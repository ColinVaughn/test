
import React, { useState, useContext, createContext } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PcConfiguration, PrebuiltPC } from "@/types/types";

// Create a new type that allows either PcConfiguration or PrebuiltPC
export type CheckoutData = PcConfiguration | PrebuiltPC | {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
  addresses?: any;
  promoCode?: string;
  accessories?: string[];
  affiliateCode?: string | null;
  couponCode?: string | null;
  pcConfiguration?: Record<string, any> | null;
  components?: Record<string, string> | null; // Added structured components object
};

type CheckoutContextType = {
  startStripeCheckout: (configuration: CheckoutData) => Promise<void>;
  startPayPalCheckout: (configuration: CheckoutData) => Promise<void>;
  isLoading: boolean;
};

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  const startStripeCheckout = async (configuration: CheckoutData) => {
    setIsLoading(true);
    try {
      // Check if this has PC configuration data
      const hasPcConfig = 'cpu' in configuration && 
        typeof configuration.cpu === 'object' && 
        configuration.cpu !== null;
      
      // Create a processed configuration object with PC configuration if available
      // Make a deep copy to handle circular references and non-serializable properties
      const processedConfig = {
        ...configuration,
        pcConfiguration: hasPcConfig ? deepCopy(configuration) : null
      };
      
      const { data, error } = await supabase.functions.invoke('stripe-checkout', {
        body: { configuration: processedConfig }
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(`Failed to start checkout process: ${error.message || "Unknown error"}`);
      setIsLoading(false);
      throw error;
    }
  };

  const startPayPalCheckout = async (configuration: CheckoutData) => {
    setIsLoading(true);
    try {
      console.log("Starting PayPal checkout with configuration:", configuration);
      
      // Check if this has PC configuration data
      const hasPcConfig = 'cpu' in configuration && 
        typeof configuration.cpu === 'object' && 
        configuration.cpu !== null;
      
      // Create a processed configuration object with PC configuration if available
      const processedConfig = {
        ...configuration,
        pcConfiguration: hasPcConfig ? deepCopy(configuration) : null
      };
      
      const { data, error } = await supabase.functions.invoke('paypal-checkout', {
        body: { configuration: processedConfig }
      });

      if (error) {
        console.error("PayPal function error:", error);
        throw new Error(`PayPal checkout failed: ${error.message || "Unknown error"}`);
      }

      if (!data) {
        throw new Error("No response data received from PayPal checkout");
      }

      console.log("PayPal checkout response:", data);

      if (data?.url) {
        // Navigate to PayPal approval URL
        window.location.href = data.url;
      } else if (data?.error) {
        throw new Error(`PayPal checkout error: ${data.error}`);
      } else {
        throw new Error("No PayPal checkout URL received");
      }
    } catch (error: any) {
      console.error("PayPal checkout error:", error);
      toast.error(`Failed to start PayPal checkout process: ${error.message || "Unknown error"}`);
      setIsLoading(false);
      throw error;
    }
  };

  // Enhanced deep copy function to capture all component details
  const deepCopy = (obj: any): any => {
    try {
      // First attempt with JSON stringify/parse for simplicity
      return JSON.parse(JSON.stringify(obj));
    } catch (error) {
      // If that fails due to circular references, use this more robust approach
      const cache = new Set();
      
      const copy = (obj: any): any => {
        if (obj === null || typeof obj !== 'object') {
          return obj;
        }
        
        // Handle circular references
        if (cache.has(obj)) {
          return null; // Replace circular reference with null
        }
        
        cache.add(obj);
        
        const result: any = Array.isArray(obj) ? [] : {};
        
        // Copy each property, but only take what we need
        Object.keys(obj).forEach(key => {
          // Skip functions and complex objects we don't need
          if (typeof obj[key] === 'function') return;
          
          // For components, preserve more properties including options and selections
          if (key === 'cpu' || key === 'gpu' || key === 'motherboard' || 
              key === 'storage' || key === 'case' || key === 'psu' || 
              key === 'cooler' || key === 'os') {
            
            if (obj[key] && typeof obj[key] === 'object') {
              result[key] = {
                name: obj[key].name,
                price: obj[key].price,
                brand: obj[key].brand,
                specs: obj[key].specs || {},
                // Preserve color selection
                selectedColor: obj[key].selectedColor ? {
                  name: obj[key].selectedColor.name,
                  hexCode: obj[key].selectedColor.hexCode,
                  price: obj[key].selectedColor.price
                } : undefined,
                // Preserve cooler options
                selectedCoolerColor: obj[key].selectedCoolerColor ? {
                  name: obj[key].selectedCoolerColor.name,
                  hexCode: obj[key].selectedCoolerColor.hexCode,
                  price: obj[key].selectedCoolerColor.price
                } : undefined,
                selectedCoolerSize: obj[key].selectedCoolerSize ? {
                  size: obj[key].selectedCoolerSize.size,
                  radiatorSize: obj[key].selectedCoolerSize.radiatorSize,
                  price: obj[key].selectedCoolerSize.price
                } : undefined
              };
              return;
            }
          }
          
          // Special handling for RAM which has selected size
          if (key === 'ram' && obj[key] && typeof obj[key] === 'object') {
            result[key] = {
              name: obj[key].name,
              price: obj[key].price,
              brand: obj[key].brand,
              specs: obj[key].specs || {},
              selectedRamSize: obj[key].selectedRamSize ? {
                size: obj[key].selectedRamSize.size,
                modules: obj[key].selectedRamSize.modules,
                speed: obj[key].selectedRamSize.speed,
                price: obj[key].selectedRamSize.price,
                // Add selectedColor from RAM size
                selectedColor: obj[key].selectedRamSize.selectedColor ? {
                  name: obj[key].selectedRamSize.selectedColor.name,
                  hexCode: obj[key].selectedRamSize.selectedColor.hexCode,
                  price: obj[key].selectedRamSize.selectedColor.price
                } : null
              } : null
            };
            return;
          }
          
          // Special handling for fans
          if (key === 'fans' && obj[key] && typeof obj[key] === 'object') {
            result[key] = {
              quantity: obj[key].quantity,
              component: obj[key].component ? {
                name: obj[key].component.name,
                price: obj[key].component.price,
                brand: obj[key].component.brand,
                specs: obj[key].component.specs || {}
              } : null
            };
            return;
          }
          
          // For other properties, copy them as is
          result[key] = copy(obj[key]);
        });
        
        return result;
      };
      
      return copy(obj);
    }
  };

  return (
    <CheckoutContext.Provider value={{ startStripeCheckout, startPayPalCheckout, isLoading }}>
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error("useCheckout must be used within a CheckoutProvider");
  }
  return context;
}
