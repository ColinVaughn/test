import React, { useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MarketplaceProvider } from "@/hooks/use-marketplace";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MarketplaceProduct } from "@/types/marketplace";
import { ShoppingCart, Package, Store, AlertCircle, ChevronLeft, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/hooks/use-cart";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { SellerProfileCard } from "@/components/Marketplace/SellerProfileCard";
import { SellerReviews } from "@/components/Marketplace/SellerReviews";
import { SellerReview } from '@/types/rpcFunctions';

const MarketplaceProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [contactMessage, setContactMessage] = useState("");
  const [contactSubject, setContactSubject] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { currentUser } = useAuth();
  const { addItem } = useCart();

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['marketplaceProduct', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketplace_products')
        .select(`
          *,
          seller:seller_id (
            store_name,
            logo_url,
            description,
            id,
            store_slug,
            return_policy,
            buyer_protection_policy
          )
        `)
        .eq('id', id as string)
        .eq('status', 'approved')
        .single();

      if (error) throw error;
      return data as MarketplaceProduct;
    },
    enabled: !!id,
  });

  const { data: reviews } = useQuery({
    queryKey: ['sellerReviews', product?.seller?.id],
    queryFn: async () => {
      if (!product?.seller?.id) return [];
      
      try {
        // Cast supabase to CustomSupabaseClient with proper RPC typing
        const { data, error } = await (supabase as any).rpc(
          'get_seller_reviews', 
          {
            p_seller_id: product.seller.id,
            p_status: 'approved'
          }
        );
        
        if (error) throw error;
        return (data as unknown) as SellerReview[];
      } catch (error) {
        console.error("Error fetching seller reviews:", error);
        toast.error("Failed to load reviews");
        return [];
      }
    },
    enabled: !!product?.seller?.id
  });

  const handleSubmitMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contactMessage.trim()) {
      toast.error("Please enter a message");
      return;
    }
    
    if (!contactSubject.trim()) {
      toast.error("Please enter a subject");
      return;
    }
    
    if (!product?.seller?.id) {
      toast.error("Seller information not available");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .from('marketplace_customer_messages')
        .insert([
          {
            seller_id: product.seller.id,
            subject: contactSubject,
            message: contactMessage,
            customer_email: currentUser?.email,
            status: 'unread',
            order_id: null,
            product_name: product.name,
            customer_id: currentUser?.id
          }
        ]);
        
      if (error) throw error;
      
      toast.success("Message sent to seller!");
      setContactMessage("");
      setContactSubject("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    const shippingDetails = {
      dimensions: product.specs?.dimensions || 'Not specified',
      weight: product.specs?.weight || 'Not specified'
    };

    addItem({
      product_id: product.id,
      product_name: product.name,
      price: product.price,
      quantity: 1,
      product_type: 'marketplace',
      details: {
        specs: product.specs,
        description: product.description,
        imageUrl: product.images && product.images.length > 0 ? product.images[0] : "/placeholder.svg",
        seller: product.seller?.store_name || "Unknown Seller",
        condition: product.condition,
        shipping: {
          ...shippingDetails,
          insuranceCoverage: 100
        }
      }
    }).catch(error => {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart");
    });
  };

  if (isLoading) {
    return (
      <MarketplaceProvider>
        <div className="min-h-screen bg-gaming-darker flex flex-col">
          <Header />
          <main className="flex-grow container mx-auto py-8 px-4">
            <div className="flex items-center justify-center h-96">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-12 w-64 bg-gaming-dark/60 rounded mb-4"></div>
                <div className="h-6 w-32 bg-gaming-dark/60 rounded"></div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </MarketplaceProvider>
    );
  }

  if (error || !product) {
    return (
      <MarketplaceProvider>
        <div className="min-h-screen bg-gaming-darker flex flex-col">
          <Header />
          <main className="flex-grow container mx-auto py-8 px-4">
            <div className="bg-gaming-dark/30 rounded-lg p-6 text-center">
              <AlertCircle className="h-16 w-16 mx-auto text-red-500 mb-4" />
              <h2 className="text-xl font-bold mb-2">Product Not Found</h2>
              <p className="text-gray-400 mb-6">
                The product you are looking for may have been removed or is not available.
              </p>
              <Link to="/marketplace">
                <Button>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back to Marketplace
                </Button>
              </Link>
            </div>
          </main>
          <Footer />
        </div>
      </MarketplaceProvider>
    );
  }

  return (
    <MarketplaceProvider>
      <div className="min-h-screen bg-gaming-darker flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto py-8 px-4">
          <div className="mb-6">
            <Link to="/marketplace" className="text-gaming-blue hover:underline flex items-center">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Marketplace
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="bg-gaming-dark/20 rounded-lg overflow-hidden aspect-square flex items-center justify-center">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[currentImageIndex]}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <Package className="h-32 w-32 text-gray-500" />
                )}
              </div>

              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      className={`flex-shrink-0 w-20 h-20 rounded overflow-hidden border-2 ${
                        idx === currentImageIndex ? "border-gaming-blue" : "border-transparent"
                      }`}
                      onClick={() => setCurrentImageIndex(idx)}
                    >
                      <img src={img} alt={`Product image ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant={product.condition === 'new' ? 'default' : 
                           product.condition === 'used' ? 'secondary' : 'outline'}>
                    {product.condition.charAt(0).toUpperCase() + product.condition.slice(1)}
                  </Badge>
                  <Badge variant="outline">{product.category}</Badge>
                </div>
                <div className="text-2xl font-bold text-gaming-blue mb-6">
                  {formatCurrency(product.price)}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={product.stock_quantity === 0}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {product.stock_quantity > 0 ? "Add to Cart" : "Out of Stock"}
                </Button>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="lg" className="flex-1">
                      <MessageSquare className="mr-2 h-5 w-5" />
                      Contact Seller
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Contact {product.seller?.store_name || "Seller"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmitMessage} className="space-y-4 pt-4">
                      {!currentUser && (
                        <div className="bg-amber-500/20 text-amber-300 p-3 rounded border border-amber-500/30 mb-4 text-sm">
                          Please sign in to contact the seller
                        </div>
                      )}
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input 
                          id="subject" 
                          value={contactSubject} 
                          onChange={(e) => setContactSubject(e.target.value)} 
                          placeholder="Question about product" 
                          required 
                          disabled={!currentUser || isSubmitting}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea 
                          id="message" 
                          value={contactMessage} 
                          onChange={(e) => setContactMessage(e.target.value)} 
                          placeholder="Your message to the seller..." 
                          rows={5} 
                          required 
                          disabled={!currentUser || isSubmitting}
                        />
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline" type="button">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={!currentUser || isSubmitting}>
                          {isSubmitting ? "Sending..." : "Send Message"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="pt-4">
                <h3 className="text-lg font-medium mb-2">Availability:</h3>
                <p className="text-gray-300">
                  {product.stock_quantity > 10
                    ? "In Stock"
                    : product.stock_quantity > 0
                    ? `Only ${product.stock_quantity} left in stock`
                    : "Out of Stock"}
                </p>
              </div>

              {product.seller && (
                <SellerProfileCard 
                  seller={{
                    ...product.seller,
                    id: product.seller.id || '',
                    user_id: '',
                    approved: true,
                    commission_rate: 0,
                    created_at: '',
                    updated_at: '',
                    store_slug: product.seller.store_slug || '',
                  }}
                />
              )}
            </div>
          </div>

          <div className="mt-12 grid md:grid-cols-2 gap-8">
            <div>
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="w-full justify-start bg-gaming-dark/30 mb-8">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="specifications">Specifications</TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="text-gray-300">
                  <div className="bg-gaming-dark/20 p-6 rounded-lg">
                    {product.description ? (
                      <p className="whitespace-pre-line">{product.description}</p>
                    ) : (
                      <p className="text-gray-400">No description provided for this product.</p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="specifications">
                  <div className="bg-gaming-dark/20 p-6 rounded-lg">
                    {product.specs && Object.keys(product.specs).length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(product.specs).map(([key, value]) => (
                          <div key={key} className="flex justify-between py-2 border-b border-gaming-dark/50">
                            <span className="font-medium">{key}:</span>
                            <span className="text-gray-300">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400">No specifications available for this product.</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            <div>
              {reviews && <SellerReviews reviews={reviews as SellerReview[]} />}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </MarketplaceProvider>
  );
};

export default MarketplaceProductPage;
