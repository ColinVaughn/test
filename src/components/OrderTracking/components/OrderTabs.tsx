
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrderDetails from "../OrderDetails";
import ShipmentTracker from "../ShipmentTracker";
import { Order, OrderItem, Shipment } from "../types";

interface OrderTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  order: Order;
  orderItems: OrderItem[];
  shipment: Shipment | null;
  isLoading: boolean;
  setShipment: (shipment: Shipment | null) => void;
}

export default function OrderTabs({
  activeTab,
  setActiveTab,
  order,
  orderItems,
  shipment,
  isLoading,
  setShipment
}: OrderTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="bg-gaming-dark mb-4">
        <TabsTrigger value="details">Order Details</TabsTrigger>
        <TabsTrigger value="tracking">Shipment Tracking</TabsTrigger>
      </TabsList>

      <TabsContent value="details">
        <OrderDetails order={order} orderItems={orderItems} />
      </TabsContent>

      <TabsContent value="tracking">
        <ShipmentTracker
          shipment={shipment}
          orderId={order.id}
          isLoading={isLoading}
          setShipment={setShipment}
        />
      </TabsContent>
    </Tabs>
  );
}
