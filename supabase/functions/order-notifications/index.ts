
// Follow this setup guide to integrate the Deno runtime into your Supabase functions:
// https://supabase.com/docs/guides/functions/deno-runtime

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const resendApiKey = Deno.env.get("RESEND_API_KEY") || "";
    
    if (!supabaseUrl || !supabaseKey || !resendApiKey) {
      return new Response(
        JSON.stringify({ error: "Missing environment variables" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const resend = new Resend(resendApiKey);

    // Parse request body
    const requestData = await req.json();
    console.log("Notification request:", requestData);

    // Check request type
    const { type, email, orderDetails } = requestData;
    
    if (!type || !orderDetails) {
      throw new Error("Missing required parameters");
    }
    
    // Handle different notification types
    let subject = "";
    let html = "";
    
    // Default recipient
    const to = email || "admin@battleforgepc.com";

    if (type === "order_placed") {
      subject = "Your BattleForgePc Order Confirmation";
      
      // Check if this is a Zelle order
      const isZelleOrder = orderDetails.paymentMethod === 'zelle';
      
      // Create HTML content for the email
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #131519; padding: 20px; text-align: center;">
            <h1 style="color: #4FACFE; margin: 0;">Order Confirmation</h1>
          </div>
          <div style="background-color: #1D1F25; padding: 20px; color: #E1E1E1;">
            <p>Thank you for your order!</p>
            
            <div style="background-color: #2A2D36; border-radius: 5px; padding: 15px; margin: 15px 0;">
              <p style="margin: 0; font-size: 14px; color: #A1A1A1;">Order Number</p>
              <p style="margin: 5px 0; font-family: monospace; font-size: 16px;">${orderDetails.orderId}</p>
            </div>
            
            <p>Order Total: <strong>$${orderDetails.orderTotal?.toFixed(2)}</strong></p>
            
            ${isZelleOrder ? `
              <div style="background-color: #2A2D36; border-radius: 5px; padding: 15px; margin: 15px 0;">
                <h3 style="color: #4FACFE; margin-top: 0;">Complete Your Zelle Payment</h3>
                <p>Please send your payment to:</p>
                <p style="font-family: monospace; background: #131519; padding: 8px; border-radius: 4px;">${orderDetails.zelleEmail || 'info@battleforgepc.com'}</p>
                <p>Include your order number in the memo:</p>
                <p style="font-family: monospace; background: #131519; padding: 8px; border-radius: 4px;">${orderDetails.orderId}</p>
                <p style="font-size: 14px; color: #A1A1A1;">Your order will be processed after your Zelle payment is confirmed.</p>
              </div>
            ` : `
              <p>Your order is being processed and will be shipped soon.</p>
            `}
            
            <p>If you have any questions about your order, please contact our support team.</p>
          </div>
          <div style="background-color: #131519; padding: 15px; text-align: center; color: #777777; font-size: 12px;">
            <p>&copy; 2025 BattleForgePc. All rights reserved.</p>
          </div>
        </div>
      `;
      
    } else if (type === "order_shipped") {
      subject = "Your BattleForgePc Order Has Shipped";
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #131519; padding: 20px; text-align: center;">
            <h1 style="color: #4FACFE; margin: 0;">Order Shipped</h1>
          </div>
          <div style="background-color: #1D1F25; padding: 20px; color: #E1E1E1;">
            <p>Your order has been shipped!</p>
            
            <div style="background-color: #2A2D36; border-radius: 5px; padding: 15px; margin: 15px 0;">
              <p style="margin: 0; font-size: 14px; color: #A1A1A1;">Order Number</p>
              <p style="margin: 5px 0; font-family: monospace; font-size: 16px;">${orderDetails.orderId}</p>
              
              <p style="margin: 10px 0 0; font-size: 14px; color: #A1A1A1;">Tracking Number</p>
              <p style="margin: 5px 0; font-family: monospace; font-size: 16px;">${orderDetails.trackingNumber}</p>
            </div>
            
            <p>You can track your order using the tracking number above.</p>
            <p>Thank you for shopping with BattleForgePc!</p>
          </div>
          <div style="background-color: #131519; padding: 15px; text-align: center; color: #777777; font-size: 12px;">
            <p>&copy; 2025 BattleForgePc. All rights reserved.</p>
          </div>
        </div>
      `;
    } else {
      throw new Error("Invalid notification type");
    }

    // Send email using Resend
    console.log(`Sending ${type} email to ${to}`);
    const { data, error } = await resend.emails.send({
      from: "BattleForgePc <support@battleforgepc.com>",
      to: [to],
      subject: subject,
      html: html,
    });

    if (error) {
      console.error("Error sending email:", error);
      throw error;
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Unexpected error in order notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
