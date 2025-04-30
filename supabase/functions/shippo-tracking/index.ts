
// Follow this setup guide to integrate the Deno runtime into your Supabase functions:
// https://supabase.com/docs/guides/functions/deno-runtime

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

    // Check for required parameters
    if (!data.trackingNumber || !data.carrier) {
      return new Response(
        JSON.stringify({ error: "Missing trackingNumber or carrier" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Query Shippo API for tracking information
    const response = await fetch(`https://api.goshippo.com/tracks/${data.carrier}/${data.trackingNumber}/`, {
      method: 'GET',
      headers: {
        'Authorization': `ShippoToken ${SHIPPO_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Shippo API Error:', errorText);
      return new Response(
        JSON.stringify({ error: `Shippo API error: ${response.status} ${errorText}` }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: response.status }
      );
    }

    const trackingData = await response.json();

    return new Response(
      JSON.stringify({
        success: true,
        tracking: trackingData
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error('Error in shippo-tracking function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
