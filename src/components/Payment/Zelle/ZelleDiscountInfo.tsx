
import { Check } from "lucide-react";

export const ZelleDiscountInfo = () => {
  return (
    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-sm flex items-start gap-2">
      <Check className="text-green-400 mt-0.5 flex-shrink-0" size={16} />
      <p className="text-green-400">
        Save 3% by paying with Zelle! The credit card processing fee has been removed from your total.
      </p>
    </div>
  );
};
