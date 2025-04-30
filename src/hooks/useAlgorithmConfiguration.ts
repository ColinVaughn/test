
import { WizardFormData } from "@/types/wizardTypes";
import { ComponentOption } from "@/types/types";
import { calculateBudgetAllocation } from "@/utils/budgetAllocation";
import { analyzeGameRequirements } from "@/utils/gameRequirements";
import { 
  selectCPU,
  selectMotherboard,
  selectGPU,
  selectCooler,
  selectCase,
  selectPSU,
  selectStorage
} from "@/utils/componentSelection";
import { getRecommendedPSUWattage } from "@/utils/componentUtils";
import { getComponentOptions } from "@/utils/componentUtils";

export const useAlgorithmConfiguration = () => {
  const selectRAM = async (budget: number, memoryType?: string) => {
    const ramOptions = await getComponentOptions('ram');

    const compatibleRam = ramOptions.filter(ram => {
      const priceInBudget = ram.price <= budget;
      if (memoryType) {
        return priceInBudget && ram.specs.memoryType === memoryType;
      }
      return priceInBudget;
    });

    if (compatibleRam.length === 0) return null;
    
    return compatibleRam.sort((a, b) => b.price - a.price)[0];
  };

  const generateAlgorithmConfiguration = async (data: WizardFormData) => {
    console.log("Falling back to existing algorithm to generate build...");
    const budgets = calculateBudgetAllocation(data);
    
    const gameReqs = analyzeGameRequirements(data.games);
    
    console.log("Budget allocation:", budgets);
    console.log("Game requirements:", {
      games: data.games,
      targetFps: data.targetFps,
      targetResolution: data.targetResolution,
      gameReqs
    });
    
    const configuration: Record<string, ComponentOption | null> = {};
    
    configuration.cpu = selectCPU(budgets.cpu);
    console.log("Selected CPU:", configuration.cpu?.name);
    
    configuration.motherboard = selectMotherboard(
      budgets.cpu * 0.7,
      configuration.cpu
    );
    console.log("Selected motherboard:", configuration.motherboard?.name);
    
    configuration.gpu = selectGPU(budgets.gpu);
    console.log("Selected GPU:", configuration.gpu?.name);
    
    configuration.ram = await selectRAM(
      budgets.ram,
      configuration.motherboard?.specs.memoryType || configuration.cpu?.specs.memoryType
    );
    console.log("Selected RAM:", configuration.ram?.name);
    
    configuration.storage = selectStorage(
      budgets.storage,
      data.storagePreference?.capacity || gameReqs.minStorage || "1TB"
    );
    console.log("Selected storage:", configuration.storage?.name);
    
    configuration.cooler = selectCooler(
      budgets.cooler,
      configuration.cpu?.wattage,
      configuration.cpu
    );
    console.log("Selected cooler:", configuration.cooler?.name);
    
    const { caseComponents } = await import('@/data/components/caseData');
    if (caseComponents && caseComponents.options && caseComponents.options.length > 0) {
      configuration.case = selectCase(
        budgets.case,
        configuration.motherboard?.specs.formFactor,
        data.prioritizeLooks
      );
      
      if (!configuration.case && caseComponents.options.length > 0) {
        configuration.case = caseComponents.options[0];
      }
    }
    console.log("Selected case:", configuration.case?.name);
    
    // Use the simplified GPU wattage for PSU selection
    const gpuWattage = configuration.gpu?.wattage || 0;
    console.log("GPU wattage for PSU selection:", gpuWattage);
    configuration.psu = selectPSU(budgets.psu, gpuWattage);
    console.log("Selected PSU:", configuration.psu?.name);

    console.log("Algorithm build completed with configuration:", configuration);
    
    if (Object.values(configuration).every(component => component !== null)) {
      return configuration;
    }
    
    return {};
  };

  return { generateAlgorithmConfiguration };
};
