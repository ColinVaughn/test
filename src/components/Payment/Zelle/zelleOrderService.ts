
import { supabase } from "@/integrations/supabase/client";
import { ZelleFormValues } from "./zelleFormSchema";
import { processComponentDetails, calculateTotalPrice } from "./zelleOrderUtils";
import { toast } from "sonner";
import { CartItem } from "@/types/marketplace";

/**
 * Submit Zelle order to the database
 */
export const submitZelleOrder = async (
  data: ZelleFormValues, 
  configuration: any = null,
  cartItems: CartItem[] = []
) => {
  try {
    // Check if user is logged in
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id || null;
    const timestamp = new Date().toISOString();
    
    // Generate a unique reference code for the order
    const referenceCode = `ZELLE_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    
    // Determine if this is a cart checkout or a PC configuration checkout
    const isCartCheckout = cartItems && cartItems.length > 0;
    
    // Calculate the total price
    let totalAmount = 0;
    
    if (isCartCheckout) {
      // For cart checkout, sum up all item prices
      totalAmount = cartItems.reduce((total, item) => {
        return total + (item.price * item.quantity);
      }, 0);
      
      // Add shipping and tax
      const subtotal = totalAmount;
      const tax = Math.round(subtotal * 0.08);
      const shipping = calculateShippingForItems(cartItems);
      totalAmount = subtotal + tax + shipping;
    } else {
      // For PC configuration, calculate with assembly fee, etc.
      totalAmount = calculateTotalPrice(configuration, null);
    }
    
    console.log("Calculated total amount for Zelle order:", totalAmount);
    
    // Create the order record - works for both guest and authenticated users
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId, // Will be null for guest checkout
        total: totalAmount,
        status: 'pending',
        created_at: timestamp,
        updated_at: timestamp,
        affiliate_code: null,
        free_shipping_applied: false,
        shipping_discount: 0,
        coupon_code: null,
        discount_amount: 0,
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      
      // If the error is related to RLS policies, create a more friendly error message
      if (orderError.code === '42501') {
        throw new Error("Unable to create order. Please try signing in first.");
      }
      
      throw new Error(`Error creating order: ${orderError.message}`);
    }

    console.log('Order created:', orderData);
    
    if (isCartCheckout) {
      // Create order items for each cart item
      for (const item of cartItems) {
        const { error: itemError } = await supabase
          .from('order_items')
          .insert({
            order_id: orderData.id,
            product_name: item.product_name,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
            product_details: {
              product_type: item.product_type,
              ...(item.details || {}),
              ...(item.configuration ? { configuration: item.configuration } : {})
            },
          });

        if (itemError) {
          console.error('Error creating order item:', itemError);
          throw new Error(`Error creating order item: ${itemError.message}`);
        }
      }
    } else {
      // Create order item for the PC configuration
      const productDetails = processComponentDetails(configuration);
      
      const { error: itemError } = await supabase
        .from('order_items')
        .insert({
          order_id: orderData.id,
          product_name: 'Custom Gaming PC',
          product_id: 'custom-pc',
          quantity: 1,
          price: totalAmount,
          product_details: productDetails,
        });

      if (itemError) {
        console.error('Error creating order item:', itemError);
        throw new Error(`Error creating order item: ${itemError.message}`);
      }
    }

    // Format the shipping address in a consistent way for better parsing
    const formattedShippingAddress = `${data.address.street}, ${data.address.city}, ${data.address.state} ${data.address.zip}`;
    
    // Format the customer information in a structured way for better parsing later
    const zelleNotes = `Customer: ${data.customer_name}. Shipping Address: ${formattedShippingAddress}`;

    // Create payment transaction
    const { error: paymentError } = await supabase
      .from('payment_transactions')
      .insert({
        order_id: orderData.id,
        amount: totalAmount,
        status: 'pending',
        payment_method: 'zelle',
        customer_email: data.customer_email,
        transaction_id: referenceCode,
        zelle_notes: zelleNotes,
      });

    if (paymentError) {
      console.error('Error creating payment record:', paymentError);
      throw new Error(`Error creating payment: ${paymentError.message}`);
    }

    // Send order confirmation email via Supabase Edge Function
    try {
      await supabase.functions.invoke('order-notifications', {
        body: { 
          type: "order_placed",
          email: data.customer_email,
          orderDetails: {
            orderId: orderData.id,
            orderTotal: totalAmount,
            paymentMethod: 'zelle',
            zelleEmail: "info@battleforgepc.com",
            shippingAddress: formattedShippingAddress,
            customerName: data.customer_name
          }
        }
      });
    } catch (emailError) {
      console.error('Error sending order confirmation email:', emailError);
      // Don't throw here, just log the error as it's not critical
    }

    // Return ID with the correct parameter name for the success page
    return `order_id=${orderData.id}&paymentMethod=zelle`;
  } catch (error) {
    // Re-throw the error to be handled by the calling function
    throw error;
  }
};

/**
 * Calculate shipping costs for marketplace items
 */
function calculateShippingForItems(items: CartItem[]): number {
  if (!items || items.length === 0) return 20;
  
  let totalShipping = 0;
  
  for (const item of items) {
    if (item.product_type === 'marketplace') {
      const shipping = item.details?.shipping || {};
      
      // Base shipping cost
      let itemShipping = 20; 
      
      // Calculate based on dimensions if available
      if (shipping.dimensions) {
        try {
          const dimensionString = shipping.dimensions.replace(/\*/g, 'x');
          const parts = dimensionString.split('x').map(part => parseFloat(part.trim()));
          
          if (parts.length === 3 && !parts.some(isNaN)) {
            const [width, height, depth] = parts;
            const volume = width * height * depth;
            itemShipping += Math.floor(volume / 1000) * 10;
            
            if (volume > 10000) {
              itemShipping += 25;
            }
          }
        } catch (error) {
          console.error("Error parsing dimensions:", error);
        }
      }
      
      // Calculate based on weight if available
      if (shipping.weight) {
        const weight = parseFloat(shipping.weight);
        if (!isNaN(weight)) {
          const weightCharge = Math.max(0, weight - 2) * 4;
          itemShipping += weightCharge;
          
          if (weight > 30) {
            itemShipping += 30;
          }
        }
      }
      
      // Add insurance cost if specified
      if (shipping.insuranceCoverage && shipping.insuranceCoverage > 100) {
        const extraInsurance = shipping.insuranceCoverage - 100;
        const insuranceCharge = (extraInsurance / 100) * 2;
        itemShipping += insuranceCharge;
      }
      
      totalShipping += itemShipping * item.quantity;
    }
  }
  
  return Math.max(15, totalShipping);
}
