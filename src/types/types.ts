
import { AddressData } from "@/components/Payment/AddressForm";
import { Json } from "@/integrations/supabase/types";

export interface ComponentOption {
  id: string;
  name: string;
  brand: string;
  price: number;
  amazonLink?: string;
  specs: Record<string, string>;
  imageUrl?: string;
  wattage?: number;
  coolingCapacity?: number;
  colorOptions?: CaseColor[];
  selectedColor?: CaseColor;
  coolerColors?: CoolerColor[];
  selectedCoolerColor?: CoolerColor;
  coolerSizes?: CoolerSize[];
  selectedCoolerSize?: CoolerSize;
  fanSlots?: number;
  preInstalledFans?: number;
  fanSize?: number;
  ramSizes?: RamSize[];
  selectedRamSize?: RamSize;
}

export interface CaseColor {
  id: string;
  name: string;
  hexCode: string;
  price: number;
}

export interface CoolerColor {
  id: string;
  name: string;
  hexCode: string;
  price: number;
}

export interface CoolerSize {
  id: string;
  size: string;
  radiatorSize?: string;
  price: number;
}

export interface RamSize {
  id: string;
  size: string;
  modules: string;
  speed: string;
  price: number;
  colorOptions?: RamColor[];
  selectedColor?: RamColor;
}

export interface RamColor {
  id: string;
  name: string;
  hexCode: string;
  price: number;
}

export interface ComponentCategory {
  id: string;
  name: string;
  description: string;
  icon?: string;
  required: boolean;
  options: ComponentOption[];
}

export interface PcConfiguration {
  [categoryId: string]: ComponentOption | null | { quantity: number; component: ComponentOption } | undefined;
  cpu?: ComponentOption | null;
  motherboard?: ComponentOption | null;
  gpu?: ComponentOption | null;
  ram?: ComponentOption | null;
  storage?: ComponentOption | null;
  cooler?: ComponentOption | null;
  case?: ComponentOption | null;
  psu?: ComponentOption | null;
  os?: ComponentOption | null;
  fans?: { quantity: number; component: ComponentOption } | null;
}

export interface GamePerformance {
  name: string;
  fps1080p: number;
  fps1440p: number;
  fps4k: number;
}

export interface SimplifiedProduct {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
  addresses?: AddressData;
  affiliateCode?: string | null;
  couponCode?: string | null;
}

export interface PrebuiltPC {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  category: string;
  bestseller: boolean;
  featured: boolean;
  new: boolean;
  description: string;
  specs: Record<string, string>;
  imageUrl: string;
  gallery?: string[];
  rating?: number;
  reviews?: number;
  cpu?: string;
  gpu?: string;
  ram?: string;
  storage?: string;
  cooling?: string;
  psu?: string;
  benchmarks?: Benchmark[];
  details?: Array<any> | {
    specs?: Record<string, string>;
    imageUrl?: string;
    description?: string;
  };
}

export interface Benchmark {
  game: string;
  fps: number;
}

export interface PrebuiltSystemData {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  discount: number;
  bestseller: boolean;
  imageUrl: string;
  cpu: string;
  gpu: string;
  ram: string;
  storage: string;
  cooling: string;
  psu: string;
  benchmarks: Benchmark[];
}
