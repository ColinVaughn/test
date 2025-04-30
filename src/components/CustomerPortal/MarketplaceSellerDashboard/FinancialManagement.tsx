import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, CreditCard, Download, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCurrency } from "@/lib/utils";

interface FinancialManagementProps {
  sellerId: string;
}

interface Transaction {
  id: string;
  created_at: string;
  order_id: string;
  amount: number;
  payout_amount: number;
  status: string;
  customer_email?: string;
  product_name?: string;
}

interface PayoutRecord {
  id: string;
  created_at: string;
  amount: number;
  status: string;
  payment_method: string;
  transaction_reference?: string;
  processed_at?: string;
}

const FinancialManagement: React.FC<FinancialManagementProps> = ({ sellerId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [payouts, setPayouts] = useState<PayoutRecord[]>([]);
  const [earningsSummary, setEarningsSummary] = useState({
    totalSales: 0,
    totalPayout: 0,
    platformFees: 0,
    pendingPayout: 0,
    salesCount: 0,
    averageOrderValue: 0,
  });
  const [salesByMonth, setSalesByMonth] = useState<any[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [dateRange, setDateRange] = useState('30days');

  useEffect(() => {
    if (sellerId) {
      loadFinancialData();
    }
  }, [sellerId, dateRange]);

  const loadFinancialData = async () => {
    setIsLoading(true);
    try {
      // Fetch payouts data
      const { data: payoutData, error: payoutError } = await supabase
        .from('marketplace_payouts')
        .select('*')
        .eq('seller_id', sellerId)
        .order('created_at', { ascending: false });

      if (payoutError) throw payoutError;
      setPayouts(payoutData as PayoutRecord[]);

      // Calculate date range
      const endDate = new Date();
      let startDate = new Date();
      
      switch(dateRange) {
        case '7days':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '30days':
          startDate.setDate(endDate.getDate() - 30);
          break;
        case '90days':
          startDate.setDate(endDate.getDate() - 90);
          break;
        case '365days':
          startDate.setDate(endDate.getDate() - 365);
          break;
        default:
          startDate.setDate(endDate.getDate() - 30);
      }
      
      // Format dates for query
      const startDateString = startDate.toISOString();
      const endDateString = endDate.toISOString();
      
      // Fetch order transactions
      const { data: orderData, error: orderError } = await supabase
        .from('marketplace_orders')
        .select(`
          id, 
          order_id, 
          created_at, 
          total_price, 
          seller_payout, 
          commission_amount, 
          status,
          marketplace_products (name)
        `)
        .eq('seller_id', sellerId)
        .gte('created_at', startDateString)
        .lte('created_at', endDateString)
        .order('created_at', { ascending: false });
      
      if (orderError) throw orderError;
      
      // Mock payouts data since the table doesn't exist yet
      // const payoutData: PayoutRecord[] = [];
      
      // Process transaction data
      const processedTransactions = orderData ? orderData.map((order: any) => ({
        id: order.id,
        created_at: order.created_at,
        order_id: order.order_id,
        amount: order.total_price,
        payout_amount: order.seller_payout,
        status: order.status,
        product_name: order.marketplace_products?.name || "Unknown Product"
      })) : [];
      
      setTransactions(processedTransactions);
      // setPayouts(payoutData);
      
      // Calculate summary statistics
      const totalSales = processedTransactions.reduce((sum, tx) => sum + tx.amount, 0);
      const totalPayout = processedTransactions.reduce((sum, tx) => sum + tx.payout_amount, 0);
      const salesCount = processedTransactions.length;
      
      // Calculate pending payout (completed orders that haven't been paid out yet)
      const completedPayouts = payoutData
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + p.amount, 0);
      
      const completedSales = processedTransactions
        .filter(tx => tx.status === 'completed')
        .reduce((sum, tx) => sum + tx.payout_amount, 0);
      
      const pendingPayout = completedSales - completedPayouts;
      
      setEarningsSummary({
        totalSales,
        totalPayout,
        platformFees: totalSales - totalPayout,
        pendingPayout: pendingPayout > 0 ? pendingPayout : 0,
        salesCount,
        averageOrderValue: salesCount > 0 ? totalSales / salesCount : 0
      });
      
      // Prepare monthly data for charts
      const monthlyData: {[key: string]: {
        month: string,
        revenue: number,
        payout: number,
        orders: number
      }} = {};
      
      if (orderData) {
        orderData.forEach((order: any) => {
          const date = new Date(order.created_at);
          const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
          const monthName = date.toLocaleString('default', { month: 'short' });
          
          if (!monthlyData[monthYear]) {
            monthlyData[monthYear] = {
              month: `${monthName} ${date.getFullYear()}`,
              revenue: 0,
              payout: 0,
              orders: 0
            };
          }
          
          monthlyData[monthYear].revenue += order.total_price;
          monthlyData[monthYear].payout += order.seller_payout;
          monthlyData[monthYear].orders += 1;
        });
      }
      
      // Convert to array and sort chronologically
      const salesByMonthArray = Object.values(monthlyData).sort((a, b) => {
        return new Date(a.month).getTime() - new Date(b.month).getTime();
      });
      
      setSalesByMonth(salesByMonthArray);
      
    } catch (error) {
      console.error("Error loading financial data:", error);
      toast.error("Failed to load financial data");
    } finally {
      setIsLoading(false);
    }
  };

  const exportTransactions = () => {
    try {
      setIsExporting(true);
      
      if (!transactions || transactions.length === 0) {
        toast.error("No transactions to export");
        setIsExporting(false);
        return;
      }
      
      // Prepare CSV data
      const csvRows = [];
      
      // Add headers
      const headers = ['Date', 'Order ID', 'Product', 'Amount', 'Payout', 'Platform Fee', 'Status'];
      csvRows.push(headers.join(','));
      
      // Add data rows
      transactions.forEach(tx => {
        const platformFee = tx.amount - tx.payout_amount;
        const row = [
          new Date(tx.created_at).toLocaleDateString(),
          tx.order_id,
          tx.product_name,
          tx.amount.toFixed(2),
          tx.payout_amount.toFixed(2),
          platformFee.toFixed(2),
          tx.status
        ];
        
        // Escape commas in strings
        const escapedRow = row.map(field => {
          if (typeof field === 'string' && field.includes(',')) {
            return `"${field}"`;
          }
          return field;
        });
        
        csvRows.push(escapedRow.join(','));
      });
      
      // Download the CSV
      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.setAttribute('href', url);
      a.setAttribute('download', `transactions_${new Date().toISOString().slice(0, 10)}.csv`);
      a.style.display = 'none';
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast.success("Transactions exported successfully");
    } catch (error) {
      console.error("Error exporting transactions:", error);
      toast.error("Failed to export transactions");
    } finally {
      setIsExporting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <CardTitle className="flex items-center">
          <Wallet className="h-5 w-5 mr-2" />
          Financial Dashboard
        </CardTitle>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {}}
            disabled={isExporting || transactions.length === 0}
          >
            {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
            Export
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {dateRange === '7days' ? 'Last 7 days' :
                 dateRange === '30days' ? 'Last 30 days' :
                 dateRange === '90days' ? 'Last 90 days' :
                 dateRange === '365days' ? 'Last 12 months' : 'Filter'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setDateRange('7days')}>
                Last 7 days
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateRange('30days')}>
                Last 30 days
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateRange('90days')}>
                Last 90 days
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateRange('365days')}>
                Last 12 months
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gaming-blue" />
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <Card className="bg-gaming-dark/20">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-400">Total Sales</p>
                    <p className="text-3xl font-bold text-gaming-blue">
                      {formatCurrency(earningsSummary.totalSales)}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      {earningsSummary.salesCount} orders
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gaming-dark/20">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-400">Total Earnings</p>
                    <p className="text-3xl font-bold text-gaming-green">
                      {formatCurrency(earningsSummary.totalPayout)}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      After platform fees
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gaming-dark/20">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-400">Pending Payout</p>
                    <p className="text-3xl font-bold text-gaming-yellow">
                      {formatCurrency(earningsSummary.pendingPayout)}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Available for withdrawal
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Charts and Transactions */}
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="payouts">Payouts</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <Card>
                  <CardHeader>
                    <CardTitle>Sales & Earnings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {salesByMonth.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={salesByMonth}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis yAxisId="left" />
                          <YAxis yAxisId="right" orientation="right" />
                          <Tooltip formatter={(value: any) => `$${Number(value).toFixed(2)}`} />
                          <Legend />
                          <Line 
                            yAxisId="left"
                            type="monotone" 
                            dataKey="revenue" 
                            name="Revenue" 
                            stroke="#3B82F6" 
                            activeDot={{ r: 8 }}
                          />
                          <Line 
                            yAxisId="left"
                            type="monotone" 
                            dataKey="payout" 
                            name="Earnings" 
                            stroke="#10B981" 
                          />
                          <Line 
                            yAxisId="right"
                            type="monotone" 
                            dataKey="orders" 
                            name="Orders" 
                            stroke="#9333EA" 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="py-12 text-center">
                        <p className="text-gray-400">No sales data available for the selected period</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Fee Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {earningsSummary.totalSales > 0 ? (
                        <ResponsiveContainer width="100%" height={200}>
                          <BarChart
                            data={[
                              {
                                name: "Sales Breakdown",
                                earnings: earningsSummary.totalPayout,
                                fees: earningsSummary.platformFees
                              }
                            ]}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value: any) => `$${Number(value).toFixed(2)}`} />
                            <Legend />
                            <Bar 
                              dataKey="earnings" 
                              name="Your Earnings" 
                              stackId="a" 
                              fill="#10B981" 
                            />
                            <Bar 
                              dataKey="fees" 
                              name="Platform Fees" 
                              stackId="a" 
                              fill="#6366F1" 
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="py-8 text-center">
                          <p className="text-gray-400">No fee data available</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Stats & Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Average Order Value</span>
                          <span className="font-medium">
                            {formatCurrency(earningsSummary.averageOrderValue)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Platform Fee Rate</span>
                          <span className="font-medium">5%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Total Platform Fees</span>
                          <span className="font-medium">
                            {formatCurrency(earningsSummary.platformFees)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Payout Rate</span>
                          <span className="font-medium">
                            {earningsSummary.totalSales > 0 
                              ? `${((earningsSummary.totalPayout / earningsSummary.totalSales) * 100).toFixed(1)}%` 
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="transactions">
                <Card>
                  <CardContent className="p-0">
                    {transactions.length > 0 ? (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Order ID</TableHead>
                              <TableHead>Product</TableHead>
                              <TableHead className="text-right">Amount</TableHead>
                              <TableHead className="text-right">Your Earnings</TableHead>
                              <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {transactions.map((tx) => (
                              <TableRow key={tx.id}>
                                <TableCell>{formatDate(tx.created_at)}</TableCell>
                                <TableCell className="font-mono text-xs">{tx.order_id.slice(0, 8)}...</TableCell>
                                <TableCell>{tx.product_name || "Unknown Product"}</TableCell>
                                <TableCell className="text-right">${tx.amount.toFixed(2)}</TableCell>
                                <TableCell className="text-right">${tx.payout_amount.toFixed(2)}</TableCell>
                                <TableCell className="text-right">
                                  <div className={`px-2 py-1 rounded text-xs inline-flex ${
                                    tx.status === 'completed' 
                                      ? 'bg-green-500/20 text-green-300' 
                                      : tx.status === 'pending' 
                                      ? 'bg-yellow-500/20 text-yellow-300'
                                      : 'bg-blue-500/20 text-blue-300'
                                  }`}>
                                    {tx.status}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="py-12 text-center">
                        <p className="text-gray-400">No transactions found for the selected period</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="payouts">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Payout History</CardTitle>
                    <Button disabled={earningsSummary.pendingPayout <= 0}>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Request Payout
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {payouts.length > 0 ? (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Amount</TableHead>
                              <TableHead>Method</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Reference</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {payouts.map((payout) => (
                              <TableRow key={payout.id}>
                                <TableCell>{formatDate(payout.created_at)}</TableCell>
                                <TableCell>${payout.amount.toFixed(2)}</TableCell>
                                <TableCell>
                                  {payout.payment_method === 'bank_transfer' ? 'Bank Transfer' : 
                                   payout.payment_method === 'paypal' ? 'PayPal' : 
                                   payout.payment_method}
                                </TableCell>
                                <TableCell>
                                  <div className={`px-2 py-1 rounded text-xs inline-flex ${
                                    payout.status === 'completed' 
                                      ? 'bg-green-500/20 text-green-300' 
                                      : payout.status === 'pending' 
                                      ? 'bg-yellow-500/20 text-yellow-300'
                                      : payout.status === 'failed'
                                      ? 'bg-red-500/20 text-red-300'
                                      : 'bg-gray-500/20 text-gray-300'
                                  }`}>
                                    {payout.status}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {payout.transaction_reference || '—'}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="py-12 text-center">
                        <p className="text-gray-400">No payout history available</p>
                        <p className="text-sm text-gray-500 mt-2">
                          When you request a payout, it will appear here
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default FinancialManagement;
