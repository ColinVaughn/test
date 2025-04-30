
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { CommentModeration } from "@/components/Articles/CommentModeration";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  article_id: string;
  moderation_status: string;
}

interface Article {
  id: string;
  title: string;
}

export function CommentsManager() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<Article[]>([]);
  const [filter, setFilter] = useState({
    status: "all",
    articleId: "all",
    search: ""
  });

  const fetchComments = async () => {
    setLoading(true);
    
    let query = supabase
      .from('article_comments')
      .select(`
        id,
        content,
        created_at,
        user_id,
        article_id,
        moderation_status
      `)
      .order('created_at', { ascending: false });
    
    if (filter.status !== "all") {
      query = query.eq('moderation_status', filter.status);
    }
    
    if (filter.articleId !== "all") {
      query = query.eq('article_id', filter.articleId);
    }
    
    if (filter.search) {
      query = query.ilike('content', `%${filter.search}%`);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching comments:", error);
      setLoading(false);
      return;
    }
    
    setComments(data || []);
    setLoading(false);
  };
  
  const fetchArticles = async () => {
    const { data } = await supabase
      .from('articles')
      .select('id, title')
      .order('created_at', { ascending: false });
    
    setArticles(data || []);
  };

  useEffect(() => {
    fetchComments();
    fetchArticles();
  }, []);
  
  useEffect(() => {
    fetchComments();
  }, [filter]);

  const handleStatusChange = (commentId: string, status: string) => {
    if (status === 'deleted') {
      setComments(comments.filter(comment => comment.id !== commentId));
    } else {
      setComments(comments.map(comment => 
        comment.id === commentId ? {...comment, moderation_status: status} : comment
      ));
    }
  };

  const getArticleTitle = (articleId: string) => {
    const article = articles.find(a => a.id === articleId);
    return article ? article.title : 'Unknown Article';
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Comment Moderation</h2>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-1/3">
          <Input 
            placeholder="Search comment content..." 
            value={filter.search}
            onChange={(e) => setFilter({...filter, search: e.target.value})}
          />
        </div>
        
        <Select
          value={filter.status}
          onValueChange={(value) => setFilter({...filter, status: value})}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        
        <Select
          value={filter.articleId}
          onValueChange={(value) => setFilter({...filter, articleId: value})}
        >
          <SelectTrigger className="w-full sm:w-[220px]">
            <SelectValue placeholder="Filter by article" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Articles</SelectItem>
            {articles.map((article) => (
              <SelectItem key={article.id} value={article.id}>
                {article.title.length > 20 ? article.title.substring(0, 20) + "..." : article.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button variant="outline" onClick={() => fetchComments()}>
          Refresh
        </Button>
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin h-8 w-8 border-4 border-current border-t-transparent rounded-full"></div>
          <p className="mt-2">Loading comments...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 bg-muted/20 rounded-lg">
          <p>No comments found matching your criteria</p>
        </div>
      ) : (
        <Table>
          <TableCaption>List of article comments</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Article</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comments.map((comment) => (
              <TableRow key={comment.id} className="group">
                <TableCell className="font-medium max-w-[150px] truncate">
                  {getArticleTitle(comment.article_id)}
                </TableCell>
                <TableCell className="max-w-[300px]">
                  <div className="line-clamp-3">{comment.content}</div>
                </TableCell>
                <TableCell>{new Date(comment.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs ${
                    comment.moderation_status === 'approved' ? 'bg-green-100 text-green-800' :
                    comment.moderation_status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {comment.moderation_status.charAt(0).toUpperCase() + comment.moderation_status.slice(1)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <CommentModeration 
                    comment={comment}
                    onStatusChange={handleStatusChange}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
