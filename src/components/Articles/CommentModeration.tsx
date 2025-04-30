
import React, { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  moderation_status: string;
}

interface CommentModerationProps {
  comment: Comment;
  onStatusChange: (id: string, status: string) => void;
}

export function CommentModeration({ comment, onStatusChange }: CommentModerationProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const updateStatus = async (status: string) => {
    setIsLoading(true);
    
    const { error } = await supabase
      .from('article_comments')
      .update({ moderation_status: status })
      .eq('id', comment.id);
    
    setIsLoading(false);
    
    if (error) {
      toast.error(`Failed to update comment status: ${error.message}`);
      return;
    }
    
    toast.success(`Comment ${status}`);
    onStatusChange(comment.id, status);
  };

  const deleteComment = async () => {
    setIsLoading(true);
    
    const { error } = await supabase
      .from('article_comments')
      .delete()
      .eq('id', comment.id);
    
    setIsLoading(false);
    setDeleteDialogOpen(false);
    
    if (error) {
      toast.error(`Failed to delete comment: ${error.message}`);
      return;
    }
    
    toast.success('Comment deleted');
    onStatusChange(comment.id, 'deleted');
  };

  return (
    <div className="flex justify-end space-x-2 mt-2">
      {comment.moderation_status === 'pending' && (
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => updateStatus('approved')}
          disabled={isLoading}
        >
          Approve
        </Button>
      )}
      
      {comment.moderation_status !== 'rejected' && (
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => updateStatus('rejected')}
          disabled={isLoading}
        >
          Reject
        </Button>
      )}
      
      <Button 
        size="sm" 
        variant="destructive" 
        onClick={() => setDeleteDialogOpen(true)}
        disabled={isLoading}
      >
        Delete
      </Button>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the comment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteComment}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
