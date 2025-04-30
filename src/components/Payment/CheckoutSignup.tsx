
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface CheckoutSignupProps {
  email: string;
  onSignupComplete: () => void;
}

const CheckoutSignup = ({ email, onSignupComplete }: CheckoutSignupProps) => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [wantsAccount, setWantsAccount] = useState(false);
  const { currentUser } = useAuth();

  // If user is already logged in, skip the signup process
  if (currentUser) {
    onSignupComplete();
    return null;
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wantsAccount) {
      // User doesn't want to create an account, proceed as guest
      onSignupComplete();
      return;
    }
    
    if (!password) {
      toast.error("Please enter a password");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast.success("Account created successfully! You can now track your orders and access support more easily.");
      onSignupComplete();
    } catch (error: any) {
      console.error("Checkout signup error:", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignup} className="space-y-4">
      <div className="flex items-start space-x-2">
        <Checkbox
          id="create-account"
          checked={wantsAccount}
          onCheckedChange={(checked) => setWantsAccount(checked as boolean)}
        />
        <div className="grid gap-1.5 leading-none">
          <Label htmlFor="create-account" className="font-medium">
            Create an account to track orders and get better support
          </Label>
          <p className="text-sm text-muted-foreground">
            Creating an account makes it easier to track your orders, get faster support, and access exclusive deals
          </p>
        </div>
      </div>

      {wantsAccount && (
        <div className="space-y-2">
          <Label htmlFor="password">Create Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required={wantsAccount}
            className="bg-gaming-dark border-gaming-light-gray/40 text-white"
          />
        </div>
      )}

      <Button
        type="submit"
        className="w-full bg-gaming-blue hover:bg-gaming-blue/80"
        disabled={isLoading || (wantsAccount && !password)}
      >
        {isLoading ? "Creating Account..." : wantsAccount ? "Create Account & Continue" : "Continue as Guest"}
      </Button>
    </form>
  );
}

export default CheckoutSignup;
