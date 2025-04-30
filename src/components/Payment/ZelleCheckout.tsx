
import { PrebuiltPC } from "@/types/types";
import { Button } from "@/components/ui/button";
import { usePCConfiguration } from "@/hooks/use-pc-configuration";
import { ZelleEmail } from "./Zelle/ZelleEmail";
import { ZelleOrderSummary } from "./Zelle/ZelleOrderSummary";
import { ZelleInstructions } from "./Zelle/ZelleInstructions";
import { ZelleDiscountInfo } from "./Zelle/ZelleDiscountInfo";
import { useZelleOrder } from "./Zelle/useZelleOrder";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";

interface ZelleCheckoutProps {
  product?: PrebuiltPC;
}

const ZelleCheckout = ({ product }: ZelleCheckoutProps = {}) => {
  const zelleEmail = "info@battleforgepc.com";
  const { configuration } = usePCConfiguration();
  const { items } = useCart();
  const { form, isSubmitting, onSubmit } = useZelleOrder();

  // Calculate subtotal from cart items if available, otherwise use product price
  let subtotal = 0;
  let hasMarketplaceItems = false;
  
  if (items && items.length > 0) {
    hasMarketplaceItems = items.some(item => item.product_type === 'marketplace');
    subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  } else if (product?.price) {
    subtotal = product.price;
  }
  
  const tax = Math.round(subtotal * 0.08);
  const shippingCost = hasMarketplaceItems ? calculateMarketplaceShipping(items) : 60;
  const total = subtotal + tax + shippingCost;

  // Calculate shipping for marketplace items
  function calculateMarketplaceShipping(items) {
    if (!items || items.length === 0) return 20;
    
    let totalShipping = 0;
    
    for (const item of items) {
      if (item.product_type === 'marketplace') {
        const shipping = item.details?.shipping || {};
        
        // Base shipping cost
        let itemShipping = 20; 
        
        // Calculate based on dimensions if available
        if (shipping.dimensions) {
          try {
            const dimensionString = shipping.dimensions.replace(/\*/g, 'x');
            const parts = dimensionString.split('x').map(part => parseFloat(part.trim()));
            
            if (parts.length === 3 && !parts.some(isNaN)) {
              const [width, height, depth] = parts;
              const volume = width * height * depth;
              itemShipping += Math.floor(volume / 1000) * 10;
              
              if (volume > 10000) {
                itemShipping += 25;
              }
            }
          } catch (error) {
            console.error("Error parsing dimensions:", error);
          }
        }
        
        // Calculate based on weight if available
        if (shipping.weight) {
          const weight = parseFloat(shipping.weight);
          if (!isNaN(weight)) {
            const weightCharge = Math.max(0, weight - 2) * 4;
            itemShipping += weightCharge;
            
            if (weight > 30) {
              itemShipping += 30;
            }
          }
        }
        
        // Add insurance cost if specified
        if (shipping.insuranceCoverage && shipping.insuranceCoverage > 100) {
          const extraInsurance = shipping.insuranceCoverage - 100;
          const insuranceCharge = (extraInsurance / 100) * 2;
          itemShipping += insuranceCharge;
        }
        
        totalShipping += itemShipping * item.quantity;
      }
    }
    
    return Math.max(15, totalShipping);
  }

  // Generate component list or marketplace item list for display
  const renderItemsList = () => {
    // If we have marketplace items in the cart
    if (hasMarketplaceItems) {
      return (
        <div className="space-y-1 text-sm mb-3">
          <h4 className="font-medium text-gaming-blue mb-1">Items in your cart:</h4>
          {items.map((item, index) => (
            <div key={`${item.product_id}-${index}`} className="flex justify-between">
              <span>{item.product_name} {item.quantity > 1 ? `(${item.quantity}x)` : ''}</span>
              <span className="text-gaming-blue">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
      );
    }
    
    // If we have a PC configuration
    if (configuration && Object.keys(configuration).filter(key => configuration[key]).length > 0) {
      return (
        <div className="space-y-1 text-sm mb-3">
          <h4 className="font-medium text-gaming-blue mb-1">Selected Components:</h4>
          {Object.entries(configuration).map(([key, component]) => {
            if (!component) return null;
            
            if (key === 'fans' && 'quantity' in component && component.component) {
              return (
                <div key={key} className="flex justify-between">
                  <span>{component.quantity}x {component.component.name}</span>
                  <span className="text-gaming-blue">${component.component.price * component.quantity}</span>
                </div>
              );
            } else if (component && 'name' in component) {
              return (
                <div key={key} className="flex justify-between">
                  <span>{component.name}</span>
                  <span className="text-gaming-blue">${component.price}</span>
                </div>
              );
            }
            
            return null;
          })}
        </div>
      );
    }
    
    // If we have a prebuilt product
    if (product?.name) {
      return (
        <div className="text-sm text-gray-400 mb-2">
          {product.name}
        </div>
      );
    }
    
    return (
      <div className="text-sm text-gray-400 mb-2">
        No items selected.
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="bg-gaming-dark/50 p-4 rounded-lg space-y-3">
        <h3 className="font-semibold text-lg text-gaming-blue">Pay with Zelle</h3>
        <p className="text-sm text-gray-300">
          Send payment to the following email address using Zelle:
        </p>
        
        <ZelleEmail zelleEmail={zelleEmail} />
        
        {renderItemsList()}
        
        <ZelleOrderSummary 
          subtotal={subtotal} 
          tax={tax} 
          shippingFee={shippingCost} 
          total={total} 
        />
      </div>

      <ZelleDiscountInfo />
      <ZelleInstructions />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="customer_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customer_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="youremail@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator className="my-4" />
            <h3 className="font-medium text-gaming-blue">Shipping Address</h3>

            <FormField
              control={form.control}
              name="address.street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Main St" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="address.city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="New York" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address.state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input placeholder="NY" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address.zip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ZIP Code</FormLabel>
                  <FormControl>
                    <Input placeholder="10001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <Button
            className="w-full bg-gaming-blue hover:bg-gaming-blue/80 text-white"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Place Order"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ZelleCheckout;
