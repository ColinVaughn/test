
export interface GamePreference {
  name: string;
  requiredPerformance: 'low' | 'medium' | 'high';
}

export interface WizardFormData {
  budget: number;
  games: string[];
  prioritizeLooks: boolean;
  preferredGames?: GamePreference[];
  targetResolution?: '1080p' | '1440p' | '4K';
  targetFps?: number;
  primaryUse?: 'gaming' | 'streaming' | 'workstation' | 'general';
  ramPreference?: '8GB' | '16GB' | '32GB' | '64GB';
  storagePreference?: {
    type: 'SSD' | 'HDD' | 'Both';
    capacity: '256GB' | '512GB' | '1TB' | '2TB' | '4TB';
  };
  cpuBrandPreference?: 'Intel' | 'AMD' | 'No Preference';
  gpuBrandPreference?: 'NVIDIA' | 'AMD' | 'No Preference';
  strictBudget?: boolean; // New field to enforce strict budget adherence
}
