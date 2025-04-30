
import { WizardFormData } from "@/types/wizardTypes";

export const PERFORMANCE_TIERS = {
  enthusiast: { minBudget: 2500, cpuThreshold: 0.25, gpuThreshold: 0.45 },
  highEnd: { minBudget: 1800, cpuThreshold: 0.20, gpuThreshold: 0.40 },
  midRange: { minBudget: 1200, cpuThreshold: 0.18, gpuThreshold: 0.35 },
  budget: { minBudget: 800, cpuThreshold: 0.15, gpuThreshold: 0.30 }
};

export const RESOLUTION_MULTIPLIERS = {
  "1080p": 1.0,
  "1440p": 1.5,
  "4K": 2.5
};

export const FPS_SCALING = {
  30: 0.5,
  45: 0.75,
  60: 1.0,
  75: 1.2,
  90: 1.4,
  120: 1.7,
  144: 2.0,
  165: 2.2,
  240: 2.8
};

export const PRIMARY_USE_ADJUSTMENTS = {
  "gaming": { cpuBoost: 0, gpuBoost: 0, ramBoost: 0 },
  "streaming": { cpuBoost: 0.1, gpuBoost: 0, ramBoost: 8 },
  "workstation": { cpuBoost: 0.15, gpuBoost: -0.05, ramBoost: 16 },
  "general": { cpuBoost: -0.05, gpuBoost: -0.1, ramBoost: 0 }
};

export const calculateBudgetAllocation = (data: WizardFormData) => {
  const { 
    budget,
    targetResolution = "1080p",
    primaryUse = "gaming",
    targetFps = 60,
    strictBudget
  } = data;

  const baseBudget = strictBudget ? budget : budget * 1.1;
  const performanceTier = 
    budget >= PERFORMANCE_TIERS.enthusiast.minBudget ? PERFORMANCE_TIERS.enthusiast :
    budget >= PERFORMANCE_TIERS.highEnd.minBudget ? PERFORMANCE_TIERS.highEnd :
    budget >= PERFORMANCE_TIERS.midRange.minBudget ? PERFORMANCE_TIERS.midRange : 
    PERFORMANCE_TIERS.budget;

  // Calculate scaling factors
  const resolutionMultiplier = RESOLUTION_MULTIPLIERS[targetResolution] || 1.0;
  const fpsScalingFactor = getFpsScalingFactor(targetFps);
  const useAdjustments = PRIMARY_USE_ADJUSTMENTS[primaryUse] || PRIMARY_USE_ADJUSTMENTS.gaming;

  return {
    cpu: baseBudget * (performanceTier.cpuThreshold + useAdjustments.cpuBoost),
    gpu: baseBudget * (performanceTier.gpuThreshold + useAdjustments.gpuBoost) * resolutionMultiplier * fpsScalingFactor,
    ram: baseBudget * 0.15,
    storage: baseBudget * 0.12,
    cooler: baseBudget * 0.08,
    case: baseBudget * (data.prioritizeLooks ? 0.12 : 0.08),
    psu: baseBudget * 0.1,
    totalBudget: baseBudget
  };
};

export const getFpsScalingFactor = (targetFps: number): number => {
  const fpsKeys = Object.keys(FPS_SCALING).map(Number).sort((a, b) => a - b);
  
  if (FPS_SCALING[targetFps]) return FPS_SCALING[targetFps];
  
  let lowerKey = fpsKeys[0];
  let higherKey = fpsKeys[fpsKeys.length - 1];
  
  for (let i = 0; i < fpsKeys.length; i++) {
    if (fpsKeys[i] <= targetFps) lowerKey = fpsKeys[i];
    if (fpsKeys[i] >= targetFps && higherKey > fpsKeys[i]) higherKey = fpsKeys[i];
  }
  
  if (targetFps <= lowerKey) return FPS_SCALING[lowerKey];
  if (targetFps >= higherKey) return FPS_SCALING[higherKey];
  
  const ratio = (targetFps - lowerKey) / (higherKey - lowerKey);
  return FPS_SCALING[lowerKey] + ratio * (FPS_SCALING[higherKey] - FPS_SCALING[lowerKey]);
};
