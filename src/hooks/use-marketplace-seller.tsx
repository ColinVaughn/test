
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { MarketplaceSeller } from "@/types/marketplace";
import { toast } from "sonner";

export function useMarketplaceSeller() {
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSeller, setIsSeller] = useState(false);
  const [sellerProfile, setSellerProfile] = useState<MarketplaceSeller | null>(null);

  useEffect(() => {
    if (currentUser) {
      checkIfUserIsSeller();
    } else {
      setIsSeller(false);
      setSellerProfile(null);
      setIsLoading(false);
    }
  }, [currentUser]);

  const checkIfUserIsSeller = async () => {
    try {
      setIsLoading(true);
      
      // Force clear local storage cache to prevent showing stale seller data
      localStorage.removeItem('sellerProfile-' + currentUser?.id);
      
      const { data, error } = await supabase
        .from('marketplace_sellers')
        .select('*')
        .eq('user_id', currentUser?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setIsSeller(true);
        setSellerProfile(data as MarketplaceSeller);
      } else {
        setIsSeller(false);
        setSellerProfile(null);
        // Clear any potential session storage/local storage that might be caching the seller profile
        sessionStorage.removeItem('marketplace_seller_data');
      }
    } catch (error) {
      console.error("Error checking seller status:", error);
      toast.error("Could not verify seller status");
      setIsSeller(false);
      setSellerProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Force refresh seller status - this can be called after logout or other events
  const forceRefreshSellerStatus = () => {
    if (currentUser) {
      checkIfUserIsSeller();
    } else {
      setIsSeller(false);
      setSellerProfile(null);
    }
  };

  const becomeASeller = async (storeInfo: Omit<MarketplaceSeller, 'id' | 'user_id' | 'approved' | 'created_at' | 'updated_at' | 'commission_rate' | 'stripe_connect_id'>) => {
    if (!currentUser) {
      toast.error("You must be logged in to become a seller");
      return;
    }

    try {
      setIsLoading(true);
      
      // Generate a store slug from the store name
      const storeSlug = storeInfo.store_name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      const { data, error } = await supabase
        .from('marketplace_sellers')
        .insert({
          user_id: currentUser.id,
          store_name: storeInfo.store_name,
          description: storeInfo.description,
          logo_url: storeInfo.logo_url,
          store_slug: storeSlug,
          about_text: storeInfo.about_text || null,
          return_policy: storeInfo.return_policy || null,
          buyer_protection_policy: storeInfo.buyer_protection_policy || null,
          social_links: storeInfo.social_links || {}
        })
        .select()
        .single();

      if (error) throw error;

      setSellerProfile(data as MarketplaceSeller);
      setIsSeller(true);
      toast.success("Your seller profile has been created! It's pending approval.");
    } catch (error) {
      console.error("Error creating seller profile:", error);
      toast.error("Failed to create seller profile");
    } finally {
      setIsLoading(false);
    }
  };

  const updateSellerProfile = async (updates: Partial<MarketplaceSeller>) => {
    if (!currentUser || !sellerProfile) {
      toast.error("Seller profile not found");
      return;
    }

    try {
      setIsLoading(true);
      
      // If store name is being updated, update slug too
      if (updates.store_name) {
        updates.store_slug = updates.store_name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');
      }
      
      const { error } = await supabase
        .from('marketplace_sellers')
        .update(updates)
        .eq('id', sellerProfile.id);

      if (error) throw error;

      setSellerProfile({
        ...sellerProfile,
        ...updates
      });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating seller profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isSeller,
    isLoading,
    sellerProfile,
    becomeASeller,
    updateSellerProfile,
    forceRefreshSellerStatus,
  };
}
