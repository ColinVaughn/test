
import React, { forwardRef } from 'react';
import { Thermometer, Fan } from 'lucide-react';
import { ConfigItem } from '../ConfigItem';
import { getName } from '../../utils/configurationUtils';
import { ColorBadge } from '../ConfigBadges/ColorBadge';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';

// Create a proper Lucide-compatible icon for the case
const CaseIcon = forwardRef<SVGSVGElement, React.ComponentProps<LucideIcon>>((props, ref) => {
  return (
    <svg
      ref={ref}
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="2" width="16" height="20" rx="2" />
    </svg>
  );
});

CaseIcon.displayName = 'CaseIcon';

interface CaseAndCoolingProps {
  config: Record<string, any>;
}

export function CaseAndCooling({ config }: CaseAndCoolingProps) {
  if (!config.case && !config.cooler && !config.fans) {
    return null;
  }

  return (
    <>
      {config.case && (
        <ConfigItem 
          icon={CaseIcon} 
          iconColor="text-gray-400" 
          label="Case"
        >
          {getName(config.case)}
          {config.case.selectedColor && (
            <ColorBadge 
              name={config.case.selectedColor.name} 
              hexCode={config.case.selectedColor.hexCode} 
            />
          )}
        </ConfigItem>
      )}
      
      {config.cooler && (
        <ConfigItem icon={Thermometer} iconColor="text-red-400" label="CPU Cooler">
          <>
            {getName(config.cooler)}
            {config.cooler.selectedCoolerColor && (
              <ColorBadge 
                name={config.cooler.selectedCoolerColor.name} 
                hexCode={config.cooler.selectedCoolerColor.hexCode} 
              />
            )}
            {config.cooler.selectedCoolerSize && (
              <Badge variant="outline" className="ml-1 text-xs">
                {config.cooler.selectedCoolerSize.size}
              </Badge>
            )}
          </>
        </ConfigItem>
      )}
      
      {config.fans && (
        <ConfigItem icon={Fan} iconColor="text-blue-300" label="Fans">
          {config.fans.quantity}x {config.fans.component ? getName(config.fans.component) : 'Case Fans'}
        </ConfigItem>
      )}
    </>
  );
}
