
import { supabase } from "@/integrations/supabase/client";
import { SellerAffiliateProgram, ProgramType } from "@/types/marketplace";
import { toast } from "sonner";

export function useMarketplaceAffiliates() {
  const fetchAffiliatesByPerformance = async () => {
    try {
      const { data, error } = await supabase
        .from('seller_affiliate_programs')
        .select(`
          *,
          affiliates (
            code,
            user_profiles (email)
          ),
          marketplace_sellers (store_name, logo_url),
          marketplace_products (name, price)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const typedData = (data || []).map(item => ({
        ...item,
        program_type: item.program_type as ProgramType,
        status: item.status as 'pending' | 'active' | 'inactive'
      })) as SellerAffiliateProgram[];
      
      return typedData;
    } catch (error) {
      console.error("Error fetching affiliates by performance:", error);
      toast.error("Failed to load affiliate performance data");
      return [];
    }
  };

  const createAffiliateProgram = async (programData: Partial<SellerAffiliateProgram>) => {
    return;
  };
  
  const updateAffiliateProgram = async (id: string, updates: Partial<SellerAffiliateProgram>) => {
    return;
  };

  return {
    fetchAffiliatesByPerformance,
    createAffiliateProgram,
    updateAffiliateProgram
  };
}
