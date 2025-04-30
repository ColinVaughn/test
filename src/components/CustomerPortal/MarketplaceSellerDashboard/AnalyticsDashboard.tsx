
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, TrendingUp, Calendar } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

interface AnalyticsDashboardProps {
  sellerId: string;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ sellerId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7days' | '30days' | '90days' | 'all'>('30days');
  const [salesData, setSalesData] = useState<any[]>([]);
  const [productPerformance, setProductPerformance] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({
    totalSales: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    conversionRate: 0,
    viewCount: 0
  });

  useEffect(() => {
    if (sellerId) {
      loadAnalyticsData();
    }
  }, [sellerId, timeRange]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    
    try {
      // Normally we'd fetch from a marketplace_analytics table via Edge Function
      // but for now we'll use mock data
      
      // Mock sales data
      const mockSalesData = generateMockTimeSeriesData();
      setSalesData(mockSalesData);
      
      // Mock product performance
      const mockProductData = [
        { name: 'Gaming GPU XZ9000', sales: 42, revenue: 12600, viewCount: 890 },
        { name: 'MechWarrior Keyboard', sales: 38, revenue: 3800, viewCount: 750 },
        { name: 'Quantum CPU i9', sales: 27, revenue: 8100, viewCount: 620 },
        { name: 'Photonic RAM 32GB', sales: 23, revenue: 2300, viewCount: 480 },
        { name: 'Ceramic Cooling System', sales: 19, revenue: 1900, viewCount: 410 },
      ];
      setProductPerformance(mockProductData);
      
      // Mock category data
      const mockCategoryData = [
        { name: 'GPU', value: 42 },
        { name: 'Peripherals', value: 38 },
        { name: 'CPU', value: 27 },
        { name: 'Memory', value: 23 },
        { name: 'Cooling', value: 19 },
      ];
      setCategoryData(mockCategoryData);
      
      // Mock metrics
      setMetrics({
        totalSales: mockSalesData.reduce((sum, item) => sum + item.sales, 0),
        totalOrders: mockSalesData.reduce((sum, item) => sum + item.orders, 0),
        averageOrderValue: mockProductData.reduce((sum, item) => sum + item.revenue, 0) / 
                          mockProductData.reduce((sum, item) => sum + item.sales, 0),
        conversionRate: 3.2, // percent
        viewCount: mockProductData.reduce((sum, item) => sum + item.viewCount, 0)
      });
      
    } catch (error) {
      console.error("Error loading analytics data:", error);
      toast.error("Failed to load analytics data");
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockTimeSeriesData = () => {
    const data = [];
    const now = new Date();
    const daysToGenerate = timeRange === '7days' ? 7 : 
                          timeRange === '30days' ? 30 : 
                          timeRange === '90days' ? 90 : 180;
    
    for (let i = daysToGenerate - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(now.getDate() - i);
      
      // Generate random but somewhat realistic data
      const baseAmount = Math.floor(Math.random() * 500) + 100;
      const variation = (Math.sin(i / 5) + 1) * 300; // Create some waves in the data
      
      data.push({
        date: date.toISOString().split('T')[0],
        sales: baseAmount + variation,
        orders: Math.floor((baseAmount + variation) / 100),
        views: Math.floor((baseAmount + variation) * 2.5)
      });
    }
    
    return data;
  };

  const formatTooltipValue = (value: any) => {
    if (typeof value === 'number') {
      return `$${value.toFixed(2)}`;
    }
    return value;
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <CardTitle className="flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Analytics Dashboard
        </CardTitle>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {timeRange === '7days' ? 'Last 7 Days' : 
                 timeRange === '30days' ? 'Last 30 Days' : 
                 timeRange === '90days' ? 'Last 90 Days' : 'All Time'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTimeRange('7days')}>
                Last 7 Days
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeRange('30days')}>
                Last 30 Days
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeRange('90days')}>
                Last 90 Days
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeRange('all')}>
                All Time
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card className="bg-gaming-dark/20">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-400">Total Sales</p>
                    <p className="text-3xl font-bold text-gaming-blue">{formatCurrency(metrics.totalSales)}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gaming-dark/20">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-400">Total Orders</p>
                    <p className="text-3xl font-bold text-gaming-green">{metrics.totalOrders}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gaming-dark/20">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-400">Average Order</p>
                    <p className="text-3xl font-bold text-gaming-yellow">{formatCurrency(metrics.averageOrderValue)}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gaming-dark/20">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-400">Conversion Rate</p>
                    <p className="text-3xl font-bold text-gaming-pink">{metrics.conversionRate}%</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Charts */}
            <Tabs defaultValue="sales" className="space-y-6">
              <TabsList>
                <TabsTrigger value="sales">Sales Performance</TabsTrigger>
                <TabsTrigger value="products">Product Performance</TabsTrigger>
                <TabsTrigger value="categories">Categories</TabsTrigger>
              </TabsList>
              
              <TabsContent value="sales">
                <Card>
                  <CardHeader>
                    <CardTitle>Sales Over Time</CardTitle>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={salesData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip formatter={(value: any) => {
                          if (typeof value === 'number') {
                            return value.toString().includes('views') 
                              ? value 
                              : `$${Number(value).toFixed(2)}`;
                          }
                          return value;
                        }} />
                        <Legend />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="sales"
                          stroke="#3B82F6"
                          activeDot={{ r: 8 }}
                          name="Sales ($)"
                        />
                        <Line 
                          yAxisId="right" 
                          type="monotone" 
                          dataKey="orders" 
                          stroke="#10B981" 
                          name="Orders"
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="views"
                          stroke="#F59E0B"
                          name="Product Views"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="products">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Products</CardTitle>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={productPerformance}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip formatter={(value: any, name) => {
                          if (name === 'revenue') {
                            return `$${Number(value).toFixed(2)}`;
                          }
                          return value;
                        }} />
                        <Legend />
                        <Bar yAxisId="left" dataKey="revenue" name="Revenue ($)" fill="#3B82F6" />
                        <Bar yAxisId="right" dataKey="sales" name="Units Sold" fill="#10B981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="categories">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Sales by Category</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: any) => `${value} units`} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Category Performance</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          layout="vertical"
                          data={categoryData}
                          margin={{
                            top: 20,
                            right: 30,
                            left: 50,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis dataKey="name" type="category" scale="band" />
                          <Tooltip formatter={(value: any) => `${value} units`} />
                          <Legend />
                          <Bar dataKey="value" name="Units Sold" fill="#8884d8">
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalyticsDashboard;
