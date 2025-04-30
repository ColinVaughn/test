
import { Badge } from "@/components/ui/badge";

interface ActiveFilter {
  type: string;
  value: string;
  onRemove: () => void;
}

interface ActiveFiltersProps {
  filters: ActiveFilter[];
}

const ActiveFilters = ({ filters }: ActiveFiltersProps) => {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter, index) => (
        <Badge
          key={index}
          variant="secondary"
          className="cursor-pointer"
          onClick={filter.onRemove}
        >
          {filter.type}: {filter.value} ×
        </Badge>
      ))}
    </div>
  );
};

export default ActiveFilters;
