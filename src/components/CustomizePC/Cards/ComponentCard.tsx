
import { ComponentOption } from "@/types/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";
import ComponentSpecs from "../ComponentSpecs";
import ComponentCardFooter from "../ComponentCardFooter";
import ComponentColorOptions from "../ComponentColorOptions";
import CoolerOptions from "../CoolerOptions";
import RamSizeOptions from "../RamSizeOptions";

interface ComponentCardProps {
  component: ComponentOption;
  isSelected: boolean;
  onSelect: (component: ComponentOption) => void;
  selectedColors: Record<string, string>;
  selectedCoolerColors: Record<string, string>;
  selectedCoolerSizes: Record<string, string>;
  selectedRamSizes: Record<string, string>;
  onColorSelect: (componentId: string, colorId: string) => void;
  onCoolerColorSelect: (componentId: string, colorId: string) => void;
  onCoolerSizeSelect: (componentId: string, sizeId: string) => void;
  onRamSizeSelect: (componentId: string, sizeId: string) => void;
  categoryId: string;
}

const ComponentCard = ({
  component,
  isSelected,
  onSelect,
  selectedColors,
  selectedCoolerColors,
  selectedCoolerSizes,
  selectedRamSizes,
  onColorSelect,
  onCoolerColorSelect,
  onCoolerSizeSelect,
  onRamSizeSelect,
  categoryId,
}: ComponentCardProps) => {
  const selectedColorOption = component.colorOptions?.find(
    c => c.id === selectedColors[component.id]
  );
  
  const selectedCoolerSize = component.coolerSizes?.find(
    s => s.id === selectedCoolerSizes[component.id]
  );
  
  const selectedCoolerColor = component.coolerColors?.find(
    c => c.id === selectedCoolerColors[component.id]
  );
  
  const selectedRamSize = component.ramSizes?.find(
    s => s.id === selectedRamSizes[component.id]
  );
  
  let totalPrice = component.price;
  
  if (selectedColorOption) totalPrice += selectedColorOption.price;
  if (selectedCoolerSize) totalPrice += selectedCoolerSize.price;
  if (selectedCoolerColor) totalPrice += selectedCoolerColor.price;
  if (selectedRamSize) totalPrice += selectedRamSize.price;

  return (
    <Card
      className={cn(
        "gaming-card cursor-pointer transition-all duration-300 flex flex-col",
        isSelected ? "ring-2 ring-gaming-blue border-gaming-blue" : "hover:border-gaming-blue/40"
      )}
      onClick={() => {
        const componentWithOptions = {
          ...component,
          price: totalPrice,
          selectedColor: selectedColorOption,
          selectedCoolerColor,
          selectedCoolerSize,
          selectedRamSize
        };
        onSelect(componentWithOptions);
      }}
    >
      <CardHeader className="p-0">
        {component.imageUrl && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={component.imageUrl}
              alt={component.name}
              className="w-full h-full object-cover"
            />
            {isSelected && (
              <div className="absolute inset-0 bg-gaming-blue/20 flex items-center justify-center">
                <Badge className="bg-gaming-blue text-white px-3 py-1.5 text-sm">
                  <CheckCircle size={16} className="mr-1" />
                  Selected
                </Badge>
              </div>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="p-4 flex-grow">
        <div className="mb-2">
          <Badge variant="outline" className="bg-gaming-light-gray/20 text-gray-300">
            {component.brand}
          </Badge>
        </div>
        <h3 className="text-lg font-semibold mb-2 text-white">
          {component.name}
        </h3>

        {categoryId === 'ram' && selectedRamSize ? (
          <ComponentSpecs
            specs={{
              ...component.specs,
              size: selectedRamSize.size,
              modules: selectedRamSize.modules,
              speed: selectedRamSize.speed
            }}
          />
        ) : (
          <ComponentSpecs specs={component.specs} />
        )}

        {categoryId === 'case' && component.colorOptions && (
          <ComponentColorOptions
            colorOptions={component.colorOptions}
            selectedColor={selectedColors[component.id] || ''}
            onColorSelect={(colorId) => onColorSelect(component.id, colorId)}
          />
        )}

        {categoryId === 'cooler' && (
          <CoolerOptions
            coolerColors={component.coolerColors}
            coolerSizes={component.coolerSizes}
            selectedColor={selectedCoolerColors[component.id] || ''}
            selectedSize={selectedCoolerSizes[component.id] || ''}
            onColorSelect={(colorId) => onCoolerColorSelect(component.id, colorId)}
            onSizeSelect={(sizeId) => onCoolerSizeSelect(component.id, sizeId)}
          />
        )}

        {categoryId === 'ram' && component.ramSizes && (
          <RamSizeOptions
            ramSizes={component.ramSizes}
            selectedSize={selectedRamSizes[component.id] || ''}
            onSizeSelect={(sizeId) => onRamSizeSelect(component.id, sizeId)}
          />
        )}
      </CardContent>

      <CardFooter className="p-4 border-t border-gaming-light-gray/20 flex-shrink-0">
        <ComponentCardFooter
          price={totalPrice}
          amazonLink={component.amazonLink}
          isSelected={isSelected}
        />
      </CardFooter>
    </Card>
  );
};

export default ComponentCard;
