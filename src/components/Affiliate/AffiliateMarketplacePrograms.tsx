
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ProgramStatus, SampleRequestStatus } from "@/types/marketplace";

export const AffiliateMarketplacePrograms = () => {
  const { currentUser } = useAuth();
  const [affiliateId, setAffiliateId] = useState<string | null>(null);
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState<any>(null);
  const [isAcceptDialogOpen, setIsAcceptDialogOpen] = useState(false);
  const [acceptanceMessage, setAcceptanceMessage] = useState("");

  useEffect(() => {
    if (currentUser) {
      fetchAffiliateId();
    }
  }, [currentUser]);

  useEffect(() => {
    if (affiliateId) {
      fetchPrograms();
    }
  }, [affiliateId]);

  const fetchAffiliateId = async () => {
    try {
      const { data, error } = await supabase
        .from("affiliates")
        .select("id")
        .eq("user_id", currentUser?.id)
        .eq("application_status", "approved")
        .single();

      if (error) throw error;
      setAffiliateId(data?.id);
    } catch (error) {
      console.error("Error fetching affiliate ID:", error);
    }
  };

  const fetchPrograms = async () => {
    try {
      const { data, error } = await supabase
        .from("seller_affiliate_programs")
        .select(`
          *,
          marketplace_sellers(store_name, logo_url),
          marketplace_products(name, description, images, price)
        `)
        .eq("affiliate_id", affiliateId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPrograms(data || []);
    } catch (error) {
      console.error("Error fetching programs:", error);
      toast.error("Failed to load programs");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptProgram = async () => {
    if (!selectedProgram) return;

    try {
      const { error } = await supabase
        .from("seller_affiliate_programs")
        .update({ 
          status: 'active',
          affiliate_notes: acceptanceMessage || null
        })
        .eq("id", selectedProgram.id);

      if (error) throw error;
      
      toast.success("Program accepted successfully!");
      setIsAcceptDialogOpen(false);
      fetchPrograms();

      // If this is a sample program, we would also need to create a sample request
      if (['free_sample', 'refundable_sample'].includes(selectedProgram.program_type)) {
        await createSampleRequest(selectedProgram);
      }
    } catch (error) {
      console.error("Error accepting program:", error);
      toast.error("Failed to accept program");
    }
  };

  const createSampleRequest = async (program: any) => {
    try {
      const { error } = await supabase
        .from("affiliate_sample_requests")
        .insert([{
          program_id: program.id,
          affiliate_id: affiliateId,
          seller_id: program.seller_id,
          product_id: program.product_id,
          status: 'pending',
          request_notes: acceptanceMessage || null
        }]);

      if (error) throw error;
    } catch (error) {
      console.error("Error creating sample request:", error);
    }
  };

  const handleDeclineProgram = async (programId: string) => {
    try {
      const { error } = await supabase
        .from("seller_affiliate_programs")
        .update({ status: 'inactive' })
        .eq("id", programId);

      if (error) throw error;
      
      toast.success("Program declined");
      fetchPrograms();
    } catch (error) {
      console.error("Error declining program:", error);
      toast.error("Failed to decline program");
    }
  };

  const getStatusBadgeVariant = (status: ProgramStatus) => {
    switch (status) {
      case 'active':
        return 'secondary' as const;
      case 'pending':
        return 'default' as const;
      case 'inactive':
        return 'destructive' as const;
    }
  };

  if (!currentUser || !affiliateId) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-6">
            <p>You need to be an approved affiliate to access this section.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Seller Partnership Programs</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Seller</TableHead>
              <TableHead>Program Type</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">Loading programs...</TableCell>
              </TableRow>
            ) : programs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">No partnership programs available</TableCell>
              </TableRow>
            ) : (
              programs.map((program) => (
                <TableRow key={program.id}>
                  <TableCell>
                    {program.marketplace_sellers?.store_name || 'Unknown Seller'}
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
                      <span className="flex flex-col">
                        <span>{program.marketplace_products?.name || 'Product'}</span>
                        <span className="text-xs text-gray-400">
                          ${program.marketplace_products?.price?.toFixed(2) || '0.00'}
                        </span>
                      </span>
                    )}
                    {program.requirements && (
                      <div className="text-xs text-gray-400 mt-1">
                        Requirements: {program.requirements}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(program.status)}>
                      {program.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {program.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button 
                          size="sm"
                          onClick={() => {
                            setSelectedProgram(program);
                            setIsAcceptDialogOpen(true);
                          }}
                        >
                          Accept
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeclineProgram(program.id)}
                        >
                          Decline
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        
        <Dialog open={isAcceptDialogOpen} onOpenChange={setIsAcceptDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Accept Partnership Program</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              {selectedProgram && (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">Program Type:</p>
                    <p>{
                      selectedProgram.program_type === 'commission' ? 'Commission Based' :
                      selectedProgram.program_type === 'free_sample' ? 'Free Product Sample' :
                      'Refundable Sample'
                    }</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">Seller:</p>
                    <p>{selectedProgram.marketplace_sellers?.store_name}</p>
                  </div>
                  
                  {['free_sample', 'refundable_sample'].includes(selectedProgram.program_type) && (
                    <div>
                      <p className="text-sm font-medium">Product:</p>
                      <p>{selectedProgram.marketplace_products?.name || 'Product'}</p>
                      <p className="text-sm text-gray-400">${selectedProgram.marketplace_products?.price?.toFixed(2) || '0.00'}</p>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Message to Seller (Optional):</p>
                    <Textarea
                      placeholder="Add a message about your promotion plans..."
                      value={acceptanceMessage}
                      onChange={(e) => setAcceptanceMessage(e.target.value)}
                      className="h-24"
                    />
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAcceptDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAcceptProgram}>
                Accept Program
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
