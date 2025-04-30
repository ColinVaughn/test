
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface SEOSettingsProps {
  metaDescription: string;
  canonicalUrl: string;
  onMetaDescriptionChange: (value: string) => void;
  onCanonicalUrlChange: (value: string) => void;
}

export const SEOSettings = ({
  metaDescription,
  canonicalUrl,
  onMetaDescriptionChange,
  onCanonicalUrlChange,
}: SEOSettingsProps) => {
  return (
    <div className="space-y-4 border-t pt-4 mt-4">
      <h3 className="text-lg font-medium">SEO Settings</h3>
      
      <div className="space-y-2">
        <Label htmlFor="metaDescription">Meta Description</Label>
        <Textarea
          id="metaDescription"
          value={metaDescription}
          onChange={(e) => onMetaDescriptionChange(e.target.value)}
          placeholder="Enter a meta description for SEO (150-160 characters recommended)"
          rows={3}
        />
        <p className="text-sm text-muted-foreground">
          Characters: {metaDescription.length}/160
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="canonicalUrl">Canonical URL (optional)</Label>
        <Input
          type="url"
          id="canonicalUrl"
          value={canonicalUrl}
          onChange={(e) => onCanonicalUrlChange(e.target.value)}
          placeholder="https://example.com/original-article"
        />
      </div>
    </div>
  );
};
