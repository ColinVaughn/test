
import { OrderItem } from "../types";
import OrderItemCard from "./OrderItemCard";

interface OrderItemsListProps {
  items: OrderItem[];
}

const OrderItemsList = ({ items }: OrderItemsListProps) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No items found
      </div>
    );
  }
  
  return (
    <div className="p-4 space-y-3">
      {items.map((item) => (
        <OrderItemCard key={item.id} item={item} />
      ))}
    </div>
  );
};

export default OrderItemsList;
