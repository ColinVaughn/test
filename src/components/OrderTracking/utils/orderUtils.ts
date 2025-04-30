
import { Clock, PackageOpen, Truck, CheckCircle, AlertTriangle } from "lucide-react";

// This function returns the icon component based on the status without using JSX
export const getStatusIconComponent = (status: string) => {
  switch (status) {
    case "pending":
      return Clock;
    case "processing":
      return PackageOpen;
    case "shipped":
      return Truck;
    case "delivered":
      return CheckCircle;
    case "cancelled":
      return AlertTriangle;
    default:
      return Clock;
  }
};

// This function returns the color class based on the status
export const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "text-yellow-500";
    case "processing":
      return "text-blue-500";
    case "shipped":
      return "text-purple-500";
    case "delivered":
      return "text-green-500";
    case "cancelled":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
};
