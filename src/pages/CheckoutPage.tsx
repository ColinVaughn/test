
import { useEffect } from "react";
import HeaderWithAdmin from "@/components/HeaderWithAdmin";
import Footer from "@/components/Footer";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CheckoutItems from "@/components/Checkout/CheckoutItems";
import CheckoutSummary from "@/components/Checkout/CheckoutSummary";
import { calculateShippingCost } from "@/utils/checkoutCalculations";

const CheckoutPage = () => {
  const { items, isLoading, removeFromCart } = useCart();
  const navigate = useNavigate();
  
  const hasCustomPC = items.some(item => item.product_type === 'custom');
  const hasOnlyMarketplace = items.every(item => item.product_type === 'marketplace');
  
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  
  const assemblyFee = hasCustomPC ? 99 : 0;
  const shippingCost = calculateShippingCost(items, hasCustomPC, hasOnlyMarketplace);
  const taxAmount = (subtotal + assemblyFee) * 0.08;
  const total = subtotal + assemblyFee + shippingCost + taxAmount;

  useEffect(() => {
    if (!isLoading && items.length === 0) {
      toast.error("Your cart is empty!");
      navigate("/");
    }
  }, [items.length, isLoading, navigate]);

  const handleRemoveItem = async (productId: string, productName: string) => {
    try {
      await removeFromCart(productId);
      toast.success(`${productName} removed from cart`);
    } catch (error) {
      console.error("Error removing item from cart:", error);
      toast.error("Failed to remove item from cart");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gaming-darker">
      <HeaderWithAdmin />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-screen-xl">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold text-white ml-4">Checkout</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-gaming-dark p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Your Cart</h2>
            
            {items.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">Your cart is empty.</p>
              </div>
            ) : (
              <CheckoutItems 
                items={items}
                onRemoveItem={handleRemoveItem}
              />
            )}
          </div>
          
          <div className="lg:col-span-1">
            <CheckoutSummary
              hasCustomPC={hasCustomPC}
              hasOnlyMarketplace={hasOnlyMarketplace}
              subtotal={subtotal}
              assemblyFee={assemblyFee}
              shippingCost={shippingCost}
              taxAmount={taxAmount}
              total={total}
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CheckoutPage;
