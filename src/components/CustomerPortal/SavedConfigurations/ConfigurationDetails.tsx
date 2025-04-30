
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SavedConfig } from "./types";

interface ConfigurationDetailsProps {
  config: SavedConfig;
}

const ConfigurationDetails = ({ config }: ConfigurationDetailsProps) => {
  return (
    <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{config.name}</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 mt-4">
        <h3 className="font-medium text-lg">Components</h3>
        <div className="space-y-2">
          {Object.entries(config.configuration)
            .filter(([_, component]) => component !== null)
            .map(([category, component]) => {
              // Skip fans category as it has a different structure
              if (category === 'fans' && component) {
                const fanComponent = (component as any).component;
                const quantity = (component as any).quantity;
                if (fanComponent && quantity) {
                  return (
                    <div key={category} className="flex justify-between">
                      <span className="font-medium">Fans:</span>
                      <span>{quantity}x {fanComponent.name}</span>
                    </div>
                  );
                }
                return null;
              }
              
              // Handle regular components
              if (component && typeof component === 'object' && 'name' in component) {
                return (
                  <div key={category} className="flex justify-between">
                    <span className="font-medium">{category.charAt(0).toUpperCase() + category.slice(1)}:</span>
                    <span>{(component as any).name}</span>
                  </div>
                );
              }
              return null;
            })}
        </div>
      </div>
    </DialogContent>
  );
};

export default ConfigurationDetails;
