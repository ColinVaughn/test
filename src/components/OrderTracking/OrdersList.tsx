
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { PackageOpen, Search } from "lucide-react";
import { Order } from "./types";
import { getStatusIconComponent, getStatusColor } from "./utils/orderUtils";
import OrderLookup from "./OrderLookup";

interface OrdersListProps {
  orders: Order[];
  isLoading: boolean;
  onViewOrder: (order: Order) => void;
  onOrderFound: (orderId: string) => void;
}

export default function OrdersList({ orders, isLoading, onViewOrder, onOrderFound }: OrdersListProps) {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">Loading orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12 bg-gaming-dark/30 rounded-lg">
          <Search className="mx-auto w-16 h-16 text-gray-500 mb-4" />
          <h3 className="text-xl font-medium mb-2">No orders found</h3>
          <p className="text-gray-400 mb-6">Search for your order using the form below</p>
        </div>
        
        <div className="border-t border-gaming-light-gray/20 pt-8">
          <h3 className="text-xl font-medium mb-4">Look Up Your Order</h3>
          <OrderLookup onOrderFound={onOrderFound} />
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-b-gaming-light-gray/20">
            <TableHead className="text-gray-300">Order ID</TableHead>
            <TableHead className="text-gray-300">Date</TableHead>
            <TableHead className="text-gray-300">Status</TableHead>
            <TableHead className="text-gray-300 text-right">Total</TableHead>
            <TableHead className="text-gray-300"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => {
            const StatusIcon = getStatusIconComponent(order.status);
            const statusColorClass = getStatusColor(order.status);
            
            return (
              <TableRow 
                key={order.id}
                className="border-b-gaming-light-gray/20"
              >
                <TableCell className="font-mono text-xs">
                  {order.id.substring(0, 8)}...
                </TableCell>
                <TableCell>
                  {format(new Date(order.created_at), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <StatusIcon className={`w-5 h-5 ${statusColorClass}`} />
                    <span className="capitalize">{order.status}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onViewOrder(order)}
                    className="hover:bg-gaming-light-gray/10"
                  >
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
