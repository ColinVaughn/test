
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, turnstileToken } = await req.json();

    // Validate inputs
    if (!email || !turnstileToken) {
      return new Response(
        JSON.stringify({ 
          error: "Email and turnstile token are required" 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    console.log("Verifying Turnstile token:", turnstileToken.substring(0, 20) + "...");
    
    // Verify Turnstile token
    const turnstileResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: Deno.env.get('TURNSTILE_SECRET_KEY'),
        response: turnstileToken,
        remoteip: req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for'),
      }),
    });

    const turnstileResult = await turnstileResponse.json();
    console.log("Turnstile verification result:", JSON.stringify(turnstileResult));

    if (!turnstileResult.success) {
      const errorCodes = turnstileResult["error-codes"] || [];
      console.error("Turnstile verification failed with codes:", errorCodes);
      
      let errorMessage = "Security verification failed";
      
      // Provide more specific error messages based on error codes
      if (errorCodes.includes("missing-input-secret")) {
        errorMessage = "The secret parameter was not passed";
      } else if (errorCodes.includes("invalid-input-secret")) {
        errorMessage = "The secret parameter is invalid or malformed";
      } else if (errorCodes.includes("missing-input-response")) {
        errorMessage = "The response parameter was not passed";
      } else if (errorCodes.includes("invalid-input-response")) {
        errorMessage = "The response parameter is invalid or malformed";
      } else if (errorCodes.includes("bad-request")) {
        errorMessage = "The request was rejected because it was malformed";
      } else if (errorCodes.includes("timeout-or-duplicate")) {
        errorMessage = "The response parameter has already been validated before";
      }
      
      return new Response(
        JSON.stringify({ 
          error: errorMessage, 
          details: errorCodes 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Check if email already subscribed
    const { data: existingSubscriber } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (existingSubscriber) {
      return new Response(
        JSON.stringify({ message: "You're already subscribed to our newsletter" }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    // Subscribe new email
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert([{ email }]);

    if (error) throw error;

    return new Response(
      JSON.stringify({ message: 'Successfully subscribed to newsletter' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
