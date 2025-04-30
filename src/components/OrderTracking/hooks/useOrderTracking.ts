
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Order, OrderItem, Shipment } from "../types";
import { Json } from "@/integrations/supabase/types";

export const useOrderTracking = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("useOrderTracking hook initialized");
    fetchOrders();
  }, []);

  useEffect(() => {
    if (selectedOrder) {
      console.log("Selected order in useOrderTracking:", selectedOrder.id);
      fetchOrderItems(selectedOrder.id);
      fetchShipment(selectedOrder.id);
    }
  }, [selectedOrder]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching all orders");
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      console.log("Orders fetched:", data?.length || 0);
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Could not load orders");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrderItems = async (orderId: string) => {
    try {
      console.log("Fetching order items for:", orderId);
      const { data, error } = await supabase
        .from("order_items")
        .select("id, product_name, quantity, price, product_id, product_details")
        .eq("order_id", orderId);

      if (error) throw error;
      
      console.log("Order items fetched:", data?.length || 0);
      
      // Process the data only if it's an array
      const processedItems: OrderItem[] = [];
      
      if (data && Array.isArray(data)) {
        // Use filter to remove nulls and get TypeScript to recognize our non-null items
        data.filter((item): item is NonNullable<typeof item> => item !== null && item !== undefined)
          .forEach(item => {
            // Now item is guaranteed to be non-null
            // Extract product_name safely
            const productName = 'product_name' in item && item.product_name !== null 
              ? String(item.product_name) 
              : '';
            
            // Infer product_type from product_name
            let productType: 'custom' | 'prebuilt' | 'accessory' | undefined = undefined;
            
            if (productName.toLowerCase().includes('custom pc')) {
              productType = 'custom';
            } else if (productName.toLowerCase().includes('prebuilt')) {
              productType = 'prebuilt';
            }
            
            // Create the order item with safe property access
            processedItems.push({
              id: 'id' in item && item.id !== null ? String(item.id) : '',
              product_name: productName,
              quantity: 'quantity' in item && item.quantity !== null ? Number(item.quantity) : 0,
              price: 'price' in item && item.price !== null ? Number(item.price) : 0,
              product_id: 'product_id' in item && item.product_id !== null ? String(item.product_id) : undefined,
              product_type: productType,
              product_details: 'product_details' in item && item.product_details !== null 
                ? (typeof item.product_details === 'object' ? item.product_details as Record<string, any> : {})
                : {}
            });
          });
      }
      
      setOrderItems(processedItems);
    } catch (error) {
      console.error("Error fetching order items:", error);
      toast.error("Could not load order items");
    }
  };

  const fetchShipment = async (orderId: string) => {
    try {
      console.log("Fetching shipment for order:", orderId);
      const { data, error } = await supabase
        .from("shipments")
        .select("*")
        .eq("order_id", orderId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        if (error.code === "PGRST116") {
          console.log("No shipment found for order:", orderId);
          setShipment(null);
        } else {
          throw error;
        }
      } else {
        console.log("Shipment found:", data ? "yes" : "no");
        setShipment(data);
      }
    } catch (error) {
      console.error("Error fetching shipment:", error);
      toast.error("Could not load shipment information");
    }
  };

  const handleOrderLookup = (orderId: string) => {
    setIsLoading(true);
    setSelectedOrder(null);
    
    console.log("Looking up order by ID:", orderId);
    const order = orders.find(o => o.id === orderId);
    if (order) {
      console.log("Order found in local state");
      setSelectedOrder(order);
      setIsLoading(false);
    } else {
      console.log("Fetching order from database");
      supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .maybeSingle()
        .then(({ data, error }) => {
          if (error) {
            console.error("Error fetching order:", error);
            toast.error("Could not load order details");
          } else if (data) {
            console.log("Order fetched from database");
            setSelectedOrder(data);
            fetchOrderItems(data.id);
            fetchShipment(data.id);
          } else {
            console.log("Order not found");
            toast.error("Order not found");
          }
          setIsLoading(false);
        });
    }
  };

  return {
    orders,
    selectedOrder,
    setSelectedOrder,
    orderItems,
    shipment,
    setShipment,
    isLoading,
    fetchOrders,
    handleOrderLookup
  };
};
