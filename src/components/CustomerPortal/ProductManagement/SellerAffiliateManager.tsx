
import React, { useState, useEffect } from "react";
import { useMarketplace } from "@/hooks/use-marketplace";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ProgramType, SellerAffiliateProgram } from "@/types/marketplace";

interface AffiliateStats extends Record<string, any> {
  totalRevenue: number;
  totalConversions: number;
  totalVisitors: number;
  conversionRate: string;
}

interface ProcessedAffiliate {
  id: string;
  code: string;
  user_profiles?: {
    email: string | null;
  };
  stats: AffiliateStats;
}

export const SellerAffiliateManager = () => {
  const { sellerProfile } = useMarketplace();
  const [affiliates, setAffiliates] = useState<ProcessedAffiliate[]>([]);
  const [filteredAffiliates, setFilteredAffiliates] = useState<ProcessedAffiliate[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedAffiliate, setSelectedAffiliate] = useState<ProcessedAffiliate | null>(null);
  const [isAddProgramDialogOpen, setIsAddProgramDialogOpen] = useState(false);
  const [programType, setProgramType] = useState<ProgramType>("commission");
  const [commissionRate, setCommissionRate] = useState("0");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [requirements, setRequirements] = useState("");
  const [sellerProducts, setSellerProducts] = useState<any[]>([]);
  const [affiliatePrograms, setAffiliatePrograms] = useState<SellerAffiliateProgram[]>([]);
  const [activeTab, setActiveTab] = useState("browse");

  useEffect(() => {
    if (sellerProfile) {
      fetchAffiliates();
      fetchSellerProducts();
      fetchAffiliatePrograms();
    }
  }, [sellerProfile]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredAffiliates(affiliates);
    } else {
      const filtered = affiliates.filter(
        affiliate => 
          affiliate.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (affiliate.user_profiles?.email?.toLowerCase() || '').includes(searchQuery.toLowerCase())
      );
      setFilteredAffiliates(filtered);
    }
  }, [searchQuery, affiliates]);

  const fetchAffiliates = async () => {
    try {
      const { data, error } = await supabase
        .from('affiliates')
        .select(`
          *,
          user_profiles!fk_affiliate_user_profile(email),
          affiliate_analytics(revenue, conversions, unique_visitors)
        `)
        .eq('application_status', 'approved');

      if (error) throw error;
      
      // Process data to include statistics
      const processedData: ProcessedAffiliate[] = (data || []).map(affiliate => {
        const analytics = affiliate.affiliate_analytics || [];
        const totalRevenue = analytics.reduce((sum: number, item: any) => sum + (item.revenue || 0), 0);
        const totalConversions = analytics.reduce((sum: number, item: any) => sum + (item.conversions || 0), 0);
        const totalVisitors = analytics.reduce((sum: number, item: any) => sum + (item.unique_visitors || 0), 0);
        
        return {
          ...affiliate,
          stats: {
            totalRevenue,
            totalConversions,
            totalVisitors,
            conversionRate: totalVisitors ? ((totalConversions / totalVisitors) * 100).toFixed(2) : '0'
          }
        };
      });

      setAffiliates(processedData);
      setFilteredAffiliates(processedData);
    } catch (error) {
      console.error("Error fetching affiliates:", error);
      toast.error("Failed to load affiliates");
    } finally {
      setLoading(false);
    }
  };

  const fetchSellerProducts = async () => {
    if (!sellerProfile?.id) return;
    
    try {
      const { data, error } = await supabase
        .from("marketplace_products")
        .select("*")
        .eq("seller_id", sellerProfile.id);

      if (error) throw error;
      setSellerProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    }
  };

  const fetchAffiliatePrograms = async () => {
    if (!sellerProfile?.id) return;
    
    try {
      const { data, error } = await supabase
        .from("seller_affiliate_programs")
        .select(`
          *,
          affiliates(code, user_profiles(email))
        `)
        .eq("seller_id", sellerProfile.id);

      if (error) throw error;
      
      // Cast the data to match the SellerAffiliateProgram type
      const typedData = (data || []).map(item => ({
        ...item,
        program_type: item.program_type as ProgramType,
        status: item.status as 'pending' | 'active' | 'inactive'
      })) as SellerAffiliateProgram[];
      
      setAffiliatePrograms(typedData);
    } catch (error) {
      console.error("Error fetching affiliate programs:", error);
      toast.error("Failed to load affiliate programs");
    }
  };

  const handleAddProgram = async () => {
    if (!sellerProfile?.id || !selectedAffiliate) return;
    
    try {
      // Validate input based on program type
      if (programType === "commission") {
        const rate = parseFloat(commissionRate);
        if (isNaN(rate) || rate < 0 || rate > 100) {
          toast.error("Please enter a valid commission rate (0-100%)");
          return;
        }
      } else if ((programType === "free_sample" || programType === "refundable_sample") && !selectedProductId) {
        toast.error("Please select a product for the sample program");
        return;
      }

      const newProgram = {
        seller_id: sellerProfile.id,
        affiliate_id: selectedAffiliate.id,
        program_type: programType,
        commission_rate: programType === "commission" ? parseFloat(commissionRate) : null,
        product_id: ["free_sample", "refundable_sample"].includes(programType) ? selectedProductId : null,
        requirements: requirements || null,
        status: 'pending'
      };

      const { error } = await supabase
        .from("seller_affiliate_programs")
        .insert([newProgram]);

      if (error) throw error;

      toast.success("Affiliate program request sent");
      fetchAffiliatePrograms();
      setIsAddProgramDialogOpen(false);
      resetProgramForm();
    } catch (error) {
      console.error("Error creating affiliate program:", error);
      toast.error("Failed to create affiliate program");
    }
  };

  const handleCancelProgram = async (programId: string) => {
    try {
      const { error } = await supabase
        .from("seller_affiliate_programs")
        .update({ status: 'inactive' })
        .eq("id", programId);

      if (error) throw error;

      toast.success("Program cancelled successfully");
      fetchAffiliatePrograms();
    } catch (error) {
      console.error("Error cancelling program:", error);
      toast.error("Failed to cancel program");
    }
  };

  const resetProgramForm = () => {
    setProgramType("commission");
    setCommissionRate("0");
    setSelectedProductId("");
    setRequirements("");
  };

  if (!sellerProfile) {
    return null;
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Affiliate Marketing Programs</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="browse">Browse Affiliates</TabsTrigger>
            <TabsTrigger value="active">Active Programs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="browse">
            <div className="space-y-4">
              <Input 
                placeholder="Search affiliates by code or email" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="mb-4"
              />
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Affiliate Code</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Total Sales</TableHead>
                    <TableHead>Conv. Rate</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">Loading...</TableCell>
                    </TableRow>
                  ) : filteredAffiliates.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">No affiliates found</TableCell>
                    </TableRow>
                  ) : (
                    filteredAffiliates.map((affiliate) => (
                      <TableRow key={affiliate.id}>
                        <TableCell>{affiliate.code}</TableCell>
                        <TableCell>{affiliate.user_profiles?.email}</TableCell>
                        <TableCell>${affiliate.stats?.totalRevenue?.toFixed(2) || "0.00"}</TableCell>
                        <TableCell>{affiliate.stats?.conversionRate || "0"}%</TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => {
                              setSelectedAffiliate(affiliate);
                              setIsAddProgramDialogOpen(true);
                            }}
                          >
                            Create Program
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="active">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Affiliate</TableHead>
                  <TableHead>Program Type</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {affiliatePrograms.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">No active affiliate programs</TableCell>
                  </TableRow>
                ) : (
                  affiliatePrograms.map((program) => (
                    <TableRow key={program.id}>
                      <TableCell>
                        {program.affiliates?.code || 'Unknown'}
                        <div className="text-xs text-gray-500">
                          {program.affiliates?.user_profiles?.email || ''}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          program.program_type === "commission" ? 'default' :
                          program.program_type === "free_sample" ? 'secondary' : 'outline'
                        }>
                          {program.program_type === "commission" ? 'Commission' : 
                           program.program_type === "free_sample" ? 'Free Sample' : 
                           'Refundable Sample'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {program.program_type === "commission" ? (
                          <span>{program.commission_rate}% commission</span>
                        ) : (
                          <span>
                            {sellerProducts.find(p => p.id === program.product_id)?.name || 'Product'}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          program.status === 'active' ? 'secondary' :
                          program.status === 'pending' ? 'default' : 'destructive'
                        }>
                          {program.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {program.status !== 'inactive' && (
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleCancelProgram(program.id)}
                          >
                            Cancel
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>

        {/* Dialog for adding a new affiliate program */}
        <Dialog open={isAddProgramDialogOpen} onOpenChange={setIsAddProgramDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create Affiliate Program</DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-4">
              {selectedAffiliate && (
                <div className="space-y-1">
                  <p className="text-sm font-medium">Affiliate:</p>
                  <p>{selectedAffiliate.code} ({selectedAffiliate.user_profiles?.email})</p>
                </div>
              )}
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Program Type:</p>
                <Select 
                  value={programType} 
                  onValueChange={(value) => setProgramType(value as ProgramType)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select program type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="commission">Commission Based</SelectItem>
                    <SelectItem value="free_sample">Free Product Sample</SelectItem>
                    <SelectItem value="refundable_sample">Refundable Sample</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {programType === "commission" ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Commission Rate (%):</p>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(e.target.value)}
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Select Product:</p>
                  <Select 
                    value={selectedProductId} 
                    onValueChange={setSelectedProductId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {sellerProducts.map(product => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Requirements (Optional):</p>
                <Textarea
                  placeholder="Specify any requirements for this affiliate program..."
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  className="h-24"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddProgramDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddProgram}>
                Create Program
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
