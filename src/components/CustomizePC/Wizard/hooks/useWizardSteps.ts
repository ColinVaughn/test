
import { useState } from 'react';
import { lazy } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { WizardFormData } from '@/types/wizardTypes';

// Define the type for components that accept form props
type FormComponentProps = {
  form: UseFormReturn<WizardFormData>;
};

// Define the lazy-loaded components
const BudgetSelector = lazy(() => import(/* webpackChunkName: "budget-selector" */ "../BudgetSelector"));
const GameSelector = lazy(() => import(/* webpackChunkName: "game-selector" */ "../GameSelector"));
const AestheticsPreference = lazy(() => import(/* webpackChunkName: "aesthetics" */ "../AestheticsPreference"));
const ResolutionSelector = lazy(() => import(/* webpackChunkName: "resolution-selector" */ "../ResolutionSelector"));
const UsageSelector = lazy(() => import(/* webpackChunkName: "usage-selector" */ "../UsageSelector"));
const FpsSelector = lazy(() => import(/* webpackChunkName: "fps-selector" */ "../FpsSelector"));
const HardwarePreferences = lazy(() => import(/* webpackChunkName: "hardware-preferences" */ "../HardwarePreferences"));
const MemoryStoragePreferences = lazy(() => import(/* webpackChunkName: "memory-storage-preferences" */ "../MemoryStoragePreferences"));

export interface WizardStep {
  name: string;
  component: React.LazyExoticComponent<React.ComponentType<FormComponentProps>>;
}

export const useWizardSteps = () => {
  const steps: WizardStep[] = [
    { name: 'Budget', component: BudgetSelector },
    { name: 'Games', component: GameSelector },
    { name: 'Usage', component: UsageSelector },
    { name: 'Hardware', component: HardwarePreferences },
    { name: 'Memory', component: MemoryStoragePreferences },
    { name: 'Resolution', component: ResolutionSelector },
    { name: 'FPS', component: FpsSelector },
    { name: 'Aesthetics', component: AestheticsPreference }
  ];

  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  return {
    steps,
    currentStep,
    setCurrentStep,
    nextStep,
    prevStep,
    isLastStep,
    isFirstStep
  };
};
