
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useMarketplaceAds = () => {
  const { currentUser } = useAuth();
  const [isOptedIn, setIsOptedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      checkAdPreferences();
    } else {
      setIsOptedIn(false);
      setIsLoading(false);
    }
  }, [currentUser]);

  const checkAdPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('marketplace_ad_preferences')
        .select('ads_enabled')
        .eq('user_id', currentUser?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setIsOptedIn(!!data?.ads_enabled);
    } catch (error) {
      console.error('Error checking ad preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const optInToAds = async () => {
    if (!currentUser) {
      toast.error('Please sign in to opt into ads');
      return;
    }

    try {
      const { error } = await supabase
        .from('marketplace_ad_preferences')
        .upsert({
          user_id: currentUser.id,
          ads_enabled: true,
          opted_in_at: new Date().toISOString(),
        });

      if (error) throw error;

      setIsOptedIn(true);
      toast.success('Successfully opted into ads. You will now save 2% on your orders!');
    } catch (error) {
      console.error('Error opting into ads:', error);
      toast.error('Failed to opt into ads');
    }
  };

  return { isOptedIn, isLoading, optInToAds };
};
