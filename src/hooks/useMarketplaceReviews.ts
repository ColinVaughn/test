
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SellerReview } from "@/types/rpcFunctions";

export function useMarketplaceReviews() {
  const fetchSellerReviews = async (sellerId: string): Promise<SellerReview[]> => {
    if (!sellerId) {
      console.error("No seller ID provided to fetchSellerReviews");
      return [];
    }
    
    try {
      const { data, error } = await (supabase as any).rpc(
        'get_seller_reviews', 
        {
          p_seller_id: sellerId,
          p_status: 'approved'
        }
      );
        
      if (error) {
        console.error("Error fetching seller reviews:", error);
        throw error;
      }
      
      return (data as unknown) as SellerReview[];
    } catch (error) {
      console.error("Error in fetchSellerReviews:", error);
      toast.error("Failed to load seller reviews");
      return [];
    }
  };

  return {
    fetchSellerReviews
  };
}
