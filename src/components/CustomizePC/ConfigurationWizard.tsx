
import React, { memo, useCallback } from 'react';
import WizardDialog from './Wizard/WizardDialog';
import { toast } from '@/hooks/use-toast';
import { ComponentOption } from '@/types/types';
import { isComponentOption } from '@/utils/typeGuards';

interface ConfigurationWizardProps {
  onConfigurationGenerated: (configuration: Record<string, ComponentOption>) => void;
}

const ConfigurationWizard = memo(({ onConfigurationGenerated }: ConfigurationWizardProps) => {
  const handleConfigurationGenerated = useCallback((configuration: Record<string, unknown>) => {
    console.log("Wizard received configuration:", configuration);
    
    const validatedConfig: Record<string, ComponentOption> = {};
    
    // Validate each component and ensure it's a proper ComponentOption
    Object.entries(configuration).forEach(([category, component]) => {
      if (component && isComponentOption(component)) {
        validatedConfig[category] = component;
      }
    });

    // Only proceed if we have valid components
    if (Object.keys(validatedConfig).length > 0) {
      console.log("Wizard generated valid configuration:", validatedConfig);
      onConfigurationGenerated(validatedConfig);
      
      toast({
        title: "Build Generated",
        description: "Components have been automatically selected based on your preferences.",
        variant: "default",
      });
    } else {
      toast({
        title: "Configuration Error",
        description: "Failed to generate a valid PC configuration. Please try again.",
        variant: "destructive",
      });
    }
  }, [onConfigurationGenerated]);

  return (
    <WizardDialog onConfigurationGenerated={handleConfigurationGenerated} />
  );
});

ConfigurationWizard.displayName = 'ConfigurationWizard';

export default ConfigurationWizard;
