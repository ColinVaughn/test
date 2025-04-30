
import React, { useState, useEffect } from "react";
import { NewsletterManager } from '@/components/Admin/NewsletterManager';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tabs } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useRMARequests } from "@/components/Admin/hooks/useRMARequests";
import { AdminAuthCheck } from "@/components/Admin/Auth/AdminAuthCheck";
import { AdminTabs } from "@/components/Admin/Navigation/AdminTabs";
import { AdminTabsContent } from "@/components/Admin/Content/AdminTabsContent";

function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { 
    requests, 
    isLoading: rmaLoading, 
    selectedRequest, 
    setSelectedRequest,
    updateRequestStatus 
  } = useRMARequests();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log("AdminPage - No session found");
          setIsAdmin(false);
          toast.error('Please sign in to access the admin panel');
          return;
        }
        
        console.log("AdminPage - Checking admin status for user:", session.user.email);
        
        const { data, error } = await supabase
          .rpc('is_admin', { user_id_param: session.user.id });
            
        if (error) {
          console.error('Error checking admin status:', error);
          console.error('Error details:', JSON.stringify(error));
          toast.error('Error verifying admin access');
          throw error;
        }
        
        console.log("AdminPage - Admin status result:", data);
        setIsAdmin(!!data);
        
        if (!data) {
          toast.error('Access denied: You do not have admin privileges');
        }
      } catch (error) {
        console.error('Error in checkAdminStatus:', error);
        toast.error('Error verifying admin access');
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAdminStatus();
  }, []);

  return (
    <>
      <AdminAuthCheck isLoading={isLoading} isAdmin={isAdmin} />
      
      {isAdmin && (
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-8 text-gaming-blue">Admin Panel</h1>
            
            <Tabs defaultValue="orders" className="w-full">
              <AdminTabs />
              <AdminTabsContent 
                selectedRequest={selectedRequest}
                setSelectedRequest={setSelectedRequest}
                updateRequestStatus={updateRequestStatus}
                requests={requests}
                rmaLoading={rmaLoading}
              />
            </Tabs>
          </main>
          <div className="mt-8">
            <NewsletterManager />
          </div>
          <Footer />
        </div>
      )}
    </>
  );
}

export default AdminPage;
