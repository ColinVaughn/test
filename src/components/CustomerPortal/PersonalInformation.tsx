
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Info } from "lucide-react";

const PersonalInformation = () => {
  const { currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm({
    defaultValues: {
      email: currentUser?.email || ''
    }
  });

  const handleUpdateEmail = async (values: { email: string }) => {
    if (values.email === currentUser?.email) {
      setIsEditing(false);
      return;
    }
    
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.updateUser({ email: values.email });
      
      if (error) throw error;
      
      toast.success("Verification email sent. Please check your email to confirm the change.");
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdateEmail)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <div className="flex flex-col gap-1">
                      <FormControl>
                        <Input {...field} type="email" placeholder="email@example.com" />
                      </FormControl>
                      <p className="text-xs text-gray-500 flex items-center">
                        <Info className="h-3 w-3 mr-1" />
                        You'll need to verify your new email address
                      </p>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
                <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="flex justify-between items-center">
              <span className="text-base">{currentUser?.email}</span>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Change Email
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PersonalInformation;
