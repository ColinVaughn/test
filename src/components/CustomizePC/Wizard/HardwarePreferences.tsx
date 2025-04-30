
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { WizardFormData } from '@/types/wizardTypes';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Cpu, Monitor } from 'lucide-react';

interface HardwarePreferencesProps {
  form: UseFormReturn<WizardFormData>;
}

const HardwarePreferences = ({ form }: HardwarePreferencesProps) => {
  const { register, setValue, watch } = form;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4 text-white">Hardware Preferences</h2>
        <p className="text-sm text-gray-400 mb-6">
          Select your preferred hardware specifications. These will be used to optimize your build.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <Label className="text-white">CPU Brand Preference</Label>
          <RadioGroup
            defaultValue={watch('cpuBrandPreference') || 'No Preference'}
            onValueChange={(value) => setValue('cpuBrandPreference', value as 'Intel' | 'AMD' | 'No Preference')}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Intel" id="intel" />
              <Label htmlFor="intel" className="cursor-pointer">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-blue-500" />
                  <span>Intel</span>
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="AMD" id="amd-cpu" />
              <Label htmlFor="amd-cpu" className="cursor-pointer">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-red-500" />
                  <span>AMD</span>
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="No Preference" id="no-pref-cpu" />
              <Label htmlFor="no-pref-cpu">No Preference</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <Label className="text-white">GPU Brand Preference</Label>
          <RadioGroup
            defaultValue={watch('gpuBrandPreference') || 'No Preference'}
            onValueChange={(value) => setValue('gpuBrandPreference', value as 'NVIDIA' | 'AMD' | 'No Preference')}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="NVIDIA" id="nvidia" />
              <Label htmlFor="nvidia" className="cursor-pointer">
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-green-500" />
                  <span>NVIDIA</span>
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="AMD" id="amd-gpu" />
              <Label htmlFor="amd-gpu" className="cursor-pointer">
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-red-500" />
                  <span>AMD</span>
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="No Preference" id="no-pref-gpu" />
              <Label htmlFor="no-pref-gpu">No Preference</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};

export default HardwarePreferences;
