
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function AdminAffiliateManager() {
  const [affiliates, setAffiliates] = useState<any[]>([]);
  const [sellerPrograms, setSellerPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [programsLoading, setProgramsLoading] = useState(true);
  const [selectedAffiliate, setSelectedAffiliate] = useState<any>(null);
  const [commissionRate, setCommissionRate] = useState("");
  const [activeTab, setActiveTab] = useState("affiliates");

  useEffect(() => {
    fetchAffiliates();
    fetchSellerPrograms();
  }, []);

  const fetchAffiliates = async () => {
    try {
      const { data, error } = await supabase
        .from("affiliates")
        .select(`
          *,
          user_profiles!fk_affiliate_user_profile(email)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAffiliates(data);
    } catch (error) {
      console.error("Error fetching affiliates:", error);
      toast.error("Failed to load affiliates");
    } finally {
      setLoading(false);
    }
  };

  const fetchSellerPrograms = async () => {
    try {
      const { data, error } = await supabase
        .from("seller_affiliate_programs")
        .select(`
          *,
          affiliates(code, user_profiles(email)),
          marketplace_sellers(store_name),
          marketplace_products(name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSellerPrograms(data || []);
    } catch (error) {
      console.error("Error fetching seller programs:", error);
      toast.error("Failed to load seller programs");
    } finally {
      setProgramsLoading(false);
    }
  };

  const handleStatusChange = async (affiliateId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("affiliates")
        .update({ application_status: newStatus })
        .eq("id", affiliateId);

      if (error) throw error;
      toast.success(`Affiliate ${newStatus}`);
      fetchAffiliates();
    } catch (error) {
      console.error("Error updating affiliate status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleProgramStatusChange = async (programId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("seller_affiliate_programs")
        .update({ status: newStatus })
        .eq("id", programId);

      if (error) throw error;
      toast.success(`Program status updated to ${newStatus}`);
      fetchSellerPrograms();
    } catch (error) {
      console.error("Error updating program status:", error);
      toast.error("Failed to update program status");
    }
  };

  const handleCommissionUpdate = async () => {
    if (!selectedAffiliate) return;

    try {
      const rate = parseFloat(commissionRate);
      if (isNaN(rate) || rate < 0 || rate > 100) {
        toast.error("Please enter a valid commission rate (0-100)");
        return;
      }

      const { error } = await supabase
        .from("affiliates")
        .update({ commission_rate: rate })
        .eq("id", selectedAffiliate.id);

      if (error) throw error;
      toast.success("Commission rate updated");
      setSelectedAffiliate(null);
      fetchAffiliates();
    } catch (error) {
      console.error("Error updating commission rate:", error);
      toast.error("Failed to update commission rate");
    }
  };

  return (
    <div className="bg-gaming-dark/30 rounded-lg p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="affiliates">Affiliate Management</TabsTrigger>
          <TabsTrigger value="programs">Seller Programs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="affiliates">
          <h2 className="text-xl font-semibold mb-4">Affiliate Management</h2>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Commission Rate</TableHead>
                <TableHead>Total Sales</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">Loading affiliates...</TableCell>
                </TableRow>
              ) : (
                affiliates.map((affiliate) => (
                  <TableRow key={affiliate.id}>
                    <TableCell>{affiliate.user_profiles?.email}</TableCell>
                    <TableCell>{affiliate.code}</TableCell>
                    <TableCell>
                      <Badge variant={
                        affiliate.application_status === "approved" ? "secondary" :
                        affiliate.application_status === "rejected" ? "destructive" :
                        "default"
                      }>
                        {affiliate.application_status}
                      </Badge>
                    </TableCell>
                    <TableCell>{affiliate.commission_rate}%</TableCell>
                    <TableCell>${affiliate.total_sales?.toFixed(2) || "0.00"}</TableCell>
                    <TableCell className="space-x-2">
                      {affiliate.application_status === "pending" && (
                        <>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleStatusChange(affiliate.id, 'approved')}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleStatusChange(affiliate.id, 'rejected')}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedAffiliate(affiliate);
                          setCommissionRate(affiliate.commission_rate.toString());
                        }}
                      >
                        Edit Rate
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TabsContent>
        
        <TabsContent value="programs">
          <h2 className="text-xl font-semibold mb-4">Seller-Affiliate Programs</h2>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Seller</TableHead>
                <TableHead>Affiliate</TableHead>
                <TableHead>Program Type</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {programsLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">Loading programs...</TableCell>
                </TableRow>
              ) : sellerPrograms.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">No programs found</TableCell>
                </TableRow>
              ) : (
                sellerPrograms.map((program) => (
                  <TableRow key={program.id}>
                    <TableCell>{program.marketplace_sellers?.store_name || 'Unknown'}</TableCell>
                    <TableCell>
                      {program.affiliates?.code || 'Unknown'}
                      <div className="text-xs text-gray-500">
                        {program.affiliates?.user_profiles?.email || ''}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        program.program_type === 'commission' ? 'default' :
                        program.program_type === 'free_sample' ? 'secondary' : 'outline'
                      }>
                        {program.program_type === 'commission' ? 'Commission' :
                         program.program_type === 'free_sample' ? 'Free Sample' :
                         'Refundable Sample'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {program.program_type === 'commission' ? (
                        <span>{program.commission_rate}% commission</span>
                      ) : (
                        <span>
                          {program.marketplace_products?.name || 'Product'}
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
                    <TableCell className="space-x-2">
                      {program.status === 'pending' && (
                        <>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleProgramStatusChange(program.id, 'active')}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleProgramStatusChange(program.id, 'inactive')}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {program.status === 'active' && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleProgramStatusChange(program.id, 'inactive')}
                        >
                          Deactivate
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

      <Dialog open={!!selectedAffiliate} onOpenChange={() => setSelectedAffiliate(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Commission Rate</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              type="number"
              value={commissionRate}
              onChange={(e) => setCommissionRate(e.target.value)}
              placeholder="Enter commission rate (%)"
              min="0"
              max="100"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedAffiliate(null)}>
              Cancel
            </Button>
            <Button onClick={handleCommissionUpdate}>
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
