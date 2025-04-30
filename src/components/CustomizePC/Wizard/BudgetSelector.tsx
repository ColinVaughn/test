
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { UseFormReturn } from "react-hook-form";
import { WizardFormData } from "@/types/wizardTypes";
import { Badge } from "@/components/ui/badge";

interface BudgetSelectorProps {
  form: UseFormReturn<WizardFormData>;
}

// Define budget tiers with descriptions for the AI optimizer
const BUDGET_TIERS = [
  { min: 800, max: 1199, label: 'Entry', description: 'Good for casual gaming at 1080p' },
  { min: 1200, max: 1799, label: 'Mid-Range', description: 'Solid 1080p-1440p performance' },
  { min: 1800, max: 2499, label: 'High-End', description: 'Excellent 1440p gaming, good 4K' },
  { min: 2500, max: 5000, label: 'Enthusiast', description: 'Maximum performance at all resolutions' },
];

const getCurrentTier = (value: number) => {
  return BUDGET_TIERS.find(tier => value >= tier.min && value <= tier.max) || BUDGET_TIERS[0];
};

const BudgetSelector = ({ form }: BudgetSelectorProps) => {
  const budget = form.watch("budget");
  const currentTier = getCurrentTier(budget);
  
  return (
    <FormItem>
      <FormLabel>Budget (USD)</FormLabel>
      <div className="flex items-center mb-2">
        <Badge variant="outline" className="bg-purple-900/50 text-white border-purple-500/50">
          {currentTier.label} Tier
        </Badge>
        <span className="ml-auto font-bold text-lg">${budget}</span>
      </div>
      <FormField
        control={form.control}
        name="budget"
        render={({ field }) => (
          <FormControl>
            <div className="space-y-2">
              <Slider
                value={[field.value]}
                onValueChange={(value) => field.onChange(value[0])}
                min={800}
                max={5000}
                step={100}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>$800</span>
                <span>$5000</span>
              </div>
            </div>
          </FormControl>
        )}
      />
      <FormDescription className="text-xs text-gray-400 mt-2">
        {currentTier.description}
      </FormDescription>
    </FormItem>
  );
};

export default BudgetSelector;
