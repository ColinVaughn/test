
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ComponentCategory, ComponentOption, PcConfiguration } from "@/types/types";
import { Cpu, CheckCircle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { isFanConfiguration, isComponentOption } from "@/utils/typeGuards";

interface CustomizerSidebarProps {
  categories: ComponentCategory[];
  selectedCategory: string;
  setSelectedCategory: (categoryId: string) => void;
  configuration: PcConfiguration;
}

const CustomizerSidebar = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  configuration,
}: CustomizerSidebarProps) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([categories[0]?.id || ""]);

  const handleCategoryToggle = (categoryId: string) => {
    setExpandedCategories((prevExpanded) => {
      if (prevExpanded.includes(categoryId)) {
        return prevExpanded.filter((id) => id !== categoryId);
      } else {
        return [...prevExpanded, categoryId];
      }
    });
  };

  return (
    <div className="bg-gaming-dark border-r border-gaming-light-gray/20 p-4 h-full overflow-auto">
      <h2 className="text-xl font-bold mb-6 text-white">PC Components</h2>

      <Accordion
        type="multiple"
        value={expandedCategories}
        className="space-y-2"
      >
        {categories.map((category) => {
          const isSelected = selectedCategory === category.id;
          const isComponentSelected = configuration[category.id] !== null;
          const component = configuration[category.id];

          return (
            <AccordionItem
              key={category.id}
              value={category.id}
              className={cn(
                "border border-gaming-light-gray/20 rounded-md overflow-hidden",
                isSelected && "rgb-border animate-rgb-shift"
              )}
            >
              <AccordionTrigger
                onClick={(e) => {
                  e.stopPropagation();
                  handleCategoryToggle(category.id);
                }}
                className={cn(
                  "px-4 py-3 hover:bg-gaming-light-gray/10",
                  isSelected && "bg-gaming-light-gray/20"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <Cpu
                      size={20}
                      className={isComponentSelected ? "text-gaming-blue" : "text-gray-400"}
                    />
                  </div>
                  <div className="flex-grow text-left">
                    <span className="font-medium">{category.name}</span>
                    <div className="text-sm text-gray-400">
                      {isComponentSelected ? (
                        <span className="text-gaming-blue flex items-center gap-1">
                          <CheckCircle size={12} />
                          {category.id === 'fans' && isFanConfiguration(component)
                            ? `${component.quantity}× fans` 
                            : isComponentOption(component) ? component.name : 'Selected'}
                        </span>
                      ) : (
                        <span>{category.required ? "Required" : "Optional"}</span>
                      )}
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedCategory(category.id)}
                  className="w-full justify-start px-4 py-2 text-gray-300 hover:text-white hover:bg-gaming-light-gray/10"
                >
                  Select {category.name}
                </Button>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};

export default CustomizerSidebar;
