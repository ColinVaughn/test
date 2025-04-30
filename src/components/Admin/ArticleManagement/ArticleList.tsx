
import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Eye, TrendingUp } from "lucide-react";

interface Article {
  id: string;
  title: string;
  status: string;
  created_at: string;
  published_at: string | null;
  view_count: number;
}

interface ArticleListProps {
  onEdit: (id: string) => void;
}

export const ArticleList = ({ onEdit }: ArticleListProps) => {
  const [articles, setArticles] = React.useState<Article[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const loadArticles = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('articles')
        .select('id, title, status, created_at, published_at, view_count')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error loading articles:", error);
        toast.error(`Failed to load articles: ${error.message}`);
        return;
      }
      
      console.log("Fetched articles:", data);
      setArticles(data || []);
    } catch (error: any) {
      console.error('Error loading articles:', error);
      toast.error(`Failed to load articles: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    loadArticles();
  }, []);

  const togglePublish = async (article: Article) => {
    try {
      const newStatus = article.status === 'published' ? 'draft' : 'published';
      const { error } = await supabase
        .from('articles')
        .update({
          status: newStatus,
          published_at: newStatus === 'published' ? new Date().toISOString() : null
        })
        .eq('id', article.id);

      if (error) {
        console.error("Error updating article status:", error);
        toast.error(`Failed to update article status: ${error.message}`);
        return;
      }
      
      toast.success(`Article ${newStatus === 'published' ? 'published' : 'unpublished'}`);
      loadArticles();
    } catch (error: any) {
      console.error('Error toggling article status:', error);
      toast.error(`Failed to update article status: ${error.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {articles.length === 0 ? (
            <div className="text-center py-8">
              <p>No articles found. Create your first article!</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {articles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell>{article.title}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${
                        article.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {article.status}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(article.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="flex items-center gap-1">
                      <Eye className="h-3 w-3" /> {article.view_count || 0}
                    </TableCell>
                    <TableCell className="space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onEdit(article.id)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant={article.status === 'published' ? "destructive" : "default"}
                        size="sm"
                        onClick={() => togglePublish(article)}
                      >
                        {article.status === 'published' ? 'Unpublish' : 'Publish'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </>
      )}
    </div>
  );
};
