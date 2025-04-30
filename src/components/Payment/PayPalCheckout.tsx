
import { PrebuiltPC } from "@/types/types";
import { Button } from "@/components/ui/button";
// Removing the incorrect import since lucide-react doesn't have a PayPalIcon

interface PayPalCheckoutProps {
  product: PrebuiltPC;
}

const PayPalCheckout = ({ product }: PayPalCheckoutProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <span className="text-gray-300">Checkout with PayPal</span>
        <div className="h-8 w-20 bg-[#0070ba] rounded-sm flex items-center justify-center">
          <PayPalIcon className="text-white" size={20} />
        </div>
      </div>
      
      <div className="bg-gaming-dark text-gray-300 rounded-lg p-4 text-sm border border-gaming-light-gray/20">
        <p>
          You'll be redirected to PayPal to complete your payment securely. 
          You can use your PayPal balance, bank account, or credit card.
        </p>
      </div>
    </div>
  );
};

// Define PayPalIcon since lucide-react doesn't have a built-in PayPal icon
const PayPalIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M17.5 7H20.5C21.3 7 22 7.7 22 8.5C22 9.3 21.3 10 20.5 10H17.5C16.7 10 16 9.3 16 8.5C16 7.7 16.7 7 17.5 7Z" />
    <path d="M2 17.5C2 16.7 2.7 16 3.5 16H6.5C7.3 16 8 16.7 8 17.5C8 18.3 7.3 19 6.5 19H3.5C2.7 19 2 18.3 2 17.5Z" />
    <path d="M2 12V7.5C2 6.7 2.7 6 3.5 6H14.5C15.3 6 16 6.7 16 7.5V16.5C16 17.3 15.3 18 14.5 18H9" />
  </svg>
);

export default PayPalCheckout;
