import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MarketplaceProductGrid } from "@/components/Marketplace/MarketplaceProductGrid";
import { MarketplaceFilters } from "@/components/Marketplace/MarketplaceFilters";
import { MarketplaceHero } from "@/components/Marketplace/MarketplaceHero";
import { MarketplaceProvider } from "@/hooks/use-marketplace";
import { MarketplaceProduct, ProductCategory } from "@/types/marketplace";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MarketplaceAdBanner } from "@/components/Marketplace/MarketplaceAdBanner";

const MarketplacePage = () => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: products = [], isLoading, error, refetch } = useQuery({
    queryKey: ['marketplaceProducts'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('marketplace_products')
          .select(`
            *,
            seller:seller_id (
              store_name,
              logo_url
            )
          `)
          .eq('status', 'approved')
          .order('featured', { ascending: false })
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data as MarketplaceProduct[] || [];
      } catch (err) {
        console.error("Error fetching marketplace products:", err);
        throw err;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
    retryDelay: 1000
  });

  useEffect(() => {
    if (error) {
      toast.error("Failed to load marketplace products", {
        action: {
          label: "Retry",
          onClick: () => refetch()
        }
      });
    }
  }, [error, refetch]);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesSearch = searchQuery === "" || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (product.description?.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesPrice && matchesSearch;
  });

  return (
    <MarketplaceProvider>
      <div className="min-h-screen bg-gaming-darker flex flex-col">
        <Header />
        <main className="flex-grow">
          <MarketplaceHero />
          
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gaming-blue mb-6">PC Parts Marketplace</h1>
            
            <MarketplaceAdBanner />
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-64">
                <MarketplaceFilters
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
              </div>
              
              <div className="flex-1">
                <MarketplaceProductGrid 
                  products={filteredProducts} 
                  isLoading={isLoading} 
                />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </MarketplaceProvider>
  );
};

export default MarketplacePage;
