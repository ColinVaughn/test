
import { Badge } from '@/components/ui/badge';

interface ColorBadgeProps {
  name: string;
  hexCode: string;
}

export function ColorBadge({ name, hexCode }: ColorBadgeProps) {
  return (
    <Badge variant="outline" className="ml-2 text-xs">
      {name}
      <span 
        className="inline-block w-3 h-3 ml-1 rounded-full border border-gray-600"
        style={{ backgroundColor: hexCode }}
      />
    </Badge>
  );
}
