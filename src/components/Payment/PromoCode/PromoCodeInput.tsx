
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PromoCodeInputProps {
  promoCode: string;
  isProcessing: boolean;
  onChange: (value: string) => void;
}

const PromoCodeInput = ({ promoCode, isProcessing, onChange }: PromoCodeInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="promo-code">Promo Code (Affiliate or Coupon)</Label>
      <div className="flex gap-2">
        <Input
          id="promo-code"
          placeholder="Enter promo code"
          value={promoCode}
          onChange={(e) => onChange(e.target.value)}
          className="bg-gaming-dark border-gaming-light-gray/40"
        />
        <Button 
          onClick={() => {}} // Validation will be handled by the backend
          disabled={isProcessing || !promoCode.trim()}
          className="whitespace-nowrap"
        >
          Apply
        </Button>
      </div>
    </div>
  );
};

export default PromoCodeInput;
