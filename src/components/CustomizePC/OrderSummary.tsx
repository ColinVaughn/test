
import { PcConfiguration } from "@/types/types";
import { calculateTotalPrice } from "@/data/mockPcComponents";
import { useCart } from "@/hooks/use-cart";
import { isComponentOption } from "@/utils/typeGuards";
import SuggestedProducts from "./OrderSummary/SuggestedProducts";
import BuildGuide from "./BuildGuide";
import SelectedComponents from "./OrderSummary/SelectedComponents";
import PriceSummary from "./OrderSummary/PriceSummary";
import ActionButtons from "./OrderSummary/ActionButtons";

interface OrderSummaryProps {
  configuration: PcConfiguration;
  onRemoveComponent: (categoryId: string) => void;
  onCheckout: () => void;
  onSaveConfiguration?: () => void;
}

const OrderSummary = ({ 
  configuration, 
  onRemoveComponent, 
  onCheckout,
  onSaveConfiguration
}: OrderSummaryProps) => {
  const { addToCart } = useCart();
  const totalPrice = calculateTotalPrice(configuration);
  const assemblyFee = 99; // Assembly fee for custom PCs is always applied
  
  const createPcCartItem = () => {
    // Get key components for the name
    const cpu = configuration.cpu?.name || "Custom PC";
    const gpu = configuration.gpu?.name || "";
    
    // Create a meaningful name based on components
    let productName = "Custom Gaming PC";
    if (cpu && gpu) {
      productName = `Custom PC with ${cpu} & ${gpu}`;
    } else if (cpu) {
      productName = `Custom PC with ${cpu}`;
    }
    
    // Calculate specs for details
    const specs: Record<string, string> = {
      cpu: configuration.cpu?.name || "Not selected",
      gpu: configuration.gpu?.name || "Not selected",
      ram: configuration.ram?.name || "Not selected",
      storage: configuration.storage?.name || "Not selected",
      motherboard: configuration.motherboard?.name || "Not selected",
      case: configuration.case?.name || "Not selected",
      psu: configuration.psu?.name || "Not selected",
      cooling: configuration.cooler?.name || "Not selected"
    };
    
    // Add fans if any
    if (configuration.fans && configuration.fans.quantity > 0) {
      specs.fans = `${configuration.fans.quantity}x ${configuration.fans.component.name}`;
    }

    // Count selected components
    const selectedComponentsCount = Object.values(configuration).filter(
      (component) => component && (isComponentOption(component) || 'quantity' in component)
    ).length;
    
    return {
      product_id: `custom-pc-${Date.now()}`,
      product_name: productName,
      product_type: "custom" as "prebuilt" | "custom" | "marketplace" | "accessory",
      price: totalPrice,
      quantity: 1,
      configuration,
      details: {
        specs,
        description: `Custom built PC with ${selectedComponentsCount} selected components`,
        imageUrl: configuration.case?.imageUrl || "/placeholder.svg"
      }
    };
  };

  const handleAddToCart = async () => {
    await addToCart(createPcCartItem());
  };
  
  const handleCheckoutNow = () => {
    addToCart(createPcCartItem()).then(() => {
      onCheckout();
    });
  };

  return (
    <div className="h-full flex flex-col bg-gaming-dark">
      <div className="p-6 flex-1 overflow-auto">
        <h2 className="text-xl font-bold text-white mb-4">Order Summary</h2>
        
        <SelectedComponents 
          configuration={configuration}
          onRemoveComponent={onRemoveComponent}
        />

        <SuggestedProducts />
        
        <div className="space-y-3 mt-6">
          <PriceSummary 
            totalPrice={totalPrice}
            assemblyFee={assemblyFee}
          />
          
          <ActionButtons 
            onAddToCart={handleAddToCart}
            onCheckoutNow={handleCheckoutNow}
            onSaveConfiguration={onSaveConfiguration}
          />
          
          <BuildGuide configuration={configuration} />
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
