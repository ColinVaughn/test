
import { useState } from "react";
import { Package, ChevronDown, ChevronUp } from "lucide-react";
import type { OrderItemType } from "../types/AdminTypes";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ConfigurationDetails from "@/components/OrderTracking/OrderItemDetails/ConfigurationDetails";

interface OrderItemsProps {
  items: OrderItemType[];
}

export const OrderItems = ({ items }: OrderItemsProps) => {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  if (items.length === 0) {
    return (
      <div className="text-center py-3 bg-gaming-darker rounded-lg">
        <Package className="w-6 h-6 mx-auto mb-2 text-gray-500" />
        <p className="text-gray-400">No items found</p>
      </div>
    );
  }

  // Debug information
  console.log("OrderItems component - received items:", items);
  items.forEach((item, index) => {
    console.log(`Item ${index} details:`, {
      name: item.product_name,
      type: item.product_type,
      detailsKeys: item.product_details ? Object.keys(item.product_details) : "No product details"
    });
  });

  const toggleExpand = (itemId: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const isExpanded = expandedItems[item.id] || false;
        
        // Get product_type from item.product_type or from product_details
        let productType: 'custom' | 'prebuilt' | 'accessory' = 'prebuilt';
        
        // Check if product_type is explicitly set
        if (item.product_type) {
          productType = item.product_type as 'custom' | 'prebuilt' | 'accessory';
        } 
        // Check if product_type is in product_details
        else if (item.product_details && 
                typeof item.product_details === 'object' && 
                'product_type' in item.product_details) {
          const detailsType = item.product_details.product_type;
          if (detailsType === 'custom') {
            productType = 'custom';
          } else if (detailsType === 'accessory') {
            productType = 'accessory';
          } else {
            productType = 'prebuilt';
          }
        }
        // Fallback to checking product name
        else if (item.product_name.toLowerCase().includes('custom')) {
          productType = 'custom';
        }
        
        // Check if we have configuration details to show
        const hasConfiguration = item.product_details && 
          typeof item.product_details === 'object' && 
          Object.keys(item.product_details).length > 0;
        
        console.log(`OrderItems - Item ${item.product_name}:`, {
          productType,
          hasConfiguration,
          details: item.product_details
        });
        
        return (
          <div key={item.id} className="bg-gaming-dark/40 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center">
                  <span className="font-medium">{item.product_name}</span>
                  <Badge variant="outline" className="ml-2 text-xs">
                    {productType === 'custom' ? 'Custom PC' : 
                     productType === 'accessory' ? 'Accessory' : 'Prebuilt PC'}
                  </Badge>
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
                    onClick={() => toggleExpand(item.id)} 
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
                  type={productType} 
                />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};
