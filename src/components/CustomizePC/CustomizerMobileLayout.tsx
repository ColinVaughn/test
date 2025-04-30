
import { ComponentCategory, PcConfiguration } from "@/types/types";
import MobileNavigation from "./MobileNavigation";
import { fanComponents } from "@/data/components/fanData";
import PaymentModal from "../Payment/PaymentModal";
import { calculateTotalPrice } from "@/data/mockPcComponents";
import { useCustomizerState } from "@/hooks/use-customizer-state";

interface CustomizerMobileLayoutProps {
  children: React.ReactNode;
  state: ReturnType<typeof useCustomizerState>;
  categories: ComponentCategory[];
}

const CustomizerMobileLayout = ({ children, state, categories }: CustomizerMobileLayoutProps) => {
  const totalPrice = calculateTotalPrice(state.configuration);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <MobileNavigation
        isSidebarOpen={state.isSidebarOpen}
        setIsSidebarOpen={state.setIsSidebarOpen}
        isSummaryOpen={state.isSummaryOpen}
        setIsSummaryOpen={state.setIsSummaryOpen}
        categories={[...categories, fanComponents]}
        selectedCategory={state.selectedCategory}
        onSelectCategory={state.handleSelectCategory}
        configuration={state.configuration}
        onRemoveComponent={state.handleRemoveComponent}
        onCheckout={state.handleCheckout}
        onSaveConfiguration={state.handleSaveConfiguration}
      />
      
      {children}

      {state.isPaymentModalOpen && (
        <PaymentModal
          isOpen={state.isPaymentModalOpen}
          onClose={() => state.setIsPaymentModalOpen(false)}
          product={{
            id: `custom-pc-${Date.now()}`,
            name: "Custom Gaming PC",
            description: "Custom built gaming PC with selected components",
            price: totalPrice,
            originalPrice: totalPrice,
            discount: 0,
            category: "Custom PC",
            bestseller: false,
            featured: false,
            new: true,
            imageUrl: "/placeholder.svg",
            specs: {
              cpu: state.configuration.cpu?.name || "Not selected",
              gpu: state.configuration.gpu?.name || "Not selected",
              ram: state.configuration.ram?.name || "Not selected",
              storage: state.configuration.storage?.name || "Not selected",
            },
            rating: 5,
            reviews: 0
          }}
        />
      )}
    </div>
  );
};

export default CustomizerMobileLayout;
