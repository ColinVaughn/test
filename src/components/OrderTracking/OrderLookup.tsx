
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Package, Mail, Search } from "lucide-react";

interface OrderLookupProps {
  onOrderFound: (orderId: string) => void;
}

const OrderLookup = ({ onOrderFound }: OrderLookupProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    setIsLoading(true);
    console.log("Searching for order with term:", searchTerm);

    try {
      // First try to find by order ID
      let { data: order, error } = await supabase
        .from("orders")
        .select("id")
        .eq("id", searchTerm)
        .maybeSingle();

      if (error && error.code !== "PGRST116") throw error;

      if (!order) {
        console.log("Not found by ID, trying email in payment transactions");
        // If not found by ID, try to find by user email in payment transactions
        const { data: transaction, error: txError } = await supabase
          .from("payment_transactions")
          .select("order_id")
          .eq("customer_email", searchTerm.toLowerCase())
          .maybeSingle();

        if (txError && txError.code !== "PGRST116") throw txError;

        if (transaction?.order_id) {
          console.log("Found order via email:", transaction.order_id);
          order = { id: transaction.order_id };
        }
      } else {
        console.log("Found order via ID:", order.id);
      }

      if (order) {
        onOrderFound(order.id);
      } else {
        console.log("No order found");
        toast.error("No order found with that ID or email");
      }
    } catch (error) {
      console.error("Error searching for order:", error);
      toast.error("Error searching for order");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gaming-dark/30 rounded-lg p-6 mb-8">
      <div className="flex items-center gap-3 mb-4">
        <Search className="w-5 h-5 text-gaming-blue" />
        <h2 className="text-xl font-semibold">Look Up Your Order</h2>
      </div>
      
      <form onSubmit={handleSearch} className="space-y-4">
        <div>
          <div className="relative">
            <Input
              type="text"
              placeholder="Enter order ID or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gaming-dark border-gaming-light-gray/20 pl-10"
            />
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          <p className="text-sm text-gray-400 mt-2">
            Enter your order ID or the email used during purchase
          </p>
        </div>
        <Button 
          type="submit" 
          disabled={isLoading || !searchTerm.trim()} 
          className="w-full bg-gaming-blue hover:bg-gaming-blue/80"
        >
          <Package className="w-4 h-4 mr-2" />
          {isLoading ? "Searching..." : "Find Order"}
        </Button>
      </form>
    </div>
  );
}

export default OrderLookup;
