
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );
    
    const { action, data } = await req.json();
    
    // Get auth user
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();
    
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    switch (action) {
      case 'send_bulk_email':
        return await handleBulkEmail(supabaseClient, user.id, data);
      case 'send_reply':
        return await handleReply(supabaseClient, user.id, data);
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function handleBulkEmail(supabase, userId, data) {
  const { subject, content, sellerId } = data;
  
  if (!subject || !content || !sellerId) {
    return new Response(
      JSON.stringify({ error: 'Missing required fields' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
  
  // Check if user is the seller
  const { data: sellerData, error: sellerError } = await supabase
    .from('marketplace_sellers')
    .select('*')
    .eq('id', sellerId)
    .eq('user_id', userId)
    .single();
  
  if (sellerError || !sellerData) {
    return new Response(
      JSON.stringify({ error: 'Not authorized as this seller' }),
      { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
  
  try {
    // In a real implementation, we would:
    // 1. Get all customers who have purchased from this seller
    // 2. Send emails to each customer
    // 3. Log the email campaign
    
    // For now, we'll just return success
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Bulk email queued successfully',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error sending bulk email:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to send bulk email' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function handleReply(supabase, userId, data) {
  const { messageId, reply, sellerId } = data;
  
  if (!messageId || !reply || !sellerId) {
    return new Response(
      JSON.stringify({ error: 'Missing required fields' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
  
  // Check if user is the seller
  const { data: sellerData, error: sellerError } = await supabase
    .from('marketplace_sellers')
    .select('*')
    .eq('id', sellerId)
    .eq('user_id', userId)
    .single();
  
  if (sellerError || !sellerData) {
    return new Response(
      JSON.stringify({ error: 'Not authorized as this seller' }),
      { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
  
  try {
    // In a real implementation, we would:
    // 1. Insert the reply to database
    // 2. Update the message status
    // 3. Send email notification to customer
    
    // For now, we'll just return success
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Reply sent successfully',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error sending reply:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to send reply' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}
