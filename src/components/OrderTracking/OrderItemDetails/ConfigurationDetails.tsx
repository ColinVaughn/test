
import React from 'react';
import { isCustomPC } from '../utils/configurationUtils';
import { CoreComponents } from './ConfigSections/CoreComponents';
import { StorageAndPower } from './ConfigSections/StorageAndPower';
import { CaseAndCooling } from './ConfigSections/CaseAndCooling';

interface ConfigurationDetailsProps {
  config: Record<string, any>;
  type?: 'custom' | 'prebuilt' | 'accessory';
}

export default function ConfigurationDetails({ config, type = 'custom' }: ConfigurationDetailsProps) {
  if (!config || Object.keys(config).length === 0) {
    return null;
  }

  // Show raw JSON if not a custom PC configuration
  if (!isCustomPC(config, type)) {
    return (
      <div className="mt-3 text-sm">
        <div className="text-gray-400 mb-2">Configuration Details:</div>
        <pre className="bg-gaming-dark/40 p-2 rounded-md text-xs overflow-auto whitespace-pre-wrap">
          {JSON.stringify(config, null, 2)}
        </pre>
      </div>
    );
  }

  return (
    <div className="mt-3 space-y-3">
      <div className="flex flex-col gap-2">
        <CoreComponents config={config} />
        <StorageAndPower config={config} />
        <CaseAndCooling config={config} />
      </div>
    </div>
  );
}
