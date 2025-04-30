
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Clock, PackageOpen, Truck, CheckCircle, AlertTriangle, ShoppingBag, Loader2 } from "lucide-react";
import type { OrderType } from "../types/AdminTypes";
import { Skeleton } from "@/components/ui/skeleton";
import { memo } from "react";

interface OrderListProps {
  orders: OrderType[];
  onSelectOrder: (order: OrderType) => void;
  isMobile: boolean;
  isLoading: boolean;
}

export const OrderList = memo(({ orders, onSelectOrder, isMobile, isLoading }: OrderListProps) => {
  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "processing":
        return <PackageOpen className="w-5 h-5 text-blue-500" />;
      case "shipped":
        return <Truck className="w-5 h-5 text-purple-500" />;
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "cancelled":
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  console.log("[OrderList] Rendering with", orders.length, "orders. Loading:", isLoading);

  if (isLoading) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-400">Loading orders...</span>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-12 bg-gaming-darker rounded-lg">
        <ShoppingBag className="mx-auto w-16 h-16 text-gray-500 mb-4" />
        <h3 className="text-xl font-medium mb-2">No orders found</h3>
        <p className="text-sm text-gray-400 mb-6">There are currently no orders matching your filters.</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (error) {
      console.error("Invalid date format:", dateString);
      return "Invalid date";
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-b-gaming-light-gray/20">
            <TableHead className="text-gray-300">Order ID</TableHead>
            <TableHead className="text-gray-300">Date</TableHead>
            <TableHead className="text-gray-300">Status</TableHead>
            <TableHead className="text-gray-300 text-right">Total</TableHead>
            <TableHead className="text-gray-300">Payment</TableHead>
            <TableHead className="text-gray-300 w-24"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} className="border-b-gaming-light-gray/20">
              <TableCell className="font-mono text-xs">
                {typeof order.id === 'string' && order.id.length > 8 
                  ? `${order.id.substring(0, 8)}...` 
                  : order.id}
              </TableCell>
              <TableCell>
                {formatDate(order.created_at)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5">
                  {getStatusIcon(order.status)}
                  <span className="capitalize">{order.status}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                ${typeof order.total === 'number' 
                  ? order.total.toFixed(2) 
                  : parseFloat(String(order.total)).toFixed(2)}
              </TableCell>
              <TableCell>
                {order.paypal_order_id ? 'PayPal' : order.stripe_session_id ? 'Stripe' : 'Unknown'}
              </TableCell>
              <TableCell>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="hover:bg-gaming-light-gray/10"
                  onClick={() => onSelectOrder(order)}
                >
                  Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
});

OrderList.displayName = "OrderList";
