
import React, { useEffect } from 'react';
import { Clock, Eye } from 'lucide-react';
import { calculateReadingTime } from '@/utils/articleUtils';
import { ArticleShare } from './ArticleShare';

interface Article {
  title: string;
  content: string | object;
  created_at: string;
  meta_description?: string;
  canonical_url?: string;
  id: string;
  view_count?: number;
}

interface ArticleMetaProps {
  article: Article;
}

export const ArticleMeta = ({ article }: ArticleMetaProps) => {
  useEffect(() => {
    if (article) {
      document.title = `${article.title} | BattleforgePC`;
      
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription && article.meta_description) {
        metaDescription.setAttribute('content', article.meta_description);
      }

      // Add canonical URL if provided
      if (article.canonical_url) {
        let canonicalLink = document.querySelector('link[rel="canonical"]');
        if (!canonicalLink) {
          canonicalLink = document.createElement('link');
          canonicalLink.setAttribute('rel', 'canonical');
          document.head.appendChild(canonicalLink);
        }
        canonicalLink.setAttribute('href', article.canonical_url);
      }
    }
    
    return () => {
      document.title = 'BattleforgePC';
      
      // Clean up canonical link
      const canonicalLink = document.querySelector('link[rel="canonical"]');
      if (canonicalLink) {
        document.head.removeChild(canonicalLink);
      }
    };
  }, [article]);

  const readingTime = calculateReadingTime(article.content);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2 text-muted-foreground flex-wrap">
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>{readingTime} min read</span>
        </div>
        
        <span className="mx-2">•</span>
        
        <div className="flex items-center gap-1">
          <Eye className="h-4 w-4" />
          <span>{article.view_count || 0} views</span>
        </div>
        
        <span className="mx-2">•</span>
        
        <span>{new Date(article.created_at).toLocaleDateString()}</span>
      </div>
      
      <ArticleShare 
        title={article.title} 
        url={window.location.href}
        articleId={article.id}
      />
    </div>
  );
};
