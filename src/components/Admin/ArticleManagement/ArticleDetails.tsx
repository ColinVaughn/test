
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArticleEditor } from './ArticleEditor';
import { ArticleAnalytics } from './ArticleAnalytics';

interface ArticleDetailsProps {
  articleId: string;
  onBack: () => void;
}

interface Article {
  id: string;
  title: string;
  status: string;
}

export const ArticleDetails = ({ articleId, onBack }: ArticleDetailsProps) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("edit");

  useEffect(() => {
    const loadArticle = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('id, title, status')
          .eq('id', articleId)
          .single();

        if (error) {
          console.error("Error loading article:", error);
          return;
        }

        if (data) {
          setArticle(data);
        }
      } catch (error) {
        console.error("Error loading article:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (articleId) {
      loadArticle();
    }
  }, [articleId]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          Back to Articles
        </Button>
        {article && (
          <h3 className="text-lg font-semibold">
            {article.title}
            <span className={`ml-2 px-2 py-1 rounded text-xs ${
              article.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {article.status}
            </span>
          </h3>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="edit">Edit Article</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="edit">
          <ArticleEditor 
            articleId={articleId} 
            onSuccess={onBack} 
          />
        </TabsContent>
        
        <TabsContent value="analytics">
          <ArticleAnalytics articleId={articleId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
