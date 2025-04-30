
import { ComponentOption } from "@/types/types";
import ComponentCard from "../Cards/ComponentCard";

interface ComponentGridProps {
  components: ComponentOption[];
  selectedComponent: ComponentOption | null;
  onSelectComponent: (component: ComponentOption) => void;
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

const ComponentGrid = ({
  components,
  selectedComponent,
  onSelectComponent,
  selectedColors,
  selectedCoolerColors,
  selectedCoolerSizes,
  selectedRamSizes,
  onColorSelect,
  onCoolerColorSelect,
  onCoolerSizeSelect,
  onRamSizeSelect,
  categoryId
}: ComponentGridProps) => {
  if (components.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No components match your filter criteria
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {components.map((component) => (
        <ComponentCard
          key={component.id}
          component={component}
          isSelected={selectedComponent?.id === component.id}
          onSelect={onSelectComponent}
          selectedColors={selectedColors}
          selectedCoolerColors={selectedCoolerColors}
          selectedCoolerSizes={selectedCoolerSizes}
          selectedRamSizes={selectedRamSizes}
          onColorSelect={onColorSelect}
          onCoolerColorSelect={onCoolerColorSelect}
          onCoolerSizeSelect={onCoolerSizeSelect}
          onRamSizeSelect={onRamSizeSelect}
          categoryId={categoryId}
        />
      ))}
    </div>
  );
};

export default ComponentGrid;
