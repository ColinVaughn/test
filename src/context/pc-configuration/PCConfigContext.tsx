
import React, { createContext, useContext, useState, useCallback } from "react";
import { ComponentOption } from "@/types/types";
import { mockComponents } from "@/data/mockPcComponents";
import { toast } from "sonner";
import { PCConfigContextType } from "./types";
import { useAuth } from "@/hooks/useAuth";
import { saveConfigurationToSupabase } from "./utils/saveConfiguration";
import { saveConfigurationToLocalStorage } from "./utils/localStorage";
import { getInitialConfiguration } from "./utils/configUtils";

const PCConfigContext = createContext<PCConfigContextType | undefined>(undefined);

export const PCConfigProvider = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useAuth();
  const [configuration, setConfiguration] = useState<Record<string, any>>(getInitialConfiguration());

  const handleSelectComponent = (component: ComponentOption, selectedCategory: string) => {
    console.log(`PCConfigContext: selecting ${selectedCategory}:`, component.name);
    
    if (selectedCategory === "cooler") {
      const selectedCoolerColor = component.coolerColors?.find(
        c => c.id === component.selectedCoolerColor?.id
      );
      const selectedCoolerSize = component.coolerSizes?.find(
        s => s.id === component.selectedCoolerSize?.id
      );
      
      const totalPrice = component.price + 
        (selectedCoolerColor?.price || 0) + 
        (selectedCoolerSize?.price || 0);

      const coolerWithOptions = {
        ...component,
        price: totalPrice,
        selectedCoolerColor,
        selectedCoolerSize
      };

      setConfiguration(prev => ({
        ...prev,
        [selectedCategory]: coolerWithOptions
      }));
    } else {
      setConfiguration(prev => ({
        ...prev,
        [selectedCategory]: component
      }));
    }
    
    toast("Component Selected", {
      description: `${component.name} added to your build.`,
    });
  };

  const handleFanSelection = (fanComponent: ComponentOption, quantity: number) => {
    if (quantity > 0) {
      setConfiguration(prev => ({
        ...prev,
        fans: {
          component: fanComponent,
          quantity
        }
      }));
      
      toast("Fans Added", {
        description: `${quantity}x ${fanComponent.name} added to your build.`,
      });
    } else {
      setConfiguration(prev => ({
        ...prev,
        fans: null
      }));
    }
  };

  const handleRemoveComponent = (categoryId: string) => {
    if (categoryId === 'fans') {
      setConfiguration(prev => ({
        ...prev,
        fans: null
      }));
    } else {
      setConfiguration(prev => ({
        ...prev,
        [categoryId]: null
      }));
    }
    
    toast("Component Removed", {
      description: "Component has been removed from your build.",
    });
  };

  const validateConfiguration = () => {
    const missingRequiredComponents = mockComponents
      .filter(category => category.required && !configuration[category.id])
      .map(category => category.name);

    if (missingRequiredComponents.length > 0) {
      toast("Missing Required Components", {
        description: `Please select the following components: ${missingRequiredComponents.join(", ")}`,
      });
      return false;
    }
    return true;
  };

  const handleSaveConfiguration = useCallback(async () => {
    const timestamp = new Date().toISOString();
    const configName = `PC Build ${new Date().toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit'
    })}`;

    // Save configuration data
    const configToSave = {
      configuration,
      savedAt: timestamp,
      name: configName
    };
    
    // Save to database if user is logged in
    if (currentUser) {
      try {
        console.log("Saving configuration to database for user:", currentUser.id);
        
        const success = await saveConfigurationToSupabase(
          currentUser.id, 
          configName, 
          configuration
        );
        
        if (success) {
          toast("Configuration Saved", {
            description: "Your PC build has been saved to your account.",
          });
          return true;
        } else {
          throw new Error("Failed to save configuration");
        }
      } catch (error: any) {
        console.error("Error saving configuration to database:", error);
        toast("Error Saving Configuration", {
          description: "There was a problem saving your configuration. Please try again.",
        });
        
        // Fallback to local storage if database save fails
        saveConfigurationToLocalStorage(configToSave);
        return false;
      }
    } else {
      // Save to local storage if user is not logged in
      saveConfigurationToLocalStorage(configToSave);
      
      toast("Configuration Saved Locally", {
        description: "Sign in to save configurations to your account.",
      });
      
      return true;
    }
  }, [configuration, currentUser]);

  const value = {
    configuration,
    handleSelectComponent,
    handleRemoveComponent,
    validateConfiguration,
    handleSaveConfiguration,
    handleFanSelection
  };

  return (
    <PCConfigContext.Provider value={value}>
      {children}
    </PCConfigContext.Provider>
  );
};

export const usePCConfiguration = () => {
  const context = useContext(PCConfigContext);
  if (context === undefined) {
    throw new Error("usePCConfiguration must be used within a PCConfigProvider");
  }
  return context;
};
