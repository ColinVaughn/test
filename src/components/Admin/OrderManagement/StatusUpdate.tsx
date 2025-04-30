
import { Button } from "@/components/ui/button";

interface StatusUpdateProps {
  currentStatus: string;
  isUpdating: boolean;
  onUpdateStatus: (status: string) => void;
}

export const StatusUpdate = ({ currentStatus, isUpdating, onUpdateStatus }: StatusUpdateProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Update Order Status</h3>
      <div className="flex gap-2 flex-wrap">
        <Button 
          variant={currentStatus === "pending" ? "default" : "outline"} 
          size="sm" 
          onClick={() => onUpdateStatus("pending")}
          disabled={isUpdating || currentStatus === "pending"}
        >
          Pending
        </Button>
        <Button 
          variant={currentStatus === "processing" ? "default" : "outline"} 
          size="sm" 
          onClick={() => onUpdateStatus("processing")}
          disabled={isUpdating || currentStatus === "processing"}
        >
          Processing
        </Button>
        <Button 
          variant={currentStatus === "shipped" ? "default" : "outline"} 
          size="sm" 
          onClick={() => onUpdateStatus("shipped")}
          disabled={isUpdating || currentStatus === "shipped"}
        >
          Shipped
        </Button>
        <Button 
          variant={currentStatus === "delivered" ? "default" : "outline"} 
          size="sm" 
          onClick={() => onUpdateStatus("delivered")}
          disabled={isUpdating || currentStatus === "delivered"}
        >
          Delivered
        </Button>
        <Button 
          variant={currentStatus === "cancelled" ? "default" : "outline"} 
          size="sm" 
          onClick={() => onUpdateStatus("cancelled")}
          disabled={isUpdating || currentStatus === "cancelled"}
          className="bg-red-900/30 border-red-700/30 text-red-500 hover:bg-red-900/50"
        >
          Cancelled
        </Button>
      </div>
    </div>
  );
};
