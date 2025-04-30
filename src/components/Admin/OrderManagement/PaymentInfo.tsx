import { PaymentType } from "../types/AdminTypes";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Mail, User, MapPin, Phone, Package, List } from "lucide-react";

interface PaymentInfoProps {
  paymentInfo: PaymentType | null;
}

export const PaymentInfo = ({ paymentInfo }: PaymentInfoProps) => {
  if (!paymentInfo) {
    return (
      <div className="bg-gaming-dark/40 p-4 rounded-lg text-center text-gray-400">
        No payment information available
      </div>
    );
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Extract customer info from metadata or zelle_notes
  const customerMetadata = paymentInfo.customer_metadata;
  const customerName = customerMetadata?.name || 
    (paymentInfo.zelle_notes?.match(/Customer: (.*?)\./) || [])[1] || 
    'Not provided';

  // Extract shipping address from customer_metadata
  const shippingAddress = customerMetadata?.shipping_address;
  
  // Format full address if available
  const formattedAddress = shippingAddress ? 
    `${shippingAddress.line1}${shippingAddress.line2 ? ', ' + shippingAddress.line2 : ''}, 
    ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postal_code}` : 
    // Try to extract address from zelle_notes as a fallback
    (paymentInfo.zelle_notes?.match(/Shipping Address: (.*?)(?:$|\.)/) || [])[1] || 
    'No address provided';

  // PC components rendering helper
  const renderPcComponents = () => {
    // Check if we have component details in the metadata
    if (!customerMetadata?.components && !customerMetadata?.component_details) {
      return null;
    }

    return (
      <>
        <Separator className="my-3 bg-gaming-light-gray/20" />
        <h3 className="text-lg mb-2 flex items-center">
          <Package className="h-4 w-4 mr-2 text-gray-400" />
          PC Components
        </h3>
        
        {customerMetadata.component_count && (
          <div className="mb-2 text-sm">
            <span className="text-gray-400">Total Components:</span>{" "}
            <Badge variant="outline">{customerMetadata.component_count}</Badge>
          </div>
        )}
        
        {/* Display detailed components list if available */}
        {customerMetadata.component_details ? (
          // Use structured component details for better display
          <div className="space-y-1">
            {Object.entries(customerMetadata.component_details).map(([key, value]) => (
              <div key={key} className="text-sm">
                <span className="text-gray-400 capitalize">{key}:</span>{" "}
                <span>{value as string}</span>
              </div>
            ))}
          </div>
        ) : customerMetadata.components ? (
          // Otherwise use the components string if available
          <div>
            <div className="text-sm whitespace-pre-wrap">
              {customerMetadata.components.split(' | ').map((component: string, index: number) => (
                <div key={index} className="mb-1">{component}</div>
              ))}
            </div>
          </div>
        ) : null}
      </>
    );
  };

  return (
    <div className="bg-gaming-dark/40 p-4 rounded-lg">
      <div>
        <h3 className="text-lg mb-2 flex items-center">
          <CreditCard className="h-4 w-4 mr-2 text-gray-400" />
          Payment Information
        </h3>
        
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Method:</span>
            <span>
              <Badge className={`
                ${paymentInfo.payment_method === 'stripe' ? 'bg-green-600' : 
                  paymentInfo.payment_method === 'paypal' ? 'bg-blue-600' : 
                  'bg-amber-600'}
              `}>
                {paymentInfo.payment_method === 'stripe' ? 'Stripe' : 
                  paymentInfo.payment_method === 'paypal' ? 'PayPal' : 
                  'Zelle'}
              </Badge>
            </span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Status:</span>
            <span className={`
              ${paymentInfo.status === 'completed' ? 'text-green-400' : 
                paymentInfo.status === 'pending' ? 'text-amber-400' : 
                'text-red-400'}
            `}>
              {paymentInfo.status.charAt(0).toUpperCase() + paymentInfo.status.slice(1)}
            </span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Amount:</span>
            <span>{formatCurrency(paymentInfo.amount)}</span>
          </div>
          
          {paymentInfo.payment_method === 'zelle' && paymentInfo.zelle_received_amount !== null && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Received:</span>
              <span className={paymentInfo.zelle_received_amount >= paymentInfo.amount 
                ? 'text-green-400' 
                : 'text-amber-400'}>
                {formatCurrency(paymentInfo.zelle_received_amount)}
              </span>
            </div>
          )}
          
          {paymentInfo.transaction_id && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Transaction ID:</span>
              <span className="text-xs max-w-[200px] truncate" title={paymentInfo.transaction_id}>
                {paymentInfo.transaction_id}
              </span>
            </div>
          )}
        </div>

        {/* Customer Information */}
        {(paymentInfo.customer_email || customerName || shippingAddress) && (
          <>
            <Separator className="my-3 bg-gaming-light-gray/20" />
            <h3 className="text-lg mb-2 flex items-center">
              <User className="h-4 w-4 mr-2 text-gray-400" />
              Customer Information
            </h3>
            
            <div className="space-y-2">
              {/* Customer Name */}
              {customerName && customerName !== 'Not provided' && (
                <div className="flex items-start text-sm">
                  <User className="h-4 w-4 mr-2 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-gray-400">Name</div>
                    <div>{customerName}</div>
                  </div>
                </div>
              )}
              
              {/* Customer Email */}
              {paymentInfo.customer_email && (
                <div className="flex items-start text-sm">
                  <Mail className="h-4 w-4 mr-2 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-gray-400">Email</div>
                    <div className="break-all">{paymentInfo.customer_email}</div>
                  </div>
                </div>
              )}
              
              {/* Shipping Address */}
              {(shippingAddress || formattedAddress !== 'No address provided') && (
                <div className="flex items-start text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-gray-400">Shipping Address</div>
                    <div className="whitespace-pre-line">{formattedAddress}</div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* PC Components Section */}
        {renderPcComponents()}
      </div>
    </div>
  );
};
