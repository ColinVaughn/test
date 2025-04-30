import React, { useState, useEffect } from "react";
import { useMarketplace } from "@/hooks/use-marketplace";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ProductManagement } from "@/components/CustomerPortal/ProductManagement";
import { SellerAffiliateManager } from "@/components/CustomerPortal/ProductManagement/SellerAffiliateManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Store, MessageSquare, AlertTriangle, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import AnalyticsDashboard from "./AnalyticsDashboard";
import InventoryManagement from "./InventoryManagement";
import PromotionTools from "./PromotionTools";
import FinancialManagement from "./FinancialManagement";
import CustomerCommunication from "./CustomerCommunication";
import { SellerProfileForm } from "./SellerProfileForm";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";

export const MarketplaceSellerDashboard = () => {
  const { currentUser } = useAuth();
  const { 
    isSeller, 
    isLoading, 
    sellerProfile, 
    becomeASeller, 
    sellerProducts,
    refreshSellerStatus
  } = useMarketplace();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("messages"); // Default to messages tab
  const [wasSellerBefore, setWasSellerBefore] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  
  // Check if the user was a seller but no longer is (banned)
  useEffect(() => {
    const checkSellerHistory = async () => {
      if (!currentUser?.id) return;
      
      // If user isn't a seller but was previously trying to access seller dashboard,
      // check if they were banned
      if (!isLoading && !isSeller && localStorage.getItem('was_seller_' + currentUser.id)) {
        setWasSellerBefore(true);
        toast("Your seller account has been removed by administrators. Contact support for more information.");
      }
      
      // If user is a seller now, set the flag for future reference
      if (!isLoading && isSeller) {
        localStorage.setItem('was_seller_' + currentUser.id, 'true');
      }
    };
    
    checkSellerHistory();
  }, [currentUser?.id, isLoading, isSeller]);
  
  useEffect(() => {
    console.log("Seller dashboard - Current user:", currentUser?.id);
    console.log("Seller dashboard - Is seller:", isSeller);
    console.log("Seller dashboard - Seller profile:", sellerProfile);
    console.log("Seller dashboard - Seller products:", sellerProducts?.length);
    console.log("Seller dashboard - Active tab:", activeTab);
    console.log("Seller dashboard - Was seller before:", wasSellerBefore);
    
  }, [currentUser, isSeller, sellerProfile, sellerProducts, activeTab, wasSellerBefore]);
  
  const form = useForm({
    defaultValues: {
      store_name: "",
      description: ""
    }
  });

  // Handle manual refresh of seller status
  const handleRefreshStatus = async () => {
    try {
      setIsCheckingStatus(true);
      
      // Clear all possible storage locations
      if (currentUser?.id) {
        localStorage.removeItem('sellerProfile-' + currentUser.id);
        localStorage.removeItem('marketplace_seller');
        sessionStorage.removeItem('marketplace_seller_data');
      }
      
      // Force direct DB check
      if (currentUser?.id) {
        const { data, error } = await supabase
          .from('marketplace_sellers')
          .select('id')
          .eq('user_id', currentUser.id)
          .maybeSingle();
          
        if (error) {
          console.error("Error checking seller status:", error);
        }
        
        // If we find no data in the database, the seller has been deleted
        if (!data) {
          setWasSellerBefore(true);
          toast("Your seller account has been removed. Contact support if you believe this is a mistake.", {
            icon: <AlertTriangle className="h-4 w-4 text-red-500" />
          });
        }
      }
      
      // Refresh from the context
      refreshSellerStatus();
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const onSubmit = async (values: { store_name: string; description: string }) => {
    try {
      setIsSubmitting(true);
      // Generate a store slug from the store name
      const storeSlug = values.store_name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      await becomeASeller({
        store_name: values.store_name,
        description: values.description,
        logo_url: null,
        store_slug: storeSlug,
        social_links: {},
        about_text: "",
        return_policy: "",
        buyer_protection_policy: ""
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentUser) {
    return (
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="text-center py-6">
            <p>Please sign in to access the marketplace seller dashboard.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="text-center py-6">
            <p>Loading...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // If the user was previously a seller but now isn't, show banned message
  if (wasSellerBefore && !isSeller) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center text-red-500">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Seller Account Removed
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Access Revoked</AlertTitle>
            <AlertDescription>
              Your marketplace seller account has been removed by administrators.
              If you believe this was done in error, please contact our support team.
            </AlertDescription>
          </Alert>
          
          <div className="flex justify-between mt-4">
            <Button 
              variant="outline" 
              onClick={handleRefreshStatus}
              disabled={isCheckingStatus}
            >
              {isCheckingStatus ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
              Check Status Again
            </Button>
            
            <Link to="/support">
              <Button>Contact Support</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isSeller) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Store className="mr-2 h-5 w-5" />
            Become a Marketplace Seller
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="mb-4">
            Start selling your computer parts on our marketplace. Set up your store profile below:
          </p>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="store_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Store Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Your Store Name" />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Tell customers about your store and what you sell..." 
                        rows={4}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <div className="flex justify-between items-center mt-6">
                <p className="text-sm text-gray-400">
                  By becoming a seller, you agree to our{" "}
                  <Link to="/terms" className="text-blue-400 hover:underline">
                    seller terms
                  </Link>
                  .
                </p>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Seller Account"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Store className="mr-2 h-5 w-5" />
              Seller Dashboard
            </CardTitle>
            <Badge variant={sellerProfile?.approved ? "default" : "outline"}>
              {sellerProfile?.approved ? "Approved" : "Pending Approval"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Store Name</Label>
              <p className="text-lg font-medium">{sellerProfile?.store_name}</p>
            </div>
            
            <div>
              <Label>Description</Label>
              <p>{sellerProfile?.description || "No description provided."}</p>
            </div>
            
            <div>
              <Label>Commission Rate</Label>
              <p>{sellerProfile?.commission_rate}%</p>
              <p className="text-xs text-gray-400 mt-1">
                3% for payment processing, 2% platform fee
              </p>
            </div>
            
            <div className="flex justify-between pt-4">
              <Button 
                variant="outline" 
                onClick={handleRefreshStatus} 
                className="flex items-center gap-1"
                disabled={isCheckingStatus}
              >
                {isCheckingStatus ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                Refresh Status
              </Button>
              <div className="flex gap-2">
                <Link to="/marketplace/seller/edit">
                  <Button variant="outline">Edit Profile</Button>
                </Link>
                <Link to="/marketplace/seller/sales">
                  <Button>View Sales</Button>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex-wrap mb-4">
          <TabsTrigger value="messages" className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>Messages</span>
          </TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="promotions">Promotions</TabsTrigger>
          <TabsTrigger value="finances">Finances</TabsTrigger>
          <TabsTrigger value="affiliates">Affiliates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          {sellerProfile && <SellerProfileForm seller={sellerProfile} />}
        </TabsContent>
        
        <TabsContent value="messages">
          {sellerProfile?.id ? (
            <CustomerCommunication sellerId={sellerProfile.id} />
          ) : (
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-6">
                  <p>Seller profile not fully loaded. Unable to load messages.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="products">
          <ProductManagement />
        </TabsContent>
        
        <TabsContent value="analytics">
          <AnalyticsDashboard sellerId={sellerProfile?.id || ""} />
        </TabsContent>
        
        <TabsContent value="inventory">
          <InventoryManagement sellerId={sellerProfile?.id || ""} />
        </TabsContent>

        <TabsContent value="promotions">
          <PromotionTools sellerId={sellerProfile?.id || ""} />
        </TabsContent>

        <TabsContent value="finances">
          <FinancialManagement sellerId={sellerProfile?.id || ""} />
        </TabsContent>

        <TabsContent value="affiliates">
          <SellerAffiliateManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};
