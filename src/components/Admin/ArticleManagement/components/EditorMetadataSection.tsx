
import React from "react";
import { SEOSettings } from "../SEOSettings";
import { CategoryTagSelect } from "../CategoryTagSelect";

interface EditorMetadataSectionProps {
  metaDescription: string;
  canonicalUrl: string;
  setMetaDescription: (value: string) => void;
  setCanonicalUrl: (value: string) => void;
  articleId?: string;
  onCategoriesChange: (categories: string[]) => void;
  onTagsChange: (tags: string[]) => void;
}

export const EditorMetadataSection: React.FC<EditorMetadataSectionProps> = ({
  metaDescription,
  canonicalUrl,
  setMetaDescription,
  setCanonicalUrl,
  articleId,
  onCategoriesChange,
  onTagsChange,
}) => {
  return (
    <>
      <SEOSettings
        metaDescription={metaDescription}
        canonicalUrl={canonicalUrl}
        onMetaDescriptionChange={setMetaDescription}
        onCanonicalUrlChange={setCanonicalUrl}
      />

      <CategoryTagSelect
        articleId={articleId}
        onCategoriesChange={onCategoriesChange}
        onTagsChange={onTagsChange}
      />
    </>
  );
};
