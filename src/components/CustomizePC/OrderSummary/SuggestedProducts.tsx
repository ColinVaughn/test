
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { suggestedProducts } from "@/data/suggestedProducts";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";

interface SuggestedProductsProps {
  onAddToCart?: (productId: string) => void;
}

const SuggestedProducts = ({ onAddToCart }: SuggestedProductsProps) => {
  const handleAddToCart = (productId: string) => {
    onAddToCart?.(productId);
    toast({
      title: "Product Added",
      description: "The accessory has been added to your cart",
    });
  };

  return (
    <Card className="bg-gaming-darker p-4 mb-4">
      <h3 className="text-lg font-semibold text-white mb-3">
        Recommended Accessories
      </h3>
      <ScrollArea className="h-[200px] pr-4">
        <div className="space-y-3">
          {suggestedProducts.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between bg-gaming-gray p-3 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gaming-light-gray rounded-md overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium text-white">{product.name}</h4>
                  <p className="text-sm text-gray-400">{product.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gaming-blue font-bold">
                  ${product.price.toFixed(2)}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => handleAddToCart(product.id)}
                >
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default SuggestedProducts;
