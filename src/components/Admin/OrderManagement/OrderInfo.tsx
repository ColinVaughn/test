
import { format } from "date-fns";
import type { OrderType } from "../types/AdminTypes";

interface OrderInfoProps {
  order: OrderType;
}

export const OrderInfo = ({ order }: OrderInfoProps) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Order Information</h3>
      <div className="space-y-2 bg-gaming-dark/40 p-3 rounded-lg">
        <div className="flex justify-between">
          <span className="text-gray-400">Order ID:</span>
          <span className="font-mono">{order.id.substring(0, 8)}...</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Date:</span>
          <span>{format(new Date(order.created_at), "MMMM d, yyyy")}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Status:</span>
          <span className="capitalize">{order.status}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Total:</span>
          <span className="font-semibold">${order.total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};
