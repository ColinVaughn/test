
import { useIsMobile } from "@/hooks/use-mobile";
import { mockComponents } from "@/data/mockPcComponents";
import { useCustomizerState } from "@/hooks/use-customizer-state";
import CustomizerMobileLayout from "./CustomizerMobileLayout";
import CustomizerDesktopLayout from "./CustomizerDesktopLayout";
import CustomizerContent from "./CustomizerContent";
import { fanComponents } from "@/data/components/fanData";
import { checkCompatibility } from "@/utils/componentCompatibility";
import { ComponentOption } from "@/types/types";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";
import { isFanConfiguration, isComponentOption } from "@/utils/typeGuards";

const PCCustomizer = () => {
  const isMobile = useIsMobile();
  const customizerState = useCustomizerState();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  // Find the category data for the currently selected category
  const selectedCategoryData = customizerState.selectedCategory === 'fans' 
    ? fanComponents 
    : mockComponents.find(category => category.id === customizerState.selectedCategory);

  // Get compatible components based on already selected components
  let compatibleComponents: ComponentOption[] | undefined;
  
  if (selectedCategoryData) {
    compatibleComponents = checkCompatibility(
      customizerState.configuration,
      customizerState.selectedCategory,
      selectedCategoryData.options
    );
  }

  // Validate configuration before checkout
  const validateConfiguration = () => {
    // Check if all required components are selected
    const requiredCategories = mockComponents.filter(cat => cat.required).map(cat => cat.id);
    const missingComponents = requiredCategories.filter(categoryId => 
      !customizerState.configuration[categoryId]
    );
    
    if (missingComponents.length > 0) {
      const missingNames = missingComponents.map(id => 
        mockComponents.find(cat => cat.id === id)?.name || id
      ).join(', ');
      
      toast.error(`Please select all required components: ${missingNames}`);
      return false;
    }
    
    return true;
  };

  // Create a PC cart item from the current configuration
  const createPcCartItem = () => {
    // Validate configuration first
    if (!validateConfiguration()) {
      return null;
    }
    
    // Get key components for the name
    const cpu = customizerState.configuration.cpu?.name || "Custom PC";
    const gpu = customizerState.configuration.gpu?.name || "";
    
    // Create a meaningful name based on components
    let productName = "Custom Gaming PC";
    if (cpu && gpu) {
      productName = `Custom PC with ${cpu} & ${gpu}`;
    } else if (cpu) {
      productName = `Custom PC with ${cpu}`;
    }
    
    // Calculate specs for details
    const specs: Record<string, string> = {
      cpu: customizerState.configuration.cpu?.name || "Not selected",
      gpu: customizerState.configuration.gpu?.name || "Not selected",
      ram: customizerState.configuration.ram?.name || "Not selected",
      storage: customizerState.configuration.storage?.name || "Not selected",
      motherboard: customizerState.configuration.motherboard?.name || "Not selected",
      case: customizerState.configuration.case?.name || "Not selected",
      psu: customizerState.configuration.psu?.name || "Not selected",
      cooling: customizerState.configuration.cooler?.name || "Not selected"
    };
    
    // Add fans if any
    if (customizerState.configuration.fans && isFanConfiguration(customizerState.configuration.fans)) {
      specs.fans = `${customizerState.configuration.fans.quantity}x ${customizerState.configuration.fans.component.name}`;
    }
    
    // Count selected components but exclude fans from count
    const selectedComponentsCount = Object.entries(customizerState.configuration)
      .filter(([key, value]) => key !== 'fans' && value !== null)
      .length;
      
    // Calculate price using the same logic as in zelleOrderUtils
    let componentTotal = 0;
    
    // Sum up all component prices
    Object.entries(customizerState.configuration).forEach(([key, component]) => {
      if (!component) return;
      
      if (key === 'fans' && isFanConfiguration(component)) {
        componentTotal += (component.component.price || 0) * (component.quantity || 0);
      } else if (isComponentOption(component)) {
        componentTotal += component.price || 0;
      }
    });
    
    // Add assembly fee, tax and shipping
    const assemblyFee = 99;
    const subtotal = componentTotal + assemblyFee;
    const tax = Math.round(subtotal * 0.08);
    const shipping = 60;
    const totalPrice = subtotal + tax + shipping;
    
    return {
      product_id: `custom-pc-${Date.now()}`,
      product_name: productName,
      product_type: "custom" as "prebuilt" | "custom" | "accessory",
      price: totalPrice,
      quantity: 1,
      configuration: customizerState.configuration,
      details: {
        specs,
        description: `Custom built PC with ${selectedComponentsCount} selected components`,
        imageUrl: customizerState.configuration.case?.imageUrl || "/placeholder.svg"
      }
    };
  };

  // Handle saving configuration
  const handleSaveConfiguration = () => {
    toast.success("Configuration saved!");
  };

  // Handle checkout flow - UPDATED TO USE STANDARD CHECKOUT FLOW
  const handleCheckoutNow = async () => {
    const cartItem = createPcCartItem();
    if (cartItem) {
      try {
        await addToCart(cartItem);
        // Modified: Navigate to checkout page instead of calling Stripe directly
        navigate('/checkout');
        toast.success("Proceeding to checkout");
      } catch (error) {
        console.error('Error adding to cart:', error);
        toast.error('Failed to add PC to cart. Please try again.');
      }
    }
  };

  // Create combined state for passing to layout components
  const combinedState = {
    ...customizerState,
    validateConfiguration,
    handleSaveConfiguration,
    setSelectedCategory: customizerState.handleSelectCategory
  };
  
  return isMobile ? (
    <CustomizerMobileLayout 
      state={combinedState}
      categories={mockComponents}
    >
      <CustomizerContent
        state={customizerState}
        selectedCategoryData={selectedCategoryData ?? null}
        compatibleComponents={compatibleComponents}
        isMobile={isMobile}
        onCheckoutNow={handleCheckoutNow}
      />
    </CustomizerMobileLayout>
  ) : (
    <CustomizerDesktopLayout
      state={combinedState}
      categories={mockComponents}
    >
      <CustomizerContent
        state={customizerState}
        selectedCategoryData={selectedCategoryData ?? null}
        compatibleComponents={compatibleComponents}
        isMobile={isMobile}
        onCheckoutNow={handleCheckoutNow}
      />
    </CustomizerDesktopLayout>
  );
};

export default PCCustomizer;
