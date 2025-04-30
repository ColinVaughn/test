
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Package } from "lucide-react";
import type { Order } from "@/components/OrderTracking/types";
import { Link } from "react-router-dom";
import OrderDetails from "@/components/OrderTracking/OrderDetails";

const OrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data: ordersData, error } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", currentUser?.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setOrders(ordersData || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Could not load orders");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchOrders();
    }
  }, [currentUser]);

  const fetchOrderItems = async (orderId: string) => {
    try {
      const { data, error } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", orderId);

      if (error) throw error;
      setOrderItems(data || []);
    } catch (error) {
      console.error("Error fetching order items:", error);
      toast.error("Could not load order items");
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12 bg-gaming-dark/30 rounded-lg">
        <Package className="mx-auto w-16 h-16 text-gray-500 mb-4" />
        <h3 className="text-xl font-medium mb-2">No orders found</h3>
        <p className="text-gray-400 mb-6">You haven't placed any orders yet</p>
        <Button asChild>
          <Link to="/prebuilt">Browse PCs</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {selectedOrder ? (
        <>
          <Button 
            variant="ghost" 
            onClick={() => setSelectedOrder(null)}
            className="mb-4"
          >
            Back to Orders
          </Button>
          <OrderDetails order={selectedOrder} orderItems={orderItems} />
        </>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <div 
              key={order.id} 
              className="bg-gaming-dark/30 p-4 rounded-lg flex justify-between items-center"
              onClick={() => {
                setSelectedOrder(order);
                fetchOrderItems(order.id);
              }}
            >
              <div>
                <p className="font-mono text-sm text-gray-400">Order #{order.id.substring(0, 8)}...</p>
                <p className="text-sm text-gray-300">{format(new Date(order.created_at), "MMM d, yyyy")}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">${order.total.toFixed(2)}</p>
                <p className="text-sm text-gray-300 capitalize">{order.status}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
