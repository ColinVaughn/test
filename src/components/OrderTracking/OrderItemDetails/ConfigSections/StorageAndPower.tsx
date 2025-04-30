
import { HardDrive, Power } from 'lucide-react';
import { ConfigItem } from '../ConfigItem';
import { getName } from '../../utils/configurationUtils';

interface StorageAndPowerProps {
  config: Record<string, any>;
}

export function StorageAndPower({ config }: StorageAndPowerProps) {
  if (!config.storage && !config.psu) {
    return null;
  }

  return (
    <>
      {config.storage && (
        <ConfigItem icon={HardDrive} iconColor="text-cyan-400" label="Storage">
          {getName(config.storage)}
        </ConfigItem>
      )}
      
      {config.psu && (
        <ConfigItem icon={Power} iconColor="text-yellow-400" label="Power Supply">
          {getName(config.psu)}
        </ConfigItem>
      )}
    </>
  );
}
