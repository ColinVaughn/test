
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Search, RefreshCw } from "lucide-react";
import { memo, useCallback } from "react";

interface OrderFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string | undefined;
  onStatusFilterChange: (value: string) => void;
  onRefresh: () => void;
}

export const OrderFilters = memo(({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onRefresh
}: OrderFiltersProps) => {
  console.log("[OrderFilters] Current status filter:", statusFilter);

  // Memoize the handler to prevent recreating it on each render
  const handleStatusChange = useCallback((value: string) => {
    console.log("[OrderFilters] Filter changed to:", value);
    onStatusFilterChange(value);
  }, [onStatusFilterChange]);

  // Memoize the refresh handler
  const handleRefresh = useCallback(() => {
    onRefresh();
  }, [onRefresh]);

  return (
    <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
      <div className="relative flex-grow">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search orders..."
          className="pl-8 bg-gaming-darker border-gaming-light-gray/30"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-gray-400" />
        <Select
          value={statusFilter || "all"}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className="w-36 bg-gaming-darker border-gaming-light-gray/30">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Button 
          variant="outline" 
          size="icon"
          onClick={handleRefresh}
          title="Refresh orders"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
});

OrderFilters.displayName = "OrderFilters";
