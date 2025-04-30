
import { CaseColor } from "@/types/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ComponentColorOptionsProps {
  colorOptions: CaseColor[];
  selectedColor: string;
  onColorSelect: (colorId: string) => void;
}

const ComponentColorOptions = ({
  colorOptions,
  selectedColor,
  onColorSelect,
}: ComponentColorOptionsProps) => {
  return (
    <div className="mt-4 space-y-3" onClick={(e) => e.stopPropagation()}>
      <h4 className="text-sm font-medium text-gray-300">Color Options</h4>
      <RadioGroup
        value={selectedColor}
        onValueChange={onColorSelect}
        className="grid grid-cols-2 gap-2"
      >
        {colorOptions.map((color) => (
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
  );
};

export default ComponentColorOptions;
