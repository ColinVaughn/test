
import { PrebuiltPC } from "@/types/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";

interface OrderSummaryProps {
  product: PrebuiltPC;
  paymentMethod: "stripe" | "paypal" | "zelle";
}

const OrderSummary = ({ product, paymentMethod }: OrderSummaryProps) => {
  const { items } = useCart();
  
  // Determine if we have marketplace items, custom PCs, or both
  const hasCustomPC = items.some(item => item.product_type === 'custom');
  const hasOnlyMarketplace = items.every(item => item.product_type === 'marketplace');
  
  // Get subtotal of only custom PC items for processing fee calculation
  const getCustomPCSubtotal = (): number => {
    return items
      .filter(item => item.product_type === 'custom')
      .reduce((total, item) => total + item.price * item.quantity, 0);
  };
  
  // Calculate shipping costs based on item types with improved calculation
  const calculateShipping = (): number => {
    if (hasOnlyMarketplace) {
      let totalShipping = 0;
      
      for (const item of items) {
        if (item.product_type === 'marketplace') {
          const shipping = item.details?.shipping || {};
          
          // Base shipping cost (higher base for marketplace items)
          let itemShipping = 20; 
          
          // Calculate based on dimensions if available
          if (shipping.dimensions) {
            try {
              // Handle both 'x' and '*' as dimension separators
              const dimensionString = shipping.dimensions.replace(/\*/g, 'x');
              const parts = dimensionString.split('x').map(part => parseFloat(part.trim()));
              
              if (parts.length === 3 && !parts.some(isNaN)) {
                const [width, height, depth] = parts;
                const volume = width * height * depth;
                
                // More aggressive scaling for large items - $10 per 1000 cubic inches
                itemShipping += Math.floor(volume / 1000) * 10;
                
                // Additional fee for very large items (over 10,000 cubic inches)
                if (volume > 10000) {
                  itemShipping += 25; // Oversize fee
                }
                
                console.log(`OrderSummary: Calculated shipping for dimensions ${shipping.dimensions} (volume: ${volume}): $${itemShipping}`);
              }
            } catch (error) {
              console.error("Error parsing dimensions:", error);
            }
          }
          
          // Calculate based on weight if available
          if (shipping.weight) {
            const weight = parseFloat(shipping.weight);
            if (!isNaN(weight)) {
              // More significant weight charges - $4 per pound over 2 pounds
              const weightCharge = Math.max(0, weight - 2) * 4;
              itemShipping += weightCharge;
              
              // Heavy package surcharge for items over 30 pounds
              if (weight > 30) {
                itemShipping += 30; // Heavy item fee
              }
              
              console.log(`OrderSummary: Added weight charge for ${shipping.weight} lbs: $${weightCharge}`);
            }
          }
          
          // Add insurance cost if specified (beyond the $100 included coverage)
          if (shipping.insuranceCoverage && shipping.insuranceCoverage > 100) {
            const extraInsurance = shipping.insuranceCoverage - 100;
            const insuranceCharge = (extraInsurance / 100) * 2; // $2 per $100 of extra insurance
            itemShipping += insuranceCharge;
            
            console.log(`OrderSummary: Added insurance charge for $${shipping.insuranceCoverage}: $${insuranceCharge}`);
          }
          
          totalShipping += itemShipping * item.quantity;
        }
      }
      
      return Math.max(15, totalShipping); // Ensure minimum shipping fee of $15
    }
    
    // For custom PCs or mixed orders, apply fixed shipping fee
    return hasCustomPC ? 60 : 20;
  };
  
  const baseAmount = product.price;
  const assemblyFee = hasCustomPC ? 99 : 0;
  const shippingFee = calculateShipping();
  const tax = Math.round((baseAmount + assemblyFee) * 0.08);
  
  // Only apply credit card fee to custom PC items
  const creditCardFee = (paymentMethod === "stripe" || paymentMethod === "paypal") && hasCustomPC ? 
    Math.round(getCustomPCSubtotal() * 0.03) : 0;
  
  const total = baseAmount + assemblyFee + shippingFee + tax + creditCardFee;

  return (
    <Card className="bg-gaming-dark border-gaming-light-gray/20">
      <CardHeader>
        <CardTitle className="text-gaming-blue">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Base Price</span>
            <span className="text-white">${baseAmount.toFixed(2)}</span>
          </div>
          
          {/* Only show assembly fee for custom PCs */}
          {hasCustomPC && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Assembly Fee</span>
              <span className="text-white">${assemblyFee.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Shipping</span>
            <span className="text-white">${shippingFee.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Tax (8%)</span>
            <span className="text-white">${tax.toFixed(2)}</span>
          </div>

          {/* Only show credit card fee for custom PCs */}
          {creditCardFee > 0 && hasCustomPC && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Processing Fee (3%)</span>
              <span className="text-white">${creditCardFee.toFixed(2)}</span>
            </div>
          )}

          <Separator className="my-2 bg-gaming-light-gray/20" />
          
          <div className="flex justify-between font-bold">
            <span className="text-white">Total</span>
            <span className="text-gaming-blue">${total.toFixed(2)}</span>
          </div>

          {paymentMethod === "zelle" && hasCustomPC && (
            <p className="text-sm text-green-500 mt-2">
              Save 3% by paying with Zelle!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
