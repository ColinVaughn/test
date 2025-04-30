
import React from 'react';
import { Button } from "@/components/ui/button";

interface WizardNavigationProps {
  isFirstStep: boolean;
  isLastStep: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onGenerate: () => void;
}

const WizardNavigation = ({
  isFirstStep,
  isLastStep,
  onPrevious,
  onNext,
  onGenerate
}: WizardNavigationProps) => {
  return (
    <div className="flex justify-between">
      {!isFirstStep && (
        <Button 
          type="button" 
          variant="outline" 
          onClick={onPrevious}
        >
          Back
        </Button>
      )}
      <div className="flex-grow"></div>
      {!isLastStep ? (
        <Button 
          type="button" 
          onClick={onNext}
        >
          Next
        </Button>
      ) : (
        <Button 
          type="button"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0" 
          onClick={onGenerate}
        >
          Generate AI-Optimized Build
        </Button>
      )}
    </div>
  );
};

export default WizardNavigation;
