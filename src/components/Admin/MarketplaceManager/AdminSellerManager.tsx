
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MarketplaceSeller } from "@/types/marketplace";
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
import { Loader2, Store } from "lucide-react";

const AdminSellerManager = () => {
  const [sellers, setSellers] = useState<MarketplaceSeller[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedSeller, setSelectedSeller] = useState<MarketplaceSeller | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('marketplace_sellers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSellers(data as MarketplaceSeller[]);
    } catch (error) {
      console.error("Error fetching sellers:", error);
      toast.error("Failed to load marketplace sellers");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSeller = async (sellerId: string) => {
    try {
      setIsProcessing(true);
      
      // Delete marketplace products first to avoid foreign key constraints
      const { error: productsError } = await supabase
        .from('marketplace_products')
        .delete()
        .eq('seller_id', sellerId);
        
      if (productsError) {
        console.error("Error deleting seller products:", productsError);
        // Continue with seller deletion even if products fail
      }
      
      // Delete any seller affiliate programs
      const { error: affiliatesError } = await supabase
        .from('seller_affiliate_programs')
        .delete()
        .eq('seller_id', sellerId);
        
      if (affiliatesError) {
        console.error("Error deleting seller affiliate programs:", affiliatesError);
        // Continue with seller deletion even if affiliates fail
      }
      
      // Delete seller messages and replies
      const { error: messagesError } = await supabase
        .from('marketplace_customer_messages')
        .delete()
        .eq('seller_id', sellerId);
        
      if (messagesError) {
        console.error("Error deleting seller messages:", messagesError);
        // Continue with deletion
      }
      
      const { error: repliesError } = await supabase
        .from('marketplace_message_replies')
        .delete()
        .eq('seller_id', sellerId);
        
      if (repliesError) {
        console.error("Error deleting message replies:", repliesError);
        // Continue with deletion
      }
      
      // Delete any seller orders
      const { error: ordersError } = await supabase
        .from('marketplace_orders')
        .delete()
        .eq('seller_id', sellerId);
        
      if (ordersError) {
        console.error("Error deleting seller orders:", ordersError);
        // Continue with deletion
      }
      
      // Delete any seller payouts
      const { error: payoutsError } = await supabase
        .from('marketplace_payouts')
        .delete()
        .eq('seller_id', sellerId);
        
      if (payoutsError) {
        console.error("Error deleting seller payouts:", payoutsError);
        // Continue with deletion
      }
      
      // Delete any promotions
      const { error: promoError } = await supabase
        .from('marketplace_promotions')
        .delete()
        .eq('seller_id', sellerId);
        
      if (promoError) {
        console.error("Error deleting seller promotions:", promoError);
        // Continue with deletion
      }
      
      // Finally delete the seller record
      const { error } = await supabase
        .from('marketplace_sellers')
        .delete()
        .eq('id', sellerId);

      if (error) throw error;

      // Update local state
      setSellers(sellers.filter(seller => seller.id !== sellerId));
      toast.success("Seller has been banned and permanently deleted");
      setIsDetailsOpen(false);
    } catch (error) {
      console.error("Error deleting seller:", error);
      toast.error("Failed to ban seller");
    } finally {
      setIsProcessing(false);
    }
  };

  const approveSeller = async (sellerId: string) => {
    try {
      setIsProcessing(true);
      const { error } = await supabase
        .from('marketplace_sellers')
        .update({ approved: true })
        .eq('id', sellerId);

      if (error) throw error;

      setSellers(sellers.map(seller => 
        seller.id === sellerId ? { ...seller, approved: true } : seller
      ));

      toast.success("Seller approved successfully");
      setIsDetailsOpen(false);
    } catch (error) {
      console.error("Error approving seller:", error);
      toast.error("Failed to approve seller");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewDetails = (seller: MarketplaceSeller) => {
    setSelectedSeller(seller);
    setIsDetailsOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Store className="h-5 w-5 text-gaming-blue" />
        <h3 className="text-xl font-semibold">Marketplace Sellers</h3>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-gaming-blue" />
        </div>
      ) : sellers.length === 0 ? (
        <div className="text-center py-8 bg-gaming-dark/30 rounded-lg">
          <p className="text-gray-400">No marketplace sellers found</p>
        </div>
      ) : (
        <div className="bg-gaming-dark/30 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Store Name</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sellers.map((seller) => (
                <TableRow key={seller.id}>
                  <TableCell className="font-medium">{seller.store_name}</TableCell>
                  <TableCell>{new Date(seller.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={seller.approved ? "default" : "outline"}>
                      {seller.approved ? "Approved" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleViewDetails(seller)}
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
      
      {selectedSeller && (
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{selectedSeller.store_name}</DialogTitle>
              <DialogDescription>
                Seller profile information
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-2">
                <p className="text-sm font-medium">Store Name:</p>
                <p className="col-span-3">{selectedSeller.store_name}</p>
              </div>
              <div className="grid grid-cols-4 items-start gap-2">
                <p className="text-sm font-medium">Description:</p>
                <p className="col-span-3">{selectedSeller.description || "No description provided"}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-2">
                <p className="text-sm font-medium">Created:</p>
                <p className="col-span-3">{new Date(selectedSeller.created_at).toLocaleString()}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-2">
                <p className="text-sm font-medium">Commission:</p>
                <p className="col-span-3">{selectedSeller.commission_rate}%</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-2">
                <p className="text-sm font-medium">Status:</p>
                <div className="col-span-3">
                  <Badge variant={selectedSeller.approved ? "default" : "outline"}>
                    {selectedSeller.approved ? "Approved" : "Pending"}
                  </Badge>
                </div>
              </div>
            </div>
            
            <DialogFooter className="flex justify-between">
              {selectedSeller.approved ? (
                <Button 
                  variant="destructive" 
                  onClick={() => deleteSeller(selectedSeller.id)}
                  disabled={isProcessing}
                >
                  {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Ban & Delete Seller
                </Button>
              ) : (
                <Button 
                  variant="default" 
                  onClick={() => approveSeller(selectedSeller.id)}
                  disabled={isProcessing}
                >
                  {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Approve Seller
                </Button>
              )}
              <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminSellerManager;
