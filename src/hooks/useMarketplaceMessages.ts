
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { CustomerMessage } from "@/types/marketplace";
import { toast } from "sonner";

export function useMarketplaceMessages() {
  const fetchSellerMessages = async (sellerId: string): Promise<CustomerMessage[]> => {
    if (!sellerId) {
      console.error("No seller ID provided to fetchSellerMessages");
      return [];
    }
    
    try {
      console.log("Fetching messages for seller ID:", sellerId);
      const { data, error } = await supabase
        .from('marketplace_customer_messages')
        .select('*')
        .eq('seller_id', sellerId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching seller messages:", error);
        throw error;
      }
      
      console.log("Messages fetched:", data);
      return data as CustomerMessage[];
    } catch (error) {
      console.error("Error in fetchSellerMessages:", error);
      toast.error("Failed to load customer messages");
      return [];
    }
  };

  const sendMessageReply = async (messageId: string, sellerId: string, reply: string): Promise<void> => {
    try {
      if (!messageId || !sellerId || !reply.trim()) {
        throw new Error("Missing required fields for reply");
      }
      
      console.log("Sending reply to message:", messageId);
      
      const { error: replyError } = await supabase
        .from('marketplace_message_replies')
        .insert({
          message_id: messageId,
          seller_id: sellerId,
          reply: reply.trim()
        });

      if (replyError) throw replyError;

      const { error: msgError } = await supabase
        .from('marketplace_customer_messages')
        .update({ status: 'replied' })
        .eq('id', messageId);

      if (msgError) throw msgError;
      
      toast.success("Reply sent successfully");
    } catch (error) {
      console.error("Error sending message reply:", error);
      toast.error("Failed to send reply");
      throw error;
    }
  };

  return {
    fetchSellerMessages,
    sendMessageReply
  };
}
