
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PackageX } from "lucide-react";
import { format } from "date-fns";
import type { RMARequest } from "../types/AdminTypes";

interface RMAListProps {
  requests: RMARequest[];
  onSelectRequest: (request: RMARequest) => void;
  isLoading: boolean;
}

export const RMAList = ({ requests, onSelectRequest, isLoading }: RMAListProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p>Loading RMA requests...</p>
      </div>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <div className="text-center py-12 bg-gaming-darker rounded-lg">
        <PackageX className="mx-auto w-16 h-16 text-gray-500 mb-4" />
        <h3 className="text-xl font-medium mb-2">No RMA requests found</h3>
        <p className="text-sm text-gray-400 mb-6">There are currently no RMA requests.</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-b-gaming-light-gray/20">
            <TableHead className="text-gray-300">Request ID</TableHead>
            <TableHead className="text-gray-300">Order ID</TableHead>
            <TableHead className="text-gray-300">Date</TableHead>
            <TableHead className="text-gray-300">Status</TableHead>
            <TableHead className="text-gray-300 w-24"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id} className="border-b-gaming-light-gray/20">
              <TableCell className="font-mono text-xs">
                {request.id.substring(0, 8)}...
              </TableCell>
              <TableCell className="font-mono text-xs">
                {request.order_id.substring(0, 8)}...
              </TableCell>
              <TableCell>{formatDate(request.created_at)}</TableCell>
              <TableCell>
                <span className="capitalize">{request.status}</span>
              </TableCell>
              <TableCell>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="hover:bg-gaming-light-gray/10"
                  onClick={() => onSelectRequest(request)}
                >
                  Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
