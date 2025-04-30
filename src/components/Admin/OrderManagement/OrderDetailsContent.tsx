
import { Separator } from "@/components/ui/separator";
import type { OrderType, OrderItemType, ShipmentType, PaymentType } from "../types/AdminTypes";
import { OrderInfo } from "./OrderInfo";
import { PaymentInfo } from "./PaymentInfo";
import { OrderItems } from "./OrderItems";
import { StatusUpdate } from "./StatusUpdate";
import { ZellePaymentUpdate } from "./ZellePaymentUpdate";

interface OrderDetailsContentProps {
  selectedOrder: OrderType;
  orderItems: OrderItemType[];
  shipment: ShipmentType | null;
  paymentInfo: PaymentType | null;
  isUpdatingStatus: boolean;
  isUpdatingShipment: boolean;
  onUpdateOrderStatus: (orderId: string, status: string) => void;
  onUpdateShipment: () => void;
}

export const OrderDetailsContent = ({
  selectedOrder,
  orderItems,
  shipment,
  paymentInfo,
  isUpdatingStatus,
  onUpdateOrderStatus,
  onUpdateShipment,
}: OrderDetailsContentProps) => {
  // Check if there's a Zelle payment that needs attention
  const isZellePending = paymentInfo?.payment_method === 'zelle' && 
                        (paymentInfo.status === 'pending' || 
                         (paymentInfo.zelle_received_amount || 0) < paymentInfo.amount);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Order Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <OrderInfo order={selectedOrder} />
            </div>
            <div>
              <PaymentInfo paymentInfo={paymentInfo} />
            </div>
          </div>
          
          {/* Add Zelle Payment Update Section if needed */}
          {isZellePending && (
            <div className="mt-4">
              <ZellePaymentUpdate
                orderId={selectedOrder.id}
                orderTotal={selectedOrder.total}
                currentAmount={paymentInfo.zelle_received_amount || 0}
                onPaymentUpdated={() => {
                  onUpdateOrderStatus(selectedOrder.id, selectedOrder.status);
                  onUpdateShipment();
                }}
              />
            </div>
          )}
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-3">Order Items</h3>
          <OrderItems items={orderItems} />
        </div>
      </div>
      
      <Separator className="bg-gaming-light-gray/20" />
      
      <StatusUpdate 
        currentStatus={selectedOrder.status}
        isUpdating={isUpdatingStatus}
        onUpdateStatus={(status) => onUpdateOrderStatus(selectedOrder.id, status)}
      />
    </div>
  );
};
