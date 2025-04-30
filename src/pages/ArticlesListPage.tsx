
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArticleSearch } from '@/components/Articles/ArticleSearch';
import { Clock } from 'lucide-react';
import { toast } from "sonner";
import { calculateReadingTime } from '@/utils/articleUtils';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  created_at: string;
  featured: boolean;
}

export default function ArticlesListPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) {
        toast.error('Failed to load articles');
        setLoading(false);
        return;
      }

      setArticles(data || []);
      setLoading(false);
    };

    fetchArticles();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">BattleforgePC Articles</h1>
          <ArticleSearch />
        </div>

        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gaming-blue"></div>
          </div>
        )}

        {!loading && articles.length === 0 && (
          <div className="text-center py-12">
            <p>No articles found.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Card key={article.id} className="h-full flex flex-col">
              <Link to={`/article/${article.slug}`}>
                {article.cover_image && (
                  <div className="w-full h-48 overflow-hidden">
                    <img 
                      src={article.cover_image} 
                      alt={article.title} 
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{article.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground line-clamp-3">{article.excerpt}</p>
                </CardContent>
                <CardFooter className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{calculateReadingTime(article.content)} min read</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{new Date(article.created_at).toLocaleDateString()}</span>
                    {article.featured && (
                      <span className="bg-gaming-blue/20 text-gaming-blue px-2 py-1 rounded text-xs">Featured</span>
                    )}
                  </div>
                </CardFooter>
              </Link>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
