
import React from 'react';

interface WizardStepIndicatorProps {
  steps: { name: string }[];
  currentStep: number;
}

const WizardStepIndicator = ({ steps, currentStep }: WizardStepIndicatorProps) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-2">
        {steps.map((step, index) => (
          <div 
            key={step.name} 
            className={`text-xs ${index === currentStep ? 'text-blue-500 font-bold' : 'text-gray-500'}`}
          >
            {step.name}
          </div>
        ))}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all" 
          style={{width: `${((currentStep + 1) / steps.length) * 100}%`}}
        />
      </div>
    </div>
  );
};

export default WizardStepIndicator;
