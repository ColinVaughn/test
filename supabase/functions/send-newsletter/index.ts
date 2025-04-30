
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TestEmailRequest {
  email: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: TestEmailRequest = await req.json();

    const { data, error } = await resend.emails.send({
      from: 'Battle Forge PC <mail@battleforgepc.com>',
      to: [email],
      subject: 'Test Email from Battle Forge PC',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Hello from Battle Forge PC!</h1>
          <p>This is a test email to confirm our newsletter system is working correctly.</p>
          <p>If you did not expect this email, please disregard.</p>
          <br>
          <p>Best regards,<br>Battle Forge PC Team</p>
        </div>
      `
    });

    if (error) {
      console.error('Error sending test email:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        }
      });
    }

    return new Response(JSON.stringify({
      message: 'Test email sent successfully',
      data
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        ...corsHeaders 
      }
    });

  } catch (error) {
    console.error('Unexpected error in test email function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        ...corsHeaders 
      }
    });
  }
});
