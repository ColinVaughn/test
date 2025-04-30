
import { CartItem } from "@/types/marketplace";

export const calculateShippingCost = (items: CartItem[], hasCustomPC: boolean, hasOnlyMarketplace: boolean): number => {
  if (hasOnlyMarketplace) {
    let totalShipping = 0;
    
    for (const item of items) {
      if (item.product_type === 'marketplace') {
        const shipping = item.details?.shipping || {};
        let itemShipping = 20;
        
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
  
  return hasCustomPC ? 60 : 15;
};

export const getCustomPCSubtotal = (items: CartItem[]): number => {
  return items
    .filter(item => item.product_type === 'custom')
    .reduce((total, item) => total + item.price * item.quantity, 0);
};
