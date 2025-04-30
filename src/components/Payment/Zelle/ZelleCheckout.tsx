
import { PrebuiltPC } from "@/types/types";
import { Button } from "@/components/ui/button";
import { usePCConfiguration } from "@/hooks/use-pc-configuration";
import { ZelleEmail } from "./ZelleEmail";
import { ZelleOrderSummary } from "./ZelleOrderSummary";
import { ZelleInstructions } from "./ZelleInstructions";
import { ZelleDiscountInfo } from "./ZelleDiscountInfo";
import { useZelleOrder } from "./useZelleOrder";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateTotalPrice } from "./zelleOrderUtils";

interface ZelleCheckoutProps {
  product: PrebuiltPC;
}

const ZelleCheckout = ({ product }: ZelleCheckoutProps) => {
  const zelleEmail = "colin@battleforgepc.com";
  const { configuration } = usePCConfiguration();
  const { form, isSubmitting, onSubmit } = useZelleOrder();

  // Calculate the total price based on either the configuration or product
  let componentTotal = 0;
  let subtotal = 0;
  let hasCustomComponents = false;
  
  if (configuration && Object.keys(configuration).some(key => configuration[key])) {
    hasCustomComponents = true;
    
    // Sum up all component prices
    Object.entries(configuration).forEach(([key, component]) => {
      if (!component) return;
      
      if (key === 'fans' && 'quantity' in component && component.component) {
        componentTotal += (component.component.price || 0) * (component.quantity || 0);
      } else if ('price' in component) {
        componentTotal += component.price || 0;
      }
    });
    
    // Add assembly fee
    subtotal = componentTotal + 99; // $99 assembly fee
  } else if (product && product.price) {
    // Use the prebuilt product price
    subtotal = product.price;
  }
  
  const tax = Math.round(subtotal * 0.08);
  const shippingFee = 60;
  const total = subtotal + tax + shippingFee;

  console.log("ZelleCheckout - Final price calculation:");
  console.log("Component Total:", componentTotal);
  console.log("Subtotal (with assembly fee if custom):", subtotal);
  console.log("Tax:", tax);
  console.log("Shipping Fee:", shippingFee);
  console.log("Total:", total);

  // Generate component list for display
  const renderComponentList = () => {
    if (!hasCustomComponents) {
      return (
        <div className="text-sm text-gray-400 mb-2">
          {product.price ? `${product.name}` : "No custom components selected."}
        </div>
      );
    }

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
        <div className="flex justify-between font-medium mt-2">
          <span>Assembly Fee</span>
          <span className="text-gaming-blue">$99.00</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gaming-dark/50 border-gaming-light-gray/20">
        <CardHeader>
          <CardTitle className="text-gaming-blue">Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ZelleEmail zelleEmail={zelleEmail} />
          {renderComponentList()}
          <ZelleOrderSummary 
            subtotal={subtotal} 
            tax={tax} 
            shippingFee={shippingFee} 
            total={total} 
          />
          <ZelleDiscountInfo />
        </CardContent>
      </Card>

      <Card className="bg-gaming-dark/50 border-gaming-light-gray/20">
        <CardHeader>
          <CardTitle className="text-gaming-blue">Shipping Information</CardTitle>
        </CardHeader>
        <CardContent>
          <ZelleInstructions />
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="customer_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} className="bg-gaming-dark border-gaming-light-gray/40" />
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
                        <Input placeholder="youremail@example.com" {...field} className="bg-gaming-dark border-gaming-light-gray/40" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator className="my-4" />
              <h3 className="font-medium text-gaming-blue mb-2">Shipping Address</h3>

              <FormField
                control={form.control}
                name="address.street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St" {...field} className="bg-gaming-dark border-gaming-light-gray/40" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="address.city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="New York" {...field} className="bg-gaming-dark border-gaming-light-gray/40" />
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
                        <Input placeholder="NY" {...field} className="bg-gaming-dark border-gaming-light-gray/40" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="address.zip"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ZIP Code</FormLabel>
                      <FormControl>
                        <Input placeholder="10001" {...field} className="bg-gaming-dark border-gaming-light-gray/40" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <Button
                className="w-full mt-6 bg-gaming-blue hover:bg-gaming-blue/80 text-white"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Place Order with Zelle"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ZelleCheckout;
