
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect } from "react";
import OrderHistory from "@/components/CustomerPortal/OrderHistory";
import RMARequests from "@/components/CustomerPortal/RMARequests";
import AccountSettings from "@/components/CustomerPortal/AccountSettings";
import { MarketplaceSellerDashboard } from "@/components/CustomerPortal/MarketplaceSellerDashboard";
import { MarketplaceProvider } from "@/hooks/use-marketplace";
import { supabase } from "@/integrations/supabase/client";
import SavedConfigurations from "@/components/CustomerPortal/SavedConfigurations";

const CustomerPortalPage = () => {
  const { currentUser } = useAuth();

  // Force check seller status on each visit to the customer portal
  useEffect(() => {
    const checkSellerStatus = async () => {
      if (!currentUser?.id) return;
      
      // Force clear any seller data from the browser's storage
      localStorage.removeItem('sellerProfile-' + currentUser.id);
      sessionStorage.removeItem('marketplace_seller_data');
      
      // Also check if the seller exists directly
      const { data, error } = await supabase
        .from('marketplace_sellers')
        .select('id')
        .eq('user_id', currentUser.id)
        .maybeSingle();
        
      if (error) {
        console.error("Error checking seller status:", error);
      }
      
      // If no seller record exists, clear any cached React state
      if (!data) {
        // The MarketplaceProvider will check again and update state accordingly
        console.log("No seller record found, clearing any cached state");
      }
    };
    
    checkSellerStatus();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gaming-darker">
        <Header />
        <main className="container mx-auto py-12 px-4">
          <h1 className="text-4xl font-bold text-gaming-blue mb-8">Customer Portal</h1>
          <p className="text-gray-300">Please sign in to access your customer portal.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gaming-darker">
      <Header />
      <main className="container mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold text-gaming-blue mb-8">Customer Portal</h1>
        
        <MarketplaceProvider>
          <Tabs defaultValue="orders" className="space-y-6">
            <TabsList className="bg-gaming-dark">
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="rma">RMA Requests</TabsTrigger>
              <TabsTrigger value="configurations">Saved PCs</TabsTrigger>
              <TabsTrigger value="marketplace">Seller Dashboard</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
            </TabsList>

            <TabsContent value="orders">
              <OrderHistory />
            </TabsContent>

            <TabsContent value="rma">
              <RMARequests />
            </TabsContent>
            
            <TabsContent value="configurations">
              <SavedConfigurations />
            </TabsContent>

            <TabsContent value="marketplace">
              <MarketplaceSellerDashboard />
            </TabsContent>

            <TabsContent value="account">
              <AccountSettings />
            </TabsContent>
          </Tabs>
        </MarketplaceProvider>
      </main>
      <Footer />
    </div>
  );
};

export default CustomerPortalPage;
