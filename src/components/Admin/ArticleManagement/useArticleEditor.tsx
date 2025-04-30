
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { saveDraft } from '@/utils/articleUtils';
import { debounce } from 'lodash';

export const useArticleEditor = (articleId?: string) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [metaDescription, setMetaDescription] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load article data including draft content if available
  useEffect(() => {
    if (articleId) {
      loadArticle();
    } else {
      setIsLoading(false);
    }
  }, [articleId]);

  const loadArticle = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', articleId)
        .single();

      if (error) {
        toast.error('Error loading article');
        console.error("Error loading article:", error);
        return;
      }

      if (data) {
        setTitle(data.title || '');
        
        // Determine which content to use:
        // 1. Use draft_content if it exists and article is in draft status
        // 2. Use content in all other cases
        let articleContent = data.content;
        if (data.draft_content && data.status === 'draft') {
          articleContent = data.draft_content;
        }

        // Make sure content is properly formatted
        if (articleContent) {
          console.log("Article content loaded:", typeof articleContent);
          setContent(articleContent);
        } else {
          console.log("No article content found");
          setContent('');
        }
        
        if (data.draft_updated_at) {
          setLastSaved(new Date(data.draft_updated_at));
        }
        
        setExcerpt(data.excerpt || '');
        setCoverImage(data.cover_image || '');
        setMetaDescription(data.meta_description || '');
        setCanonicalUrl(data.canonical_url || '');
        
        // Load categories and tags
        loadArticleRelations(articleId);
      }
    } catch (error) {
      console.error("Error loading article:", error);
      toast.error('Error loading article');
    } finally {
      setIsLoading(false);
    }
  };

  // Load article categories and tags
  const loadArticleRelations = async (articleId: string) => {
    try {
      // Load categories
      const { data: categoryRelations, error: catError } = await supabase
        .from('article_category_relations')
        .select('category_id')
        .eq('article_id', articleId);
      
      if (catError) {
        console.error("Error loading categories:", catError);
      } else if (categoryRelations) {
        const categoryIds = categoryRelations.map(relation => relation.category_id);
        setSelectedCategories(categoryIds);
      }

      // Load tags
      const { data: tagRelations, error: tagError } = await supabase
        .from('article_tag_relations')
        .select('tag_id')
        .eq('article_id', articleId);
      
      if (tagError) {
        console.error("Error loading tags:", tagError);
      } else if (tagRelations) {
        const tagIds = tagRelations.map(relation => relation.tag_id);
        setSelectedTags(tagIds);
      }
    } catch (error) {
      console.error("Error loading article relations:", error);
    }
  };

  // Debounced save draft function
  const debouncedSaveDraft = useCallback(
    debounce(async (id: string, draftContent: string) => {
      setIsSaving(true);
      const success = await saveDraft(id, draftContent);
      setIsSaving(false);
      if (success) {
        setLastSaved(new Date());
      }
    }, 2000),
    []
  );

  // Content change handler with autosave
  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    if (articleId) {
      debouncedSaveDraft(articleId, newContent);
    }
  };

  return {
    title,
    setTitle,
    content,
    setContent: handleContentChange,
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
  };
};
