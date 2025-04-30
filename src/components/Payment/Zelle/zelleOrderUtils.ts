
import { ComponentOption, PcConfiguration } from "@/types/types";

/**
 * Process component details for database storage
 */
export const processComponentDetails = (configuration: PcConfiguration) => {
  // Create a detailed component object for storing in the database
  const componentDetails: Record<string, any> = {
    product_type: 'custom',
    components: {}
  };

  // Process each component in the configuration
  Object.entries(configuration).forEach(([categoryId, component]) => {
    if (!component) return;

    // Special handling for fans which has a different structure
    if (categoryId === 'fans' && 'quantity' in component && component.component) {
      componentDetails.components[categoryId] = {
        id: component.component.id || '',
        name: component.component.name || '',
        brand: component.component.brand || '',
        price: component.component.price || 0,
        quantity: component.quantity || 0,
        total_price: (component.component.price || 0) * (component.quantity || 0)
      };
    } 
    // Handle regular components
    else if ('id' in component) {
      componentDetails.components[categoryId] = {
        id: component.id || '',
        name: component.name || '',
        brand: component.brand || '',
        price: component.price || 0
      };

      // Include any selected options like cooler colors/sizes or case colors
      if (component.selectedCoolerColor) {
        componentDetails.components[categoryId].color = component.selectedCoolerColor.name;
        componentDetails.components[categoryId].color_price = component.selectedCoolerColor.price;
        componentDetails.components[categoryId].color_hex = component.selectedCoolerColor.hexCode;
      }

      if (component.selectedColor) {
        componentDetails.components[categoryId].color = component.selectedColor.name;
        componentDetails.components[categoryId].color_price = component.selectedColor.price;
        componentDetails.components[categoryId].color_hex = component.selectedColor.hexCode;
      }

      if (component.selectedCoolerSize) {
        componentDetails.components[categoryId].size = component.selectedCoolerSize.size;
        componentDetails.components[categoryId].size_price = component.selectedCoolerSize.price;
      }

      // Handle RAM separately since it has nested selectedRamSize and potentially selectedColor
      if (categoryId === 'ram' && component.selectedRamSize) {
        componentDetails.components[categoryId].size = component.selectedRamSize.size;
        componentDetails.components[categoryId].modules = component.selectedRamSize.modules;
        componentDetails.components[categoryId].speed = component.selectedRamSize.speed;
        componentDetails.components[categoryId].size_price = component.selectedRamSize.price;
        
        // Include RAM color if selected
        if (component.selectedRamSize.selectedColor) {
          componentDetails.components[categoryId].color = component.selectedRamSize.selectedColor.name;
          componentDetails.components[categoryId].color_price = component.selectedRamSize.selectedColor.price;
          componentDetails.components[categoryId].color_hex = component.selectedRamSize.selectedColor.hexCode;
        }
      }
    }
  });

  return componentDetails;
};

/**
 * Calculate total price of configuration
 */
export const calculateTotalPrice = (configuration: PcConfiguration, affiliateDiscount: number | null): number => {
  let componentsTotal = 0;
  
  // Check if there's no configuration or if it's empty
  if (!configuration || Object.keys(configuration).length === 0) {
    return 60; // Just return shipping fee if no components
  }

  // Log the configuration for debugging
  console.log("Configuration passed to calculateTotalPrice:", configuration);
  
  // Sum up all component prices
  Object.entries(configuration).forEach(([categoryId, component]) => {
    if (!component) return;
    
    // Special handling for fans
    if (categoryId === 'fans' && 'quantity' in component && component.component) {
      const fanCost = (component.component.price || 0) * (component.quantity || 0);
      componentsTotal += fanCost;
      console.log(`Fan component: ${component.component.name}, quantity: ${component.quantity}, price: ${component.component.price}, total: ${fanCost}`);
    } 
    // Regular components
    else if ('price' in component) {
      let itemPrice = component.price || 0;
      
      // Add any additional costs for color/size selections
      if (component.selectedColor) {
        itemPrice += component.selectedColor.price || 0;
        console.log(`Added ${component.selectedColor.price} for ${component.selectedColor.name} color`);
      }
      
      if (component.selectedCoolerColor) {
        itemPrice += component.selectedCoolerColor.price || 0;
        console.log(`Added ${component.selectedCoolerColor.price} for ${component.selectedCoolerColor.name} color`);
      }
      
      if (component.selectedCoolerSize) {
        itemPrice += component.selectedCoolerSize.price || 0;
        console.log(`Added ${component.selectedCoolerSize.price} for ${component.selectedCoolerSize.size} size`);
      }
      
      // Handle RAM separately since it has nested selectedRamSize and potentially selectedColor
      if (categoryId === 'ram' && component.selectedRamSize) {
        itemPrice += component.selectedRamSize.price || 0;
        console.log(`Added ${component.selectedRamSize.price} for ${component.selectedRamSize.size} RAM`);
        
        if (component.selectedRamSize.selectedColor) {
          itemPrice += component.selectedRamSize.selectedColor.price || 0;
          console.log(`Added ${component.selectedRamSize.selectedColor.price} for ${component.selectedRamSize.selectedColor.name} RAM color`);
        }
      }
      
      componentsTotal += itemPrice;
      console.log(`Regular component: ${categoryId}, base price: ${component.price}, total price: ${itemPrice}`);
    }
  });
  
  console.log("Total components cost (before assembly fee):", componentsTotal);
  
  // Add assembly fee (fixed at $99)
  const assemblyFee = 99;
  componentsTotal += assemblyFee;
  
  console.log("Total after assembly fee:", componentsTotal);
  
  // Add tax (8%)
  const tax = Math.round(componentsTotal * 0.08);
  console.log("Tax amount:", tax);
  
  // Add shipping fee
  const shippingFee = 60;
  console.log("Shipping fee:", shippingFee);
  
  // Calculate total with tax and shipping
  let total = componentsTotal + tax + shippingFee;
  console.log("Final total (before affiliate discount):", total);
  
  // Apply affiliate discount if available
  if (affiliateDiscount && affiliateDiscount > 0) {
    const discountAmount = total * (affiliateDiscount / 100);
    total = total - discountAmount;
    console.log("Affiliate discount applied:", affiliateDiscount, "%, amount:", discountAmount);
  }
  
  console.log("Final total price:", Math.round(total));
  return Math.round(total);
};
