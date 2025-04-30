
import { ComponentOption } from "@/types/types";
import { Fan, Plus, Minus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface FansSectionProps {
  category: ComponentOption;
  selectedCase: ComponentOption | null;
  selectedCooler: ComponentOption | null;
  onSelectComponent: (component: ComponentOption, quantity: number) => void;
}

const FansSection = ({
  category,
  selectedCase,
  selectedCooler,
  onSelectComponent,
}: FansSectionProps) => {
  const [quantity, setQuantity] = useState(0);

  // Calculate max available fan slots
  const calculateMaxFans = () => {
    if (!selectedCase) return 0;
    
    const totalFanSlots = selectedCase.fanSlots || 0;
    const preInstalledFans = selectedCase.preInstalledFans || 0;
    
    let coolerFansUsed = 0;
    if (selectedCooler?.specs.type?.toLowerCase().includes('liquid')) {
      const radiatorSize = parseInt(selectedCooler.specs.radiatorSize || '0');
      if (!isNaN(radiatorSize)) {
        const fanSize = selectedCooler.fanSize || 120;
        coolerFansUsed = Math.floor(radiatorSize / fanSize);
      }
    }

    return Math.max(0, totalFanSlots - preInstalledFans - coolerFansUsed);
  };

  const maxFans = calculateMaxFans();

  const handleIncrement = () => {
    if (quantity < maxFans) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      if (newQuantity > 0) {
        onSelectComponent(category, newQuantity);
      }
    }
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onSelectComponent(category, newQuantity);
    }
  };

  if (!selectedCase) {
    return (
      <Card className="p-4 mt-4 bg-gaming-gray border-gaming-light-gray/20">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h3 className="text-white font-bold">Additional Fans</h3>
            <p className="text-sm text-gray-400">Please select a case first</p>
          </div>
          <Fan className="text-gray-400" size={24} />
        </div>
      </Card>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-2 text-white">Additional Fans</h2>
      <p className="text-gray-400 mb-4">Add more cooling capacity to your system.</p>
      
      <Card className="p-4 bg-gaming-gray border-gaming-light-gray/20">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-white font-bold">{category.name}</h3>
            <p className="text-sm text-gray-400">{category.specs.size}, {category.specs.airflow}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleDecrement}
              disabled={quantity === 0}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-white font-bold min-w-[2ch] text-center">{quantity}</span>
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleIncrement}
              disabled={quantity >= maxFans}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {quantity > 0 && (
          <div className="text-gaming-blue font-bold">
            ${(category.price * quantity).toFixed(2)}
          </div>
        )}
      </Card>
    </div>
  );
};

export default FansSection;
