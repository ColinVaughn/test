
import { Button } from "@/components/ui/button";
import { CheckSquare, ShoppingCart, Truck } from "lucide-react";

interface ActionButtonsProps {
  onAddToCart: () => void;
  onCheckoutNow: () => void;
  onSaveConfiguration?: () => void;
}

const ActionButtons = ({ onAddToCart, onCheckoutNow, onSaveConfiguration }: ActionButtonsProps) => {
  return (
    <div className="space-y-3">
      <Button 
        className="w-full bg-gaming-blue hover:bg-gaming-blue/80 text-white"
        onClick={onAddToCart}
      >
        <ShoppingCart size={16} className="mr-2" /> 
        Add to Cart
      </Button>
      
      <Button 
        className="w-full bg-green-600 hover:bg-green-700 text-white"
        onClick={onCheckoutNow}
      >
        <Truck size={16} className="mr-2" /> 
        Checkout Now
      </Button>
      
      <Button 
        variant="outline" 
        className="w-full border-gaming-blue/50 hover:border-gaming-blue hover:bg-gaming-blue/10 text-white"
        onClick={onSaveConfiguration}
      >
        <CheckSquare size={16} className="mr-2" />
        Save Configuration
      </Button>
    </div>
  );
};

export default ActionButtons;
