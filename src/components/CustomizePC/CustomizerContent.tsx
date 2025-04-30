
import { ComponentCategory, ComponentOption } from "@/types/types";
import ConfigurationWizard from "./ConfigurationWizard";
import CustomizerTabs from "./TabsContent";
import { isComponentOption } from "@/utils/typeGuards";
import { fanComponents } from "@/data/components/fanData";
import { useCustomizerState } from "@/hooks/use-customizer-state";
import FansSection from "./List/FansSection";
import { Button } from "../ui/button";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";

interface CustomizerContentProps {
  state: ReturnType<typeof useCustomizerState>;
  selectedCategoryData: ComponentCategory | null;
  compatibleComponents?: ComponentOption[];
  isMobile: boolean;
  onCheckoutNow?: () => void;
}

const CustomizerContent = ({ 
  state, 
  selectedCategoryData, 
  compatibleComponents,
  isMobile,
  onCheckoutNow 
}: CustomizerContentProps) => {
  const isStorageSection = state.selectedCategory === "additional";
  const isFansSection = state.selectedCategory === "fans";
  const location = useLocation();

  useEffect(() => {
    // Load configuration from router state if available
    if (location.state?.configuration) {
      console.log("Loading saved configuration:", location.state.configuration);
      
      // Clear the current configuration first
      Object.keys(state.configuration).forEach(category => {
        state.handleRemoveComponent(category);
      });
      
      // Set configuration in state
      Object.entries(location.state.configuration).forEach(([category, component]) => {
        if (!component) return;
        
        if (category === 'fans' && typeof component === 'object') {
          const fanConfig = component as { component: ComponentOption, quantity: number };
          if (fanConfig.component && fanConfig.quantity) {
            state.handleFanSelection(fanConfig.component, fanConfig.quantity);
          }
        } else if (isComponentOption(component)) {
          state.handleSelectComponent(component, category);
        }
      });
      
      // Clear the location state to prevent reloading on refresh
      window.history.replaceState({}, '');
      
      // Show success message
      if (Object.values(location.state.configuration).some(val => val !== null)) {
        toast.success("Configuration loaded successfully");
      }
    }
  }, [location.state]);

  const handleWizardConfigGenerated = (wizardConfig: Record<string, ComponentOption>) => {
    console.log("Configuration received from wizard:", wizardConfig);

    const componentOrder = ['cpu', 'motherboard', 'gpu', 'ram', 'storage', 'cooler', 'case', 'psu'];
    
    const processedComponents = new Set<string>();
    
    for (const category of componentOrder) {
      const component = wizardConfig[category];
      if (component && isComponentOption(component)) {
        console.log(`Auto-selecting ${category}:`, component.name);
        try {
          state.handleSelectComponent(component, category);
          processedComponents.add(category);
        } catch (error) {
          console.error(`Error selecting ${category}:`, error);
        }
      }
    }
    
    Object.entries(wizardConfig).forEach(([category, component]) => {
      if (!processedComponents.has(category) && isComponentOption(component)) {
        console.log(`Auto-selecting additional component ${category}:`, component.name);
        try {
          state.handleSelectComponent(component, category);
        } catch (error) {
          console.error(`Error selecting additional component ${category}:`, error);
        }
      }
    });

    if (wizardConfig.fans && isComponentOption(wizardConfig.fans)) {
      console.log("Auto-selecting fans:", wizardConfig.fans.name);
      state.handleFanSelection(wizardConfig.fans, 1);
    }

    if (isMobile) {
      state.setIsSummaryOpen(true);
    }
  };

  const handleRemoveAdditionalStorage = () => {
    state.handleRemoveComponent("additional");
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 pb-4">
        <ConfigurationWizard 
          onConfigurationGenerated={handleWizardConfigGenerated} 
        />
      </div>
      
      {onCheckoutNow && (
        <div className="px-6 pb-6">
          <button
            onClick={onCheckoutNow}
            className="w-full bg-gaming-blue hover:bg-gaming-blue/80 text-white rounded-md py-3 font-medium"
          >
            Checkout Now
          </button>
        </div>
      )}

      {isStorageSection ? (
        <div className="space-y-6 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold mb-2 text-white">Additional Storage</h2>
              <p className="text-sm text-gray-400">Add more storage capacity to your build.</p>
            </div>
            {isComponentOption(state.configuration.additional) && (
              <Button 
                variant="destructive" 
                onClick={handleRemoveAdditionalStorage}
              >
                Remove Storage
              </Button>
            )}
          </div>

          <CustomizerTabs
            activeTab={state.activeTab}
            setActiveTab={state.setActiveTab}
            selectedCategory={selectedCategoryData}
            selectedComponent={isComponentOption(state.configuration.additional) ? state.configuration.additional as ComponentOption : null}
            onSelectComponent={(component) => state.handleSelectComponent(component, "additional")}
            configuration={state.configuration}
            compatibleComponents={compatibleComponents}
            isMobile={isMobile}
          />
        </div>
      ) : isFansSection ? (
        <FansSection 
          category={fanComponents.options[0]}
          selectedCase={state.configuration.case}
          selectedCooler={state.configuration.cooler}
          onSelectComponent={(component, quantity) => state.handleFanSelection(component, quantity)}
        />
      ) : (
        <CustomizerTabs
          activeTab={state.activeTab}
          setActiveTab={state.setActiveTab}
          selectedCategory={selectedCategoryData}
          selectedComponent={isComponentOption(state.configuration[state.selectedCategory]) ? state.configuration[state.selectedCategory] as ComponentOption : null}
          onSelectComponent={state.handleSelectComponent}
          configuration={state.configuration}
          compatibleComponents={compatibleComponents}
          isMobile={isMobile}
        />
      )}
    </div>
  );
};

export default CustomizerContent;
