
import { ComponentOption } from "@/types/types";

interface FilterHandlersProps {
  showSocketFilter: boolean;
  showWifiFilter: boolean;
  showStorageFilters: boolean;
  showPsuFilters: boolean;
  showCaseFilters: boolean;
  showCoolerFilters: boolean;
  showMemoryFilters: boolean;
  sockets: string[];
  interfaces: string[];
  capacities: string[];
  wattages: string[];
  formFactors: string[];
  coolingTypes: string[];
  memoryTypes: string[];
  memorySpeeds: string[];
  setFilters: (fn: (prev: any) => any) => void;
  value: string | null;
}

export const FilterHandlers = ({
  showSocketFilter,
  showWifiFilter,
  showStorageFilters,
  showPsuFilters,
  showCaseFilters,
  showCoolerFilters,
  showMemoryFilters,
  sockets,
  interfaces,
  capacities,
  wattages,
  formFactors,
  coolingTypes,
  memoryTypes,
  memorySpeeds,
  setFilters,
  value
}: FilterHandlersProps) => {
  if (showSocketFilter && sockets.length > 0 && sockets.includes(value as string)) {
    setFilters(prev => ({ ...prev, socket: value as string }));
  }
  if (showWifiFilter) {
    if (value === "true" || value === "false") {
      setFilters(prev => ({ ...prev, wifi: value === "true" }));
    }
  }
  if (showStorageFilters) {
    if (interfaces.includes(value as string)) {
      setFilters(prev => ({ ...prev, interface: value as string }));
    }
    if (capacities.includes(value as string)) {
      setFilters(prev => ({ ...prev, capacity: value as string }));
    }
  }
  if (showPsuFilters && wattages.length > 0) {
    if (wattages.includes(value as string)) {
      setFilters(prev => ({ ...prev, wattage: value as string }));
    }
  }
  if (showCaseFilters && formFactors.length > 0) {
    if (formFactors.includes(value as string)) {
      setFilters(prev => ({ ...prev, formFactor: value as string }));
    }
  }
  if (showCoolerFilters && coolingTypes.length > 0) {
    if (coolingTypes.includes(value as string)) {
      setFilters(prev => ({ ...prev, coolingType: value as string }));
    }
  }
  if (showMemoryFilters) {
    if (memoryTypes.includes(value as string)) {
      setFilters(prev => ({ ...prev, memoryType: value as string }));
    }
    if (memorySpeeds.includes(value as string)) {
      setFilters(prev => ({ ...prev, memorySpeed: value as string }));
    }
  }

  return null;
};
