
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { OrderType, OrderItemType, ShipmentType, PaymentType } from "../types/AdminTypes";
import { Json } from "@/integrations/supabase/types";

export const useOrderQueries = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [orderItems, setOrderItems] = useState<OrderItemType[]>([]);
  const [shipment, setShipment] = useState<ShipmentType | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<PaymentType | null>(null);

  const fetchOrders = async (statusFilter?: string) => {
    try {
      console.log("[useOrderQueries] Fetching orders with statusFilter:", statusFilter);
      let query = supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
        
      if (statusFilter && statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error("[useOrderQueries] Error fetching orders:", error);
        throw error;
      }
      
      console.log("[useOrderQueries] Orders fetched successfully:", data?.length || 0, "orders");
      if (data && data.length > 0) {
        console.log("[useOrderQueries] First few orders:", data.slice(0, 3));
      }
      
      return data || [];
    } catch (error) {
      console.error("[useOrderQueries] Error fetching orders:", error);
      toast.error("Failed to load orders");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId: string) => {
    try {
      console.log("[useOrderQueries] Fetching order details for:", orderId);
      // Fetch order items with product_details
      const { data: itemsData, error: itemsError } = await supabase
        .from("order_items")
        .select("id, product_name, quantity, price, product_id, product_details")
        .eq("order_id", orderId);
        
      if (itemsError) throw itemsError;
      
      console.log("[useOrderQueries] Order items:", itemsData);
      
      // Process the data only if it's an array (not an error type)
      const processedItems: OrderItemType[] = [];
      
      if (itemsData && Array.isArray(itemsData)) {
        // Use a safer way to map items
        itemsData.filter((item): item is NonNullable<typeof item> => item !== null && item !== undefined)
          .forEach(item => {
            // Extract product_name with safe access
            const productName = 'product_name' in item && item.product_name !== null 
              ? String(item.product_name) 
              : '';
            
            // Determine product type from product_details or product_name
            let productType: 'custom' | 'prebuilt' = 'prebuilt';
            let productDetails = {};
            
            if (item.product_details && typeof item.product_details === 'object') {
              productDetails = item.product_details as Record<string, any>;
              
              if ('product_type' in item.product_details) {
                productType = item.product_details.product_type === 'custom' ? 'custom' : 'prebuilt';
              } else if (productName.toLowerCase().includes('custom')) {
                productType = 'custom';
                // Add product_type to details
                productDetails = {
                  ...productDetails,
                  product_type: 'custom'
                };
              }
              
              // Examine product details deeply to detect custom PCs even if product_type isn't set
              if (productType === 'prebuilt' && (
                'cpu' in item.product_details || 
                'gpu' in item.product_details || 
                'ram' in item.product_details || 
                'motherboard' in item.product_details ||
                'case' in item.product_details ||
                'storage' in item.product_details ||
                'psu' in item.product_details
              )) {
                productType = 'custom';
                // Ensure product_type is set for downstream components
                productDetails = {
                  ...productDetails,
                  product_type: 'custom'
                };
              }
            } else if (productName.toLowerCase().includes('custom')) {
              productType = 'custom';
              productDetails = { product_type: 'custom' };
            }
            
            console.log(`[useOrderQueries] Processing item: ${productName}, type: ${productType}`);
            console.log("[useOrderQueries] Item product_details:", item.product_details);
            
            // Create the order item with safe access
            processedItems.push({
              id: 'id' in item && item.id !== null ? String(item.id) : '',
              product_name: productName,
              quantity: 'quantity' in item && item.quantity !== null ? Number(item.quantity) : 0,
              price: 'price' in item && item.price !== null ? Number(item.price) : 0,
              product_type: productType,
              product_details: productDetails
            });
          });
      }
      
      setOrderItems(processedItems);

      console.log("[useOrderQueries] Fetching payment information for order:", orderId);
      const { data: paymentData, error: paymentError } = await supabase
        .from("payment_transactions")
        .select("*")
        .eq("order_id", orderId)
        .maybeSingle();
        
      if (paymentError && paymentError.code !== "PGRST116") throw paymentError;
      
      // Process payment data to extract customer metadata if available
      let processedPaymentData = paymentData as PaymentType | null;
      
      console.log("[useOrderQueries] Raw payment data:", processedPaymentData);
      
      // Set customer_metadata field
      if (processedPaymentData) {
        // Process customer_metadata if available
        if (processedPaymentData.customer_metadata) {
          console.log("[useOrderQueries] Found customer_metadata:", processedPaymentData.customer_metadata);
        } 
        // Try to extract customer info from Zelle notes if no metadata is present
        else if (processedPaymentData.zelle_notes) {
          console.log("[useOrderQueries] Extracting from Zelle notes:", processedPaymentData.zelle_notes);
          
          // Try to extract shipping information from zelle_notes
          try {
            const zelleNotes = processedPaymentData.zelle_notes;
            
            // Extract basic customer info
            const customerMatch = zelleNotes.match(/Customer: (.*?)\./);
            const addressMatch = zelleNotes.match(/Shipping Address: (.*?)(?:$|\.)/);
            
            if (customerMatch || addressMatch) {
              const customerMetadata: PaymentType['customer_metadata'] = {};
              
              // Extract name if available
              if (customerMatch && customerMatch[1]) {
                customerMetadata.name = customerMatch[1].trim();
              }
              
              // Extract address if available
              if (addressMatch && addressMatch[1]) {
                const addressText = addressMatch[1].trim();
                const addressParts = addressText.split(',').map(part => part.trim());
                
                // Create a shipping address object
                const shippingAddress: Record<string, string> = {};
                
                if (addressParts.length >= 3) {
                  shippingAddress.line1 = addressParts[0];
                  shippingAddress.city = addressParts[1];
                  
                  // Handle state and zip which might be in the same part
                  const stateZipPart = addressParts[2].split(' ');
                  shippingAddress.state = stateZipPart[0];
                  
                  // Extract zip code if present
                  if (stateZipPart.length > 1) {
                    shippingAddress.postal_code = stateZipPart.slice(1).join(' ');
                  }
                  
                  // Set default country
                  shippingAddress.country = 'US';
                  
                  // Add the shipping address to customer metadata
                  customerMetadata.shipping_address = shippingAddress;
                }
              }
              
              // Add the customer metadata to the payment data
              processedPaymentData.customer_metadata = customerMetadata;
              console.log("[useOrderQueries] Extracted customer metadata from Zelle notes:", customerMetadata);
            }
          } catch (error) {
            console.error("[useOrderQueries] Error extracting customer data from Zelle notes:", error);
          }
        }
      }
      
      setPaymentInfo(processedPaymentData);
      console.log("[useOrderQueries] Processed payment information:", processedPaymentData);

      console.log("[useOrderQueries] Fetching shipment information for order:", orderId);
      const { data: shipmentData, error: shipmentError } = await supabase
        .from("shipments")
        .select("*")
        .eq("order_id", orderId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
        
      if (shipmentError && shipmentError.code !== "PGRST116") throw shipmentError;
      setShipment(shipmentData);
      console.log("[useOrderQueries] Shipment information:", shipmentData);
      
    } catch (error) {
      console.error("[useOrderQueries] Error fetching order details:", error);
      toast.error("Failed to load order details");
    }
  };

  return {
    isLoading,
    orderItems,
    shipment,
    paymentInfo,
    fetchOrders,
    fetchOrderDetails
  };
};
