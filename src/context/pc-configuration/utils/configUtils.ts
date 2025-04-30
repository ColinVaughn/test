
import { mockComponents } from "@/data/mockPcComponents";

/**
 * Creates an initial empty configuration state with null values
 * for all component categories
 * 
 * @returns Initial configuration object
 */
export const getInitialConfiguration = (): Record<string, any> => {
  const initialConfig: Record<string, any> = {};
  mockComponents.forEach(category => {
    initialConfig[category.id] = null;
  });
  initialConfig.fans = null;
  return initialConfig;
};
