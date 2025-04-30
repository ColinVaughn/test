
import { Cpu, Monitor, MemoryStick, Landmark } from 'lucide-react';
import { ConfigItem } from '../ConfigItem';
import { getName } from '../../utils/configurationUtils';
import { Badge } from '@/components/ui/badge';
import { ColorBadge } from '../ConfigBadges/ColorBadge';

interface CoreComponentsProps {
  config: Record<string, any>;
}

export function CoreComponents({ config }: CoreComponentsProps) {
  if (!config.cpu && !config.gpu && !config.ram && !config.motherboard) {
    return null;
  }

  return (
    <>
      {config.cpu && (
        <ConfigItem icon={Cpu} iconColor="text-blue-400" label="CPU">
          {getName(config.cpu)}
        </ConfigItem>
      )}
      
      {config.gpu && (
        <ConfigItem icon={Monitor} iconColor="text-green-400" label="Graphics">
          {getName(config.gpu)}
        </ConfigItem>
      )}
      
      {config.ram && (
        <ConfigItem icon={MemoryStick} iconColor="text-purple-400" label="Memory">
          {getName(config.ram)}
          {config.ram.selectedRamSize && (
            <Badge variant="outline" className="ml-2 text-xs">
              {config.ram.selectedRamSize.size} {config.ram.selectedRamSize.modules}
              {config.ram.selectedRamSize.selectedColor && (
                <ColorBadge 
                  name={config.ram.selectedRamSize.selectedColor.name} 
                  hexCode={config.ram.selectedRamSize.selectedColor.hexCode} 
                />
              )}
            </Badge>
          )}
        </ConfigItem>
      )}
      
      {config.motherboard && (
        <ConfigItem icon={Landmark} iconColor="text-amber-400" label="Motherboard">
          {getName(config.motherboard)}
        </ConfigItem>
      )}
    </>
  );
}
