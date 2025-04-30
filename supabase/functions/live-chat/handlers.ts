
import { corsHeaders, createSupabaseClient, getUserId, isGuestUser, validateEmailFormat, createErrorResponse } from "./utils.ts";
import {
  handleCreateConversation,
  handleSendMessage,
  handleGetConversations,
  handleGetMessages
} from "./operations.ts";

export async function handleRequest(req: Request) {
  const supabase = createSupabaseClient();
  
  const body = await req.json();
  const { action } = body;

  const authHeader = req.headers.get("Authorization") || "";
  const providedGuestId = body.guest_id || null;
  
  console.log("Request with action:", action);
  console.log("Auth header present:", authHeader ? "Yes" : "No");
  console.log("Guest ID provided:", providedGuestId || "None");
  
  // Get or generate user ID
  let userId = getUserId(authHeader, providedGuestId);
  
  // If we got a token but no user ID yet, try to get the authenticated user
  if (authHeader && authHeader !== 'Bearer ' && !userId) {
    try {
      console.log("Attempting to get user from auth token");
      const { data: userData, error: authError } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));
      
      if (!authError && userData?.user) {
        userId = userData.user.id;
        console.log("Found authenticated user:", userId);
      } else {
        console.log("Auth error or no user data:", authError);
      }
    } catch (authCheckError) {
      console.error("Error checking auth:", authCheckError);
    }
  }

  // If still no userId, create error response
  if (!userId) {
    console.error("No user ID could be determined");
    return createErrorResponse("User identification is required");
  }

  console.log("Processing action:", action, "for user:", userId);
  console.log("Is guest user:", isGuestUser(userId));

  // Dispatch to appropriate handler based on action
  switch (action) {
    case "create_conversation":
      return await handleCreateConversation(supabase, body, userId);
      
    case "send_message":
      return await handleSendMessage(supabase, body, userId);
      
    case "get_conversations":
      return await handleGetConversations(supabase, userId);
      
    case "get_messages":
      return await handleGetMessages(supabase, body, userId);
      
    default:
      return createErrorResponse("Invalid action");
  }
}
