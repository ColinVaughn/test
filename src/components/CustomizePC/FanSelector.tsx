
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { PlusIcon, MinusIcon, Fan } from "lucide-react";
import { ComponentOption } from "@/types/types";
import { Card } from '@/components/ui/card';

interface FanSelectorProps {
  selectedCase: ComponentOption | null;
  selectedCooler: ComponentOption | null;
  fanComponent: ComponentOption;
  onFanChange: (quantity: number) => void;
  initialQuantity?: number;
}

const FanSelector = ({ 
  selectedCase, 
  selectedCooler, 
  fanComponent, 
  onFanChange,
  initialQuantity = 0
}: FanSelectorProps) => {
  const [quantity, setQuantity] = useState<number>(initialQuantity);
  
  // Calculate available fan slots
  const maxAdditionalFans = calculateMaxFans();

  // Initialize with initial quantity if provided and valid
  useEffect(() => {
    if (initialQuantity > 0 && initialQuantity <= maxAdditionalFans) {
      setQuantity(initialQuantity);
    } else if (initialQuantity > maxAdditionalFans) {
      // If initialQuantity is larger than available slots, adjust to max
      setQuantity(maxAdditionalFans);
      onFanChange(maxAdditionalFans);
    }
  }, [selectedCase, selectedCooler, maxAdditionalFans]);

  function calculateMaxFans(): number {
    if (!selectedCase) return 0;
    
    // Get case fan slots
    const totalFanSlots = selectedCase.fanSlots || 0;
    const preInstalledFans = selectedCase.preInstalledFans || 0;
    
    // Calculate cooler fan slots used
    let coolerFansUsed = 0;
    if (selectedCooler) {
      // Check if it's an AIO liquid cooler
      if (selectedCooler.specs.type && selectedCooler.specs.type.toLowerCase().includes('liquid')) {
        // Extract radiator size from specs
        const radiatorSizeStr = selectedCooler.specs.radiatorSize;
        if (radiatorSizeStr) {
          // Parse radiator size - typical formats are "240mm", "360mm" etc.
          const radiatorSize = parseInt(radiatorSizeStr);
          if (!isNaN(radiatorSize)) {
            // Calculate fans based on radiator size (120mm or 140mm per fan)
            const fanSize = selectedCooler.fanSize || 120;
            coolerFansUsed = Math.floor(radiatorSize / fanSize);
          }
        }
      }
    }

    // Calculate available slots
    return Math.max(0, totalFanSlots - preInstalledFans - coolerFansUsed);
  };

  const handleIncrement = () => {
    if (quantity < maxAdditionalFans) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      onFanChange(newQuantity);
    }
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onFanChange(newQuantity);
    }
  };

  if (!selectedCase || maxAdditionalFans === 0) {
    return (
      <Card className="p-4 mt-4 bg-gaming-gray border-gaming-light-gray/20">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h3 className="text-white font-bold">Additional Fans</h3>
            <p className="text-sm text-gray-400">
              No available fan slots
            </p>
          </div>
          <Fan className="text-gray-400" size={24} />
        </div>
        <p className="text-sm text-gray-400">
          {!selectedCase 
            ? "Please select a case first" 
            : "This case does not have available fan slots or they are all used by other components"}
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-4 mt-4 bg-gaming-gray border-gaming-light-gray/20">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 className="text-white font-bold">Additional Fans</h3>
          <p className="text-sm text-gray-400">
            {maxAdditionalFans} available fan slots
          </p>
        </div>
        <div className="flex items-center">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleDecrement}
            disabled={quantity === 0}
            className="h-8 w-8"
          >
            <MinusIcon className="h-4 w-4" />
          </Button>
          <span className="mx-4 text-white font-bold">{quantity}</span>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleIncrement}
            disabled={quantity >= maxAdditionalFans}
            className="h-8 w-8"
          >
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Fan className="text-gaming-blue mr-2" size={20} />
          <div>
            <div className="text-white font-medium">
              {fanComponent.brand} {fanComponent.name}
            </div>
            <div className="text-sm text-gray-400">
              {fanComponent.specs.size}, {fanComponent.specs.airflow}
            </div>
          </div>
        </div>
        <div className="text-gaming-blue font-bold">
          {quantity > 0 ? `$${(fanComponent.price * quantity).toFixed(2)}` : '$0.00'}
        </div>
      </div>
    </Card>
  );
};

export default FanSelector;
