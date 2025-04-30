
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FilterOption {
  label: string;
  value: string | null;
  icon?: React.ReactNode;
  separator?: boolean;
}

interface FilterDropdownProps {
  label: string;
  options: FilterOption[];
  onSelect: (value: string | null) => void;
}

const FilterDropdown = ({ label, options, onSelect }: FilterDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="bg-gaming-dark border-gaming-light-gray/30">
          <Filter className="mr-2 h-4 w-4" />
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-gaming-darker text-white border-gaming-light-gray/30 w-56">
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        {options.map((option, index) => (
          option.separator ? (
            <DropdownMenuSeparator key={`sep-${index}`} className="bg-gaming-light-gray/30" />
          ) : (
            <DropdownMenuItem 
              key={index} 
              onClick={() => onSelect(option.value)}
            >
              {option.icon && <span className="mr-2">{option.icon}</span>}
              {option.label}
            </DropdownMenuItem>
          )
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterDropdown;
