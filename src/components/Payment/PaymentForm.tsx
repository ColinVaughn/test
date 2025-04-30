
import { useState } from "react";
import { PrebuiltPC } from "@/types/types";
import { useCheckout, CheckoutData } from "@/hooks/use-checkout";
import AddressForm, { AddressData } from "./AddressForm";
import PaymentTabs from "./PaymentTabs/PaymentTabs";
import PaymentButton from "./PaymentButton/PaymentButton";
import PromoCodeInput from "./PromoCode/PromoCodeInput";
import SuggestedProducts from "../CustomizePC/OrderSummary/SuggestedProducts";
import { toast } from "sonner";
import ZelleCheckout from "./ZelleCheckout";
import OrderSummary from "./OrderSummary";

interface PaymentFormProps {
  product: PrebuiltPC;
  onCancel: () => void;
}

const PaymentForm = ({ product, onCancel }: PaymentFormProps) => {
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "paypal" | "zelle">("stripe");
  const [addresses, setAddresses] = useState<AddressData | null>(null);
  const [promoCode, setPromoCode] = useState<string>("");
  const [cart, setCart] = useState<string[]>([]);
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [formValid, setFormValid] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { startStripeCheckout, startPayPalCheckout } = useCheckout();

  const handleAddToCart = (productId: string) => {
    setCart(prev => [...prev, productId]);
  };

  const handleAddressSubmit = (addressData: AddressData) => {
    setAddresses(addressData);
    setFormValid(true);
    toast.success("Address information saved");
    console.log("Address data submitted:", addressData);
  };

  const handleCheckout = async () => {
    if (!addresses && paymentMethod !== "zelle") {
      toast.error("Please fill in the address information");
      return;
    }

    try {
      setIsProcessing(true);
      
      // Calculate total with credit card fee for Stripe
      const baseAmount = product.price;
      const tax = Math.round(baseAmount * 0.08);
      const shippingFee = 60;
      const creditCardFee = paymentMethod === "stripe" ? Math.round(baseAmount * 0.03) : 0;
      const total = baseAmount + tax + shippingFee + creditCardFee;
      
      // Create checkout data with product details and additional information
      const checkoutPayload: CheckoutData = {
        ...product,
        price: total,
        addresses,
        promoCode,
        accessories: cart
      };
      
      console.log("Starting checkout with payload:", checkoutPayload);
      setCheckoutData(checkoutPayload);
      
      if (paymentMethod === "stripe") {
        await startStripeCheckout(checkoutPayload);
        toast.success("Redirecting to Stripe checkout...");
      } else if (paymentMethod === "paypal") {
        await startPayPalCheckout(checkoutPayload);
        toast.success("Redirecting to PayPal checkout...");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to process payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <PaymentTabs 
        product={product}
        paymentMethod={paymentMethod}
        onPaymentMethodChange={setPaymentMethod}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          {/* Only show address form for stripe/paypal payments */}
          {paymentMethod !== "zelle" ? (
            <>
              <AddressForm onAddressSubmit={handleAddressSubmit} />
              
              <div className="space-y-4 mt-6">
                <PromoCodeInput 
                  promoCode={promoCode}
                  isProcessing={false}
                  onChange={setPromoCode}
                />

                <SuggestedProducts onAddToCart={handleAddToCart} />

                <PaymentButton 
                  configuration={checkoutData || { ...product, addresses, promoCode, accessories: cart }}
                  paymentMethod={paymentMethod}
                  disabled={!formValid}
                  onCheckout={handleCheckout}
                />
              </div>
            </>
          ) : (
            <ZelleCheckout product={product} />
          )}
        </div>
        
        <div className="lg:sticky lg:top-6">
          <OrderSummary product={product} paymentMethod={paymentMethod} />
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
