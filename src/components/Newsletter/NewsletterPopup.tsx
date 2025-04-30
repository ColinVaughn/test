
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const NewsletterPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem("hasSeenNewsletterPopup");
    if (!hasSeenPopup) {
      // Show popup after 3 seconds for first-time visitors
      const timer = setTimeout(() => setIsOpen(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('subscribe-newsletter', {
        body: { email }
      });

      if (error) throw error;
      
      toast.success("Successfully subscribed! Check your email for free shipping code.");
      setIsOpen(false);
      localStorage.setItem("hasSeenNewsletterPopup", "true");
    } catch (error: any) {
      console.error("Newsletter subscription error:", error);
      toast.error(error.message || "Failed to subscribe. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md bg-gaming-dark border-gaming-light-gray/20">
        <DialogHeader>
          <DialogTitle className="text-center flex flex-col items-center gap-4">
            <Package className="h-12 w-12 text-gaming-blue" />
            <span className="text-2xl">Get Free Shipping!</span>
          </DialogTitle>
        </DialogHeader>
        <div className="text-center space-y-4">
          <p className="text-gray-400">
            Subscribe to our newsletter and receive a free shipping code for your first order!
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-gaming-darker border-gaming-light-gray/30"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            <div className="flex gap-2 justify-center">
              <Button
                type="submit"
                className="bg-gaming-blue hover:bg-gaming-blue/80"
                disabled={isLoading}
              >
                {isLoading ? "Subscribing..." : "Get Free Shipping"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="border-gaming-light-gray/30 hover:bg-gaming-light-gray/10"
                onClick={() => {
                  setIsOpen(false);
                  localStorage.setItem("hasSeenNewsletterPopup", "true");
                }}
              >
                Maybe Later
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
