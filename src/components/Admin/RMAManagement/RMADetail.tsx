
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { format } from "date-fns";
import { ArrowLeft, Check, X } from "lucide-react";
import type { RMARequest } from "../types/AdminTypes";

interface RMADetailProps {
  request: RMARequest;
  onBack: () => void;
  onUpdateStatus: (requestId: string, status: string) => Promise<void>;
}

export const RMADetail = ({ request, onBack, onUpdateStatus }: RMADetailProps) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPpp");
    } catch (error) {
      return "Invalid date";
    }
  };

  return (
    <Card className="bg-gaming-dark/30 border-gaming-light-gray/20">
      <CardHeader className="border-b border-gaming-light-gray/20">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="hover:bg-gaming-light-gray/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="space-x-2">
            {request.status !== 'approved' && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onUpdateStatus(request.id, 'approved')}
                className="bg-green-600/20 hover:bg-green-600/30 text-green-400"
              >
                <Check className="w-4 h-4 mr-2" />
                Approve
              </Button>
            )}
            {request.status !== 'rejected' && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onUpdateStatus(request.id, 'rejected')}
                className="bg-red-600/20 hover:bg-red-600/30 text-red-400"
              >
                <X className="w-4 h-4 mr-2" />
                Reject
              </Button>
            )}
          </div>
        </div>
        <CardTitle className="text-xl mt-2">RMA Request {request.id.substring(0, 8)}...</CardTitle>
        <div className="text-sm text-gray-400">Created {formatDate(request.created_at)}</div>
        <div className="flex items-center mt-1">
          <span className="text-sm mr-2">Status:</span>
          <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
            request.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' : 
            request.status === 'approved' ? 'bg-green-500/20 text-green-300' :
            request.status === 'rejected' ? 'bg-red-500/20 text-red-300' :
            'bg-blue-500/20 text-blue-300'
          }`}>
            {request.status.toUpperCase()}
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        <div>
          <h3 className="text-sm font-semibold mb-1">Order ID</h3>
          <p className="font-mono text-sm bg-gaming-darker p-2 rounded">{request.order_id}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold mb-1">Reason</h3>
          <p className="bg-gaming-darker p-3 rounded whitespace-pre-wrap">{request.reason}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold mb-1">Items</h3>
          <ul className="bg-gaming-darker p-2 rounded">
            {request.items && request.items.length > 0 ? (
              request.items.map((item, index) => (
                <li key={index} className="py-1 px-2 border-b border-gaming-light-gray/10 last:border-0">
                  {item}
                </li>
              ))
            ) : (
              <li className="py-1 px-2 italic text-gray-400">No items specified</li>
            )}
          </ul>
        </div>
        
        {request.notes && (
          <div>
            <h3 className="text-sm font-semibold mb-1">Admin Notes</h3>
            <p className="bg-gaming-darker p-3 rounded whitespace-pre-wrap">{request.notes}</p>
          </div>
        )}
        
        {request.shipping_label_url && (
          <div>
            <h3 className="text-sm font-semibold mb-1">Shipping Label</h3>
            <a 
              href={request.shipping_label_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline flex items-center"
            >
              View Shipping Label
            </a>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="border-t border-gaming-light-gray/20 pt-4">
        <div className="w-full flex justify-end">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onBack}
          >
            Close
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
