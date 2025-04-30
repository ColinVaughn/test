
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface ZellePaymentUpdateProps {
  orderId: string;
  orderTotal: number;
  currentAmount: number;
  onPaymentUpdated: () => void;
}

export const ZellePaymentUpdate = ({ 
  orderId, 
  orderTotal, 
  currentAmount, 
  onPaymentUpdated 
}: ZellePaymentUpdateProps) => {
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdatePayment = async () => {
    if (!amount) {
      toast.error("Please enter a payment amount");
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error("Please enter a valid payment amount");
      return;
    }

    setIsUpdating(true);
    try {
      const newTotal = currentAmount + numAmount;
      const newStatus = newTotal >= orderTotal ? "processing" : "pending";

      const { error: paymentError } = await supabase
        .from("payment_transactions")
        .update({
          zelle_received_amount: newTotal,
          zelle_notes: notes || undefined,
          status: newStatus
        })
        .eq("order_id", orderId);

      if (paymentError) throw paymentError;

      if (newStatus === "processing") {
        const { error: orderError } = await supabase
          .from("orders")
          .update({ status: "processing" })
          .eq("id", orderId);

        if (orderError) throw orderError;
      }

      toast.success("Payment updated successfully");
      setAmount("");
      setNotes("");
      onPaymentUpdated();
    } catch (error) {
      console.error("Error updating payment:", error);
      toast.error("Failed to update payment");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-4 bg-gaming-darker p-4 rounded-lg">
      <h3 className="font-semibold">Update Zelle Payment</h3>
      <div className="space-y-2">
        <div>
          <label className="text-sm text-gray-400">Current Amount Received</label>
          <p className="text-lg font-medium">${currentAmount.toFixed(2)}</p>
        </div>
        <div>
          <label className="text-sm text-gray-400">Order Total</label>
          <p className="text-lg font-medium">${orderTotal.toFixed(2)}</p>
        </div>
        <div>
          <label className="text-sm text-gray-400">Remaining</label>
          <p className="text-lg font-medium text-amber-500">
            ${Math.max(0, orderTotal - currentAmount).toFixed(2)}
          </p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div>
          <label className="text-sm text-gray-400">Add Payment Amount</label>
          <Input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount received"
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-sm text-gray-400">Notes (optional)</label>
          <Input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add payment notes"
            className="mt-1"
          />
        </div>
        <Button 
          onClick={handleUpdatePayment} 
          disabled={isUpdating || !amount}
          className="w-full"
        >
          {isUpdating ? "Updating..." : "Update Payment"}
        </Button>
      </div>
    </div>
  );
};
