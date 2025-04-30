
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { UseFormReturn } from "react-hook-form";
import { WizardFormData } from "@/types/wizardTypes";

interface FpsSelectorProps {
  form: UseFormReturn<WizardFormData>;
}

const FpsSelector = ({ form }: FpsSelectorProps) => {
  const targetFps = form.watch("targetFps") || 60;
  
  const getFpsDescription = (fps: number) => {
    if (fps < 60) return "Basic smoothness for casual gaming";
    if (fps < 100) return "Smooth gameplay for most titles";
    if (fps < 144) return "Very responsive for competitive gaming";
    if (fps < 200) return "Professional-level gaming performance";
    return "Ultra-high refresh rate for esports";
  };
  
  return (
    <FormItem>
      <FormLabel>Target FPS (Frames Per Second)</FormLabel>
      <div className="flex items-center mb-2">
        <span className="font-bold text-lg">{targetFps} FPS</span>
      </div>
      <FormField
        control={form.control}
        name="targetFps"
        render={({ field }) => (
          <FormControl>
            <div className="space-y-2">
              <Slider
                value={[field.value || 60]}
                onValueChange={(value) => field.onChange(value[0])}
                min={30}
                max={240}
                step={15}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>30</span>
                <span>60</span>
                <span>144</span>
                <span>240</span>
              </div>
            </div>
          </FormControl>
        )}
      />
      <FormDescription className="text-xs text-gray-400 mt-2">
        {getFpsDescription(targetFps)}
      </FormDescription>
    </FormItem>
  );
};

export default FpsSelector;
