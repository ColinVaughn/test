
import React from "react";
import { Button } from "@/components/ui/button";

interface ArticleActionButtonsProps {
  isSubmitting: boolean;
  isUploading: boolean;
  onSaveAsDraft: (e: React.FormEvent) => void;
  onPublish: (e: React.FormEvent) => void;
}

export const ArticleActionButtons: React.FC<ArticleActionButtonsProps> = ({
  isSubmitting,
  isUploading,
  onSaveAsDraft,
  onPublish,
}) => {
  return (
    <div className="flex space-x-2">
      <Button 
        type="submit" 
        disabled={isSubmitting || isUploading}
        onClick={onSaveAsDraft}
      >
        {isSubmitting ? 'Saving...' : 'Save as Draft'}
      </Button>
      <Button 
        type="button" 
        disabled={isSubmitting || isUploading}
        onClick={onPublish}
        variant="outline"
      >
        Save and Publish
      </Button>
    </div>
  );
};
