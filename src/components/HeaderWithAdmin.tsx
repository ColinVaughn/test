import { useState, useEffect } from "react";
import Header from "./Header";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { User } from "lucide-react";
import { toast } from "sonner";

const HeaderWithAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        setIsChecking(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        // Update user state
        setUser(session?.user || null);
        
        if (!session) {
          console.log("HeaderWithAdmin - No session found");
          setIsAdmin(false);
          return;
        }
        
        console.log("HeaderWithAdmin - Checking admin status for user:", session.user.email);
        
        // Use explicit parameter object with corrected param name
        const { data, error } = await supabase
          .rpc('is_admin', { user_id_param: session.user.id });
            
        if (error) {
          console.error('Error checking admin status:', error);
          console.error('Error details:', JSON.stringify(error));
          toast.error('Error checking admin access');
          throw error;
        }
        
        console.log("HeaderWithAdmin - Admin status result:", data);
        setIsAdmin(!!data);
      } catch (error) {
        console.error('Error in checkAdminStatus:', error);
        toast.error('Error verifying admin access');
        setIsAdmin(false);
      } finally {
        setIsChecking(false);
      }
    };
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed in header:", event, session?.user?.email);
        setUser(session?.user || null);
        
        // Recheck admin status on auth changes
        if (session) {
          checkAdminStatus();
        } else {
          setIsAdmin(false);
        }
      }
    );
    
    checkAdminStatus();
    
    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="relative">
      <Header />
      <div className="absolute top-16 right-4 z-10 flex flex-col md:flex-row gap-2">
        {user ? (
          <>
            <Link 
              to="/auth"
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm font-medium flex items-center"
            >
              <User className="mr-1 h-4 w-4" />
              Account
            </Link>
            
            {isAdmin && !isChecking && (
              <Link 
                to="/admin"
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm font-medium"
              >
                Admin Panel
              </Link>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
};

export default HeaderWithAdmin;
