
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from "sonner";
import { AffiliateMarketplacePrograms } from "@/components/Affiliate/AffiliateMarketplacePrograms";

const AffiliateDashboardPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [affiliateData, setAffiliateData] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (currentUser) {
      fetchAffiliateData();
    }
  }, [currentUser]);

  const fetchAffiliateData = async () => {
    try {
      // Fetch affiliate profile
      const { data: affiliateData, error: affiliateError } = await supabase
        .from("affiliates")
        .select("*")
        .eq("user_id", currentUser?.id)
        .single();

      if (affiliateError) throw affiliateError;

      if (!affiliateData || affiliateData.application_status !== "approved") {
        navigate("/affiliate/status");
        return;
      }

      setAffiliateData(affiliateData);

      // Fetch analytics for the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: analyticsData, error: analyticsError } = await supabase
        .from("affiliate_analytics")
        .select("*")
        .eq("affiliate_id", affiliateData.id)
        .gte("date", thirtyDaysAgo.toISOString())
        .order("date", { ascending: true });

      if (analyticsError) throw analyticsError;
      
      // Format the analytics data for the chart
      const formattedAnalytics = analyticsData?.map(item => ({
        ...item,
        date: new Date(item.date).toLocaleDateString(),
        revenue: Number(item.revenue)
      })) || [];
      
      setAnalytics(formattedAnalytics);

      // Fetch payouts
      const { data: payoutsData, error: payoutsError } = await supabase
        .from("affiliate_payouts")
        .select("*")
        .eq("affiliate_id", affiliateData.id)
        .order("created_at", { ascending: false });

      if (payoutsError) throw payoutsError;
      setPayouts(payoutsData || []);
    } catch (error: any) {
      console.error("Error fetching affiliate data:", error);
      toast.error(error.message || "Failed to load affiliate data");
    } finally {
      setLoading(false);
    }
  };

  const copyAffiliateLink = () => {
    const link = `${window.location.origin}/?ref=${affiliateData.code}`;
    navigator.clipboard.writeText(link);
    toast.success("Affiliate link copied to clipboard!");
  };

  if (loading) {
    return <div className="min-h-screen bg-gaming-darker flex items-center justify-center">
      <p className="text-xl">Loading...</p>
    </div>;
  }

  if (!affiliateData) {
    return <div className="min-h-screen bg-gaming-darker flex items-center justify-center">
      <p className="text-xl">No affiliate data found</p>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gaming-darker">
      <Header />
      <main className="container mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold text-gaming-blue mb-8">Affiliate Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-2">Your Affiliate Code</h3>
            <p className="text-2xl font-bold text-gaming-blue">{affiliateData.code}</p>
            <button 
              onClick={copyAffiliateLink}
              className="mt-2 text-sm text-gaming-blue hover:text-gaming-blue/80"
            >
              Copy affiliate link
            </button>
            <p className="text-sm text-gray-400 mt-2">Commission Rate: {affiliateData.commission_rate}%</p>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-medium mb-2">Total Earnings</h3>
            <p className="text-2xl font-bold text-gaming-blue">
              ${affiliateData.total_earnings?.toFixed(2) || "0.00"}
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-medium mb-2">Total Sales</h3>
            <p className="text-2xl font-bold text-gaming-blue">
              ${affiliateData.total_sales?.toFixed(2) || "0.00"}
            </p>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Performance</TabsTrigger>
            <TabsTrigger value="partnerships">Seller Partnerships</TabsTrigger>
            <TabsTrigger value="payouts">Payouts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Performance Overview</h2>
              <Card className="p-6">
                <div className="h-[400px]">
                  {analytics.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analytics}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis 
                          dataKey="date"
                          stroke="#9CA3AF"
                          tick={{ fill: '#9CA3AF' }}
                        />
                        <YAxis 
                          stroke="#9CA3AF"
                          tick={{ fill: '#9CA3AF' }}
                          tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1F2937',
                            border: '1px solid #374151',
                            color: '#E5E7EB'
                          }}
                          formatter={(value: number) => [`$${value.toFixed(2)}`, "Revenue"]}
                        />
                        <Bar 
                          dataKey="revenue" 
                          fill="#3B82F6" 
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-400">
                      No performance data available yet
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="partnerships">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Seller Partnerships</h2>
              <AffiliateMarketplacePrograms />
            </div>
          </TabsContent>

          <TabsContent value="payouts">
            <div>
              <h2 className="text-2xl font-bold mb-4">Recent Payouts</h2>
              <Card className="overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment Method</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payouts.map((payout) => (
                      <TableRow key={payout.id}>
                        <TableCell>
                          {new Date(payout.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>${payout.amount.toFixed(2)}</TableCell>
                        <TableCell>{payout.status}</TableCell>
                        <TableCell>{payout.payment_method || "N/A"}</TableCell>
                      </TableRow>
                    ))}
                    {payouts.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">
                          No payouts yet
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default AffiliateDashboardPage;
