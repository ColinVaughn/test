import { caseComponents } from "./components/caseData";
import { cpuComponents } from "./components/cpuData";
import { gpuComponents } from "./components/gpuData";
import { motherboardComponents } from "./components/motherboardData";
import { osComponents, additionalComponents } from "./components/osData";
import { psuComponents } from "./components/psuData";
import { ramComponents } from "./components/ramData";
import { storageComponents } from "./components/storageData";
import { coolerComponents } from "./components/coolerData";
import { fanComponents } from "./components/fanData";
import { ComponentCategory, PcConfiguration } from "@/types/types";

export const mockComponents: ComponentCategory[] = [
  cpuComponents,
  motherboardComponents,
  gpuComponents,
  ramComponents,
  storageComponents,
  coolerComponents,
  caseComponents,
  psuComponents,
  osComponents,
  additionalComponents,
  fanComponents,
];

export const calculateTotalPrice = (configuration: PcConfiguration): number => {
  let totalPrice = 0;
  
  // Add up the price of each component
  for (const [categoryId, component] of Object.entries(configuration)) {
    if (component && categoryId !== 'fans' && categoryId !== 'additional') {
      // Check if it's a regular component option
      if ('price' in component) {
        totalPrice += component.price;
      }
    }
  }
  
  // Add fan prices if any
  if (configuration.fans && configuration.fans.quantity > 0) {
    totalPrice += configuration.fans.quantity * configuration.fans.component.price;
  }

  // Add additional storage price if any
  if (configuration.additional && 'price' in configuration.additional) {
    totalPrice += configuration.additional.price;
  }
  
  // Add assembly fee
  totalPrice += 99;
  
  return totalPrice;
};
