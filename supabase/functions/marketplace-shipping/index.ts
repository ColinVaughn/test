
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SHIPPO_API_KEY = "shippo_live_0d69c4af5455a11387ab417a2de1e74579354e93";
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") || "";

    if (!supabaseUrl || !supabaseKey || !SHIPPO_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Missing required environment variables" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const data = await req.json();
    const { action, orderId, shipmentData, sellerId } = data;

    // Verify the seller ID from the JWT token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    // Get the JWT token
    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData) {
      return new Response(
        JSON.stringify({ error: "Invalid authorization" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    // Check if the user is the seller of this order
    if (action === "create_label") {
      if (!orderId || !shipmentData) {
        return new Response(
          JSON.stringify({ error: "Missing orderId or shipment data" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
        );
      }

      // Verify the seller owns this order
      const { data: orderData, error: orderError } = await supabase
        .from('marketplace_orders')
        .select('*')
        .eq('id', orderId)
        .eq('seller_id', sellerId)
        .single();
        
      if (orderError || !orderData) {
        return new Response(
          JSON.stringify({ error: "Order not found or not owned by seller" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 403 }
        );
      }

      // Create shipping label through Shippo API
      const addressFrom = shipmentData.addressFrom;
      const addressTo = shipmentData.addressTo;
      const parcel = shipmentData.parcel;

      const shippoResponse = await fetch('https://api.goshippo.com/shipments/', {
        method: 'POST',
        headers: {
          'Authorization': `ShippoToken ${SHIPPO_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          address_from: addressFrom,
          address_to: addressTo,
          parcels: [parcel],
          async: false
        })
      });

      if (!shippoResponse.ok) {
        const errorText = await shippoResponse.text();
        return new Response(
          JSON.stringify({ error: `Shippo API error: ${errorText}` }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: shippoResponse.status }
        );
      }

      const shipment = await shippoResponse.json();

      // Create a transaction to purchase the shipping label
      const transactionResponse = await fetch('https://api.goshippo.com/transactions/', {
        method: 'POST',
        headers: {
          'Authorization': `ShippoToken ${SHIPPO_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rate: shipment.rates[0].object_id,
          label_file_type: "PDF",
          async: false
        })
      });

      if (!transactionResponse.ok) {
        const errorText = await transactionResponse.text();
        return new Response(
          JSON.stringify({ error: `Shippo transaction error: ${errorText}` }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: transactionResponse.status }
        );
      }

      const transaction = await transactionResponse.json();

      // Update the order with shipping information
      const { error: updateError } = await supabase
        .from('marketplace_shipping_labels')
        .insert({
          order_id: orderId,
          seller_id: sellerId,
          tracking_number: transaction.tracking_number,
          label_url: transaction.label_url,
          tracking_url: transaction.tracking_url_provider,
          carrier: transaction.carrier,
          shipping_cost: transaction.rate.amount,
          created_at: new Date().toISOString()
        });

      if (updateError) {
        return new Response(
          JSON.stringify({ error: `Database error: ${updateError.message}` }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }

      // Update the order status
      const { error: statusError } = await supabase
        .from('marketplace_orders')
        .update({ status: 'shipped' })
        .eq('id', orderId);

      if (statusError) {
        return new Response(
          JSON.stringify({ error: `Could not update order status: ${statusError.message}` }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          label: transaction.label_url,
          tracking: {
            number: transaction.tracking_number,
            url: transaction.tracking_url_provider
          },
          shipping_cost: transaction.rate.amount,
          carrier: transaction.carrier
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else if (action === "get_rates") {
      // Implementation for getting shipping rates
      const { addressFrom, addressTo, parcel } = data;
      
      if (!addressFrom || !addressTo || !parcel) {
        return new Response(
          JSON.stringify({ error: "Missing shipping information" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
        );
      }

      const shippoResponse = await fetch('https://api.goshippo.com/shipments/', {
        method: 'POST',
        headers: {
          'Authorization': `ShippoToken ${SHIPPO_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          address_from: addressFrom,
          address_to: addressTo,
          parcels: [parcel],
          async: false
        })
      });

      if (!shippoResponse.ok) {
        const errorText = await shippoResponse.text();
        return new Response(
          JSON.stringify({ error: `Shippo API error: ${errorText}` }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: shippoResponse.status }
        );
      }

      const shipment = await shippoResponse.json();
      
      return new Response(
        JSON.stringify({
          success: true,
          rates: shipment.rates
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );

  } catch (error) {
    console.error('Error in marketplace-shipping function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
