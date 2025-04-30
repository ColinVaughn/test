
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import PaymentTabs from "@/components/Payment/PaymentTabs/PaymentTabs";
import ZelleCheckout from "@/components/Payment/ZelleCheckout";
import { useCheckout, CheckoutData } from "@/hooks/use-checkout";
import { useState } from "react";
import { toast } from "sonner";

interface CheckoutSummaryProps {
  hasCustomPC: boolean;
  hasOnlyMarketplace: boolean;
  subtotal: number;
  assemblyFee: number;
  shippingCost: number;
  taxAmount: number;
  total: number;
}

const CheckoutSummary = ({
  hasCustomPC,
  hasOnlyMarketplace,
  subtotal,
  assemblyFee,
  shippingCost,
  taxAmount,
  total
}: CheckoutSummaryProps) => {
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "paypal" | "zelle">("stripe");
  const { startStripeCheckout, startPayPalCheckout } = useCheckout();
  const { items } = useCart();

  const processingFee = (paymentMethod === "stripe" || paymentMethod === "paypal") && hasCustomPC ? 
    Math.round(subtotal * 0.03) : 0;

  const finalTotal = total + processingFee;

  const handleCheckout = async () => {
    if (items.length > 0) {
      try {
        const checkoutData: CheckoutData = {
          id: `cart-checkout-${Date.now()}`,
          name: "Cart Checkout",
          price: finalTotal,
          description: `Checkout for ${items.length} item(s)`,
          imageUrl: items[0]?.details?.imageUrl && items[0].details.imageUrl.startsWith('http') 
            ? items[0].details.imageUrl 
            : "https://images.unsplash.com/photo-1624914023435-4cf3cb4e6e25?q=80&w=2574&auto=format",
          details: items,
          specs: items.reduce((acc, item, index) => {
            const itemNumber = `Item ${index + 1}`;
            let description = item.product_name;
            
            if (item.product_type === 'custom' && item.configuration) {
              const cpu = item.configuration.cpu?.name || '';
              const gpu = item.configuration.gpu?.name || '';
              if (cpu && gpu) {
                description += ` (CPU: ${cpu}, GPU: ${gpu})`;
              }
            }
            
            acc[itemNumber] = description;
            return acc;
          }, {} as Record<string, string>),
          originalPrice: subtotal,
          discount: 0,
          category: "Cart",
          bestseller: false,
          featured: false,
          new: false,
          rating: 5,
          reviews: 0
        };
        
        if (paymentMethod === "stripe") {
          await startStripeCheckout(checkoutData);
        } else if (paymentMethod === "paypal") {
          await startPayPalCheckout(checkoutData);
        }
      } catch (error) {
        console.error("Checkout error:", error);
        toast.error("Failed to process checkout");
      }
    }
  };

  return (
    <div className="bg-gaming-dark p-6 rounded-lg">
      <h2 className="text-xl font-semibold text-white mb-4">Order Summary</h2>
      
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-400">Subtotal</span>
          <span className="text-white">${subtotal.toFixed(2)}</span>
        </div>
        
        {hasCustomPC && (
          <div className="flex justify-between">
            <span className="text-gray-400">Assembly Fee</span>
            <span className="text-white">${assemblyFee.toFixed(2)}</span>
          </div>
        )}
        
        <div className="flex justify-between">
          <span className="text-gray-400">Shipping</span>
          <span className="text-white">${shippingCost.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">Tax (8%)</span>
          <span className="text-white">${taxAmount.toFixed(2)}</span>
        </div>
        
        {(paymentMethod === "stripe" || paymentMethod === "paypal") && hasCustomPC && (
          <div className="flex justify-between">
            <span className="text-gray-400">Credit Card Fee (3%)</span>
            <span className="text-white">${processingFee.toFixed(2)}</span>
          </div>
        )}
        
        <div className="flex justify-between text-lg font-bold mt-4">
          <span className="text-white">Total</span>
          <span className="text-gaming-blue">${finalTotal.toFixed(2)}</span>
        </div>
        
        <PaymentTabs
          paymentMethod={paymentMethod}
          onPaymentMethodChange={setPaymentMethod}
        />
        
        {paymentMethod === "zelle" ? (
          <ZelleCheckout />
        ) : (
          <Button 
            className="w-full bg-gaming-blue hover:bg-gaming-blue/80 mt-6 py-6 text-white"
            onClick={handleCheckout}
            disabled={items.length === 0}
          >
            Complete Purchase
          </Button>
        )}
        
        <p className="text-xs text-gray-400 mt-4 text-center">
          By completing your purchase, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default CheckoutSummary;
