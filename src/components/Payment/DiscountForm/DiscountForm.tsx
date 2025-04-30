
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface DiscountFormProps {
  onApplyAffiliate: (code: string) => void;
  onApplyCoupon: (code: string) => void;
  className?: string;
}

const DiscountForm = ({ onApplyAffiliate, onApplyCoupon, className = "" }: DiscountFormProps) => {
  const [affiliateCode, setAffiliateCode] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateAffiliateCode = async (code: string) => {
    const { data, error } = await supabase
      .from("affiliates")
      .select("*")
      .eq("code", code)
      .eq("application_status", "approved")
      .single();

    if (error || !data) {
      toast.error("Invalid affiliate code");
      return false;
    }
    return true;
  };

  const validateCouponCode = async (code: string) => {
    const { data, error } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", code)
      .eq("active", true)
      .single();

    if (error || !data) {
      toast.error("Invalid or expired coupon code");
      return false;
    }

    if (data.expire_date && new Date(data.expire_date) < new Date()) {
      toast.error("This coupon has expired");
      return false;
    }

    if (data.max_uses && data.current_uses >= data.max_uses) {
      toast.error("This coupon has reached its maximum uses");
      return false;
    }

    return true;
  };

  const handleApplyAffiliate = async () => {
    if (!affiliateCode.trim()) return;
    
    setIsLoading(true);
    const isValid = await validateAffiliateCode(affiliateCode);
    if (isValid) {
      onApplyAffiliate(affiliateCode);
      toast.success("Affiliate code applied successfully");
    }
    setIsLoading(false);
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setIsLoading(true);
    const isValid = await validateCouponCode(couponCode);
    if (isValid) {
      onApplyCoupon(couponCode);
      toast.success("Coupon code applied successfully");
    }
    setIsLoading(false);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="space-y-2">
        <Label htmlFor="affiliate-code">Affiliate Code</Label>
        <div className="flex gap-2">
          <Input
            id="affiliate-code"
            placeholder="Enter affiliate code"
            value={affiliateCode}
            onChange={(e) => setAffiliateCode(e.target.value)}
            className="bg-gaming-dark border-gaming-light-gray/40"
          />
          <Button 
            onClick={handleApplyAffiliate}
            disabled={isLoading || !affiliateCode.trim()}
          >
            Apply
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="coupon-code">Coupon Code</Label>
        <div className="flex gap-2">
          <Input
            id="coupon-code"
            placeholder="Enter coupon code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="bg-gaming-dark border-gaming-light-gray/40"
          />
          <Button 
            onClick={handleApplyCoupon}
            disabled={isLoading || !couponCode.trim()}
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DiscountForm;
