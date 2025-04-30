
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FileText } from "lucide-react";
import { format } from "date-fns";
import CreateRMARequest from "./CreateRMARequest";

interface RMARequest {
  id: string;
  order_id: string;
  reason: string;
  status: string;
  created_at: string;
}

const RMARequests = () => {
  const [requests, setRequests] = useState<RMARequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const { currentUser } = useAuth();

  // Function to fetch RMA requests
  const fetchRequests = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("rma_requests")
        .select("*")
        .eq("user_id", currentUser.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error("Error fetching RMA requests:", error);
      toast.error("Could not load RMA requests");
    } finally {
      setLoading(false);
    }
  };

  // Fetch requests on component mount and when currentUser changes
  useEffect(() => {
    if (currentUser) {
      fetchRequests();
    }
  }, [currentUser]);

  // Listen for changes in the RMA requests table
  useEffect(() => {
    if (!currentUser) return;
    
    const channel = supabase
      .channel('rma_status_changes')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'rma_requests',
          filter: `user_id=eq.${currentUser.id}`
        }, 
        (payload) => {
          console.log('RMA request updated:', payload);
          fetchRequests();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser]);

  const handleRefresh = () => {
    fetchRequests();
    toast.info("Refreshing RMA requests...");
  };

  if (showCreate) {
    return <CreateRMARequest onClose={() => {
      setShowCreate(false);
      fetchRequests(); // Refresh data when returning from create form
    }} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">RMA Requests</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
          <Button onClick={() => setShowCreate(true)}>New RMA Request</Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading RMA requests...</div>
      ) : requests.length === 0 ? (
        <div className="text-center py-12 bg-gaming-dark/30 rounded-lg">
          <FileText className="mx-auto w-16 h-16 text-gray-500 mb-4" />
          <h3 className="text-xl font-medium mb-2">No RMA requests</h3>
          <p className="text-gray-400 mb-6">You haven't submitted any RMA requests yet</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {requests.map((request) => (
            <div key={request.id} className="bg-gaming-dark/30 p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-mono text-sm text-gray-400">Request #{request.id.substring(0, 8)}...</p>
                  <p className="text-sm text-gray-300">{format(new Date(request.created_at), "MMM d, yyyy")}</p>
                  <p className="mt-2">{request.reason}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    request.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' : 
                    request.status === 'approved' ? 'bg-green-500/20 text-green-300' :
                    request.status === 'rejected' ? 'bg-red-500/20 text-red-300' :
                    'bg-gaming-dark'
                  } capitalize`}>
                    {request.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RMARequests;
