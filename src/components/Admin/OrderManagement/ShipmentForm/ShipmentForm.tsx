
import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

const shipmentFormSchema = z.object({
  tracking_number: z.string().min(2, {
    message: "Tracking number must be at least 2 characters.",
  }),
  carrier: z.string().min(2, {
    message: "Carrier must be at least 2 characters.",
  }),
  tracking_url: z.string().url({
    message: "Please enter a valid URL.",
  }),
  estimated_delivery: z.date(),
})

interface ShipmentFormData extends z.infer<typeof shipmentFormSchema> {}

interface ShipmentFormProps {
  selectedOrder: any;
  shipment: any;
  onShipmentUpdated: () => void;
  setIsUpdatingShipment: (isUpdating: boolean) => void;
}

export const ShipmentForm: React.FC<ShipmentFormProps> = ({ selectedOrder, shipment, onShipmentUpdated, setIsUpdatingShipment }) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ShipmentFormData>({
    resolver: zodResolver(shipmentFormSchema),
    defaultValues: {
      tracking_number: shipment?.tracking_number || "",
      carrier: shipment?.carrier || "",
      tracking_url: shipment?.tracking_url || "",
      estimated_delivery: shipment?.estimated_delivery ? new Date(shipment.estimated_delivery) : new Date(),
    },
  });

  const handleSubmit = async (data: ShipmentFormData) => {
    setIsLoading(true);
    try {
      // Convert Date object to ISO string for Supabase
      const { error } = await supabase
        .from('shipments')
        .insert({
          order_id: selectedOrder.id,
          tracking_number: data.tracking_number,
          carrier: data.carrier,
          status: 'shipped',
          tracking_url: data.tracking_url,
          estimated_delivery: data.estimated_delivery.toISOString()
        });

      if (error) throw error;

      // Send shipment notification email
      const { error: notificationError } = await supabase.functions.invoke('order-notifications', {
        body: {
          type: 'order_shipped',
          email: selectedOrder.customer_email,
          orderDetails: {
            orderId: selectedOrder.id,
            trackingNumber: data.tracking_number
          }
        }
      });

      if (notificationError) {
        console.error('Error sending shipment notification:', notificationError);
      }

      toast.success('Shipment created and notification sent');
      onShipmentUpdated();
    } catch (error) {
      console.error('Error creating shipment:', error);
      toast.error('Failed to create shipment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="tracking_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tracking Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter tracking number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="carrier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Carrier</FormLabel>
              <FormControl>
                <Input placeholder="Enter carrier" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tracking_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tracking URL</FormLabel>
              <FormControl>
                <Input placeholder="Enter tracking URL" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="estimated_delivery"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Estimated Delivery Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date()
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Shipment"}
        </Button>
      </form>
    </Form>
  );
};
