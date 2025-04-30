
import { Order, OrderItem } from "./types";
import OrderSummary from "./OrderItemDetails/OrderSummary";
import OrderItemsList from "./OrderItemDetails/OrderItemsList";

interface OrderDetailsProps {
  order: Order;
  orderItems: OrderItem[];
}

export { getStatusIconComponent, getStatusColor } from "./utils/orderUtils";

export default function OrderDetails({ order, orderItems }: OrderDetailsProps) {
  return (
    <div className="space-y-6">
      <OrderSummary order={order} />

      <div className="bg-gaming-dark/30 rounded-lg overflow-hidden">
        <h3 className="text-lg font-medium p-4 bg-gaming-dark/60">Order Items</h3>
        <OrderItemsList items={orderItems} />
      </div>
    </div>
  );
}
