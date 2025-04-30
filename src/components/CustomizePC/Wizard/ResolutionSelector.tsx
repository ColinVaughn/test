
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { UseFormReturn } from "react-hook-form";
import { WizardFormData } from "@/types/wizardTypes";

interface ResolutionSelectorProps {
  form: UseFormReturn<WizardFormData>;
}

const ResolutionSelector = ({ form }: ResolutionSelectorProps) => {
  return (
    <FormField
      control={form.control}
      name="targetResolution"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Target Resolution</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="grid grid-cols-3 gap-4"
            >
              <div>
                <RadioGroupItem value="1080p" id="1080p" className="peer sr-only" />
                <Label
                  htmlFor="1080p"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <span className="font-bold">1080p</span>
                  <span className="text-xs text-muted-foreground">Full HD</span>
                </Label>
              </div>

              <div>
                <RadioGroupItem value="1440p" id="1440p" className="peer sr-only" />
                <Label
                  htmlFor="1440p"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <span className="font-bold">1440p</span>
                  <span className="text-xs text-muted-foreground">QHD</span>
                </Label>
              </div>

              <div>
                <RadioGroupItem value="4K" id="4K" className="peer sr-only" />
                <Label
                  htmlFor="4K"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <span className="font-bold">4K</span>
                  <span className="text-xs text-muted-foreground">Ultra HD</span>
                </Label>
              </div>
            </RadioGroup>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default ResolutionSelector;
