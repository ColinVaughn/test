
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArticleGallery } from './ArticleGallery';
import { ArticleReactions } from './ArticleReactions';
import { ArticleComments } from './ArticleComments';
import { RelatedArticles } from './RelatedArticles';
import { ArticleMeta } from './ArticleMeta';
import { trackArticleView } from '@/utils/articleUtils';
import { EditorJSRenderer } from '../Admin/ArticleManagement/EditorJSRenderer';

interface Article {
  id: string;
  title: string;
  content: string | object;
  cover_image?: string;
  created_at: string;
  meta_description?: string;
  canonical_url?: string;
  view_count?: number;
}

interface ArticleContentProps {
  article: Article;
}

export const ArticleContent = ({ article }: ArticleContentProps) => {
  // Track article view
  useEffect(() => {
    if (article?.id) {
      trackArticleView(article.id);
    }
  }, [article?.id]);
  
  // Get content for the renderer
  const getProcessedContent = () => {
    if (!article.content) return null;
    
    try {
      // If it's already an object with blocks, we'll pass it as is
      if (typeof article.content === 'object' && article.content !== null) {
        return article.content;
      }
      
      // If it's a string that looks like JSON, we'll try to parse it
      if (typeof article.content === 'string') {
        if (article.content.trim().startsWith('{')) {
          try {
            // We'll let the EditorJSRenderer handle the parsing
            return article.content;
          } catch (e) {
            console.error("Failed to parse article content:", e);
            // Return the string as is
            return article.content;
          }
        }
        // If it doesn't look like JSON, return it as is
        return article.content;
      }
      
      // Fallback for any other case
      return article.content;
    } catch (err) {
      console.error("Error in getProcessedContent:", err);
      return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl">{article.title}</CardTitle>
        <ArticleMeta article={article} />
      </CardHeader>
      
      {article.cover_image && (
        <div className="relative w-full h-64 mb-6">
          <img
            src={article.cover_image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <CardContent>
        {article.content ? (
          <EditorJSRenderer content={getProcessedContent()} />
        ) : (
          <div className="text-muted-foreground py-4">No content available</div>
        )}
        
        <ArticleReactions articleId={article.id} />
        <ArticleGallery articleId={article.id} />
        <ArticleComments articleId={article.id} />
        <RelatedArticles articleId={article.id} />
      </CardContent>
    </Card>
  );
};
