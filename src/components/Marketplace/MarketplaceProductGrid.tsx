
import React, { useState, useEffect } from "react";
import { MarketplaceProductCard } from "@/components/Marketplace/MarketplaceProductCard";
import { MarketplaceProduct } from "@/types/marketplace";
import { Loader } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface MarketplaceProductGridProps {
  products?: MarketplaceProduct[];
  isLoading?: boolean;
  sellerId?: string;
  category?: string;
}

export const MarketplaceProductGrid = ({ products: propProducts, isLoading: propIsLoading, sellerId, category }: MarketplaceProductGridProps) => {
  const [products, setProducts] = useState<MarketplaceProduct[]>(propProducts || []);
  const [isLoading, setIsLoading] = useState<boolean>(propIsLoading !== undefined ? propIsLoading : true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Update local state when prop products change
    if (propProducts) {
      setProducts(propProducts);
      setIsLoading(false);
      return;
    }
    
    // Only fetch products if they aren't provided as props
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        let query = supabase
          .from('marketplace_products')
          .select(`
            *,
            seller:seller_id (
              store_name,
              logo_url,
              id,
              description
            )
          `)
          .eq('status', 'approved');
          
        if (sellerId) {
          query = query.eq('seller_id', sellerId);
        }
        
        if (category && category !== 'all') {
          query = query.eq('category', category);
        }
        
        const { data, error } = await query
          .order('featured', { ascending: false })
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        // Add a slight delay to ensure UI updates properly
        setTimeout(() => {
          setProducts(data as MarketplaceProduct[] || []);
          setIsLoading(false);
        }, 100);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please try again.");
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, [propProducts, sellerId, category]);
  
  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader className="h-8 w-8 animate-spin text-gaming-blue" />
          <p className="mt-2 text-gray-400">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-gaming-dark/20 rounded-lg">
        <div className="text-center">
          <p className="text-xl text-red-500 mb-2">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gaming-blue text-white rounded-md hover:bg-gaming-blue/80 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-gaming-dark/20 rounded-lg">
        <div className="text-center">
          <p className="text-xl text-gray-400">No products found</p>
          <p className="text-gray-500 mt-2">Try adjusting your filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <MarketplaceProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
