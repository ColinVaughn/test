
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { OrderType } from "../types/AdminTypes";

export const useOrderOperations = () => {
  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      console.log("[useOrderOperations] Updating order status:", orderId, "to", status);
      const { error } = await supabase
        .from("orders")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", orderId);
        
      if (error) throw error;
      console.log("[useOrderOperations] Order status updated successfully");
      toast.success(`Order status updated to ${status}`);
      return true;
    } catch (error) {
      console.error("[useOrderOperations] Error updating order status:", error);
      toast.error("Failed to update order status");
      return false;
    }
  };

  const createTestOrder = async () => {
    try {
      console.log("[useOrderOperations] Creating test order...");
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData?.user) {
        throw new Error("User not authenticated");
      }
      
      // Create a new order entry with timestamp for uniqueness
      const timestamp = new Date().toISOString();
      const newOrderData = {
        user_id: userData.user.id,
        total: 199.99,
        status: 'pending',
        created_at: timestamp,
        updated_at: timestamp,
      };
      
      console.log("[useOrderOperations] Creating order with data:", newOrderData);
      const { data: createdOrder, error: orderError } = await supabase
        .from('orders')
        .insert(newOrderData)
        .select()
        .single();
      
      if (orderError) {
        console.error("[useOrderOperations] Error creating order:", orderError);
        throw orderError;
      }
      console.log("[useOrderOperations] Order created:", createdOrder);
      
      // Create order item
      const itemData = {
        order_id: createdOrder.id,
        product_id: 'test-product-001',
        product_name: 'Test Gaming PC',
        quantity: 1,
        price: 199.99,
      };
      
      console.log("[useOrderOperations] Creating order item:", itemData);
      const { error: itemError } = await supabase
        .from('order_items')
        .insert(itemData);
      
      if (itemError) {
        console.error("[useOrderOperations] Error creating order item:", itemError);
        throw itemError;
      }
      
      // Create payment transaction
      const paymentData = {
        order_id: createdOrder.id,
        amount: 199.99,
        status: 'completed',
        payment_method: 'Test Payment',
        customer_email: userData.user.email,
        transaction_id: 'test-tx-' + Date.now(),
      };
      
      console.log("[useOrderOperations] Creating payment transaction:", paymentData);
      const { error: paymentError } = await supabase
        .from('payment_transactions')
        .insert(paymentData);
      
      if (paymentError) {
        console.error("[useOrderOperations] Error creating payment transaction:", paymentError);
        throw paymentError;
      }
      
      console.log("[useOrderOperations] Test order created successfully");
      toast.success('Test order created successfully');
      return true;
    } catch (error) {
      console.error("[useOrderOperations] Error creating test order:", error);
      toast.error(`Failed to create test order: ${(error as Error).message}`);
      return false;
    }
  };

  return {
    updateOrderStatus,
    createTestOrder
  };
};
