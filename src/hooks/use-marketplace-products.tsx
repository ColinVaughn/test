
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MarketplaceProduct } from "@/types/marketplace";
import { toast } from "sonner";

export function useMarketplaceProducts(sellerId: string | null) {
  const [isLoading, setIsLoading] = useState(false);
  const [sellerProducts, setSellerProducts] = useState<MarketplaceProduct[]>([]);

  // Fetch products whenever sellerId changes
  useEffect(() => {
    if (sellerId) {
      fetchSellerProducts();
    }
  }, [sellerId]);

  const fetchSellerProducts = async () => {
    if (!sellerId) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('marketplace_products')
        .select('*')
        .eq('seller_id', sellerId);

      if (error) throw error;
      
      setSellerProducts(data as MarketplaceProduct[]);
    } catch (error) {
      console.error("Error fetching seller products:", error);
      toast.error("Failed to load your products");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProductsForSale = async () => {
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
      
      return data as MarketplaceProduct[];
    } catch (error) {
      console.error("Error fetching marketplace products:", error);
      toast.error("Failed to load products");
      return [];
    }
  };

  const addProduct = async (product: Omit<MarketplaceProduct, 'id' | 'seller_id' | 'status' | 'created_at' | 'updated_at'>) => {
    if (!sellerId) {
      toast.error("You must have a seller profile to add products");
      return null;
    }

    try {
      setIsLoading(true);
      
      // Create a valid product object for insertion
      const productToInsert = {
        ...product,
        seller_id: sellerId,
        status: 'pending',
        // Make sure shipping data is properly structured
        shipping: product.shipping || {}
      };
      
      // Log the product being inserted to help with debugging
      console.log("Product being inserted:", productToInsert);
      console.log("Shipping details:", productToInsert.shipping);
      
      const { data, error } = await supabase
        .from('marketplace_products')
        .insert(productToInsert)
        .select()
        .single();

      if (error) {
        console.error("Database error details:", error);
        throw error;
      }

      const newProduct = data as MarketplaceProduct;
      setSellerProducts([...sellerProducts, newProduct]);
      toast.success("Product added successfully! It's pending approval.");
      return newProduct;
    } catch (error: any) {
      console.error("Error adding product:", error);
      toast.error(`Failed to add product: ${error.message}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProduct = async (id: string, updates: Partial<MarketplaceProduct>) => {
    try {
      setIsLoading(true);
      
      // Log the updates being applied to help with debugging
      console.log("Updating product with ID:", id);
      console.log("Updates to apply:", updates);
      
      // Ensure shipping info is properly structured
      if (updates.shipping) {
        console.log("Shipping updates:", updates.shipping);
      }
      
      const { error } = await supabase
        .from('marketplace_products')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error("Database error details:", error);
        throw error;
      }

      // Update local state
      const updatedProducts = sellerProducts.map(product => 
        product.id === id ? { ...product, ...updates } : product
      );
      setSellerProducts(updatedProducts);
      
      toast.success("Product updated successfully");
    } catch (error: any) {
      console.error("Error updating product:", error);
      toast.error(`Failed to update product: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('marketplace_products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSellerProducts(sellerProducts.filter(product => product.id !== id));
      toast.success("Product deleted successfully");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    sellerProducts,
    fetchSellerProducts,
    fetchProductsForSale,
    addProduct,
    updateProduct,
    deleteProduct,
  };
}
