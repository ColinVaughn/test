
import { RamSize } from "@/types/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface RamSizeOptionsProps {
  ramSizes?: RamSize[];
  selectedSize: string;
  onSizeSelect: (sizeId: string, colorId?: string) => void;
}

const RamSizeOptions = ({
  ramSizes,
  selectedSize,
  onSizeSelect
}: RamSizeOptionsProps) => {
  const [tempSelectedSize, setTempSelectedSize] = useState<string>(selectedSize);
  const [selectedColor, setSelectedColor] = useState<string>("");
  
  useEffect(() => {
    setTempSelectedSize(selectedSize);
  }, [selectedSize]);
  
  if (!ramSizes || ramSizes.length === 0) {
    return null;
  }

  const handleConfirmSelection = () => {
    onSizeSelect(tempSelectedSize, selectedColor);
  };

  const currentRamSize = ramSizes.find(size => size.id === tempSelectedSize);

  return (
    <div className="mt-3 space-y-3" onClick={(e) => e.stopPropagation()}>
      <h4 className="text-sm font-medium text-gray-300">Memory Configuration</h4>
      <RadioGroup
        value={tempSelectedSize || ramSizes[0].id}
        onValueChange={setTempSelectedSize}
        className="grid grid-cols-2 gap-2"
      >
        {ramSizes.map((size) => (
          <div
            key={size.id}
            className={cn(
              "flex flex-col rounded-md border px-3 py-2",
              tempSelectedSize === size.id
                ? "border-gaming-blue bg-gaming-blue/10"
                : "border-gaming-light-gray/20"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RadioGroupItem value={size.id} id={size.id} />
                <Label htmlFor={size.id} className="cursor-pointer">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{size.size}</span>
                    <span className="text-xs text-gray-400">
                      {size.modules} - {size.speed}
                    </span>
                  </div>
                </Label>
              </div>
              <div className="text-sm font-medium">
                {size.price > 0 ? `+$${size.price}` : "Included"}
              </div>
            </div>

            {tempSelectedSize === size.id && size.colorOptions && (
              <div className="mt-2 border-t border-gaming-light-gray/20 pt-2">
                <div className="flex gap-2 flex-wrap">
                  {size.colorOptions.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color.id)}
                      className={cn(
                        "w-5 h-5 rounded-full border-2 transition-all",
                        selectedColor === color.id 
                          ? "border-gaming-blue scale-110" 
                          : "border-transparent hover:scale-105"
                      )}
                      style={{ backgroundColor: color.hexCode }}
                      title={`${color.name}${color.price > 0 ? ` (+$${color.price})` : ''}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </RadioGroup>

      {tempSelectedSize !== selectedSize && (
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setTempSelectedSize(selectedSize);
              setSelectedColor("");
            }}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleConfirmSelection}
          >
            Confirm Selection
          </Button>
        </div>
      )}
    </div>
  );
};

export default RamSizeOptions;
