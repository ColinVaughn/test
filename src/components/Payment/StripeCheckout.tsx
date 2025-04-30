
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PrebuiltPC } from "@/types/types";
import { CreditCard, Lock } from "lucide-react";

interface StripeCheckoutProps {
  product: PrebuiltPC;
}

const StripeCheckout = ({ product }: StripeCheckoutProps) => {
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Format card number with spaces
    if (name === "number") {
      const formatted = value.replace(/\s/g, "").replace(/(.{4})/g, "$1 ").trim();
      setCardDetails({ ...cardDetails, [name]: formatted });
    } 
    // Format expiry as MM/YY
    else if (name === "expiry") {
      const cleaned = value.replace(/\D/g, "");
      let formatted = cleaned;
      
      if (cleaned.length > 2) {
        formatted = cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
      }
      
      setCardDetails({ ...cardDetails, [name]: formatted });
    } 
    // Limit CVC to 3 or 4 digits
    else if (name === "cvc") {
      const cleaned = value.replace(/\D/g, "").slice(0, 4);
      setCardDetails({ ...cardDetails, [name]: cleaned });
    }
    else {
      setCardDetails({ ...cardDetails, [name]: value });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-300">Paying with Credit Card</span>
        <div className="flex gap-2">
          <div className="w-8 h-5 bg-gray-700 rounded-sm"></div>
          <div className="w-8 h-5 bg-gray-700 rounded-sm"></div>
          <div className="w-8 h-5 bg-gray-700 rounded-sm"></div>
        </div>
      </div>
      
      <div className="space-y-3">
        <div>
          <Label htmlFor="name">Cardholder Name</Label>
          <Input 
            id="name"
            name="name"
            placeholder="Name on card" 
            value={cardDetails.name}
            onChange={handleChange}
            className="bg-gaming-dark border-gaming-light-gray/40 text-white"
          />
        </div>
        
        <div>
          <Label htmlFor="number">Card Number</Label>
          <div className="relative">
            <Input 
              id="number"
              name="number"
              placeholder="1234 5678 9012 3456" 
              value={cardDetails.number}
              onChange={handleChange}
              maxLength={19}
              className="bg-gaming-dark border-gaming-light-gray/40 text-white"
            />
            <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="expiry">Expiry Date</Label>
            <Input 
              id="expiry"
              name="expiry"
              placeholder="MM/YY" 
              value={cardDetails.expiry}
              onChange={handleChange}
              maxLength={5}
              className="bg-gaming-dark border-gaming-light-gray/40 text-white"
            />
          </div>
          <div>
            <Label htmlFor="cvc">CVC</Label>
            <div className="relative">
              <Input 
                id="cvc"
                name="cvc"
                placeholder="123" 
                value={cardDetails.cvc}
                onChange={handleChange}
                maxLength={4}
                className="bg-gaming-dark border-gaming-light-gray/40 text-white"
              />
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StripeCheckout;
