
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import CustomizerSidebar from "./CustomizerSidebar";
import OrderSummary from "./OrderSummary";
import { ComponentCategory, PcConfiguration } from "@/types/types";

interface MobileNavigationProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  isSummaryOpen: boolean;
  setIsSummaryOpen: (open: boolean) => void;
  categories: ComponentCategory[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  configuration: PcConfiguration;
  onRemoveComponent: (categoryId: string) => void;
  onCheckout: () => void;
  onSaveConfiguration?: () => void;
}

const MobileNavigation = ({
  isSidebarOpen,
  setIsSidebarOpen,
  isSummaryOpen,
  setIsSummaryOpen,
  categories,
  selectedCategory,
  onSelectCategory,
  configuration,
  onRemoveComponent,
  onCheckout,
  onSaveConfiguration,
}: MobileNavigationProps) => {
  return (
    <div className="flex justify-between items-center p-4 bg-gaming-dark border-b border-gaming-light-gray/20">
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Menu size={16} /> Components
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[80%] p-0 bg-gaming-darker">
          <CustomizerSidebar
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={onSelectCategory}
            configuration={configuration}
          />
        </SheetContent>
      </Sheet>
      
      <Sheet open={isSummaryOpen} onOpenChange={setIsSummaryOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            Build Summary
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[80%] p-0 bg-gaming-darker">
          <OrderSummary
            configuration={configuration}
            onRemoveComponent={onRemoveComponent}
            onCheckout={onCheckout}
            onSaveConfiguration={onSaveConfiguration}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNavigation;
