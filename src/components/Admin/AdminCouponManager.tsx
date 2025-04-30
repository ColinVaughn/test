
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { format } from "date-fns";
import { Tag, Percent, X } from "lucide-react";

const couponFormSchema = z.object({
  code: z.string().min(3, "Code must be at least 3 characters"),
  discount_type: z.enum(["percentage", "fixed"]),
  discount_value: z.number().positive("Discount must be positive"),
  max_uses: z.number().nullable(),
  minimum_purchase: z.number().nullable(),
  start_date: z.string().nullable(),
  expire_date: z.string().nullable(),
  active: z.boolean().default(true),
});

type CouponForm = z.infer<typeof couponFormSchema>;

export default function AdminCouponManager() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  
  const { data: coupons, isLoading } = useQuery({
    queryKey: ["coupons"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("coupons")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const form = useForm<CouponForm>({
    resolver: zodResolver(couponFormSchema),
    defaultValues: {
      active: true,
      discount_type: "percentage",
      max_uses: null,
      minimum_purchase: null,
      start_date: null,
      expire_date: null,
    },
  });

  const createCoupon = useMutation({
    mutationFn: async (values: CouponForm) => {
      // Ensure required fields are present with correct types
      const couponData = {
        code: values.code,
        discount_type: values.discount_type,
        discount_value: values.discount_value,
        max_uses: values.max_uses,
        minimum_purchase: values.minimum_purchase,
        start_date: values.start_date,
        expire_date: values.expire_date,
        active: values.active,
      };

      const { data, error } = await supabase
        .from("coupons")
        .insert(couponData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      toast.success("Coupon created successfully");
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast.error("Failed to create coupon: " + error.message);
    },
  });

  const deleteCoupon = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("coupons")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      toast.success("Coupon deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete coupon: " + error.message);
    },
  });

  const toggleCouponStatus = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase
        .from("coupons")
        .update({ active })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      toast.success("Coupon status updated");
    },
    onError: (error) => {
      toast.error("Failed to update coupon status: " + error.message);
    },
  });

  const onSubmit = (values: CouponForm) => {
    createCoupon.mutate(values);
  };

  if (isLoading) {
    return <div>Loading coupons...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Coupon Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Tag className="mr-2 h-4 w-4" />
              Create Coupon
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Coupon</DialogTitle>
              <DialogDescription>
                Fill in the details below to create a new coupon code.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Coupon Code</FormLabel>
                      <FormControl>
                        <Input placeholder="SUMMER2025" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="discount_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select discount type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="percentage">Percentage</SelectItem>
                          <SelectItem value="fixed">Fixed Amount</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="discount_value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount Value</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder={
                            form.watch("discount_type") === "percentage"
                              ? "10"
                              : "50"
                          }
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        {form.watch("discount_type") === "percentage"
                          ? "Enter percentage (e.g., 10 for 10% off)"
                          : "Enter amount in dollars"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="max_uses"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Uses</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Leave empty for unlimited"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value ? parseInt(e.target.value) : null
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="minimum_purchase"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Purchase Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Leave empty for no minimum"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value ? parseFloat(e.target.value) : null
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expire_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiration Date</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Create Coupon
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Uses</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Expires</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coupons?.map((coupon) => (
            <TableRow key={coupon.id}>
              <TableCell className="font-mono">{coupon.code}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  {coupon.discount_type === "percentage" ? (
                    <Percent className="mr-2 h-4 w-4" />
                  ) : (
                    <Tag className="mr-2 h-4 w-4" />
                  )}
                  {coupon.discount_type}
                </div>
              </TableCell>
              <TableCell>
                {coupon.discount_type === "percentage"
                  ? `${coupon.discount_value}%`
                  : `$${coupon.discount_value}`}
              </TableCell>
              <TableCell>
                {coupon.current_uses || 0}
                {coupon.max_uses ? `/${coupon.max_uses}` : ""}
              </TableCell>
              <TableCell>
                <Button
                  variant={coupon.active ? "default" : "secondary"}
                  size="sm"
                  onClick={() =>
                    toggleCouponStatus.mutate({
                      id: coupon.id,
                      active: !coupon.active,
                    })
                  }
                >
                  {coupon.active ? "Active" : "Inactive"}
                </Button>
              </TableCell>
              <TableCell>
                {coupon.expire_date
                  ? format(new Date(coupon.expire_date), "MMM d, yyyy")
                  : "Never"}
              </TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete this coupon?"
                      )
                    ) {
                      deleteCoupon.mutate(coupon.id);
                    }
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
