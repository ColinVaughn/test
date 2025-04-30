
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface CoverImageUploadProps {
  coverImage: string;
  setCoverImage: (url: string) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
}

export const CoverImageUpload: React.FC<CoverImageUploadProps> = ({
  coverImage,
  setCoverImage,
  onFileUpload,
  isUploading
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="coverImage">Cover Image</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Input
            type="file"
            id="coverImageUpload"
            accept="image/*"
            onChange={onFileUpload}
            disabled={isUploading}
            className="mb-2"
          />
          <p className="text-sm text-muted-foreground">
            Upload a new image or provide a URL below
          </p>
        </div>
        <Input
          type="url"
          id="coverImage"
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
          placeholder="Cover Image URL"
          required
        />
      </div>
      {coverImage && (
        <div className="mt-4 relative aspect-video w-full max-w-md overflow-hidden rounded-lg border border-border">
          <img 
            src={coverImage} 
            alt="Cover preview" 
            className="h-full w-full object-cover"
          />
        </div>
      )}
    </div>
  );
};
