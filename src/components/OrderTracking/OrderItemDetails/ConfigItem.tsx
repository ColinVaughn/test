
import { LucideIcon } from 'lucide-react';

interface ConfigItemProps {
  icon: LucideIcon;
  iconColor: string;
  label: string;
  children: React.ReactNode;
}

export function ConfigItem({ icon: Icon, iconColor, label, children }: ConfigItemProps) {
  return (
    <div className="flex items-start gap-2">
      <div className="bg-gaming-dark/50 p-1.5 rounded">
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </div>
      <div>
        <div className="text-xs text-gray-400">{label}</div>
        <div className="text-sm">{children}</div>
      </div>
    </div>
  );
}
