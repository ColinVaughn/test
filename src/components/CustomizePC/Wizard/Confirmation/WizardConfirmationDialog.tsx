
import React from 'react';
import { 
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Brain, Loader2, CheckCircle } from "lucide-react";
import { WizardFormData } from "@/types/wizardTypes";
import { UseFormReturn } from "react-hook-form";

interface WizardConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isGenerating: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  form: UseFormReturn<WizardFormData>;
}

const WizardConfirmationDialog = ({ 
  open, 
  onOpenChange, 
  isGenerating, 
  onConfirm,
  onCancel,
  form
}: WizardConfirmationDialogProps) => {
  // Properly handle confirm action with stopPropagation to prevent event bubbling
  const handleConfirm = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onConfirm();
  };

  // Properly handle cancel action
  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onCancel();
  };

  return (
    <AlertDialog 
      open={open} 
      onOpenChange={(newOpen) => {
        // Don't allow closing during generation
        if (isGenerating && !newOpen) return;
        
        if (!newOpen) {
          // If closing, explicitly call onCancel
          onCancel();
        }
        
        onOpenChange(newOpen);
      }}
    >
      <AlertDialogContent className="sm:max-w-[500px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Generate Your Custom Build</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <p>Ready to create your AI-optimized PC build based on your preferences?</p>
              
              {form.watch("prioritizeLooks") && (
                <div className="flex items-center space-x-2 bg-purple-900/10 p-3 border border-purple-400/30 rounded-md">
                  <CheckCircle className="h-5 w-5 text-purple-400" />
                  <span className="text-sm font-medium">Aesthetics prioritization is enabled</span>
                </div>
              )}
              
              <p className="text-sm text-gray-500">
                Click "Generate Build" to create your custom PC configuration tailored to your specifications.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            onClick={handleCancel}
            disabled={isGenerating}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                AI Optimizing Build...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                Generate Build
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default WizardConfirmationDialog;
