
import { supabase } from "@/integrations/supabase/client";

/**
 * Saves PC configuration to Supabase database
 * 
 * @param userId The user's ID
 * @param configName Configuration name
 * @param configuration The PC configuration object
 * @returns Boolean indicating success or failure
 */
export const saveConfigurationToSupabase = async (
  userId: string,
  configName: string,
  configuration: Record<string, any>
): Promise<boolean> => {
  const { error } = await supabase
    .from('saved_configurations')
    .insert({
      user_id: userId,
      name: configName,
      configuration: configuration
    });

  if (error) {
    console.error("Error saving configuration to Supabase:", error);
    return false;
  }

  return true;
};
