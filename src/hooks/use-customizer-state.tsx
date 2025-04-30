
import React, { useState, createContext, useContext } from "react";
import { ComponentOption } from "@/types/types";
import { mockComponents } from "@/data/mockPcComponents";
import { toast } from "@/hooks/use-toast";
import { usePCConfiguration } from "@/hooks/use-pc-configuration";

type CustomizerStateContextType = {
  selectedCategory: string;
  activeTab: "components" | "performance";
  isSidebarOpen: boolean;
  isSummaryOpen: boolean;
  isPaymentModalOpen: boolean;
  configuration: any;
  setIsSidebarOpen: (isOpen: boolean) => void;
  setIsSummaryOpen: (isOpen: boolean) => void;
  setIsPaymentModalOpen: (isOpen: boolean) => void;
  handleSelectCategory: (categoryId: string) => void;
  handleSelectComponent: (component: ComponentOption, categoryOverride?: string) => void;
  handleRemoveComponent: (categoryId: string) => void;
  handleCheckout: () => void;
  handleSaveConfiguration: () => void;
  handleFanSelection: (fanComponent: ComponentOption, quantity: number) => void;
  setActiveTab: (tab: "components" | "performance") => void;
};

const CustomizerStateContext = createContext<CustomizerStateContextType | undefined>(undefined);

export const CustomizerStateProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(mockComponents[0]?.id || "");
  const [activeTab, setActiveTab] = useState<"components" | "performance">("components");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  
  const {
    configuration,
    handleSelectComponent: pcConfigSelectComponent,
    handleRemoveComponent,
    validateConfiguration,
    handleSaveConfiguration,
    handleFanSelection
  } = usePCConfiguration();

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setActiveTab("components");
  };

  const handleSelectComponent = (component: ComponentOption, categoryOverride?: string) => {
    try {
      const categoryToUse = categoryOverride || selectedCategory;
      console.log(`Selecting component for ${categoryToUse}:`, component.name);
      
      // Call the PC configuration handler
      pcConfigSelectComponent(component, categoryToUse);
      
      if (!categoryOverride) {
        // Only move to next category if this wasn't an override selection (like from wizard)
        const currentIndex = mockComponents.findIndex(c => c.id === selectedCategory);
        if (currentIndex < mockComponents.length - 1) {
          setSelectedCategory(mockComponents[currentIndex + 1].id);
        }
      }
    } catch (error) {
      console.error("Error selecting component:", error);
      toast({
        title: "Error",
        description: `Failed to select component: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  };

  const handleCheckout = () => {
    if (!validateConfiguration()) return;

    toast({
      title: "Checkout Started",
      description: "Processing your custom PC build...",
      variant: "default",
    });
    
    setIsPaymentModalOpen(true);
  };

  const value = {
    selectedCategory,
    activeTab,
    isSidebarOpen,
    isSummaryOpen,
    isPaymentModalOpen,
    configuration,
    setIsSidebarOpen,
    setIsSummaryOpen,
    setIsPaymentModalOpen,
    handleSelectCategory,
    handleSelectComponent,
    handleRemoveComponent,
    handleCheckout,
    handleSaveConfiguration,
    handleFanSelection,
    setActiveTab
  };

  return (
    <CustomizerStateContext.Provider value={value}>
      {children}
    </CustomizerStateContext.Provider>
  );
};

export const useCustomizerState = () => {
  const context = useContext(CustomizerStateContext);
  if (context === undefined) {
    throw new Error("useCustomizerState must be used within a CustomizerStateProvider");
  }
  return context;
};
