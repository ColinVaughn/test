
import { Separator } from "@/components/ui/separator";

interface ZelleOrderSummaryProps {
  subtotal: number;
  tax: number;
  shippingFee: number;
  total: number;
}

export const ZelleOrderSummary = ({ 
  subtotal, 
  tax, 
  shippingFee, 
  total 
}: ZelleOrderSummaryProps) => {
  return (
    <div className="space-y-2 pt-4">
      <div className="flex justify-between text-sm">
        <span className="text-gray-400">Subtotal:</span>
        <span>${subtotal}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-400">Tax (8%):</span>
        <span>${tax}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-400">Shipping:</span>
        <span>${shippingFee}</span>
      </div>
      <Separator className="my-2 bg-gaming-light-gray/20" />
      <div className="flex justify-between font-bold text-lg">
        <span>Total:</span>
        <span className="text-gaming-blue">${total}</span>
      </div>
    </div>
  );
};
