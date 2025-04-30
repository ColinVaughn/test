
import { useState } from "react";
import OrderLookup from "./OrderLookup";
import OrdersList from "./OrdersList";
import { useOrderTracking } from "./hooks/useOrderTracking";
import BackButton from "./components/BackButton";
import OrderTabs from "./components/OrderTabs";

export default function OrderTracker() {
  const {
    orders,
    selectedOrder,
    setSelectedOrder,
    orderItems,
    shipment,
    setShipment,
    isLoading,
    handleOrderLookup
  } = useOrderTracking();
  const [activeTab, setActiveTab] = useState("orders");

  const handleViewOrder = (order: typeof selectedOrder) => {
    if (!order) return;
    console.log("Viewing order:", order.id);
    setSelectedOrder(order);
    setActiveTab("details");
  };

  const handleBack = () => {
    console.log("Going back to all orders");
    setSelectedOrder(null);
    setActiveTab("orders");
  };

  return (
    <div className="bg-gaming-darker text-white p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-6 border-b border-gaming-light-gray/20 pb-3">
        {selectedOrder ? `Order #${selectedOrder.id.substring(0, 8)}...` : "Order Tracking"}
      </h2>

      {!selectedOrder && <OrderLookup onOrderFound={handleOrderLookup} />}

      {selectedOrder ? (
        <>
          <BackButton onClick={handleBack} />
          <OrderTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            order={selectedOrder}
            orderItems={orderItems}
            shipment={shipment}
            isLoading={isLoading}
            setShipment={setShipment}
          />
        </>
      ) : (
        <OrdersList
          orders={orders}
          isLoading={isLoading}
          onViewOrder={handleViewOrder}
          onOrderFound={handleOrderLookup}
        />
      )}
    </div>
  );
}
