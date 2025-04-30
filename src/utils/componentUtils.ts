
import { mockComponents } from "@/data/mockPcComponents";
import { ComponentOption } from "@/types/types";

const componentOptionsCache = new Map<string, ComponentOption[]>();

export const getComponentOptions = (id: string): ComponentOption[] => {
  if (componentOptionsCache.size === 0) {
    mockComponents.forEach(component => {
      componentOptionsCache.set(component.id, component.options || []);
    });
  }
  return componentOptionsCache.get(id) || [];
};

// Simplified PSU recommendation based only on GPU wattage
export const getRecommendedPSUWattage = (configuration: Record<string, ComponentOption | null>) => {
  return configuration.gpu?.wattage || 500; // Default to 500W if no GPU is selected
};

// Helper function to find a RAM option with the specified size
export const findRamWithSize = (ramOptions: ComponentOption[], targetSize: string = "16GB"): ComponentOption | undefined => {
  // Normalize the target size for comparison
  const normalizedTarget = targetSize.toLowerCase().replace(/\s+/g, '');
  
  return ramOptions.find(ram => {
    // Try to find in specs.size first
    if (ram.specs?.size && ram.specs.size.toLowerCase().replace(/\s+/g, '') === normalizedTarget) {
      return true;
    }
    
    // Then check the component name for size indicators
    if (ram.name.toLowerCase().includes(normalizedTarget)) {
      return true;
    }
    
    // For RAM components with ramSizes array
    if (ram.ramSizes) {
      return ram.ramSizes.some(size => size.size.toLowerCase().replace(/\s+/g, '') === normalizedTarget);
    }
    
    return false;
  });
};

// Helper function to find storage with the specified capacity
export const findStorageWithCapacity = (storageOptions: ComponentOption[], targetCapacity: string = "1TB"): ComponentOption | undefined => {
  // Normalize the target capacity for comparison
  const normalizedTarget = targetCapacity.toLowerCase().replace(/\s+/g, '');
  
  return storageOptions.find(storage => {
    // Try to find in specs.capacity first
    if (storage.specs?.capacity && storage.specs.capacity.toLowerCase().replace(/\s+/g, '') === normalizedTarget) {
      return true;
    }
    
    // Then check the component name for capacity indicators
    if (storage.name.toLowerCase().includes(normalizedTarget)) {
      return true;
    }
    
    return false;
  });
};
