
import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface ArticleReactionsProps {
  articleId: string;
}

export const ArticleReactions = ({ articleId }: ArticleReactionsProps) => {
  const { currentUser } = useAuth();
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadReactions();
  }, [articleId]);

  const loadReactions = async () => {
    const { data: reactions } = await supabase
      .from('article_reactions')
      .select('reaction_type')
      .eq('article_id', articleId);

    if (reactions) {
      setLikes(reactions.filter(r => r.reaction_type === 'like').length);
      setDislikes(reactions.filter(r => r.reaction_type === 'dislike').length);
    }

    // Load user's reaction if logged in
    if (currentUser) {
      const { data: userReaction } = await supabase
        .from('article_reactions')
        .select('reaction_type')
        .eq('article_id', articleId)
        .eq('user_id', currentUser.id)
        .single();

      if (userReaction) {
        setUserReaction(userReaction.reaction_type);
      }
    }
  };

  const handleReaction = async (type: 'like' | 'dislike') => {
    try {
      setLoading(true);

      if (!currentUser) {
        toast.error('Please sign in to react to articles');
        return;
      }

      if (userReaction === type) {
        // Remove reaction
        await supabase
          .from('article_reactions')
          .delete()
          .eq('article_id', articleId)
          .eq('user_id', currentUser.id);
        setUserReaction(null);
      } else {
        // Upsert reaction
        await supabase
          .from('article_reactions')
          .upsert({
            article_id: articleId,
            user_id: currentUser.id,
            reaction_type: type
          }, {
            onConflict: 'article_id,user_id'
          });
        setUserReaction(type);
      }

      await loadReactions();
    } catch (error) {
      console.error('Error handling reaction:', error);
      toast.error('Failed to save reaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4 py-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleReaction('like')}
        disabled={loading}
        className={userReaction === 'like' ? 'bg-green-100' : ''}
      >
        <ThumbsUp className="w-4 h-4 mr-2" />
        {likes}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleReaction('dislike')}
        disabled={loading}
        className={userReaction === 'dislike' ? 'bg-red-100' : ''}
      >
        <ThumbsDown className="w-4 h-4 mr-2" />
        {dislikes}
      </Button>
    </div>
  );
};
