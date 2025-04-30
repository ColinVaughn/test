import { ComponentOption } from "@/types/types";
import { getComponentOptions, findRamWithSize, findStorageWithCapacity, getRecommendedPSUWattage } from "./componentUtils";

export const selectCPU = (budget: number, socket?: string) => {
  const cpuOptions = getComponentOptions('cpu');
  const affordableCpus = cpuOptions.filter(cpu => cpu.price <= budget);
  
  if (socket) {
    const compatibleCpus = affordableCpus.filter(cpu => cpu.specs.socket === socket);
    return compatibleCpus.length > 0 
      ? compatibleCpus.sort((a, b) => b.price - a.price)[0]
      : undefined;
  }
  
  return affordableCpus.length > 0
    ? affordableCpus.sort((a, b) => b.price - a.price)[0]
    : cpuOptions.sort((a, b) => a.price - b.price)[0];
};

export const selectMotherboard = (budget: number, cpu?: ComponentOption, caseFormFactor?: string) => {
  const moboOptions = getComponentOptions('motherboard');
  let compatibleMobos = moboOptions;
  
  if (cpu) {
    compatibleMobos = compatibleMobos.filter(mobo => 
      mobo.specs.socket === cpu.specs.socket &&
      mobo.specs.memoryType === cpu.specs.memoryType
    );
  }
  
  if (caseFormFactor) {
    compatibleMobos = compatibleMobos.filter(mobo => 
      caseFormFactor.includes(mobo.specs.formFactor)
    );
  }
  
  const affordableMobos = compatibleMobos.filter(mobo => mobo.price <= budget);
  return affordableMobos.length > 0
    ? affordableMobos.sort((a, b) => b.price - a.price)[0]
    : compatibleMobos.sort((a, b) => a.price - b.price)[0];
};

export const selectGPU = (budget: number) => {
  const gpuOptions = getComponentOptions('gpu');
  const affordableGpus = gpuOptions.filter(gpu => gpu.price <= budget);
  
  return affordableGpus.length > 0
    ? affordableGpus.sort((a, b) => b.price - a.price)[0]
    : gpuOptions.sort((a, b) => a.price - b.price)[0];
};

export const selectRAM = (budget: number, memoryType?: string, targetSize: string = "16GB") => {
  const ramOptions = getComponentOptions('ram');
  let compatibleRam = ramOptions;
  
  if (memoryType) {
    compatibleRam = compatibleRam.filter(ram => ram.specs.memoryType === memoryType);
  }
  
  // First try to find RAM with the exact target size
  const targetRam = findRamWithSize(compatibleRam, targetSize);
  if (targetRam && targetRam.price <= budget) {
    return targetRam;
  }
  
  // If no exact match with budget, try to parse size numbers for comparison
  const targetSizeGB = parseInt(targetSize);
  if (!isNaN(targetSizeGB)) {
    const suitableRam = compatibleRam.filter(ram => {
      // Try to extract size from specs
      if (ram.specs?.size) {
        const sizeMatch = ram.specs.size.match(/(\d+)GB/i);
        if (sizeMatch && parseInt(sizeMatch[1]) >= targetSizeGB) {
          return true;
        }
      }
      
      // Check ramSizes property if available
      if (ram.ramSizes && ram.ramSizes.length > 0) {
        return ram.ramSizes.some(size => {
          const sizeMatch = size.size.match(/(\d+)GB/i);
          return sizeMatch && parseInt(sizeMatch[1]) >= targetSizeGB;
        });
      }
      
      return false;
    });
    
    const affordableRam = suitableRam.filter(ram => ram.price <= budget);
    if (affordableRam.length > 0) {
      return affordableRam.sort((a, b) => {
        // First try to compare by parsed RAM size
        const aSize = a.specs?.size?.match(/(\d+)GB/i);
        const bSize = b.specs?.size?.match(/(\d+)GB/i);
        
        if (aSize && bSize) {
          const aSizeNum = parseInt(aSize[1]);
          const bSizeNum = parseInt(bSize[1]);
          if (aSizeNum !== bSizeNum) {
            return aSizeNum - bSizeNum; // Smallest size that meets requirements
          }
        }
        
        // If sizes are equal or can't be compared, use price
        return a.price - b.price; // Cheapest option
      })[0];
    }
  }
  
  // Fallback to any RAM option within budget
  const affordableRam = compatibleRam.filter(ram => ram.price <= budget);
  return affordableRam.length > 0
    ? affordableRam.sort((a, b) => b.price - a.price)[0]
    : compatibleRam.sort((a, b) => a.price - b.price)[0];
};

