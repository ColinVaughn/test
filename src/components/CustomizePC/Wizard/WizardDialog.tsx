
import React, { useState, useCallback, lazy, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { WizardFormData } from "@/types/wizardTypes";
import { useConfigurationGenerator } from "@/hooks/useConfigurationGenerator";
import { Brain } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Import our components
import WizardStepIndicator from "./Navigation/WizardStepIndicator";
import WizardNavigation from "./Navigation/WizardNavigation";
import WizardConfirmationDialog from "./Confirmation/WizardConfirmationDialog";
import WizardStepContent from "./Steps/WizardStepContent";
import { useWizardSteps } from "./hooks/useWizardSteps";

// Preload components
const preloadComponents = () => {
  const timer = setTimeout(() => {
    import("./BudgetSelector");
    import("./GameSelector");
    import("./AestheticsPreference");
    import("./ResolutionSelector");
    import("./UsageSelector");
    import("./FpsSelector");
    import("./HardwarePreferences");
    import("./MemoryStoragePreferences");
  }, 1000);
  return () => clearTimeout(timer);
};

interface WizardDialogProps {
  onConfigurationGenerated: (configuration: any) => void;
}

const WizardDialog = ({ onConfigurationGenerated }: WizardDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { generateConfiguration } = useConfigurationGenerator();
  const { steps, currentStep, nextStep, prevStep, isLastStep, isFirstStep, setCurrentStep } = useWizardSteps();
  
  useEffect(() => {
    // Cleanup function that ensures we reset state when component unmounts
    return () => {
      setIsGenerating(false);
      setShowConfirmDialog(false);
      setOpen(false);
    };
  }, []);
  
  React.useEffect(preloadComponents, []);
  
  const form = useForm<WizardFormData>({
    defaultValues: {
      budget: 1500,
      games: [],
      prioritizeLooks: false,
      targetResolution: '1080p',
      targetFps: 60,
      primaryUse: 'gaming'
    },
  });

  // Safe dialog close handler - ensures we don't close during generation
  const handleOpenChange = (newOpen: boolean) => {
    // Don't close if we're generating
    if (isGenerating && !newOpen) return;
    
    // If closing while confirmation dialog is shown, also close that dialog
    if (!newOpen && showConfirmDialog) {
      setShowConfirmDialog(false);
    }
    
    setOpen(newOpen);
    
    // Reset state when dialog is closed
    if (!newOpen) {
      // Small delay to ensure UI updates first
      setTimeout(() => {
        setCurrentStep(0);
        form.reset();
        setShowConfirmDialog(false);
      }, 100);
    }
  };

  const handleGenerateClick = () => {
    setShowConfirmDialog(true);
  };

  // Cancel generation
  const handleCancelGeneration = useCallback(() => {
    if (isGenerating) return; // Don't do anything if we're generating
    setShowConfirmDialog(false);
  }, [isGenerating]);

  // Handle form submission
  const handleSubmit = useCallback(async (data: WizardFormData) => {
    if (isGenerating) return; // Prevent duplicate submissions
    
    try {
      setIsGenerating(true);
      
      // Brief timeout to let UI update before potentially heavy processing
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const configuration = await generateConfiguration(data);
      
      // Only update UI after successful generation
      onConfigurationGenerated(configuration);
      
      // Clean up state after successful generation
      setTimeout(() => {
        setIsGenerating(false);
        setShowConfirmDialog(false);
        
        // Only close the dialog after all state updates are complete
        setTimeout(() => {
          setOpen(false);
          
          // Reset form with a small delay to avoid state updates during rendering
          setTimeout(() => {
            setCurrentStep(0);
            form.reset();
          }, 100);
        }, 100);
      }, 100);
      
    } catch (error) {
      console.error("Failed to generate configuration:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate your PC build. Please try again.",
        variant: "destructive"
      });
      
      // Clean up on error
      setIsGenerating(false);
      setShowConfirmDialog(false);
    }
  }, [generateConfiguration, onConfigurationGenerated, setCurrentStep, form, isGenerating]);

  // Safe confirmation dialog state handler
  const handleConfirmDialogOpenChange = (newOpen: boolean) => {
    if (isGenerating && !newOpen) return; // Prevent closing during generation
    setShowConfirmDialog(newOpen);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button 
            variant="secondary" 
            className="w-full mb-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
            onClick={() => {
              setOpen(true);
              import("./BudgetSelector");
              import("./GameSelector");
              import("./AestheticsPreference");
              import("./ResolutionSelector");
              import("./UsageSelector");
              import("./FpsSelector");
              import("./HardwarePreferences");
              import("./MemoryStoragePreferences");
            }}
          >
            <Brain className="w-4 h-4 mr-2" /> AI Build Wizard
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-center flex items-center justify-center">
              <Brain className="w-5 h-5 mr-2 text-blue-400" />
              PC Build AI Wizard
            </DialogTitle>
          </DialogHeader>
          
          <WizardStepIndicator steps={steps} currentStep={currentStep} />
          
          <Form {...form}>
            <form id="generate-build-form" className="space-y-6">
              <WizardStepContent currentStep={currentStep} form={form} />
              
              <WizardNavigation 
                isFirstStep={isFirstStep}
                isLastStep={isLastStep}
                onPrevious={prevStep}
                onNext={nextStep}
                onGenerate={handleGenerateClick}
              />
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <WizardConfirmationDialog 
        open={showConfirmDialog}
        onOpenChange={handleConfirmDialogOpenChange}
        isGenerating={isGenerating}
        onConfirm={() => form.handleSubmit(handleSubmit)()}
        onCancel={handleCancelGeneration}
        form={form}
      />
    </>
  );
};

export default React.memo(WizardDialog);
