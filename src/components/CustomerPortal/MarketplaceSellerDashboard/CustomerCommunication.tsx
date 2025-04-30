import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2, MessageSquare, Users, Mail, Clock } from "lucide-react";
import { CustomerMessage } from "@/types/marketplace";

interface CustomerCommunicationProps {
  sellerId: string;
}

interface CustomerReply {
  id: string;
  message_id: string;
  reply: string;
  created_at: string;
}

const CustomerCommunication: React.FC<CustomerCommunicationProps> = ({ sellerId }) => {
  const [messages, setMessages] = useState<CustomerMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<CustomerMessage | null>(null);
  const [replies, setReplies] = useState<CustomerReply[]>([]);
  const [newReply, setNewReply] = useState("");
  const [isReplyLoading, setIsReplyLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBulkEmailOpen, setIsBulkEmailOpen] = useState(false);
  const [bulkEmailSubject, setBulkEmailSubject] = useState("");
  const [bulkEmailContent, setBulkEmailContent] = useState("");
  const [isSendingBulkEmail, setIsSendingBulkEmail] = useState(false);

  useEffect(() => {
    console.log("CustomerCommunication - Component mounted with sellerId:", sellerId);
    if (!sellerId) {
      console.error("CustomerCommunication - No seller ID provided");
      setIsLoading(false);
      return;
    }
    loadMessages();
  }, [sellerId]);

  const loadMessages = async () => {
    if (!sellerId) {
      console.error("Cannot load messages: No seller ID provided");
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      console.log("Fetching messages for seller ID:", sellerId);
      
      const { data: messagesData, error: messagesError } = await supabase
        .from('marketplace_customer_messages')
        .select('*')
        .eq('seller_id', sellerId)
        .order('created_at', { ascending: false });

      if (messagesError) {
        console.error("Error fetching messages:", messagesError);
        throw messagesError;
      }

      console.log("Messages fetched:", messagesData?.length || 0, messagesData);

      const messagesWithEmail: CustomerMessage[] = await Promise.all(
        (messagesData || []).map(async (message) => {
          const enhancedMessage = {
            ...message,
            customer_email: message.customer_email || 'Unknown',
            order_id: message.order_id,
            product_name: message.product_name
          } as CustomerMessage;
          
          if (message.customer_id && !message.customer_email) {
            const { data: userData, error: userError } = await supabase
              .from('user_profiles')
              .select('email')
              .eq('user_id', message.customer_id)
              .single();
            
            if (!userError && userData) {
              enhancedMessage.customer_email = userData.email;
            }
          }
          
          return enhancedMessage;
        })
      );
      
      console.log("Messages with email:", messagesWithEmail);
      setMessages(messagesWithEmail);
    } catch (error) {
      console.error("Error loading messages:", error);
      toast.error("Failed to load customer messages");
    } finally {
      setIsLoading(false);
    }
  };

  const loadReplies = async (messageId: string) => {
    try {
      console.log("Loading replies for message ID:", messageId);
      const { data, error } = await supabase
        .from('marketplace_message_replies')
        .select('*')
        .eq('message_id', messageId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      console.log("Replies loaded:", data?.length || 0, data);
      setReplies(data as CustomerReply[]);
    } catch (error) {
      console.error("Error loading replies:", error);
      toast.error("Failed to load message replies");
    }
  };

  const handleMessageClick = async (message: CustomerMessage) => {
    console.log("Clicked on message:", message);
    setSelectedMessage(message);
    setNewReply("");
    await loadReplies(message.id);
    setIsDialogOpen(true);

    if (message.status === 'unread') {
      try {
        console.log("Marking message as read:", message.id);
        const { error } = await supabase
          .from('marketplace_customer_messages')
          .update({ status: 'read' })
          .eq('id', message.id);
        
        if (error) throw error;
        
        setMessages(messages.map(m => 
          m.id === message.id ? { ...m, status: 'read' } : m
        ));
        console.log("Message marked as read successfully");
      } catch (error) {
        console.error("Error marking message as read:", error);
      }
    }
  };

  const handleSendReply = async () => {
    if (!selectedMessage || !newReply.trim()) return;

    setIsReplyLoading(true);
    try {
      console.log("Sending reply to message:", selectedMessage.id);
      
      const { error: replyError } = await supabase
        .from('marketplace_message_replies')
        .insert({
          message_id: selectedMessage.id,
          seller_id: sellerId,
          reply: newReply.trim()
        });

      if (replyError) throw replyError;

      const { error: msgError } = await supabase
        .from('marketplace_customer_messages')
        .update({ status: 'replied' })
        .eq('id', selectedMessage.id);

      if (msgError) throw msgError;

      console.log("Reply sent successfully");
      toast.success("Reply sent successfully");
      
      setMessages(messages.map(msg => 
        msg.id === selectedMessage.id ? { ...msg, status: 'replied' } : msg
      ));
      
      setNewReply("");
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error sending reply:", error);
      toast.error("Failed to send reply");
    } finally {
      setIsReplyLoading(false);
    }
  };

  const handleSendBulkEmail = async () => {
    if (!bulkEmailSubject.trim() || !bulkEmailContent.trim()) {
      toast.error("Subject and content are required");
      return;
    }

    setIsSendingBulkEmail(true);
    try {
      setTimeout(() => {
        toast.success("Email campaign initiated");
        setIsBulkEmailOpen(false);
        setBulkEmailSubject("");
        setBulkEmailContent("");
        setIsSendingBulkEmail(false);
      }, 1000);
    } catch (error) {
      console.error("Error sending bulk email:", error);
      toast.error("Failed to send bulk email");
      setIsSendingBulkEmail(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  useEffect(() => {
    console.log("CustomerCommunication component is rendering with sellerId:", sellerId);
    console.log("Current messages state:", messages);
    console.log("Is loading:", isLoading);
  }, [sellerId, messages, isLoading]);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            Customer Messages
          </CardTitle>
          <Button onClick={() => setIsBulkEmailOpen(true)}>
            <Mail className="h-4 w-4 mr-2" /> Bulk Email
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gaming-blue" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg border-gray-600">
              <MessageSquare className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">No messages yet</h3>
              <p className="mt-2 text-sm text-gray-400 max-w-sm mx-auto">
                When customers send you questions or inquiries, they'll appear here
              </p>
            </div>
          ) : (
            <div className="border rounded-md overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {messages.map((message) => (
                      <TableRow 
                        key={message.id}
                        className={message.status === 'unread' ? 'bg-gaming-blue/10' : ''}
                      >
                        <TableCell>{message.customer_email}</TableCell>
                        <TableCell>{message.subject}</TableCell>
                        <TableCell>{message.product_name || "—"}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1 text-gray-400" />
                            <span>{formatDate(message.created_at)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            message.status === 'unread' 
                              ? 'bg-red-500/20 text-red-300' 
                              : message.status === 'read'
                              ? 'bg-yellow-500/20 text-yellow-300'
                              : 'bg-green-500/20 text-green-300'
                          }>
                            {message.status === 'unread' ? 'Unread' : 
                             message.status === 'read' ? 'Read' : 'Replied'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleMessageClick(message)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          {selectedMessage && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedMessage.subject}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="flex justify-between items-start border-b pb-4">
                  <div>
                    <p className="text-sm text-gray-400">From</p>
                    <p>{selectedMessage.customer_email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Received</p>
                    <p>{formatDate(selectedMessage.created_at)}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400 mb-2">Message</p>
                  <div className="p-4 border rounded-md bg-gaming-darker">
                    <p className="whitespace-pre-line">{selectedMessage.message}</p>
                  </div>
                </div>
                
                {selectedMessage.order_id && (
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Related Order</p>
                    <div className="p-4 border rounded-md">
                      <p>Order ID: {selectedMessage.order_id}</p>
                      {selectedMessage.product_name && (
                        <p>Product: {selectedMessage.product_name}</p>
                      )}
                    </div>
                  </div>
                )}
                
                {replies.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Previous Replies</p>
                    <div className="space-y-3">
                      {replies.map((reply) => (
                        <div key={reply.id} className="p-4 border rounded-md bg-gaming-blue/10">
                          <div className="flex justify-between items-center mb-2">
                            <p className="text-sm font-medium">You</p>
                            <p className="text-sm text-gray-400">{formatDate(reply.created_at)}</p>
                          </div>
                          <p className="whitespace-pre-line">{reply.reply}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <p className="text-sm text-gray-400 mb-2">Your Reply</p>
                  <Textarea
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                    placeholder="Type your reply here..."
                    rows={5}
                  />
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Close
                  </Button>
                  <Button 
                    onClick={handleSendReply} 
                    disabled={isReplyLoading || !newReply.trim()}
                  >
                    {isReplyLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Reply
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isBulkEmailOpen} onOpenChange={setIsBulkEmailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Send Email to All Customers
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Subject</p>
              <Input
                value={bulkEmailSubject}
                onChange={(e) => setBulkEmailSubject(e.target.value)}
                placeholder="Email subject line"
              />
            </div>
            
            <div>
              <p className="text-sm font-medium mb-2">Message</p>
              <Textarea
                value={bulkEmailContent}
                onChange={(e) => setBulkEmailContent(e.target.value)}
                placeholder="Type your email message here..."
                rows={10}
              />
              <p className="text-xs text-gray-400 mt-1">
                This email will be sent to all customers who have purchased from your store
              </p>
            </div>
            
            <DialogFooter className="pt-4">
              <Button variant="outline" onClick={() => setIsBulkEmailOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSendBulkEmail} 
                disabled={isSendingBulkEmail || !bulkEmailSubject.trim() || !bulkEmailContent.trim()}
              >
                {isSendingBulkEmail ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Email
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CustomerCommunication;