export const selectStorage = (budget: number, minCapacity: string = "500GB") => {
  const storageOptions = getComponentOptions('storage');
  
  // First try to find storage with the exact target capacity
  const targetStorage = findStorageWithCapacity(storageOptions, minCapacity);
  if (targetStorage && targetStorage.price <= budget) {
    return targetStorage;
  }
  
  // If no exact match with budget, try to parse capacity for comparison
  const capacityMatch = minCapacity.match(/(\d+)(TB|GB)/i);
  if (capacityMatch) {
    const capacityNum = parseInt(capacityMatch[1]);
    const capacityUnit = capacityMatch[2].toUpperCase();
    const minCapacityGB = capacityUnit === 'TB' ? capacityNum * 1024 : capacityNum;
    
    const suitableStorage = storageOptions.filter(storage => {
      if (storage.specs?.capacity) {
        const storageMatch = storage.specs.capacity.match(/(\d+)(TB|GB)/i);
        if (storageMatch) {
          const storageNum = parseInt(storageMatch[1]);
          const storageUnit = storageMatch[2].toUpperCase();
          const storageGB = storageUnit === 'TB' ? storageNum * 1024 : storageNum;
          return storageGB >= minCapacityGB;
        }
      }
      return false;
    });
    
    const affordableStorage = suitableStorage.filter(storage => storage.price <= budget);
    if (affordableStorage.length > 0) {
      return affordableStorage.sort((a, b) => a.price - b.price)[0];
    }
  }
  
  // Fallback to any storage option within budget
  const affordableStorage = storageOptions.filter(storage => storage.price <= budget);
  return affordableStorage.length > 0
    ? affordableStorage.sort((a, b) => a.price - b.price)[0]
    : storageOptions.sort((a, b) => a.price - b.price)[0];
};

export const selectCooler = (budget: number, cpuWattage: number = 65, selectedCPU?: ComponentOption) => {
  const coolerOptions = getComponentOptions('cooler');
  
  // If CPU comes with a stock cooler, add it as first option
  if (selectedCPU?.specs.stockCooler?.startsWith('Yes')) {
    // Filter cooler options to show stock cooler first
    const stockCooler = coolerOptions.find(c => c.id === 'stock-cooler');
    if (stockCooler) {
      return stockCooler;
    }
  }
  
  // Otherwise proceed with normal cooler selection
  const compatibleCoolers = coolerOptions.filter(cooler => {
    if (cooler.id === 'stock-cooler') return false; // Skip stock cooler if CPU doesn't include one
    if (cooler.coolingCapacity !== undefined) {
      return cooler.coolingCapacity >= cpuWattage;
    }
    return true;
  });
  
  const affordableCoolers = compatibleCoolers.filter(cooler => cooler.price <= budget);
  return affordableCoolers.length > 0
    ? affordableCoolers.sort((a, b) => b.price - a.price)[0]
    : compatibleCoolers.sort((a, b) => a.price - b.price)[0];
};

export const selectCase = (budget: number, motherboardFormFactor?: string, prioritizeLooks: boolean = false) => {
  const caseOptions = getComponentOptions('case');
  
  if (caseOptions.length === 0) {
    console.error("No case options available");
    return null;
  }
  
  let compatibleCases = caseOptions;
  
  if (motherboardFormFactor) {
    compatibleCases = compatibleCases.filter(c => {
      if (!c.specs || !c.specs.formFactor) {
        return true; // If no form factor specifics, assume compatible
      }
      const supportedFormFactors = c.specs.formFactor.split(',').map(f => f.trim());
      return supportedFormFactors.includes(motherboardFormFactor);
    });
  }
  
  // If no compatible cases found, return any case
  if (compatibleCases.length === 0) {
    console.warn("No cases compatible with form factor", motherboardFormFactor, "defaulting to any case");
    compatibleCases = caseOptions;
  }
  
  const affordableCases = compatibleCases.filter(c => c.price <= budget);
  
  // If no affordable cases found, return cheapest case
  if (affordableCases.length === 0) {
    console.warn("No cases within budget", budget, "defaulting to cheapest case");
    return compatibleCases.sort((a, b) => a.price - b.price)[0];
  }
  
  // Sort based on priority (looks vs value)
  if (prioritizeLooks) {
    return affordableCases.sort((a, b) => b.price - a.price)[0]; // Most expensive within budget
  } else {
    return affordableCases.sort((a, b) => a.price - b.price)[0]; // Cheapest within budget
  }
};

export const selectPSU = (budget: number, totalWattage: number) => {
  const psuOptions = getComponentOptions('psu');
  
  // Use the GPU wattage directly as the minimum requirement for PSU
  const compatiblePsus = psuOptions.filter(psu => {
    // PSU wattage might be in specs.wattage or directly in the wattage property
    const psuWattage = psu.wattage || parseInt((psu.specs?.wattage || "0").replace(/[^0-9]/g, ""));
    return psuWattage >= totalWattage;
  });
  
  const affordablePsus = compatiblePsus.filter(psu => psu.price <= budget);
  return affordablePsus.length > 0
    ? affordablePsus.sort((a, b) => a.price - b.price)[0] // Get the cheapest compatible PSU within budget
    : compatiblePsus.sort((a, b) => a.price - b.price)[0]; // If no affordable PSUs, get the cheapest compatible PSU
};
