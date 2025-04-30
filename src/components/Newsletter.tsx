
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('subscribe-newsletter', {
        body: { 
          email
        }
      });

      if (error) {
        console.error("Newsletter subscription error:", error);
        throw new Error(error.message || "Failed to subscribe");
      }
      
      if (data?.error) {
        console.error("Newsletter subscription error:", data.error);
        throw new Error(data.error);
      }
      
      toast.success("Successfully subscribed to our newsletter!");
      setEmail("");
    } catch (error: any) {
      console.error("Newsletter subscription error:", error);
      toast.error(error.message || "Failed to subscribe. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-16 bg-gaming-dark border-t border-gaming-light-gray/20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">Stay Updated</h2>
          <p className="text-gray-400 mb-8">
            Subscribe to our newsletter for exclusive deals, build guides, and early access to new products.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col max-w-lg mx-auto">
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-gaming-darker border-gaming-light-gray/30 focus:border-gaming-blue focus:ring-gaming-blue/30"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
              <Button 
                type="submit"
                className="bg-gaming-blue hover:bg-gaming-blue/80 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Subscribing..." : "Subscribe"}
              </Button>
            </div>
          </form>
          
          <p className="text-xs text-gray-500 mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
