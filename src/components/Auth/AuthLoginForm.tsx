import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AuthForm } from "./AuthForm";
import { AuthDivider } from "./AuthDivider";
import { AuthGoogleButton } from "./AuthGoogleButton";

interface AuthLoginFormProps {
  isLogin: boolean;
  setIsLogin: (value: boolean) => void;
}

export function AuthLoginForm({ isLogin, setIsLogin }: AuthLoginFormProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (email: string, password: string) => {
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) {
          console.error("Login error:", error);
          throw error;
        }
        
        toast.success("Welcome back!");
        navigate("/");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password
        });
        
        if (error) {
          console.error("Signup error:", error);
          throw error;
        }
        
        toast.success("Account created successfully! Please check your email.");
        navigate("/");
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      let errorMessage = error.message || "Authentication failed";
      
      // Handle specific error cases
      if (errorMessage.includes("User already registered")) {
        errorMessage = "This email is already registered. Please sign in instead.";
      } else if (errorMessage.includes("Invalid login credentials")) {
        errorMessage = "Invalid email or password. Please try again.";
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 bg-gaming-dark/30 p-8 rounded-lg border border-gaming-light-gray/20">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>
        <p className="text-gray-400 mt-2">
          {isLogin
            ? "Sign in to your account"
            : "Sign up for a new account"}
        </p>
      </div>

      <AuthForm
        isLogin={isLogin}
        isLoading={isLoading}
        onSubmit={handleSubmit}
      />

      <AuthDivider />

      <AuthGoogleButton />

      <div className="text-center">
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="text-gaming-blue hover:text-gaming-blue/80"
        >
          {isLogin
            ? "Need an account? Sign up"
            : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
