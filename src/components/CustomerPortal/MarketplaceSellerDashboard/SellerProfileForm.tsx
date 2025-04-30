
import React from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MarketplaceSeller } from "@/types/marketplace";
import { useMarketplace } from "@/hooks/use-marketplace";
import { Store, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

interface SellerProfileFormProps {
  seller: MarketplaceSeller;
}

export const SellerProfileForm = ({ seller }: SellerProfileFormProps) => {
  const { updateSellerProfile } = useMarketplace();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm({
    defaultValues: {
      store_name: seller.store_name,
      description: seller.description || "",
      about_text: seller.about_text || "",
      return_policy: seller.return_policy || "",
      buyer_protection_policy: seller.buyer_protection_policy || "",
      social_links: {
        twitter: seller.social_links?.twitter || "",
        instagram: seller.social_links?.instagram || "",
        website: seller.social_links?.website || ""
      }
    }
  });

  const onSubmit = async (values: any) => {
    try {
      setIsSubmitting(true);
      await updateSellerProfile({
        store_name: values.store_name,
        description: values.description,
        about_text: values.about_text,
        return_policy: values.return_policy,
        buyer_protection_policy: values.buyer_protection_policy,
        social_links: values.social_links,
      });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Store className="mr-2 h-5 w-5" />
          Edit Store Profile
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label>Store Name</Label>
            <Input {...form.register("store_name")} />
          </div>

          <div className="space-y-2">
            <Label>Short Description</Label>
            <Textarea
              {...form.register("description")}
              placeholder="Brief description of your store"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>About</Label>
            <Textarea
              {...form.register("about_text")}
              placeholder="Tell customers about your store, your story, and what makes you unique..."
              rows={6}
            />
          </div>

          <div className="space-y-2">
            <Label>Return Policy</Label>
            <Textarea
              {...form.register("return_policy")}
              placeholder="Outline your store's return policy..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label>Buyer Protection Policy</Label>
            <Textarea
              {...form.register("buyer_protection_policy")}
              placeholder="Describe any additional buyer protections you offer..."
              rows={4}
            />
          </div>

          <div className="space-y-4">
            <Label>Social Links</Label>
            <div className="space-y-2">
              <Input
                {...form.register("social_links.twitter")}
                placeholder="Twitter URL"
              />
              <Input
                {...form.register("social_links.instagram")}
                placeholder="Instagram URL"
              />
              <Input
                {...form.register("social_links.website")}
                placeholder="Website URL"
              />
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
