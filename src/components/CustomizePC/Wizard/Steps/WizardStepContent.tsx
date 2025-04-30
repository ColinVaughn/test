
import React, { Suspense } from 'react';
import { UseFormReturn } from "react-hook-form";
import { WizardFormData } from "@/types/wizardTypes";
import { Skeleton } from "@/components/ui/skeleton";
import { useWizardSteps } from '../hooks/useWizardSteps';

// Error boundary to catch errors in lazy loaded components
class StepErrorBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { fallback: React.ReactNode; children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, info: any) {
    console.error("Error in wizard step:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const FormSkeleton = () => (
  <div className="space-y-6">
    <Skeleton className="w-full h-10" />
    <Skeleton className="w-full h-32" />
    <Skeleton className="w-full h-16" />
    <Skeleton className="w-full h-10" />
  </div>
);

interface WizardStepContentProps {
  currentStep: number;
  form: UseFormReturn<WizardFormData>;
}

// Define a type for components that accept form props
type FormComponentProps = {
  form: UseFormReturn<WizardFormData>;
};

const WizardStepContent = ({ currentStep, form }: WizardStepContentProps) => {
  const { steps } = useWizardSteps();
  
  // Add safety check to prevent rendering issues when steps change
  if (currentStep < 0 || currentStep >= steps.length) {
    return <FormSkeleton />;
  }
  
  const CurrentStepComponent = steps[currentStep]?.component as React.ComponentType<FormComponentProps>;

  // Render nothing if component isn't available (prevents errors during transitions)
  if (!CurrentStepComponent) {
    return <FormSkeleton />;
  }

  return (
    <StepErrorBoundary fallback={<FormSkeleton />}>
      <Suspense fallback={<FormSkeleton />}>
        <CurrentStepComponent form={form} />
      </Suspense>
    </StepErrorBoundary>
  );
};

export default WizardStepContent;
