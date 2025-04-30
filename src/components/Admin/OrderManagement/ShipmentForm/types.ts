
import type { OrderType, ShipmentType } from "../../types/AdminTypes";

export interface ShipmentFormData {
  tracking_number: string;
  carrier: string;
  estimated_delivery: string;
}

export interface ShipmentFormProps {
  selectedOrder: OrderType;
  shipment: ShipmentType | null;
  onShipmentUpdated: () => void;
  setIsUpdatingShipment: (value: boolean) => void;
}
