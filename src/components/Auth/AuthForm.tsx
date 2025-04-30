
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface AuthFormProps {
  isLogin: boolean;
  isLoading: boolean;
  onSubmit: (email: string, password: string) => Promise<void>;
}

export function AuthForm({ isLogin, isLoading, onSubmit }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    
    try {
      await onSubmit(email, password);
    } catch (error) {
      console.error("Auth submission error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="bg-gaming-dark border-gaming-light-gray/20"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
          className="bg-gaming-dark border-gaming-light-gray/20"
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-gaming-blue hover:bg-gaming-blue/80"
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : isLogin ? "Sign In" : "Create Account"}
      </Button>
    </form>
  );
}
