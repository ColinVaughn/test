
import React, { useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useArticleEditor } from "./useArticleEditor";
import { useArticleImages } from "@/hooks/use-article-images";
import { EditorJSHandle } from "./EditorJS";
import { ArticleActionButtons } from "./components/ArticleActionButtons";
import { EditorFormContainer } from "./components/EditorFormContainer";
import { EditorFormFields } from "./components/EditorFormFields";
import { EditorMetadataSection } from "./components/EditorMetadataSection";

interface ArticleEditorProps {
  articleId?: string;
  onSuccess: () => void;
}

export const ArticleEditor = ({ articleId, onSuccess }: ArticleEditorProps) => {
  const { currentUser } = useAuth();
  const { isUploading, uploadCoverImage } = useArticleImages();
  const editorRef = useRef<EditorJSHandle>(null);
  const {
    title,
    setTitle,
    content,
    setContent,
    excerpt,
    setExcerpt,
    coverImage,
    setCoverImage,
    selectedCategories,
    setSelectedCategories,
    selectedTags,
    setSelectedTags,
    metaDescription,
    setMetaDescription,
    canonicalUrl,
    setCanonicalUrl,
    isSubmitting,
    setIsSubmitting,
    lastSaved,
    isSaving,
    isLoading
  } = useArticleEditor(articleId);

  const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const imageUrl = await uploadCoverImage(file);
    
    if (imageUrl) {
      setCoverImage(imageUrl);
      toast.success("Cover image uploaded successfully");
    }
  };

  const handleSubmit = async (e: React.FormEvent, publishNow: boolean = false) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error("You must be logged in to perform this action");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Save EditorJS content
      let finalContent = content;
      if (editorRef.current) {
        finalContent = await editorRef.current.save();
      }
      
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const currentStatus = publishNow ? 'published' : 'draft';
      
      const { data: articleId_new, error } = await supabase.rpc(
        'create_or_update_article',
        {
          p_id: articleId || null,
          p_title: title,
          p_content: finalContent,
          p_excerpt: excerpt,
          p_cover_image: coverImage,
          p_featured: false,
          p_slug: slug,
          p_status: currentStatus,
          p_meta_description: metaDescription,
          p_canonical_url: canonicalUrl
        }
      );

      if (error) {
        console.error("Error saving article:", error);
        toast.error(`Error saving article: ${error.message}`);
        return;
      }

      if (articleId_new) {
        await updateCategoriesAndTags(articleId_new);
      }

      toast.success(`Article ${articleId ? 'updated' : 'created'} successfully`);
      onSuccess();
    } catch (error: any) {
      console.error("Exception in saving article:", error);
      toast.error(`Error saving article: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateCategoriesAndTags = async (articleId: string) => {
    await supabase
      .from('article_category_relations')
      .delete()
      .eq('article_id', articleId);

    if (selectedCategories.length > 0) {
      await supabase
        .from('article_category_relations')
        .insert(selectedCategories.map(categoryId => ({
          article_id: articleId,
          category_id: categoryId
        })));
    }

    await supabase
      .from('article_tag_relations')
      .delete()
      .eq('article_id', articleId);

    if (selectedTags.length > 0) {
      await supabase
        .from('article_tag_relations')
        .insert(selectedTags.map(tagId => ({
          article_id: articleId,
          tag_id: tagId
        })));
    }
  };

  return (
    <EditorFormContainer 
      title={articleId ? "Edit Article" : "Create Article"}
      onSubmit={(e) => handleSubmit(e)}
    >
      <EditorFormFields
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        excerpt={excerpt}
        setExcerpt={setExcerpt}
        coverImage={coverImage}
        setCoverImage={setCoverImage}
        handleCoverImageUpload={handleCoverImageUpload}
        isUploading={isUploading}
        isSaving={isSaving}
        lastSaved={lastSaved}
        editorRef={editorRef}
        isLoading={isLoading}
      />
      
      <EditorMetadataSection
        metaDescription={metaDescription}
        canonicalUrl={canonicalUrl}
        setMetaDescription={setMetaDescription}
        setCanonicalUrl={setCanonicalUrl}
        articleId={articleId}
        onCategoriesChange={setSelectedCategories}
        onTagsChange={setSelectedTags}
      />

      <ArticleActionButtons
        isSubmitting={isSubmitting}
        isUploading={isUploading}
        onSaveAsDraft={handleSubmit}
        onPublish={(e) => handleSubmit(e, true)}
      />
    </EditorFormContainer>
  );
};
