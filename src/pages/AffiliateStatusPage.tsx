
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AffiliateStatusPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [affiliateStatus, setAffiliateStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      checkAffiliateStatus();
    }
  }, [currentUser]);

  const checkAffiliateStatus = async () => {
    try {
      const { data, error } = await supabase
        .from("affiliates")
        .select("*")
        .eq("user_id", currentUser?.id)
        .single();

      if (error) throw error;
      setAffiliateStatus(data);
    } catch (error) {
      console.error("Error checking affiliate status:", error);
      toast.error("Failed to load affiliate status");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gaming-darker">
      <Header />
      <main className="container mx-auto py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-gaming-blue mb-8">Affiliate Application Status</h1>
          
          <Card className="p-6 space-y-4">
            {affiliateStatus ? (
              <>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">
                    Application Status: {" "}
                    <span className={
                      affiliateStatus.application_status === "approved" ? "text-green-500" :
                      affiliateStatus.application_status === "rejected" ? "text-red-500" :
                      "text-yellow-500"
                    }>
                      {affiliateStatus.application_status.toUpperCase()}
                    </span>
                  </h2>
                  
                  {affiliateStatus.application_status === "approved" && (
                    <div className="space-y-4">
                      <div>
                        <p className="text-lg font-medium">Your Affiliate Code</p>
                        <p className="text-2xl font-bold text-gaming-blue">{affiliateStatus.code}</p>
                      </div>
                      <div>
                        <p className="text-lg font-medium">Your Affiliate Link</p>
                        <p className="text-sm break-all text-gaming-blue">
                          {`${window.location.origin}/?ref=${affiliateStatus.code}`}
                        </p>
                      </div>
                      <Button 
                        onClick={() => navigate("/affiliate/dashboard")}
                        className="w-full"
                      >
                        Go to Affiliate Dashboard
                      </Button>
                    </div>
                  )}
                  
                  {affiliateStatus.application_status === "rejected" && (
                    <div>
                      <p className="text-red-500">
                        Reason: {affiliateStatus.rejection_reason || "No reason provided"}
                      </p>
                    </div>
                  )}
                  
                  {affiliateStatus.application_status === "pending" && (
                    <p>
                      Your application is currently under review. We'll notify you once a decision has been made.
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center space-y-4">
                <p>You haven't applied to our affiliate program yet.</p>
                <Button onClick={() => navigate("/affiliate/apply")}>
                  Apply Now
                </Button>
              </div>
            )}
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AffiliateStatusPage;
