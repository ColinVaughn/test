
import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { RMARequest } from "../types/AdminTypes";
import type { Json } from "@/integrations/supabase/types";

export const useRMARequests = () => {
  const [requests, setRequests] = useState<RMARequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<RMARequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("rma_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Convert items from Json to string[]
      const formattedRequests = (data || []).map(request => ({
        ...request,
        items: request.items ? (request.items as Json[]).map(String) : []
      })) as RMARequest[];

      setRequests(formattedRequests);
    } catch (error) {
      console.error("Error fetching RMA requests:", error);
      toast.error("Could not load RMA requests");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Add effect to fetch requests when component mounts
  useEffect(() => {
    console.log("RMA Requests - Fetching data on mount");
    fetchRequests();
  }, [fetchRequests]);

  const updateRequestStatus = useCallback(async (requestId: string, status: string) => {
    try {
      const { error } = await supabase
        .from("rma_requests")
        .update({ status })
        .eq("id", requestId);

      if (error) throw error;
      
      // Update local state
      setRequests(prev => prev.map(req => 
        req.id === requestId ? { ...req, status } : req
      ));
      
      if (selectedRequest?.id === requestId) {
        setSelectedRequest(prev => prev ? { ...prev, status } : null);
      }

      toast.success("RMA request status updated");
    } catch (error) {
      console.error("Error updating RMA status:", error);
      toast.error("Could not update RMA status");
    }
  }, [selectedRequest]);

  return {
    requests,
    isLoading,
    selectedRequest,
    setSelectedRequest,
    fetchRequests,
    updateRequestStatus
  };
};
