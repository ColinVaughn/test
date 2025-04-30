
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SavedConfig } from "./types";
import { useNavigate } from "react-router-dom";

export const useConfigurationsData = () => {
  const { currentUser } = useAuth();
  const [configs, setConfigs] = useState<SavedConfig[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fetchConfigurations = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('saved_configurations')
        .select('*')
        .eq('user_id', currentUser?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.log("Fetched configurations:", data);
      setConfigs(data || []);
      
      // Also log any local configurations
      const localConfigs = localStorage.getItem('savedConfigurations');
      console.log("Local configurations:", localConfigs ? JSON.parse(localConfigs) : 'None');
      
    } catch (error: any) {
      console.error('Error loading saved configurations:', error);
      toast.error('Error loading saved configurations');
    } finally {
      setIsLoading(false);
    }
  };

  const loadConfiguration = (config: SavedConfig) => {
    console.log("Loading configuration:", config);
    // Navigate to customize page with the configuration
    navigate('/customize', { state: { configuration: config.configuration } });
  };

  const deleteConfiguration = async (id: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('saved_configurations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Configuration deleted');
      fetchConfigurations();
    } catch (error: any) {
      console.error('Error deleting configuration:', error);
      toast.error('Error deleting configuration');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchConfigurations();
    }
  }, [currentUser]);

  return {
    configs,
    isLoading,
    loadConfiguration,
    deleteConfiguration,
  };
};
