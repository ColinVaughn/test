
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { Truck, AlertCircle, RefreshCw } from "lucide-react";
import { Shipment } from "./types";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

interface ShipmentTrackerProps {
  shipment: Shipment | null;
  orderId: string;
  isLoading: boolean;
  setShipment: (shipment: Shipment | null) => void;
}

export default function ShipmentTracker({ 
  shipment, 
  orderId,
  isLoading,
  setShipment
}: ShipmentTrackerProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshTrackingInfo = async () => {
    if (!shipment || !shipment.tracking_number || !shipment.carrier) {
      toast.error("No tracking information available");
      return;
    }

    setIsRefreshing(true);
    try {
      console.log("Refreshing tracking info for order:", orderId);
      const { data, error } = await supabase.functions.invoke('shippo-tracking', {
        body: {
          tracking_number: shipment.tracking_number,
          carrier: shipment.carrier,
          order_id: orderId
        }
      });

      if (error) throw error;
      
      if (data.shipment) {
        console.log("Tracking info updated:", data.shipment);
        setShipment(data.shipment);
        toast.success("Tracking information updated");
      } else {
        console.log("No new tracking info available");
        toast.info("No new tracking information available");
      }
    } catch (error) {
      console.error("Error refreshing tracking info:", error);
      toast.error("Failed to refresh tracking information");
    } finally {
      setIsRefreshing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">Loading shipment details...</p>
      </div>
    );
  }

  if (!shipment) {
    return (
      <div className="text-center py-12 bg-gaming-dark/30 rounded-lg">
        <Truck className="mx-auto w-16 h-16 text-gray-500 mb-4" />
        <h3 className="text-xl font-medium mb-2">No Tracking Information</h3>
        <p className="text-gray-400 mb-4">This order hasn't been shipped yet or tracking information hasn't been added.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gaming-dark/30 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Shipping Status</h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshTrackingInfo}
            disabled={isRefreshing || !shipment.tracking_number}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-sm">Carrier</p>
              <p className="font-medium">{shipment.carrier || "Unknown"}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Tracking Number</p>
              <p className="font-medium font-mono text-sm">{shipment.tracking_number || "N/A"}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Status</p>
              <p className="font-medium capitalize">{shipment.status?.toLowerCase() || "Unknown"}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Estimated Delivery</p>
              <p className="font-medium">
                {shipment.estimated_delivery 
                  ? format(new Date(shipment.estimated_delivery), "MMMM d, yyyy") 
                  : "Not available"}
              </p>
            </div>
          </div>
          
          {shipment.tracking_url && (
            <div className="pt-4 border-t border-gray-700">
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => window.open(shipment.tracking_url, "_blank")}
              >
                <Truck className="mr-2 h-4 w-4" />
                Track Package on Carrier Website
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-gaming-dark/30 p-4 rounded-lg text-sm">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-yellow-400 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-2">Tracking Updates</h4>
            <p className="text-gray-300">
              Package status is updated from the carrier's tracking system. 
              Click "Refresh" to get the latest status from the carrier.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
