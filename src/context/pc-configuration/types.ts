
import { ComponentOption } from "@/types/types";

export type PCConfigContextType = {
  configuration: Record<string, ComponentOption | null | { quantity: number; component: ComponentOption } | undefined>;
  handleSelectComponent: (component: ComponentOption, selectedCategory: string) => void;
  handleRemoveComponent: (categoryId: string) => void;
  validateConfiguration: () => boolean;
  handleSaveConfiguration: () => void;
  handleFanSelection: (fanComponent: ComponentOption, quantity: number) => void;
};
