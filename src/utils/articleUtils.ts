import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

export const calculateReadingTime = (content: string | object): number => {
  const wordsPerMinute = 200;
  let text = "";
  
  // Handle different content types
  if (typeof content === 'string') {
    text = content;
  } else if (content && typeof content === 'object') {
    // If it's an EditorJS object with blocks, extract text from all blocks
    try {
      const contentObj = content as any;
      if (contentObj.blocks) {
        // Combine text from all blocks
        text = contentObj.blocks
          .map((block: any) => {
            if (block.type === 'paragraph' && block.data?.text) {
              return block.data.text;
            } else if (block.type === 'header' && block.data?.text) {
              return block.data.text;
            } else if (block.type === 'list' && Array.isArray(block.data?.items)) {
              return block.data.items.join(' ');
            }
            return '';
          })
          .join(' ');
      } else {
        // Fallback: convert object to string
        text = JSON.stringify(content);
      }
    } catch (error) {
      console.error('Error extracting text from content:', error);
      text = '';
    }
  }
  
  // Calculate word count and reading time
  const wordCount = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute)); // At least 1 minute
};

export const getRelatedArticleTags = async (articleId: string) => {
  const { data: tags, error } = await supabase
    .from('article_tag_relations')
    .select('tag_id')
    .eq('article_id', articleId);
  
  if (error || !tags?.length) return [];
  return tags.map(tag => tag.tag_id);
};

export const getRelatedArticles = async (currentArticleId: string, limit = 3) => {
  // First try to get related articles by tags
  const tagIds = await getRelatedArticleTags(currentArticleId);
  
  if (tagIds.length > 0) {
    const { data } = await supabase
      .from('article_tag_relations')
      .select('article_id')
      .in('tag_id', tagIds)
      .neq('article_id', currentArticleId)
      .limit(limit);
    
    if (data && data.length > 0) {
      const relatedIds = data.map(item => item.article_id);
      const { data: articles } = await supabase
        .from('articles')
        .select('*')
        .in('id', relatedIds)
        .eq('status', 'published')
        .limit(limit);
      
      if (articles && articles.length > 0) {
        return articles;
      }
    }
  }
  
  // Fallback: Get recent articles excluding current one
  const { data: recentArticles } = await supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .neq('id', currentArticleId)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  return recentArticles || [];
};

// New function to track article view
export const trackArticleView = async (articleId: string) => {
  try {
    // Generate a unique visitor ID if not exists
    let visitorId = localStorage.getItem('article_visitor_id');
    if (!visitorId) {
      visitorId = uuidv4();
      localStorage.setItem('article_visitor_id', visitorId);
    }

    // Record the view
    await supabase
      .from('article_views')
      .insert({
        article_id: articleId,
        visitor_id: visitorId
      });
    
    // Call the RPC function to increment analytics
    await supabase.rpc('increment_article_view', {
      article_id_param: articleId,
      visitor_id: visitorId
    });
  } catch (error) {
    console.error('Error tracking article view:', error);
  }
};

// Track article share
export const trackArticleShare = async (articleId: string) => {
  try {
    // First, fetch the current share count
    const { data, error: fetchError } = await supabase
      .from('articles')
      .select('share_count')
      .eq('id', articleId)
      .single();
    
    if (fetchError) {
      console.error('Error fetching share count:', fetchError);
      return;
    }
    
    // Then update with incremented value
    const newShareCount = (data?.share_count || 0) + 1;
    
    const { error: updateError } = await supabase
      .from('articles')
      .update({ share_count: newShareCount })
      .eq('id', articleId);
      
    if (updateError) {
      console.error('Error updating share count:', updateError);
    }
  } catch (error) {
    console.error('Error tracking article share:', error);
  }
};

// Auto-save article draft
export const saveDraft = async (articleId: string, draftContent: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('articles')
      .update({
        draft_content: draftContent,
        draft_updated_at: new Date().toISOString()
      })
      .eq('id', articleId);
    
    if (error) {
      console.error('Error saving draft:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Exception saving draft:', error);
    return false;
  }
};
