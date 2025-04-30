
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { getRelatedArticles } from '@/utils/articleUtils';
import { Clock } from 'lucide-react';
import { calculateReadingTime } from '@/utils/articleUtils';

interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image: string;
  created_at: string;
}

interface RelatedArticlesProps {
  articleId: string;
}

export function RelatedArticles({ articleId }: RelatedArticlesProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedArticles = async () => {
      try {
        const relatedArticles = await getRelatedArticles(articleId);
        setArticles(relatedArticles);
      } catch (error) {
        console.error('Failed to fetch related articles:', error);
      } finally {
        setLoading(false);
      }
    };

    if (articleId) {
      fetchRelatedArticles();
    }
  }, [articleId]);

  if (loading) {
    return <div className="mt-8 animate-pulse">Loading related articles...</div>;
  }

  if (!articles.length) {
    return null;
  }

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-4">Related Articles</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Card key={article.id} className="h-full flex flex-col">
            <Link to={`/article/${article.slug}`} className="h-full flex flex-col">
              {article.cover_image && (
                <div className="w-full h-40 overflow-hidden">
                  <img 
                    src={article.cover_image} 
                    alt={article.title} 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
              )}
              <CardContent className="flex-grow p-4">
                <h4 className="font-medium text-lg mb-2">{article.title}</h4>
                {article.excerpt && (
                  <p className="text-muted-foreground text-sm line-clamp-2">{article.excerpt}</p>
                )}
              </CardContent>
              <CardFooter className="text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{calculateReadingTime(article.content)} min read</span>
                </div>
              </CardFooter>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
