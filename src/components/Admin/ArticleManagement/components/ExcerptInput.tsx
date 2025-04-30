
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ExcerptInputProps {
  excerpt: string;
  setExcerpt: (excerpt: string) => void;
}

export const ExcerptInput: React.FC<ExcerptInputProps> = ({ excerpt, setExcerpt }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="excerpt">Excerpt</Label>
      <Textarea
        id="excerpt"
        value={excerpt}
        onChange={(e) => setExcerpt(e.target.value)}
        placeholder="Article Excerpt"
        rows={4}
        required
      />
    </div>
  );
};
