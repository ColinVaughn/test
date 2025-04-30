
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

const formSchema = z.object({
  reason: z.string().min(10, "Please provide a detailed reason"),
  orderId: z.string().uuid("Please select an order"),
  items: z.array(z.string()).min(1, "Please select at least one item")
});

interface Order {
  id: string;
  created_at: string;
  items?: OrderItem[];
}

interface OrderItem {
  id: string;
  product_name: string;
}

interface CreateRMARequestProps {
  onClose: () => void;
}

const CreateRMARequest = ({ onClose }: CreateRMARequestProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reason: "",
      orderId: "",
      items: []
    }
  });

  const watchOrderId = form.watch("orderId");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", currentUser?.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Could not load orders");
      }
    };

    if (currentUser) {
      fetchOrders();
    }
  }, [currentUser]);

  // Fetch order items when an order is selected
  useEffect(() => {
    const fetchOrderItems = async () => {
      if (!watchOrderId) {
        setOrderItems([]);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from("order_items")
          .select("*")
          .eq("order_id", watchOrderId);

        if (error) throw error;
        setOrderItems(data || []);
        
        // Reset items selection when order changes
        form.setValue("items", []);
      } catch (error) {
        console.error("Error fetching order items:", error);
        toast.error("Could not load order items");
      }
    };

    fetchOrderItems();
  }, [watchOrderId, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      console.log("Submitting RMA request:", values);
      
      const { error } = await supabase
        .from("rma_requests")
        .insert({
          user_id: currentUser?.id,
          order_id: values.orderId,
          reason: values.reason,
          items: values.items
        });

      if (error) {
        console.error("Error creating RMA:", error);
        throw error;
      }

      toast.success("RMA request submitted successfully");
      onClose();
    } catch (error: any) {
      console.error("Error creating RMA request:", error);
      toast.error("Could not submit RMA request: " + (error.message || error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">New RMA Request</h2>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="orderId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Order</FormLabel>
                <FormControl>
                  <select 
                    {...field}
                    className="w-full bg-gaming-dark rounded-md border border-gaming-light-gray/20 p-2"
                  >
                    <option value="">Select an order</option>
                    {orders.map((order) => (
                      <option key={order.id} value={order.id}>
                        Order #{order.id.substring(0, 8)}...
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {orderItems.length > 0 && (
            <FormField
              control={form.control}
              name="items"
              render={() => (
                <FormItem>
                  <div className="mb-2">
                    <FormLabel>Select Items for Return</FormLabel>
                  </div>
                  <ScrollArea className="h-48 border border-gaming-light-gray/20 rounded-md p-2">
                    {orderItems.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="items"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.id}
                              className="flex flex-row items-start space-x-3 space-y-0 py-2"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, item.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {item.product_name}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </ScrollArea>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reason for Return</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Please describe the issue in detail"
                    className="min-h-[100px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-4">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateRMARequest;
