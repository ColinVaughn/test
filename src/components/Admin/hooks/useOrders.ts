
import { useState, useCallback, useRef, useEffect } from "react";
import { useOrderQueries } from "./useOrderQueries";
import { useOrderOperations } from "./useOrderOperations";
import { supabase } from "@/integrations/supabase/client";
import type { OrderType } from "../types/AdminTypes";

export const useOrders = () => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isUpdatingShipment, setIsUpdatingShipment] = useState(false);
  const [isCreatingTestOrder, setIsCreatingTestOrder] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { 
    orderItems, 
    shipment, 
    paymentInfo,
    fetchOrders: fetchOrdersList,
    fetchOrderDetails 
  } = useOrderQueries();

  const { updateOrderStatus: updateStatus, createTestOrder: createTest } = useOrderOperations();
  const currentStatusFilter = useRef<string | undefined>("all");
  const isFetching = useRef(false);
  const lastFetchTime = useRef<number | null>(null);
  const fetchDebounceTimeout = useRef<number | null>(null);

  const fetchOrders = useCallback(async (statusFilter?: string) => {
    if (fetchDebounceTimeout.current !== null) {
      window.clearTimeout(fetchDebounceTimeout.current);
    }
    
    const now = Date.now();
    const debounceTime = 300;
    const shouldDebounce = 
      lastFetchTime.current && 
      now - lastFetchTime.current < debounceTime &&
      statusFilter === currentStatusFilter.current &&
      orders.length > 0;
    
    if (shouldDebounce) {
      return orders;
    }
    
    return new Promise<OrderType[]>((resolve) => {
      fetchDebounceTimeout.current = window.setTimeout(async () => {
        if (isFetching.current) return;
        
        isFetching.current = true;
        setIsLoading(true);
        
        console.log("[useOrders] Fetching orders with filter:", statusFilter);
        currentStatusFilter.current = statusFilter;
        
        try {
          const ordersList = await fetchOrdersList(statusFilter);
          console.log("[useOrders] Orders received from query:", ordersList.length);
          if (ordersList.length > 0) {
            console.log("[useOrders] Orders details:", JSON.stringify(ordersList.slice(0, 3)));
          }
          
          setOrders(ordersList);
          lastFetchTime.current = Date.now();
          
          resolve(ordersList);
        } catch (error) {
          console.error("[useOrders] Error fetching orders:", error);
          resolve([]);
        } finally {
          setIsLoading(false);
          isFetching.current = false;
        }
      }, 100);
    });
  }, [fetchOrdersList]);

  useEffect(() => {
    return () => {
      if (fetchDebounceTimeout.current !== null) {
        window.clearTimeout(fetchDebounceTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    const subscription = supabase
      .channel('orders')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'orders' 
      }, () => {
        fetchOrders(currentStatusFilter.current);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchOrders]);

  const updateOrderStatus = async (orderId: string, status: string) => {
    setIsUpdatingStatus(true);
    const success = await updateStatus(orderId, status);
    if (success) {
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status, updated_at: new Date().toISOString() } : order
      ));
      
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status, updated_at: new Date().toISOString() });
      }
    }
    setIsUpdatingStatus(false);
  };

  const createTestOrder = async () => {
    setIsCreatingTestOrder(true);
    const success = await createTest();
    if (success) {
      await fetchOrders(currentStatusFilter.current);
    }
    setIsCreatingTestOrder(false);
  };

  return {
    orders,
    isLoading,
    selectedOrder,
    orderItems,
    shipment,
    paymentInfo,
    isUpdatingStatus,
    isUpdatingShipment,
    isCreatingTestOrder,
    setSelectedOrder,
    setIsUpdatingShipment,
    fetchOrders,
    fetchOrderDetails,
    updateOrderStatus,
    createTestOrder
  };
};
