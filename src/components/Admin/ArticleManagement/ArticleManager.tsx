
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArticleList } from "./ArticleList";
import { ArticleEditor } from "./ArticleEditor";
import { CategoryTagManager } from "./CategoryTagManager";
import { CommentsManager } from "./CommentsManager";
import { ArticleDetails } from "./ArticleDetails";

export const ArticleManager = () => {
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    setEditingArticleId(null);
    setIsCreating(false);
    setRefreshKey(prevKey => prevKey + 1);
  };

  if (editingArticleId) {
    return (
      <ArticleDetails 
        articleId={editingArticleId}
        onBack={() => setEditingArticleId(null)} 
      />
    );
  }

  if (isCreating) {
    return (
      <div className="space-y-4">
        <Button 
          variant="outline" 
          onClick={() => setIsCreating(false)}
        >
          Back to Articles
        </Button>
        <ArticleEditor 
          onSuccess={handleSuccess}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="articles">
        <TabsList>
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="categories">Categories & Tags</TabsTrigger>
        </TabsList>
        
        <TabsContent value="articles" className="space-y-4">
          <Button onClick={() => setIsCreating(true)}>
            Create New Article
          </Button>
          <ArticleList 
            key={refreshKey} 
            onEdit={setEditingArticleId} 
          />
        </TabsContent>
        
        <TabsContent value="comments">
          <CommentsManager />
        </TabsContent>
        
        <TabsContent value="categories">
          <CategoryTagManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};
