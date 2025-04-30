import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingCart, Plus, Minus, Trash, Cpu, HardDrive, Monitor } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import PaymentModal from "../Payment/PaymentModal";
import { useNavigate } from "react-router-dom";

export const CartDialog = () => {
  const { items, isLoading, fetchCart, updateQuantity, removeFromCart } = useCart();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    setIsSheetOpen(false); // Close the cart sheet
    navigate('/checkout'); // Navigate to checkout page directly
  };

  const renderConfigurationDetails = (item: any) => {
    if (!item.configuration) return null;
    
    // For custom PCs with component selection
    if (typeof item.configuration === 'object' && item.product_type === 'custom') {
      const components = Object.values(item.configuration).filter(Boolean);
      if (components.length === 0) return null;
      
      return (
        <div className="mt-2 space-y-1 text-xs text-gray-400">
          {components.map((component: any, index) => (
            <div key={index} className="flex items-start">
              {component.name && (
                <>
                  <span className="mr-1">• {component.brand} {component.name}</span>
                  {component.selectedColor && (
                    <span className="ml-1 flex items-center">
                      (
                      <span 
                        className="inline-block w-2 h-2 rounded-full mr-1" 
                        style={{ backgroundColor: component.selectedColor.hexCode }}
                      />
                      {component.selectedColor.name}
                      )
                    </span>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      );
    }
    
    // For prebuilt PCs with specs
    return (
      <div className="mt-2 space-y-1 text-xs text-gray-400">
        {item.details?.specs && Object.entries(item.details.specs).map(([key, value]) => (
          <div key={key} className="flex items-center">
            {key === 'cpu' && <Cpu className="h-3 w-3 mr-1" />}
            {key === 'gpu' && <Monitor className="h-3 w-3 mr-1" />}
            {key === 'storage' && <HardDrive className="h-3 w-3 mr-1" />}
            {key === 'ram' && <Cpu className="h-3 w-3 mr-1" />}
            <span>• {key.charAt(0).toUpperCase() + key.slice(1)}: {value as React.ReactNode}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="relative rounded-full border-gaming-blue/50 hover:border-gaming-blue hover:bg-gaming-blue/10">
            <ShoppingCart className="h-5 w-5" />
            {items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-gaming-blue text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {items.length}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[90vw] sm:w-[540px] bg-gaming-dark border-gaming-light-gray/20 flex flex-col p-0">
          <div className="p-6">
            <SheetHeader>
              <SheetTitle className="text-gaming-blue flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Shopping Cart
              </SheetTitle>
            </SheetHeader>
          </div>

          <ScrollArea className="flex-1 px-6">
            {isLoading ? (
              <p className="text-center text-gray-400">Loading cart...</p>
            ) : items.length === 0 ? (
              <p className="text-center text-gray-400">Your cart is empty</p>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.product_id} className="bg-gaming-darker p-4 rounded-lg">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.product_name}</h4>
                        <p className="text-sm text-gray-400">{item.product_type}</p>
                        {renderConfigurationDetails(item)}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <p className="text-gaming-blue font-bold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-600"
                            onClick={() => removeFromCart(item.product_id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          <div className="p-6 mt-auto">
            <Separator className="mb-4 bg-gaming-light-gray/20" />
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg">Total</span>
              <span className="text-lg font-bold text-gaming-blue">
                ${total.toFixed(2)}
              </span>
            </div>
            <Button
              className="w-full bg-gaming-blue hover:bg-gaming-blue/80"
              disabled={items.length === 0}
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {isPaymentModalOpen && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          product={{
            id: `cart-checkout-${Date.now()}`,
            name: "Cart Checkout",
            description: `Checkout for ${items.length} item(s)`,
            price: total,
            originalPrice: total,
            discount: 0,
            category: "Cart",
            bestseller: false,
            featured: false,
            new: false,
            imageUrl: items[0]?.details?.imageUrl || "/placeholder.svg",
            specs: items.reduce((specs, item, index) => {
              if (item.configuration && item.product_type === 'custom') {
                // Extract key components from custom PC
                const cpu = item.configuration.cpu?.name || "N/A";
                const gpu = item.configuration.gpu?.name || "N/A";
                const ram = item.configuration.ram?.name || "N/A";
                const storage = item.configuration.storage?.name || "N/A";
                specs[`Item ${index+1}`] = `${item.product_name} (CPU: ${cpu}, GPU: ${gpu})`;
              } else {
                // For prebuilt systems
                specs[`Item ${index+1}`] = item.product_name;
              }
              return specs;
            }, {}),
            rating: 5,
            reviews: 0,
            details: items
          }}
        />
      )}
    </>
  );
};
