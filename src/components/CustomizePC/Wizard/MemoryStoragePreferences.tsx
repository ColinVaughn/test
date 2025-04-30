
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { WizardFormData } from '@/types/wizardTypes';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MemoryStick, HardDrive } from 'lucide-react';

interface MemoryStoragePreferencesProps {
  form: UseFormReturn<WizardFormData>;
}

const MemoryStoragePreferences = ({ form }: MemoryStoragePreferencesProps) => {
  const { register, setValue, watch } = form;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4 text-white">Memory & Storage Preferences</h2>
        <p className="text-sm text-gray-400 mb-6">
          Choose your preferred RAM and storage configurations.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <Label className="text-white">RAM Size</Label>
          <RadioGroup
            defaultValue={watch('ramPreference') || '16GB'}
            onValueChange={(value) => setValue('ramPreference', value as '8GB' | '16GB' | '32GB' | '64GB')}
            className="grid grid-cols-2 gap-4"
          >
            {['8GB', '16GB', '32GB', '64GB'].map((size) => (
              <div key={size} className="flex items-center space-x-2">
                <RadioGroupItem value={size} id={`ram-${size}`} />
                <Label htmlFor={`ram-${size}`} className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    <MemoryStick className="w-4 h-4 text-blue-400" />
                    <span>{size}</span>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <Label className="text-white">Storage Configuration</Label>
          <div className="grid gap-4">
            <Label className="text-sm text-gray-400">Type</Label>
            <RadioGroup
              defaultValue={watch('storagePreference.type') || 'SSD'}
              onValueChange={(value) => setValue('storagePreference.type', value as 'SSD' | 'HDD' | 'Both')}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="SSD" id="ssd" />
                <Label htmlFor="ssd">SSD Only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="HDD" id="hdd" />
                <Label htmlFor="hdd">HDD Only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Both" id="both" />
                <Label htmlFor="both">SSD + HDD</Label>
              </div>
            </RadioGroup>

            <Label className="text-sm text-gray-400 mt-4">Capacity</Label>
            <RadioGroup
              defaultValue={watch('storagePreference.capacity') || '1TB'}
              onValueChange={(value) => setValue('storagePreference.capacity', value as '256GB' | '512GB' | '1TB' | '2TB' | '4TB')}
              className="grid grid-cols-2 gap-4"
            >
              {['256GB', '512GB', '1TB', '2TB', '4TB'].map((size) => (
                <div key={size} className="flex items-center space-x-2">
                  <RadioGroupItem value={size} id={`storage-${size}`} />
                  <Label htmlFor={`storage-${size}`} className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      <HardDrive className="w-4 h-4 text-purple-400" />
                      <span>{size}</span>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-white flex items-center gap-2">
            <input
              type="checkbox"
              {...register('strictBudget')}
              className="rounded border-gray-400"
            />
            <span>Strictly enforce budget limit</span>
          </Label>
          <p className="text-xs text-gray-400">
            When enabled, the AI will ensure the build never exceeds your budget, even if it means compromising on some preferences.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MemoryStoragePreferences;
