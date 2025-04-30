
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const AffiliateApplicationPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    website: "",
    bio: "",
    affiliateCode: "",
    socialMedia: {
      twitter: "",
      instagram: "",
      youtube: ""
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error("Please sign in to apply");
      navigate("/auth");
      return;
    }

    if (!formData.affiliateCode) {
      toast.error("Please enter your desired affiliate code");
      return;
    }

    setLoading(true);
    try {
      // Check if code already exists
      const { data: existingCode } = await supabase
        .from("affiliates")
        .select("code")
        .eq("code", formData.affiliateCode)
        .single();

      if (existingCode) {
        toast.error("This affiliate code is already taken. Please choose another one.");
        setLoading(false);
        return;
      }

      const { error } = await supabase.from("affiliates").insert({
        user_id: currentUser.id,
        website: formData.website,
        bio: formData.bio,
        social_media: formData.socialMedia,
        application_status: "pending",
        code: formData.affiliateCode
      });

      if (error) throw error;

      toast.success("Application submitted successfully!");
      navigate("/affiliate/status");
    } catch (error: any) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gaming-darker">
      <Header />
      <main className="container mx-auto py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-gaming-blue mb-8">Affiliate Program Application</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6 bg-gaming-dark/30 p-6 rounded-lg">
            <div>
              <label className="block text-sm font-medium mb-2">Desired Affiliate Code</label>
              <Input
                required
                value={formData.affiliateCode}
                onChange={(e) => setFormData(prev => ({ ...prev, affiliateCode: e.target.value }))}
                placeholder="Enter your desired affiliate code"
                pattern="[a-zA-Z0-9]+"
                title="Only letters and numbers are allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Website (Optional)</label>
              <Input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                placeholder="https://yourwebsite.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Bio</label>
              <Textarea
                required
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell us about yourself and why you'd be a great affiliate..."
                className="h-32"
              />
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Social Media (Optional)</h3>
              
              <div>
                <label className="block text-sm mb-1">Twitter</label>
                <Input
                  value={formData.socialMedia.twitter}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    socialMedia: { ...prev.socialMedia, twitter: e.target.value }
                  }))}
                  placeholder="@username"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Instagram</label>
                <Input
                  value={formData.socialMedia.instagram}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    socialMedia: { ...prev.socialMedia, instagram: e.target.value }
                  }))}
                  placeholder="@username"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">YouTube</label>
                <Input
                  value={formData.socialMedia.youtube}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    socialMedia: { ...prev.socialMedia, youtube: e.target.value }
                  }))}
                  placeholder="Channel URL"
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Submitting..." : "Submit Application"}
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AffiliateApplicationPage;
