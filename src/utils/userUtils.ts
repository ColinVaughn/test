
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const checkUserExists = async (email: string) => {
  try {
    const { data, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      toast.error('Error checking user existence');
      return false;
    }

    const userExists = data?.users?.some((user: { email: string | null }) => user.email === email);
    return userExists;
  } catch (err) {
    console.error('Error in checkUserExists:', err);
    toast.error('An unexpected error occurred');
    return false;
  }
};

export const checkIsAdmin = async (userId: string) => {
  try {
    const { data, error } = await supabase.rpc('is_admin', { user_id_param: userId });
    
    if (error) {
      console.error('Error checking admin status:', error);
      console.error('Error details:', JSON.stringify(error));
      throw error;
    }
    
    return !!data;
  } catch (err) {
    console.error('Error in checkIsAdmin:', err);
    return false;
  }
};
