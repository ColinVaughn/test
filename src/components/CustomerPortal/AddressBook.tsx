
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { MapPin } from "lucide-react";

type Address = {
  id: string;
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  is_default: boolean;
  type: string;
};

type AddressFormValues = Omit<Address, "id" | "is_default">;

const AddressBook = () => {
  const { currentUser } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AddressFormValues>({
    defaultValues: {
      name: "",
      line1: "",
      line2: "",
      city: "",
      state: "",
      postal_code: "",
      type: "shipping"
    }
  });

  useEffect(() => {
    if (currentUser) {
      fetchAddresses();
    }
  }, [currentUser]);

  const fetchAddresses = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('saved_addresses')
        .select('*')
        .eq('user_id', currentUser?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAddresses(data || []);
    } catch (error: any) {
      console.error('Error loading addresses:', error);
      toast.error('Error loading addresses');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      setIsLoading(true);
      
      // First, remove default from all addresses
      await supabase
        .from('saved_addresses')
        .update({ is_default: false })
        .eq('user_id', currentUser?.id);

      // Set the new default
      await supabase
        .from('saved_addresses')
        .update({ is_default: true })
        .eq('id', addressId);

      toast.success('Default address updated');
      fetchAddresses();
    } catch (error: any) {
      console.error('Error updating default address:', error);
      toast.error('Error updating default address');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAddress = async (values: AddressFormValues) => {
    try {
      setIsLoading(true);
      
      // Check if this is first address to make it default
      const isFirstAddress = addresses.length === 0;
      
      const { error } = await supabase
        .from('saved_addresses')
        .insert({
          ...values,
          user_id: currentUser?.id,
          is_default: isFirstAddress
        });

      if (error) throw error;
      
      toast.success('Address added successfully');
      form.reset();
      setIsAdding(false);
      fetchAddresses();
    } catch (error: any) {
      console.error('Error adding address:', error);
      toast.error('Error adding address');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('saved_addresses')
        .delete()
        .eq('id', addressId);

      if (error) throw error;
      
      toast.success('Address removed');
      fetchAddresses();
    } catch (error: any) {
      console.error('Error removing address:', error);
      toast.error('Error removing address');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Address Book</CardTitle>
        <Button onClick={() => setIsAdding(true)} variant="outline" disabled={isAdding}>
          Add New Address
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && addresses.length === 0 && (
          <p className="text-center text-gray-500">Loading addresses...</p>
        )}
        
        {!isLoading && addresses.length === 0 && !isAdding && (
          <div className="text-center py-6">
            <MapPin className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-gray-500">No addresses saved yet</p>
          </div>
        )}

        {isAdding && (
          <Card className="border-dashed">
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAddAddress)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Home, Office, etc." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="line1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address Line 1</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Street address" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="line2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address Line 2 (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Apartment, suite, etc." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="postal_code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal Code</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address Type</FormLabel>
                          <FormControl>
                            <select 
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                              {...field}
                            >
                              <option value="shipping">Shipping</option>
                              <option value="billing">Billing</option>
                              <option value="both">Both</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex justify-end gap-2 pt-2">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      onClick={() => {
                        setIsAdding(false);
                        form.reset();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>Save Address</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {addresses.map((address) => (
          <div
            key={address.id}
            className="p-4 border rounded-lg flex justify-between items-start"
          >
            <div>
              <p className="font-medium">{address.name} <span className="text-sm text-gray-500 font-normal">({address.type})</span></p>
              <p>{address.line1}</p>
              {address.line2 && <p>{address.line2}</p>}
              <p>{`${address.city}, ${address.state} ${address.postal_code}`}</p>
              {address.is_default && (
                <span className="text-sm text-blue-500">Default</span>
              )}
            </div>
            <div className="space-y-2">
              {!address.is_default && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => handleSetDefault(address.id)}
                  disabled={isLoading}
                >
                  Set as Default
                </Button>
              )}
              <Button
                variant="ghost" 
                size="sm"
                className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={() => handleDeleteAddress(address.id)}
                disabled={isLoading}
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AddressBook;
