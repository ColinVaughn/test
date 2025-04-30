
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MarketplaceProduct } from "@/types/marketplace";
import { toast } from "sonner";
import { 
  Table, 
  TableHeader, 
  TableHead, 
  TableBody, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Loader2, Package, Check, X } from "lucide-react";

const AdminProductManager = () => {
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedProduct, setSelectedProduct] = useState<MarketplaceProduct | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('marketplace_products')
        .select(`
          *,
          seller:seller_id (
            store_name,
            logo_url
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data as MarketplaceProduct[]);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load marketplace products");
    } finally {
      setIsLoading(false);
    }
  };

  const updateProductStatus = async (productId: string, status: 'approved' | 'rejected') => {
    try {
      setIsProcessing(true);
      const { error } = await supabase
        .from('marketplace_products')
        .update({ status })
        .eq('id', productId);

      if (error) throw error;

      // Update local state
      setProducts(products.map(product => 
        product.id === productId ? { ...product, status } : product
      ));

      // If product is approved, send Discord notification
      if (status === 'approved') {
        const product = products.find(p => p.id === productId);
        
        if (product) {
          console.log("Sending Discord notification for product:", product.name);
          
          try {
            // Construct product URL
            const productUrl = `${window.location.origin}/marketplace/product/${productId}`;
            
            const response = await supabase.functions.invoke('discord-notifications', {
              body: {
                name: product.name,
                price: product.price,
                category: product.category,
                description: product.description,
                seller_name: product.seller?.store_name || 'Unknown Seller',
                status: status,
                images: product.images,
                product_url: productUrl
              }
            });
            
            console.log("Discord webhook response:", response);
          } catch (webhookError) {
            console.error("Error sending Discord notification:", webhookError);
          }
        }
      }

      toast.success(`Product ${status} successfully`);
      setIsDetailsOpen(false);
    } catch (error) {
      console.error(`Error updating product status to ${status}:`, error);
      toast.error(`Failed to ${status} product`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewDetails = (product: MarketplaceProduct) => {
    setSelectedProduct(product);
    setIsDetailsOpen(true);
  };

  const deleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product permanently?")) {
      return;
    }
    
    try {
      setIsProcessing(true);
      const { error } = await supabase
        .from('marketplace_products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      setProducts(products.filter(p => p.id !== productId));
      toast.success("Product deleted successfully");
      setIsDetailsOpen(false);
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved': return "default";
      case 'rejected': return "destructive";
      default: return "outline"; // pending
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Package className="h-5 w-5 text-gaming-blue" />
        <h3 className="text-xl font-semibold">Marketplace Products</h3>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-gaming-blue" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-8 bg-gaming-dark/30 rounded-lg">
          <p className="text-gray-400">No marketplace products found</p>
        </div>
      ) : (
        <div className="bg-gaming-dark/30 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Seller</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.seller?.store_name || 'Unknown Seller'}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(product.status)}>
                      {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleViewDetails(product)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      {/* Product Details Dialog */}
      {selectedProduct && (
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{selectedProduct.name}</DialogTitle>
              <DialogDescription>
                Product details and moderation controls
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-2">
                <p className="text-sm font-medium">Name:</p>
                <p className="col-span-3">{selectedProduct.name}</p>
              </div>
              <div className="grid grid-cols-4 items-start gap-2">
                <p className="text-sm font-medium">Description:</p>
                <p className="col-span-3">{selectedProduct.description || "No description provided"}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-2">
                <p className="text-sm font-medium">Price:</p>
                <p className="col-span-3">${selectedProduct.price.toFixed(2)}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-2">
                <p className="text-sm font-medium">Category:</p>
                <p className="col-span-3">{selectedProduct.category.charAt(0).toUpperCase() + selectedProduct.category.slice(1)}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-2">
                <p className="text-sm font-medium">Condition:</p>
                <p className="col-span-3">{selectedProduct.condition.charAt(0).toUpperCase() + selectedProduct.condition.slice(1)}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-2">
                <p className="text-sm font-medium">Stock:</p>
                <p className="col-span-3">{selectedProduct.stock_quantity}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-2">
                <p className="text-sm font-medium">Seller:</p>
                <p className="col-span-3">{selectedProduct.seller?.store_name || 'Unknown Seller'}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-2">
                <p className="text-sm font-medium">Status:</p>
                <div className="col-span-3">
                  <Badge variant={getStatusBadgeVariant(selectedProduct.status)}>
                    {selectedProduct.status.charAt(0).toUpperCase() + selectedProduct.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </div>
            
            <DialogFooter className="flex flex-col sm:flex-row gap-2 justify-between">
              <div className="flex gap-2">
                {selectedProduct.status === 'pending' && (
                  <>
                    <Button 
                      variant="default" 
                      onClick={() => updateProductStatus(selectedProduct.id, 'approved')}
                      disabled={isProcessing}
                      className="flex-1"
                    >
                      {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                      Approve
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={() => updateProductStatus(selectedProduct.id, 'rejected')}
                      disabled={isProcessing}
                      className="flex-1"
                    >
                      {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <X className="mr-2 h-4 w-4" />}
                      Reject
                    </Button>
                  </>
                )}
                {selectedProduct.status === 'rejected' && (
                  <Button 
                    variant="default" 
                    onClick={() => updateProductStatus(selectedProduct.id, 'approved')}
                    disabled={isProcessing}
                    className="flex-1"
                  >
                    {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                    Approve
                  </Button>
                )}
                {selectedProduct.status === 'approved' && (
                  <Button 
                    variant="destructive" 
                    onClick={() => updateProductStatus(selectedProduct.id, 'rejected')}
                    disabled={isProcessing}
                    className="flex-1"
                  >
                    {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <X className="mr-2 h-4 w-4" />}
                    Reject
                  </Button>
                )}
                <Button 
                  variant="destructive" 
                  onClick={() => deleteProduct(selectedProduct.id)}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  Delete
                </Button>
              </div>
              <Button variant="outline" onClick={() => setIsDetailsOpen(false)} className="sm:flex-none sm:w-auto w-full">
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminProductManager;
