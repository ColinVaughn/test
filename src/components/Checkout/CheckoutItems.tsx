
import { CartItem } from "@/types/marketplace";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { isComponentOption, isFanConfiguration } from "@/utils/typeGuards";
import { toast } from "sonner";

interface CheckoutItemsProps {
  items: CartItem[];
  onRemoveItem: (productId: string, productName: string) => Promise<void>;
}

const CheckoutItems = ({ items, onRemoveItem }: CheckoutItemsProps) => {
  const formatComponentDetails = (component: any): string => {
    if (!component) return '';

    let details = component.name || '';

    if (component.selectedRamSize) {
      details += ` (${component.selectedRamSize.size} ${component.selectedRamSize.modules})`;
      
      if (component.selectedRamSize.selectedColor) {
        details += ` - ${component.selectedRamSize.selectedColor.name} color`;
      }
    }

    if (component.selectedColor) {
      details += ` - ${component.selectedColor.name}`;
    }

    if (component.selectedCoolerColor) {
      details += ` - ${component.selectedCoolerColor.name} color`;
    }

    if (component.selectedCoolerSize) {
      details += ` - ${component.selectedCoolerSize.size}`;
    }
    
    return details;
  };

  const generateDetailedComponentsList = (configuration: any) => {
    if (!configuration) return null;
    
    const components: Record<string, string> = {};
    
    Object.entries(configuration).forEach(([key, component]) => {
      if (!component) return;

      if (key === 'fans' && isFanConfiguration(component)) {
        if (component.component && typeof component.component === 'object') {
          const fanName = component.component.name || 'Fan';
          components[key] = `${component.quantity}x ${fanName}`;
        }
      } 
      else if (isComponentOption(component)) {
        components[key] = formatComponentDetails(component);
      }
    });
    
    return components;
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={`${item.product_id}-${index}`} className="flex gap-4 py-4">
          <div className="w-24 h-24 bg-gray-800 rounded flex-shrink-0 overflow-hidden">
            <img 
              src={item.details?.imageUrl || "/placeholder.svg"} 
              alt={item.product_name} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-grow">
            <div className="flex justify-between">
              <div className="flex-grow">
                <h3 className="font-medium text-white">{item.product_name}</h3>
                <p className="text-sm text-gray-400">
                  Quantity: {item.quantity}
                </p>
                
                {item.product_type === 'custom' && item.configuration && (
                  <div className="mt-2 text-xs text-gray-500 space-y-0.5">
                    {item.configuration.cpu && isComponentOption(item.configuration.cpu) && (
                      <p>CPU: {formatComponentDetails(item.configuration.cpu)}</p>
                    )}
                    {item.configuration.gpu && isComponentOption(item.configuration.gpu) && (
                      <p>GPU: {formatComponentDetails(item.configuration.gpu)}</p>
                    )}
                    {item.configuration.motherboard && isComponentOption(item.configuration.motherboard) && (
                      <p>Motherboard: {formatComponentDetails(item.configuration.motherboard)}</p>
                    )}
                    {item.configuration.ram && isComponentOption(item.configuration.ram) && (
                      <p>RAM: {formatComponentDetails(item.configuration.ram)}</p>
                    )}
                    {item.configuration.storage && isComponentOption(item.configuration.storage) && (
                      <p>Storage: {formatComponentDetails(item.configuration.storage)}</p>
                    )}
                    {item.configuration.case && isComponentOption(item.configuration.case) && (
                      <p>Case: {formatComponentDetails(item.configuration.case)}</p>
                    )}
                    {item.configuration.psu && isComponentOption(item.configuration.psu) && (
                      <p>PSU: {formatComponentDetails(item.configuration.psu)}</p>
                    )}
                    {item.configuration.cooler && isComponentOption(item.configuration.cooler) && (
                      <p>CPU Cooler: {formatComponentDetails(item.configuration.cooler)}</p>
                    )}
                    {item.configuration.os && isComponentOption(item.configuration.os) && (
                      <p>OS: {formatComponentDetails(item.configuration.os)}</p>
                    )}
                    {item.configuration.fans && isFanConfiguration(item.configuration.fans) && (
                      <p>Fans: {item.configuration.fans.quantity}x {item.configuration.fans.component?.name || 'Fan'}</p>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex flex-col items-end gap-2">
                <p className="font-semibold text-gaming-blue">${item.price.toFixed(2)}</p>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onRemoveItem(item.product_id, item.product_name)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Trash2 size={16} className="mr-1" />
                  Remove
                </Button>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              {item.product_type === 'marketplace' && (
                <>
                  {item.details?.condition && `Condition: ${item.details.condition} | `}
                  {item.details?.shipping?.dimensions && `Dimensions: ${item.details.shipping.dimensions} | `}
                  {item.details?.shipping?.weight && `Weight: ${item.details.shipping.weight} lbs | `}
                  {item.details?.shipping?.insuranceCoverage && `Insurance: $${item.details.shipping.insuranceCoverage}`}
                </>
              )}
            </div>
          </div>
        </div>
      ))}
      <Separator className="my-4 bg-gray-700" />
    </div>
  );
};

export default CheckoutItems;
