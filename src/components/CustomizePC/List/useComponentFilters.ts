
import { useState } from "react";
import { ComponentOption } from "@/types/types";

export const useComponentFilters = (components: ComponentOption[]) => {
  const [selectedColors, setSelectedColors] = useState<Record<string, string>>({});
  const [selectedCoolerColors, setSelectedCoolerColors] = useState<Record<string, string>>({});
  const [selectedCoolerSizes, setSelectedCoolerSizes] = useState<Record<string, string>>({});
  const [selectedRamSizes, setSelectedRamSizes] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<"default" | "price-low" | "price-high" | "name">("default");
  const [filters, setFilters] = useState({
    brand: null as string | null,
    socket: null as string | null,
    wifi: null as boolean | null,
    interface: null as string | null,
    capacity: null as string | null,
    speed: null as "highest" | "lowest" | null,
    wattage: null as string | null,
    formFactor: null as string | null,
    coolingType: null as string | null,
    memoryType: null as string | null,
    memorySpeed: null as string | null,
  });

  const parseSpeed = (speed: string) => {
    const match = speed?.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  const filteredComponents = components.filter(component => {
    const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         component.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = !filters.brand || component.brand === filters.brand;
    const matchesSocket = !filters.socket || component.specs.socket === filters.socket;
    const matchesWifi = filters.wifi === null || (filters.wifi ? component.specs.wifi : !component.specs.wifi);
    const matchesInterface = !filters.interface || component.specs.interface === filters.interface;
    const matchesCapacity = !filters.capacity || component.specs.capacity === filters.capacity;
    const matchesWattage = !filters.wattage || component.specs.wattage === filters.wattage;
    const matchesFormFactor = !filters.formFactor || component.specs.formFactor === filters.formFactor;
    const matchesCoolingType = !filters.coolingType || component.specs.type === filters.coolingType;
    const matchesMemoryType = !filters.memoryType || component.specs.memoryType === filters.memoryType;
    const matchesMemorySpeed = !filters.memorySpeed || component.specs.speed === filters.memorySpeed;
    
    return matchesSearch && matchesBrand && matchesSocket && matchesWifi && 
           matchesInterface && matchesCapacity && matchesWattage && 
           matchesFormFactor && matchesCoolingType && matchesMemoryType &&
           matchesMemorySpeed;
  }).sort((a, b) => {
    if (filters.speed) {
      const speedA = parseSpeed(a.specs.readSpeed || '0');
      const speedB = parseSpeed(b.specs.readSpeed || '0');
      return filters.speed === 'highest' ? speedB - speedA : speedA - speedB;
    }

    switch (sortOption) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return {
    selectedColors,
    setSelectedColors,
    selectedCoolerColors,
    setSelectedCoolerColors,
    selectedCoolerSizes,
    setSelectedCoolerSizes,
    selectedRamSizes,
    setSelectedRamSizes,
    searchTerm,
    setSearchTerm,
    sortOption,
    setSortOption,
    filters,
    setFilters,
    filteredComponents
  };
};
