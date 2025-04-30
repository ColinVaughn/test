
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { UseFormReturn } from "react-hook-form";
import { WizardFormData } from "@/types/wizardTypes";
import { Gamepad2, MonitorPlay, Laptop, Briefcase } from "lucide-react";

interface UsageSelectorProps {
  form: UseFormReturn<WizardFormData>;
}

const UsageSelector = ({ form }: UsageSelectorProps) => {
  return (
    <FormField
      control={form.control}
      name="primaryUse"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Primary Use</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="grid grid-cols-2 gap-4"
            >
              <div>
                <RadioGroupItem value="gaming" id="gaming" className="peer sr-only" />
                <Label
                  htmlFor="gaming"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Gamepad2 className="mb-2 h-6 w-6" />
                  <span className="font-bold">Gaming</span>
                  <span className="text-xs text-muted-foreground text-center">Optimized for gaming performance</span>
                </Label>
              </div>

              <div>
                <RadioGroupItem value="streaming" id="streaming" className="peer sr-only" />
                <Label
                  htmlFor="streaming"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <MonitorPlay className="mb-2 h-6 w-6" />
                  <span className="font-bold">Streaming</span>
                  <span className="text-xs text-muted-foreground text-center">For gaming + content creation</span>
                </Label>
              </div>

              <div>
                <RadioGroupItem value="workstation" id="workstation" className="peer sr-only" />
                <Label
                  htmlFor="workstation"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Briefcase className="mb-2 h-6 w-6" />
                  <span className="font-bold">Workstation</span>
                  <span className="text-xs text-muted-foreground text-center">For professional workloads</span>
                </Label>
              </div>

              <div>
                <RadioGroupItem value="general" id="general" className="peer sr-only" />
                <Label
                  htmlFor="general"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Laptop className="mb-2 h-6 w-6" />
                  <span className="font-bold">General Use</span>
                  <span className="text-xs text-muted-foreground text-center">Balanced performance</span>
                </Label>
              </div>
            </RadioGroup>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default UsageSelector;
