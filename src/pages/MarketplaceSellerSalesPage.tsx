
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useMarketplace } from "@/hooks/use-marketplace";
import { MarketplaceProvider } from "@/hooks/use-marketplace";
import { Store, Package, DollarSign, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { MarketplaceOrder } from "@/types/marketplace";
import { Loader2 } from "lucide-react";
import { ShippingDeadlineAlert } from "@/components/Marketplace/ShippingDeadlineAlert";
import { format } from "date-fns";

const MarketplaceSellerSalesPage = () => {
  const { currentUser } = useAuth();
  const { sellerProfile, isLoading: sellerLoading } = useMarketplace();
  const [orders, setOrders] = useState<MarketplaceOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (sellerProfile?.id) {
      fetchSales();
    } else if (!sellerLoading) {
      setIsLoading(false);
    }
  }, [sellerProfile, sellerLoading]);

  const fetchSales = async () => {
    try {
      setIsLoading(true);
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
        .eq('seller_id', sellerProfile?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setOrders(data as unknown as MarketplaceOrder[]);
    } catch (error) {
      console.error("Error fetching sales:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }

  const noSales = !isLoading && orders.length === 0;
  
  const totalSales = orders.reduce((sum, order) => sum + order.total_price, 0);
  const totalCommissions = orders.reduce((sum, order) => sum + order.commission_amount, 0);
  const totalPayout = orders.reduce((sum, order) => sum + order.seller_payout, 0);

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

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-6 flex items-center">
              <Store className="mr-2 h-6 w-6 text-gaming-blue" />
              Sales Dashboard
            </h1>
            
            {!sellerLoading && sellerProfile && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="bg-gaming-dark/30">
                  <CardContent className="p-6 flex items-center">
                    <div className="rounded-full bg-green-900/20 p-3 mr-4">
                      <DollarSign className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Total Sales</p>
                      <p className="text-2xl font-bold">${totalSales.toFixed(2)}</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gaming-dark/30">
                  <CardContent className="p-6 flex items-center">
                    <div className="rounded-full bg-blue-900/20 p-3 mr-4">
                      <Package className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Orders</p>
                      <p className="text-2xl font-bold">{orders.length}</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gaming-dark/30">
                  <CardContent className="p-6 flex items-center">
                    <div className="rounded-full bg-amber-900/20 p-3 mr-4">
                      <DollarSign className="h-6 w-6 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Payout</p>
                      <p className="text-2xl font-bold">${totalPayout.toFixed(2)}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Order History
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {isLoading || sellerLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-gaming-blue" />
                </div>
              ) : !sellerProfile ? (
                <div className="text-center py-12">
                  <p className="mb-4">You don't have a seller profile yet.</p>
                  <Link to="/marketplace/sell">
                    <Button>Become a Seller</Button>
                  </Link>
                </div>
              ) : noSales ? (
                <div className="text-center py-12 bg-gaming-dark/20 rounded-lg">
                  <Package className="h-12 w-12 mx-auto text-gray-500 mb-3" />
                  <h3 className="text-xl font-medium mb-2">No sales yet</h3>
                  <p className="text-gray-400 mb-6">
                    You haven't made any sales yet. Once you make sales, they will appear here.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order Date</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Commission</TableHead>
                        <TableHead>Payout</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => {
                        const shippingDeadline = order.marketplace_shipping_deadlines?.[0]?.deadline;
                        const isOverdue = shippingDeadline && new Date(shippingDeadline) < new Date() && !order.shipping_deadline_met;
                        
                        return (
                          <React.Fragment key={order.id}>
                            {shippingDeadline && !order.shipping_deadline_met && (
                              <tr>
                                <td colSpan={7} className="p-0">
                                  <div className="px-4">
                                    <ShippingDeadlineAlert 
                                      deadline={shippingDeadline} 
                                      isOverdue={isOverdue}
                                    />
                                  </div>
                                </td>
                              </tr>
                            )}
                            <TableRow>
                              <TableCell>{formatDate(order.created_at)}</TableCell>
                              <TableCell className="font-medium">{order.product?.name || "Product"}</TableCell>
                              <TableCell>{order.quantity}</TableCell>
                              <TableCell>${order.price_per_unit.toFixed(2)}</TableCell>
                              <TableCell>${order.commission_amount.toFixed(2)}</TableCell>
                              <TableCell className="font-medium">${order.seller_payout.toFixed(2)}</TableCell>
                              <TableCell>
                                <Badge variant={
                                  order.status === 'completed' ? "default" : 
                                  order.status === 'pending' ? "outline" : 
                                  "secondary"
                                }>
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          </React.Fragment>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    </MarketplaceProvider>
  );
};

export default MarketplaceSellerSalesPage;
