
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
import { Store, ShoppingBag, Settings, Shield } from "lucide-react";
import { Link } from "react-router-dom";

export const MarketplaceSellerDashboard = () => {
  const { currentUser } = useAuth();
  const { isSeller, isLoading, sellerProfile, becomeASeller, sellerProducts } = useMarketplace();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("products");
  
  useEffect(() => {
    console.log("Seller dashboard - Current user:", currentUser?.id);
    console.log("Seller dashboard - Is seller:", isSeller);
    console.log("Seller dashboard - Seller profile:", sellerProfile);
    console.log("Seller dashboard - Seller products:", sellerProducts?.length);
  }, [currentUser, isSeller, sellerProfile, sellerProducts]);
  
  const form = useForm({
    defaultValues: {
      store_name: "",
      description: ""
    }
  });

  const onSubmit = async (values: { store_name: string; description: string }) => {
    try {
      setIsSubmitting(true);
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
        buyer_protection_policy: "Buyers are eligible for a full refund if the item never arrived, is damaged, or doesn't match the listing description within 48 hours of delivery."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getBuyerProtectionNotice = () => {
    return (
      <div className="mt-2 bg-blue-950/30 p-3 rounded-md border border-blue-800 text-sm">
        <div className="flex items-start">
          <Shield className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium mb-1">Platform Buyer Protection Policy</p>
            <p className="text-gray-400">
              All sellers must adhere to our platform's Buyer Protection Policy. Buyers are eligible for a full refund 
              if the item <strong>never arrived</strong>, is <strong>damaged</strong>, or <strong>doesn't match the listing description</strong> within <strong>48 hours of delivery</strong>.
            </p>
          </div>
        </div>
      </div>
    );
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
              
              {getBuyerProtectionNotice()}
              
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
              <div>
                <Link to="/marketplace/seller/edit">
                  <Button variant="outline" className="mr-2">
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </Link>
                <Link to={`/marketplace/seller/${sellerProfile?.store_slug || sellerProfile?.id}`}>
                  <Button variant="outline">
                    <Store className="h-4 w-4 mr-2" />
                    View Store
                  </Button>
                </Link>
              </div>
              <Link to="/marketplace/seller/sales">
                <Button>
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  View Sales
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="affiliates">Affiliate Programs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products">
          <ProductManagement />
        </TabsContent>
        
        <TabsContent value="affiliates">
          <SellerAffiliateManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};
