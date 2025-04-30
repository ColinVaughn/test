
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePCConfiguration } from "@/hooks/use-pc-configuration";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";
import { zelleFormSchema, ZelleFormValues } from "./zelleFormSchema";
import { submitZelleOrder } from "./zelleOrderService";
import { supabase } from "@/integrations/supabase/client";

export function useZelleOrder() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { configuration } = usePCConfiguration();
  const { items } = useCart();
  const navigate = useNavigate();
  
  const form = useForm<ZelleFormValues>({
    resolver: zodResolver(zelleFormSchema),
    defaultValues: {
      customer_name: "",
      customer_email: "",
      address: {
        street: "",
        city: "",
        state: "",
        zip: "",
      },
    },
  });

  const onSubmit = async (data: ZelleFormValues) => {
    console.log("Submitting Zelle order with data:", data);
    
    // Check if we have a valid cart or configuration to checkout
    const hasItems = items && items.length > 0;
    const hasConfig = configuration && Object.keys(configuration).filter(key => configuration[key]).length > 0;
    
    if (!hasItems && !hasConfig) {
      toast.error("No items or PC configuration found. Please add items to your cart or configure your PC before checkout.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Check authentication status first
      const { data: authData } = await supabase.auth.getSession();
      const isAuthenticated = !!authData?.session;
      
      // If not authenticated, show an informative toast suggesting account creation
      if (!isAuthenticated) {
        toast.info("You're checking out as a guest. Creating an account makes it easier to track orders and get support.", {
          duration: 5000,
          action: {
            label: "Sign Up",
            onClick: () => navigate("/auth")
          }
        });
      }
      
      // Submit cart items if available, otherwise submit PC configuration
      const queryParams = hasItems 
        ? await submitZelleOrder(data, null, items) 
        : await submitZelleOrder(data, configuration);
        
      navigate(`/order-success?${queryParams}`);
      toast.success('Order placed successfully! Check your email for instructions.');
    } catch (error) {
      console.error('Error submitting Zelle order:', error);
      
      // Handle schema-related errors
      if ((error as Error).message.includes("schema cache") || 
          (error as Error).message.includes("column") ||
          (error as Error).message.includes("billing_address")) {
        toast.error('There was a technical issue with the checkout. Our team has been notified. Please try again later.');
      } 
      // Handle authentication-related errors
      else if ((error as Error).message.includes("sign in")) {
        toast.error(`${(error as Error).message} Click on "Sign In" in the top right corner.`);
      } else {
        toast.error(`Failed to place order: ${(error as Error).message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    onSubmit,
  };
}
