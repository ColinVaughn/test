
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PrebuiltPC } from "@/types/types";
import CheckoutSignup from "./CheckoutSignup";
import OrderSummary from "./OrderSummary";
import PaymentForm from "./PaymentForm";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: PrebuiltPC;
}

const PaymentModal = ({ isOpen, onClose, product }: PaymentModalProps) => {
  const [step, setStep] = useState<"account" | "payment">("account");
  const [email, setEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "paypal" | "zelle">("stripe");
  const isMobile = useIsMobile();
  const { currentUser } = useAuth();

  const handleSignupComplete = () => {
    setStep("payment");
  };

  // If user is logged in, skip the account creation step
  if (currentUser && step === "account") {
    setStep("payment");
  }

  // Show account creation step only for non-logged in users
  if (!currentUser && step === "account") {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-gaming-darker text-white border-gaming-light-gray/40 max-w-md">
          <DialogHeader>
            <DialogTitle>Create Account</DialogTitle>
            <DialogDescription className="text-gray-400">
              Enter your email to continue with the purchase
            </DialogDescription>
          </DialogHeader>

          <CheckoutSignup 
            email={email} 
            onSignupComplete={handleSignupComplete} 
          />
        </DialogContent>
      </Dialog>
    );
  }

  // Payment step
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="bg-gaming-darker text-white border-gaming-light-gray/40 max-w-2xl p-0 overflow-hidden"
        style={{ 
          height: isMobile ? 'calc(100vh - 40px)' : 'calc(90vh)',
          maxHeight: '90vh',
          width: '95vw',
          maxWidth: '900px'
        }}
      >
        <div className="flex flex-col h-full">
          <DialogHeader className="p-4 pb-2 flex-shrink-0 border-b border-gaming-light-gray/20">
            <DialogTitle className="text-2xl font-bold">Complete Your Purchase</DialogTitle>
            <DialogDescription className="text-gray-400">
              You're purchasing the {product.name}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-grow overflow-hidden">
            <ScrollArea className="h-full max-h-[calc(90vh-120px)]" type="always">
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <OrderSummary product={product} paymentMethod={paymentMethod} />
                  <PaymentForm product={product} onCancel={onClose} />
                </div>
              </div>
            </ScrollArea>
          </div>

          <DialogFooter className="p-4 pt-2 flex-shrink-0 border-t border-gaming-light-gray/20">
            <Button variant="outline" onClick={onClose} className="border-gaming-light-gray/40">
              Cancel
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
