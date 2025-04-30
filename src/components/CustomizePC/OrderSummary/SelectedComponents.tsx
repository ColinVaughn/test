
import { ComponentOption, PcConfiguration } from "@/types/types";
import { Link, Trash2 } from "lucide-react";
import { isComponentOption } from "@/utils/typeGuards";

interface SelectedComponentsProps {
  configuration: PcConfiguration;
  onRemoveComponent: (categoryId: string) => void;
}

const SelectedComponents = ({ configuration, onRemoveComponent }: SelectedComponentsProps) => {
  return (
    <div className="flex-grow overflow-auto">
      {Object.entries(configuration).map(([categoryId, component]) => {
        if (!component || categoryId === 'fans') return null;
        
        if (!isComponentOption(component)) return null;
        
        return (
          <div key={categoryId} className="mb-4">
            <div className="flex justify-between">
              <div className="flex-1">
                <h3 className="text-white font-medium text-sm">{component.brand}</h3>
                <p className="text-gray-400 text-sm truncate">{component.name}</p>
                {component.selectedColor && (
                  <div className="flex items-center mt-1 space-x-1">
                    <div 
                      className="w-3 h-3 rounded-full border border-gray-600"
                      style={{ backgroundColor: component.selectedColor.hexCode }}
                    ></div>
                    <span className="text-xs text-gray-400">
                      {component.selectedColor.name}
                      {component.selectedColor.price > 0 && ` (+$${component.selectedColor.price})`}
                    </span>
                  </div>
                )}
                {component.amazonLink && (
                  <a 
                    href={component.amazonLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gaming-blue hover:text-gaming-blue/80 text-xs flex items-center mt-1"
                  >
                    <Link size={12} className="mr-1" />
                    View on Amazon
                  </a>
                )}
              </div>
              <div className="flex flex-col items-end">
                <span className="text-gaming-blue font-bold">
                  ${component.price.toFixed(2)}
                </span>
                <button 
                  className="text-red-400 hover:text-red-500 text-xs flex items-center"
                  onClick={() => onRemoveComponent(categoryId)}
                >
                  <Trash2 size={12} className="mr-1" />
                  Remove
                </button>
              </div>
            </div>
          </div>
        );
      })}
      
      {configuration.fans && 'quantity' in configuration.fans && configuration.fans.quantity > 0 && (
        <div className="mb-4">
          <div className="flex justify-between">
            <div className="flex-1">
              <h3 className="text-white font-medium text-sm">{configuration.fans.component.brand}</h3>
              <p className="text-gray-400 text-sm truncate">
                {configuration.fans.quantity}x {configuration.fans.component.name}
              </p>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-gaming-blue font-bold">
                ${(configuration.fans.component.price * configuration.fans.quantity).toFixed(2)}
              </span>
              <button 
                className="text-red-400 hover:text-red-500 text-xs flex items-center"
                onClick={() => onRemoveComponent('fans')}
              >
                <Trash2 size={12} className="mr-1" />
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectedComponents;
