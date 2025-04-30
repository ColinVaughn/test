
import { CoolerColor, CoolerSize } from "@/types/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface CoolerOptionsProps {
  coolerColors?: CoolerColor[];
  coolerSizes?: CoolerSize[];
  selectedColor: string;
  selectedSize: string;
  onColorSelect: (colorId: string) => void;
  onSizeSelect: (sizeId: string) => void;
}

const CoolerOptions = ({
  coolerColors,
  coolerSizes,
  selectedColor,
  selectedSize,
  onColorSelect,
  onSizeSelect,
}: CoolerOptionsProps) => {
  return (
    <div className="mt-4 space-y-4" onClick={(e) => e.stopPropagation()}>
      {coolerColors && coolerColors.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-300">Color Options</h4>
          <RadioGroup
            value={selectedColor}
            onValueChange={onColorSelect}
            className="grid grid-cols-2 gap-2"
          >
            {coolerColors.map((color) => (
              <div
                key={color.id}
                className="flex items-center space-x-2"
              >
                <RadioGroupItem
                  value={color.id}
                  id={color.id}
                  className="border-gaming-blue"
                  onClick={(e) => e.stopPropagation()}
                />
                <Label
                  htmlFor={color.id}
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    className="w-4 h-4 rounded border border-gray-600"
                    style={{ backgroundColor: color.hexCode }}
                  />
                  <span className="text-sm text-gray-300">
                    {color.name}
                    {color.price > 0 && ` (+$${color.price})`}
                  </span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}

      {coolerSizes && coolerSizes.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-300">Size Options</h4>
          <RadioGroup
            value={selectedSize}
            onValueChange={onSizeSelect}
            className="grid grid-cols-2 gap-2"
          >
            {coolerSizes.map((size) => (
              <div
                key={size.id}
                className="flex items-center space-x-2"
              >
                <RadioGroupItem
                  value={size.id}
                  id={size.id}
                  className="border-gaming-blue"
                  onClick={(e) => e.stopPropagation()}
                />
                <Label
                  htmlFor={size.id}
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="text-sm text-gray-300">
                    {size.size}
                    {size.price > 0 && ` (+$${size.price})`}
                  </span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}
    </div>
  );
};

export default CoolerOptions;
