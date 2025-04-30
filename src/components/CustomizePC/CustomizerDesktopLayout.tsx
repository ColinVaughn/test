
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ComponentCategory, PcConfiguration } from "@/types/types";
import OrderSummary from "./OrderSummary";
import CustomizerSidebar from "./CustomizerSidebar";
import { toast } from "sonner";
import { useCart } from "@/hooks/use-cart";

interface CustomizerDesktopLayoutProps {
  state: {
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
    configuration: PcConfiguration;
    handleRemoveComponent: (categoryId: string) => void;
    validateConfiguration: () => boolean;
    handleSaveConfiguration: () => void;
  };
  categories: ComponentCategory[];
  children: React.ReactNode;
}

const CustomizerDesktopLayout = ({ 
  state, 
  categories,
  children 
}: CustomizerDesktopLayoutProps) => {
  const navigate = useNavigate();
  
  const handleCheckout = () => {
    if (state.validateConfiguration()) {
      navigate('/checkout');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-screen-2xl">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 lg:w-72">
          <CustomizerSidebar 
            selectedCategory={state.selectedCategory}
            setSelectedCategory={state.setSelectedCategory}
            categories={categories}
            configuration={state.configuration}
          />
        </div>
        
        <div className="flex-1 bg-gaming-dark rounded-lg overflow-hidden flex flex-col">
          {children}
        </div>
        
        <div className="w-full md:w-80 lg:w-96">
          <OrderSummary 
            configuration={state.configuration}
            onRemoveComponent={state.handleRemoveComponent}
            onCheckout={handleCheckout}
            onSaveConfiguration={state.handleSaveConfiguration}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomizerDesktopLayout;
