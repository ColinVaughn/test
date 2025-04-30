
import React from 'react';
import { Share2, Facebook, Twitter, Linkedin, Copy, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { trackArticleShare } from '@/utils/articleUtils';

interface ArticleShareProps {
  title: string;
  url: string;
  articleId?: string;
}

export const ArticleShare = ({ title, url, articleId }: ArticleShareProps) => {
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  const handleShare = (platform: string) => {
    if (articleId) {
      trackArticleShare(articleId);
    }
    
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodedTitle}&body=${encodedUrl}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url)
          .then(() => toast.success('Link copied to clipboard'))
          .catch(() => toast.error('Failed to copy link'));
        return;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="flex items-center text-sm text-muted-foreground">
        <Share2 className="h-4 w-4 mr-1" /> Share: 
      </span>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 rounded-full" 
        onClick={() => handleShare('facebook')}
      >
        <Facebook className="h-4 w-4 text-blue-600" />
        <span className="sr-only">Share on Facebook</span>
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 rounded-full" 
        onClick={() => handleShare('twitter')}
      >
        <Twitter className="h-4 w-4 text-blue-400" />
        <span className="sr-only">Share on Twitter</span>
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 rounded-full"
        onClick={() => handleShare('linkedin')}
      >
        <Linkedin className="h-4 w-4 text-blue-700" />
        <span className="sr-only">Share on LinkedIn</span>
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 rounded-full" 
        onClick={() => handleShare('email')}
      >
        <Mail className="h-4 w-4" />
        <span className="sr-only">Share via Email</span>
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 rounded-full" 
        onClick={() => handleShare('copy')}
      >
        <Copy className="h-4 w-4" />
        <span className="sr-only">Copy Link</span>
      </Button>
    </div>
  );
};
