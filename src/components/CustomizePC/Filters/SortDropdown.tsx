
import { Button } from "@/components/ui/button";
import { SortDesc } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type SortOption = "default" | "price-low" | "price-high" | "name";

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const SortDropdown = ({ value, onChange }: SortDropdownProps) => {
  const getSortLabel = (sort: SortOption) => {
    switch (sort) {
      case "price-low":
        return "Price: Low to High";
      case "price-high":
        return "Price: High to Low";
      case "name":
        return "Name: A to Z";
      default:
        return "Default Sort";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="bg-gaming-dark border-gaming-light-gray/30">
          <SortDesc className="mr-2 h-4 w-4" />
          {getSortLabel(value)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-gaming-darker text-white border-gaming-light-gray/30">
        <DropdownMenuItem onClick={() => onChange("default")}>
          Default Sort
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onChange("price-low")}>
          Price: Low to High
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onChange("price-high")}>
          Price: High to Low
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onChange("name")}>
          Name: A to Z
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SortDropdown;
