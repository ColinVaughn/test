
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Clock, Package } from "lucide-react";
import { format } from "date-fns";

interface ShippingDeadlineAlertProps {
  deadline: string;
  isOverdue: boolean;
}

export const ShippingDeadlineAlert = ({ deadline, isOverdue }: ShippingDeadlineAlertProps) => {
  return (
    <Alert variant={isOverdue ? "destructive" : "default"} className="mb-4">
      <div className="flex items-start gap-3">
        {isOverdue ? <Package className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
        <div>
          <AlertTitle className="mb-2">
            {isOverdue ? "Shipping Deadline Overdue" : "Shipping Deadline Approaching"}
          </AlertTitle>
          <AlertDescription>
            {isOverdue 
              ? `This order was due to be shipped by ${format(new Date(deadline), 'MMMM d, yyyy')}. Please provide tracking information as soon as possible.`
              : `Please provide tracking information by ${format(new Date(deadline), 'MMMM d, yyyy')} to meet the shipping deadline.`
            }
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
};
