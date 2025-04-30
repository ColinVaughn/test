
import { useState } from "react";
import { OrderItem } from "../types";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, ChevronUp } from "lucide-react";
import ConfigurationDetails from "./ConfigurationDetails";

interface OrderItemCardProps {
  item: OrderItem;
}

const OrderItemCard = ({ item }: OrderItemCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasConfiguration = item.product_details && Object.keys(item.product_details).length > 0;
  
  const toggleExpand = () => {
    setIsExpanded(prev => !prev);
  };
  
  return (
    <div className="bg-gaming-dark/40 p-3 rounded-lg">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center">
            <span className="font-medium">{item.product_name}</span>
            {item.product_type && (
              <Badge variant="outline" className="ml-2 text-xs">
                {item.product_type === 'custom' ? 'Custom PC' : 'Prebuilt PC'}
              </Badge>
            )}
          </div>
          <div className="flex justify-between text-sm text-gray-400 mt-1">
            <span>Quantity: {item.quantity}</span>
            <span className="ml-4">Price: ${item.price.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="flex items-center">
          <span className="text-gray-300 mr-4">
            ${(item.price * item.quantity).toFixed(2)}
          </span>
          {hasConfiguration && (
            <button 
              onClick={toggleExpand} 
              className="p-1 hover:bg-gaming-light-gray/10 rounded-full"
            >
              {isExpanded ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
      </div>
      
      {isExpanded && hasConfiguration && (
        <>
          <Separator className="my-2 bg-gaming-light-gray/20" />
          <ConfigurationDetails 
            config={item.product_details} 
            type={item.product_type || 'custom'} 
          />
        </>
      )}
    </div>
  );
};

export default OrderItemCard;
