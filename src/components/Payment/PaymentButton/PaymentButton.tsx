
import { Button } from "@/components/ui/button";
import { useCheckout, CheckoutData } from "@/hooks/use-checkout";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface PaymentButtonProps {
  configuration: CheckoutData;
  paymentMethod: "stripe" | "paypal" | "zelle";
  disabled: boolean;
  onCheckout?: () => Promise<void>;
}

const PaymentButton = ({
  configuration,
  paymentMethod,
  disabled,
  onCheckout
}: PaymentButtonProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { startStripeCheckout, startPayPalCheckout } = useCheckout();

  const handleClick = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      if (onCheckout) {
        await onCheckout();
        return;
      }
      
      if (paymentMethod === "stripe") {
        await startStripeCheckout(configuration);
      } else if (paymentMethod === "paypal") {
        await startPayPalCheckout(configuration);
      }
    } catch (error) {
      console.error("Payment error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Button
      className="w-full h-12 text-white font-medium"
      disabled={disabled || isProcessing}
      onClick={handleClick}
    >
      {isProcessing ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        "Checkout"
      )}
    </Button>
  );
};

export default PaymentButton;
