
import { Separator } from "@/components/ui/separator";

interface PriceSummaryProps {
  totalPrice: number;
  assemblyFee: number;
}

const PriceSummary = ({ totalPrice, assemblyFee }: PriceSummaryProps) => {
  return (
    <div className="space-y-2 mb-4">
      <div className="flex justify-between text-gray-300">
        <span>Subtotal</span>
        <span>${(totalPrice - assemblyFee).toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-gray-300">
        <span>Assembly Fee</span>
        <span>${assemblyFee.toFixed(2)}</span>
      </div>
      <Separator className="my-2 bg-gaming-light-gray/20" />
      <div className="flex justify-between text-white font-bold">
        <span>Total</span>
        <span>${totalPrice.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default PriceSummary;
