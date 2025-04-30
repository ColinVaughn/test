
import { ComponentCategory, ComponentOption, PcConfiguration } from "@/types/types";
import { TabsContent as UITabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ComponentList from "./ComponentList";
import PerformanceTab from "./PerformanceTab";
import { Tabs } from "@/components/ui/tabs";

interface CustomizerTabsProps {
  activeTab: "components" | "performance";
  setActiveTab: (tab: "components" | "performance") => void;
  selectedCategory: ComponentCategory | undefined;
  selectedComponent: ComponentOption | null;
  onSelectComponent: (component: ComponentOption) => void;
  configuration: PcConfiguration;
  isMobile?: boolean;
  children?: React.ReactNode;
  compatibleComponents?: ComponentOption[];
}

const CustomizerTabs = ({
  activeTab,
  setActiveTab,
  selectedCategory,
  selectedComponent,
  onSelectComponent,
  configuration,
  isMobile,
  children,
  compatibleComponents
}: CustomizerTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "components" | "performance")}>
      <div className={`border-b border-gaming-light-gray/20 ${isMobile ? 'px-4 pt-2' : 'px-6 pt-4'}`}>
        <TabsList className={isMobile ? "w-full" : undefined}>
          <TabsTrigger className={isMobile ? "flex-1" : undefined} value="components">
            Components
          </TabsTrigger>
          <TabsTrigger className={isMobile ? "flex-1" : undefined} value="performance">
            Performance
          </TabsTrigger>
        </TabsList>
      </div>

      <UITabsContent value="components" className={isMobile ? "p-0" : undefined}>
        {selectedCategory && (
          <ComponentList
            category={selectedCategory}
            selectedComponent={selectedComponent}
            onSelectComponent={onSelectComponent}
            compatibleComponents={compatibleComponents}
          />
        )}
      </UITabsContent>

      <UITabsContent value="performance">
        <PerformanceTab configuration={configuration} />
      </UITabsContent>
      
      {/* Render any additional children */}
      {children}
    </Tabs>
  );
};

export default CustomizerTabs;
