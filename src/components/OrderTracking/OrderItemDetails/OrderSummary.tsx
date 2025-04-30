
import { format } from "date-fns";
import { Order } from "../types";
import { getStatusIconComponent, getStatusColor } from "../utils/orderUtils";

interface OrderSummaryProps {
  order: Order;
}

const OrderSummary = ({ order }: OrderSummaryProps) => {
  const StatusIcon = getStatusIconComponent(order.status);
  const statusColorClass = getStatusColor(order.status);
  
  return (
    <div className="bg-gaming-dark/30 rounded-lg p-4">
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <p className="text-gray-400">Order Date</p>
          <p>{format(new Date(order.created_at), "MMM d, yyyy")}</p>
        </div>
        <div>
          <p className="text-gray-400">Status</p>
          <div className="flex items-center gap-1.5">
            <StatusIcon className={`w-5 h-5 ${statusColorClass}`} />
            <span className="capitalize">{order.status}</span>
          </div>
        </div>
        <div>
          <p className="text-gray-400">Total</p>
          <p>${order.total.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-400">Order ID</p>
          <p className="font-mono text-xs">{order.id}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
