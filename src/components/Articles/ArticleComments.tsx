
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { CommentModeration } from './CommentModeration';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  moderation_status: string;
}

export const ArticleComments = ({ articleId }: { articleId: string }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const { currentUser } = useAuth();

  const loadComments = async () => {
    const { data, error } = await supabase
      .from('article_comments')
      .select('*')
      .eq('article_id', articleId)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load comments');
      return;
    }

    setComments(data || []);
  };

  const checkAdminStatus = async () => {
    if (!currentUser) return;

    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('user_id', currentUser.id)
      .single();

    if (!error && data) {
      setIsAdmin(true);
    }
  };

  useEffect(() => {
    loadComments();
    if (currentUser) {
      checkAdminStatus();
    }
  }, [articleId, currentUser]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error('Please log in to comment');
      return;
    }

    const { error } = await supabase
      .from('article_comments')
      .insert([
        {
          article_id: articleId,
          user_id: currentUser.id,
          content: newComment,
        }
      ]);

    if (error) {
      toast.error('Failed to post comment');
      return;
    }

    setNewComment('');
    loadComments();
    toast.success('Comment posted successfully');
  };

  const handleStatusChange = (commentId: string, status: string) => {
    if (status === 'deleted') {
      setComments(comments.filter(comment => comment.id !== commentId));
    } else {
      setComments(comments.map(comment => 
        comment.id === commentId ? {...comment, moderation_status: status} : comment
      ));
    }
  };

  return (
    <div className="space-y-4 mt-8">
      <h3 className="text-2xl font-bold">Comments</h3>
      
      {currentUser ? (
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            required
          />
          <Button type="submit">Post Comment</Button>
        </form>
      ) : (
        <p className="text-muted-foreground">Please log in to comment</p>
      )}

      <div className="space-y-4 mt-6">
        {comments.map((comment) => {
          // Only show approved comments to regular users, admins see all
          if (!isAdmin && comment.moderation_status !== 'approved') {
            return null;
          }
          
          return (
            <div key={comment.id} className="border p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Posted on {new Date(comment.created_at).toLocaleDateString()}
                    {isAdmin && (
                      <span className="ml-2 px-2 py-0.5 text-xs rounded bg-gray-200">
                        {comment.moderation_status}
                      </span>
                    )}
                  </p>
                  <p>{comment.content}</p>
                </div>
              </div>
              
              {isAdmin && (
                <CommentModeration 
                  comment={comment} 
                  onStatusChange={handleStatusChange} 
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
