
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { v4 as uuidv4 } from "https://esm.sh/uuid@9.0.0";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

export function createSupabaseClient() {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Supabase credentials are not set");
  }
  
  return createClient(supabaseUrl, supabaseServiceKey);
}

export function getUserId(authHeader: string, providedGuestId: string | null) {
  // If a guest ID is provided, validate and use it
  if (providedGuestId && providedGuestId.toString().startsWith('guest_')) {
    console.log("Using provided guest ID:", providedGuestId);
    return providedGuestId;
  }
  
  // If no auth header and no guest ID, generate a new guest ID
  if (!authHeader || authHeader === 'Bearer ') {
    const newGuestId = `guest_${uuidv4()}`;
    console.log("Generated new guest ID:", newGuestId);
    return newGuestId;
  }
  
  // Try to get user ID from auth token
  console.log("Attempting to use auth token");
  return null; // Will be replaced with actual user ID from auth if token is valid
}

export function isGuestUser(userId: string | null): boolean {
  // Safe check for null or undefined userId
  if (!userId) return false;
  
  const userIdString = userId.toString();
  const isGuest = userIdString.startsWith('guest_');
  
  console.log(`Checking if user ${userIdString} is guest: ${isGuest}`);
  return isGuest;
}

export function validateEmailFormat(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

export function createErrorResponse(message: string, status = 400) {
  console.error(`Error response: ${message} (${status})`);
  return new Response(JSON.stringify({ error: message }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status,
  });
}
