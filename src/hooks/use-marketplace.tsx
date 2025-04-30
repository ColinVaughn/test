
import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useMarketplaceSeller } from "./use-marketplace-seller";
import { useMarketplaceProducts } from "./use-marketplace-products";
import { useMarketplaceMessages } from "./useMarketplaceMessages";
import { useMarketplaceAffiliates } from "./useMarketplaceAffiliates";
import { useMarketplaceReviews } from "./useMarketplaceReviews";
import { MarketplaceProduct, MarketplaceSeller, CustomerMessage, SellerAffiliateProgram } from "@/types/marketplace";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { SellerReview } from "@/types/rpcFunctions";

interface MarketplaceContextType {
  isSeller: boolean;
  isLoading: boolean;
  sellerProfile: MarketplaceSeller | null;
  becomeASeller: (storeInfo: Omit<MarketplaceSeller, 'id' | 'user_id' | 'approved' | 'created_at' | 'updated_at' | 'commission_rate' | 'stripe_connect_id'>) => Promise<void>;
  updateSellerProfile: (data: Partial<MarketplaceSeller>) => Promise<void>;
  fetchProductsForSale: () => Promise<MarketplaceProduct[]>;
  addProduct: (product: Omit<MarketplaceProduct, 'id' | 'seller_id' | 'status' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<MarketplaceProduct>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  sellerProducts: MarketplaceProduct[];
  fetchSellerOrders: () => Promise<void>;
  fetchSellerProducts: () => Promise<void>;
  fetchSellerMessages: (sellerId: string) => Promise<CustomerMessage[]>;
  sendMessageReply: (messageId: string, sellerId: string, reply: string) => Promise<void>;
  fetchAffiliatesByPerformance: () => Promise<SellerAffiliateProgram[]>;
  createAffiliateProgram: (programData: Partial<SellerAffiliateProgram>) => Promise<void>;
  updateAffiliateProgram: (id: string, updates: Partial<SellerAffiliateProgram>) => Promise<void>;
  fetchSellerReviews: (sellerId: string) => Promise<SellerReview[]>;
  refreshSellerStatus: () => void;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export function MarketplaceProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  const [isForceRefreshing, setIsForceRefreshing] = useState(false);
  
  const {
    isSeller,
    isLoading: sellerLoading,
    sellerProfile,
    becomeASeller,
    updateSellerProfile,
    forceRefreshSellerStatus
  } = useMarketplaceSeller();

  const {
    isLoading: productsLoading,
    sellerProducts,
    fetchSellerProducts,
    fetchProductsForSale,
    addProduct: addProductOriginal,
    updateProduct: updateProductOriginal,
    deleteProduct,
  } = useMarketplaceProducts(sellerProfile?.id || null);

  const {
    fetchSellerMessages,
    sendMessageReply
  } = useMarketplaceMessages();

  const {
    fetchAffiliatesByPerformance,
    createAffiliateProgram,
    updateAffiliateProgram
  } = useMarketplaceAffiliates();

  const {
    fetchSellerReviews
  } = useMarketplaceReviews();

  useEffect(() => {
    const verifySellerExists = async () => {
      if (!currentUser?.id || !isSeller || !sellerProfile) return;
      
      try {
        setIsForceRefreshing(true);
        const { data, error } = await supabase
          .from('marketplace_sellers')
          .select('id')
          .eq('id', sellerProfile.id)
          .single();
          
        if (error || !data) {
          console.log("Seller no longer exists, forcing refresh");
          forceRefreshSellerStatus();
        }
      } catch (err) {
        console.error("Error verifying seller exists:", err);
      } finally {
        setIsForceRefreshing(false);
      }
    };
    
    verifySellerExists();
  }, [currentUser?.id, isSeller, sellerProfile]);

  const addProduct = async (product: Omit<MarketplaceProduct, 'id' | 'seller_id' | 'status' | 'created_at' | 'updated_at'>) => {
    if (!sellerProfile?.id) {
      toast.error("You must have a seller profile to add products");
      return;
    }

    try {
      const newProduct = await addProductOriginal(product);
      return;
    } catch (error: any) {
      console.error("Error adding product:", error);
      toast.error(`Failed to add product: ${error.message}`);
    }
  };

  const updateProduct = async (id: string, updates: Partial<MarketplaceProduct>) => {
    try {
      if (updates.status === 'approved') {
        const productData = sellerProducts.find(p => p.id === id);
        if (productData) {
          try {
            await supabase.functions.invoke('discord-notifications', {
              body: {
                name: productData.name,
                price: productData.price,
                category: productData.category,
                description: productData.description,
                seller_name: sellerProfile?.store_name,
                status: updates.status,
                images: productData.images,
                product_url: `${window.location.origin}/marketplace/product/${id}`
              }
            });
          } catch (webhookError) {
            console.error("Error sending Discord notification:", webhookError);
          }
        }
      }

      await updateProductOriginal(id, updates);
    } catch (error: any) {
      console.error("Error updating product:", error);
      toast.error(`Failed to update product: ${error.message}`);
    }
  };

  const fetchSellerOrders = async () => {
    if (!sellerProfile?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('marketplace_orders')
        .select(`
          *,
          product:product_id (
            name,
            images,
            category
          ),
          marketplace_shipping_deadlines (
            deadline
          )
        `)
        .eq('seller_id', sellerProfile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return;
    } catch (error) {
      console.error("Error fetching seller orders:", error);
      toast.error("Failed to load orders");
    }
  };
  
  const refreshSellerStatus = () => {
    forceRefreshSellerStatus();
  };

  return (
    <MarketplaceContext.Provider
      value={{
        isSeller,
        isLoading: sellerLoading || productsLoading || isForceRefreshing,
        sellerProfile,
        becomeASeller,
        updateSellerProfile,
        fetchProductsForSale,
        addProduct,
        updateProduct,
        deleteProduct,
        sellerProducts,
        fetchSellerOrders,
        fetchSellerProducts,
        fetchSellerMessages,
        sendMessageReply,
        fetchAffiliatesByPerformance,
        createAffiliateProgram,
        updateAffiliateProgram,
        fetchSellerReviews,
        refreshSellerStatus
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  const context = useContext(MarketplaceContext);
  if (context === undefined) {
    throw new Error("useMarketplace must be used within a MarketplaceProvider");
  }
  return context;
}
