
import { corsHeaders, validateEmailFormat, createErrorResponse, isGuestUser } from "./utils.ts";

export async function handleCreateConversation(supabase: any, body: any, userId: string | null) {
  const { subject, email } = body;

  console.log("Creating conversation - User:", userId);
  console.log("Received subject:", subject);
  console.log("Received email:", email);

  if (!subject || !subject.trim()) {
    console.error("Subject is required");
    return createErrorResponse("Subject is required");
  }

  if (!email || !email.trim()) {
    console.error("Email is required");
    return createErrorResponse("Email is required");
  }

  // Email validation
  if (!validateEmailFormat(email)) {
    console.error("Invalid email format:", email);
    return createErrorResponse("Valid email required");
  }
  
  // Check if userId is provided
  if (!userId) {
    console.error("No user ID available for creating conversation");
    return createErrorResponse("Failed to create conversation: User identification is required");
  }
  
  console.log("Creating conversation with subject:", subject, "email:", email, "for user:", userId);
  
  // Explicitly mark guest users with the is_guest flag
  const isGuest = isGuestUser(userId);
  console.log("Is guest user:", isGuest);
  
  const { data, error } = await supabase
    .from("chat_conversations")
    .insert({
      user_id: userId,
      subject: subject.trim(),
      email: email.trim(),
      status: "open",
      updated_at: new Date().toISOString(),
      is_guest: isGuest
    })
    .select();

  if (error) {
    console.error("Error creating conversation:", error);
    return createErrorResponse(error.message);
  }
  
  if (!data || data.length === 0) {
    const errorMsg = "No data returned after conversation creation";
    console.error(errorMsg);
    return createErrorResponse(errorMsg, 500);
  }
  
  console.log("Conversation created successfully:", data[0].id);
  return new Response(JSON.stringify({ conversation: data[0] }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}

export async function handleSendMessage(supabase: any, body: any, userId: string | null) {
  const { message, conversation_id } = body;

  if (!message || !message.trim()) {
    return createErrorResponse("Message is required");
  }

  if (!conversation_id) {
    return createErrorResponse("Conversation ID is required");
  }
  
  // Check if userId is provided
  if (!userId) {
    return createErrorResponse("User identification is required");
  }
  
  console.log("Sending message to conversation:", conversation_id, "from user:", userId);
  
  // Get the conversation and check if the user has access
  const { data: conversation, error: convError } = await supabase
    .from("chat_conversations")
    .select()
    .eq("id", conversation_id)
    .eq("user_id", userId)
    .single();
    
  if (convError) {
    console.error("Conversation not found:", convError);
    return createErrorResponse("Conversation not found or access denied", 404);
  }
  
  const { data, error } = await supabase
    .from("chat_messages")
    .insert({
      user_id: userId,
      message: message.trim(),
      is_admin: false,
      read: false,
      conversation_id: conversation_id
    })
    .select();

  if (error) {
    console.error("Error sending message:", error);
    return createErrorResponse(error.message);
  }
  
  await supabase
    .from("chat_conversations")
    .update({ 
      updated_at: new Date().toISOString(),
      status: 'open'
    })
    .eq("id", conversation_id);
    
  return new Response(JSON.stringify({ message: data[0] }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}

export async function handleGetConversations(supabase: any, userId: string | null) {
  console.log("Fetching conversations for user:", userId);
  
  // If no userId is provided, return empty array
  if (!userId) {
    console.log("No user ID provided, returning empty conversations");
    return new Response(JSON.stringify({ conversations: [] }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  }
  
  const { data, error } = await supabase
    .from("chat_conversations")
    .select()
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });
    
  if (error) {
    console.error("Error fetching conversations:", error);
    return createErrorResponse(error.message);
  }
  
  console.log(`Found ${data?.length || 0} conversations for user ${userId}`);
  
  return new Response(JSON.stringify({ conversations: data }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}

export async function handleGetMessages(supabase: any, body: any, userId: string | null) {
  const { conversation_id } = body;

  if (!conversation_id) {
    return createErrorResponse("Conversation ID is required");
  }
  
  // Check if userId is provided
  if (!userId) {
    return createErrorResponse("User identification is required");
  }
  
  console.log("Fetching messages for conversation:", conversation_id, "user:", userId);
  
  // Get the conversation and check if the user has access
  const { data: conversation, error: convError } = await supabase
    .from("chat_conversations")
    .select()
    .eq("id", conversation_id)
    .eq("user_id", userId)
    .single();
    
  if (convError) {
    console.error("Conversation not found:", convError);
    return createErrorResponse("Conversation not found or access denied", 404);
  }
  
  const { data, error } = await supabase
    .from("chat_messages")
    .select()
    .eq("conversation_id", conversation_id)
    .order("created_at", { ascending: true });
    
  if (error) {
    console.error("Error fetching messages:", error);
    return createErrorResponse(error.message);
  }
  
  console.log(`Found ${data?.length || 0} messages for conversation ${conversation_id}`);
  
  return new Response(JSON.stringify({ messages: data }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}
