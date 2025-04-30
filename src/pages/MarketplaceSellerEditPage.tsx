
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useMarketplace } from "@/hooks/use-marketplace";
import { MarketplaceProvider } from "@/hooks/use-marketplace";
import { Store, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

type SellerFormValues = {
  store_name: string;
  description: string;
  about_text: string;
  return_policy: string;
  buyer_protection_policy: string;
  social_links: {
    website: string;
    twitter: string;
    instagram: string;
  };
  logo_url: string;
  banner_url: string;
};

const MarketplaceSellerEditPage = () => {
  const { currentUser } = useAuth();
  const { isLoading, sellerProfile, updateSellerProfile } = useMarketplace();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SellerFormValues>({
    defaultValues: {
      store_name: sellerProfile?.store_name || "",
      description: sellerProfile?.description || "",
      about_text: sellerProfile?.about_text || "",
      return_policy: sellerProfile?.return_policy || "",
      buyer_protection_policy: sellerProfile?.buyer_protection_policy || "",
      social_links: {
        website: sellerProfile?.social_links?.website || "",
        twitter: sellerProfile?.social_links?.twitter || "",
        instagram: sellerProfile?.social_links?.instagram || ""
      },
      logo_url: sellerProfile?.logo_url || "",
      banner_url: sellerProfile?.banner_url || ""
    }
  });

  const onSubmit = async (values: SellerFormValues) => {
    if (!sellerProfile) return;

    try {
      setIsSubmitting(true);
      
      // Create social links object with only non-empty values
      const socialLinks: Record<string, string> = {};
      if (values.social_links.website) socialLinks.website = values.social_links.website;
      if (values.social_links.twitter) socialLinks.twitter = values.social_links.twitter;
      if (values.social_links.instagram) socialLinks.instagram = values.social_links.instagram;
      
      await updateSellerProfile({
        store_name: values.store_name,
        description: values.description,
        about_text: values.about_text,
        return_policy: values.return_policy,
        buyer_protection_policy: values.buyer_protection_policy,
        social_links: socialLinks,
        logo_url: values.logo_url,
        banner_url: values.banner_url
      });
      
      toast.success("Seller profile updated successfully");
    } catch (error) {
      console.error("Error updating seller profile:", error);
      toast.error("Failed to update seller profile");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Redirect if not logged in
  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <MarketplaceProvider>
      <div className="min-h-screen bg-gaming-darker flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto py-8 px-4">
          <div className="mb-6">
            <Link to="/account" className="text-gaming-blue hover:underline flex items-center">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Seller Dashboard
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Store className="mr-2 h-5 w-5" />
                Edit Seller Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-gaming-blue" />
                </div>
              ) : !sellerProfile ? (
                <div className="text-center py-6">
                  <p className="mb-4">You don't have a seller profile yet.</p>
                  <Link to="/marketplace/sell">
                    <Button>Become a Seller</Button>
                  </Link>
                </div>
              ) : (
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Store Name</label>
                    <Input
                      {...form.register("store_name")}
                      defaultValue={sellerProfile.store_name}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      {...form.register("description")}
                      defaultValue={sellerProfile.description || ""}
                      rows={3}
                      placeholder="Short description of your store that appears in listings..."
                    />
                    <p className="text-xs text-gray-400">
                      This short description will be displayed on your product listings.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">About</label>
                    <Textarea
                      {...form.register("about_text")}
                      defaultValue={sellerProfile.about_text || ""}
                      rows={6}
                      placeholder="Tell customers about your business..."
                    />
                    <p className="text-xs text-gray-400">
                      Tell customers about your business, experience, what you sell, and why they should trust you.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Return Policy</label>
                    <Textarea
                      {...form.register("return_policy")}
                      defaultValue={sellerProfile.return_policy || ""}
                      rows={4}
                      placeholder="Your store's return policy..."
                    />
                    <p className="text-xs text-gray-400">
                      Describe your return policy for customers. Be clear about timeframes, conditions, and processes.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Buyer Protection Policy</label>
                    <Textarea
                      {...form.register("buyer_protection_policy")}
                      defaultValue={sellerProfile.buyer_protection_policy || "Buyers are eligible for a full refund if the item never arrived, is damaged, or doesn't match the listing description within 48 hours of delivery."}
                      rows={4}
                      placeholder="Your buyer protection policy..."
                    />
                    <p className="text-xs text-red-400">
                      Note: This does not override the platform's standard buyer protection policy.
                    </p>
                  </div>
                  
                  <div className="pt-2">
                    <h3 className="text-lg font-medium mb-4">Social Links</h3>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Website</label>
                        <Input
                          {...form.register("social_links.website")}
                          defaultValue={sellerProfile.social_links?.website || ""}
                          placeholder="https://yourwebsite.com"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Twitter</label>
                        <Input
                          {...form.register("social_links.twitter")}
                          defaultValue={sellerProfile.social_links?.twitter || ""}
                          placeholder="https://twitter.com/yourusername"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Instagram</label>
                        <Input
                          {...form.register("social_links.instagram")}
                          defaultValue={sellerProfile.social_links?.instagram || ""}
                          placeholder="https://instagram.com/yourusername"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <h3 className="text-lg font-medium mb-4">Profile Images</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Logo URL</label>
                        <Input
                          {...form.register("logo_url")}
                          defaultValue={sellerProfile.logo_url || ""}
                          placeholder="https://example.com/your-logo.png"
                        />
                        <p className="text-xs text-gray-400">
                          Your store logo (recommended size: 200x200)
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Banner URL</label>
                        <Input
                          {...form.register("banner_url")}
                          defaultValue={sellerProfile.banner_url || ""}
                          placeholder="https://example.com/your-banner.png"
                        />
                        <p className="text-xs text-gray-400">
                          Your store banner (recommended size: 1200x300)
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    </MarketplaceProvider>
  );
};

export default MarketplaceSellerEditPage;
