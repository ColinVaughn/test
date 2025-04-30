
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PrebuiltPC } from "@/types/types";
import { CreditCard } from "lucide-react";

interface PaymentTabsProps {
  product?: PrebuiltPC;
  paymentMethod: "stripe" | "paypal" | "zelle";
  onPaymentMethodChange: (value: "stripe" | "paypal" | "zelle") => void;
}

const PaymentTabs = ({ paymentMethod, onPaymentMethodChange }: PaymentTabsProps) => {
  return (
    <Tabs 
      value={paymentMethod} 
      onValueChange={(v) => onPaymentMethodChange(v as "stripe" | "paypal" | "zelle")}
      className="w-full"
    >
      <TabsList className="grid grid-cols-3 mb-4 bg-gaming-dark w-full">
        <TabsTrigger value="stripe" className="flex items-center gap-2">
          <CreditCard size={16} />
          <span>Credit Card</span>
        </TabsTrigger>
        <TabsTrigger value="paypal">PayPal</TabsTrigger>
        <TabsTrigger value="zelle">Zelle</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default PaymentTabs;
