
import { Input } from "@/components/ui/input";
import FilterDropdown from "../Filters/FilterDropdown";
import SortDropdown from "../Filters/SortDropdown";
import ActiveFilters from "../Filters/ActiveFilters";

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterOptions: { label: string; value: string | null; icon?: React.ReactNode; separator?: boolean; }[];
  onFilterSelect: (value: string | null) => void;
  sortOption: "default" | "price-low" | "price-high" | "name";
  onSortChange: (value: "default" | "price-low" | "price-high" | "name") => void;
  activeFilters: { type: string; value: string; onRemove: () => void; }[];
}

const FilterBar = ({
  searchTerm,
  onSearchChange,
  filterOptions,
  onFilterSelect,
  sortOption,
  onSortChange,
  activeFilters
}: FilterBarProps) => {
  return (
    <div className="flex flex-wrap gap-3 mt-4 mb-6 items-center">
      <Input
        placeholder="Search components..."
        className="max-w-xs bg-gaming-dark text-white border-gaming-light-gray/30"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      
      <FilterDropdown
        label="Filters"
        options={filterOptions}
        onSelect={onFilterSelect}
      />
      
      <SortDropdown
        value={sortOption}
        onChange={onSortChange}
      />

      <ActiveFilters filters={activeFilters} />
    </div>
  );
};

export default FilterBar;
