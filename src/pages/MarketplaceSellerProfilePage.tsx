
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MarketplaceSeller, SellerReview } from "@/types/marketplace";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Store, Shield, ArrowLeft, Globe, Twitter, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import { MarketplaceProductGrid } from "@/components/Marketplace/MarketplaceProductGrid";
import { Separator } from "@/components/ui/separator";

const MarketplaceSellerProfilePage = () => {
  const { slug } = useParams();
  const [seller, setSeller] = useState<MarketplaceSeller | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const { data, error } = await supabase
          .from('marketplace_sellers')
          .select('*')
          .eq('store_slug', slug)
          .single();

        if (error) throw error;
        setSeller(data as MarketplaceSeller);
      } catch (error) {
        console.error("Error fetching seller:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchSeller();
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gaming-darker flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto py-8 px-4">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-gaming-blue" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="min-h-screen bg-gaming-darker flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto py-8 px-4">
          <Card>
            <CardContent className="p-6 text-center">
              <h2 className="text-2xl font-bold mb-4">Store Not Found</h2>
              <p className="mb-4">The store you're looking for doesn't exist or has been removed.</p>
              <Link to="/marketplace">
                <Button>Back to Marketplace</Button>
              </Link>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gaming-darker flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="mb-6">
          <Link to="/marketplace" className="text-gaming-blue hover:underline flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Marketplace
          </Link>
        </div>

        {seller.banner_url && (
          <div className="w-full h-48 md:h-64 rounded-lg overflow-hidden mb-6">
            <img
              src={seller.banner_url}
              alt={`${seller.store_name} banner`}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold flex items-center">
                      <Store className="mr-2 h-6 w-6 text-gaming-blue" />
                      {seller.store_name}
                    </h1>
                    {seller.description && (
                      <p className="text-gray-400 mt-2">{seller.description}</p>
                    )}
                  </div>
                  {seller.logo_url && (
                    <img
                      src={seller.logo_url}
                      alt={`${seller.store_name} logo`}
                      className="w-16 h-16 rounded-lg"
                    />
                  )}
                </div>

                {seller.social_links && Object.keys(seller.social_links).length > 0 && (
                  <div className="flex gap-4 mt-4">
                    {seller.social_links.website && (
                      <a
                        href={seller.social_links.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gaming-blue hover:text-gaming-blue/80"
                      >
                        <Globe className="h-5 w-5" />
                      </a>
                    )}
                    {seller.social_links.twitter && (
                      <a
                        href={seller.social_links.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gaming-blue hover:text-gaming-blue/80"
                      >
                        <Twitter className="h-5 w-5" />
                      </a>
                    )}
                    {seller.social_links.instagram && (
                      <a
                        href={seller.social_links.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gaming-blue hover:text-gaming-blue/80"
                      >
                        <Instagram className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                )}

                {seller.about_text && (
                  <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-3">About Us</h2>
                    <p className="whitespace-pre-wrap">{seller.about_text}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-gaming-blue" />
                  Buyer Protection & Policies
                </h2>

                {seller.buyer_protection_policy && (
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Buyer Protection</h3>
                    <p className="text-gray-400 whitespace-pre-wrap">
                      {seller.buyer_protection_policy}
                    </p>
                  </div>
                )}

                {seller.return_policy && (
                  <>
                    <Separator className="my-4" />
                    <div>
                      <h3 className="font-medium mb-2">Return Policy</h3>
                      <p className="text-gray-400 whitespace-pre-wrap">
                        {seller.return_policy}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Store Info</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400">Member since</p>
                    <p>{new Date(seller.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6">Products from this seller</h2>
          <MarketplaceProductGrid sellerId={seller.id} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MarketplaceSellerProfilePage;
