
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { WizardFormData } from "@/types/wizardTypes";
import { Label } from "@/components/ui/label";

interface AestheticsPreferenceProps {
  form: UseFormReturn<WizardFormData>;
}

const AestheticsPreference = ({ form }: AestheticsPreferenceProps) => {
  const handleCheckboxClick = (e: React.MouseEvent) => {
    // Prevent the event from bubbling up to the form
    e.stopPropagation();
  };

  return (
    <div className="space-y-4">
      <FormItem>
        <FormLabel>Aesthetics Preferences</FormLabel>
        <div className="flex items-center space-x-2 mt-2" onClick={handleCheckboxClick}>
          <Checkbox
            id="looks"
            checked={form.watch("prioritizeLooks")}
            onCheckedChange={(checked) => {
              form.setValue("prioritizeLooks", checked as boolean);
            }}
          />
          <Label htmlFor="looks" className="text-sm cursor-pointer">Prioritize Aesthetics over Performance</Label>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          When enabled, the AI will allocate more budget to visually appealing components like RGB lighting, premium cases, and coolers.
        </p>
      </FormItem>

      {form.watch("prioritizeLooks") && (
        <div className="border border-purple-500/30 rounded-md p-3 bg-purple-900/10">
          <p className="text-xs text-purple-300 mb-2">
            The AI will prioritize components with:
          </p>
          <ul className="list-disc text-xs text-gray-400 pl-5 space-y-1">
            <li>RGB lighting elements</li>
            <li>Premium materials and finishes</li>
            <li>Tempered glass panels</li>
            <li>Display panels (for compatible components)</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AestheticsPreference;
