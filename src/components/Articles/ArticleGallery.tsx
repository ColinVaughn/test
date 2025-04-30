
import React, { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { ResponsiveImage } from "@/components/ui/responsive-image"; 
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";

interface ArticleImage {
  id: string;
  url: string;
  caption?: string;
  alt_text?: string;
  display_order: number;
}

interface ArticleGalleryProps {
  articleId: string;
}

export function ArticleGallery({ articleId }: ArticleGalleryProps) {
  const [images, setImages] = useState<ArticleImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<ArticleImage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      const { data, error } = await supabase
        .from('article_images')
        .select('*')
        .eq('article_id', articleId)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching images:', error);
        return;
      }
      
      setImages(data || []);
      setLoading(false);
    };

    if (articleId) {
      fetchImages();
    }
  }, [articleId]);

  if (loading) {
    return <div className="animate-pulse py-4">Loading gallery...</div>;
  }

  if (!images.length) {
    return null;
  }

  return (
    <div className="my-8">
      <h3 className="text-xl font-semibold mb-4">Image Gallery</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((image) => (
          <Dialog key={image.id}>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                className="p-0 h-auto w-full aspect-square overflow-hidden rounded-md hover:opacity-90" 
                onClick={() => setSelectedImage(image)}
              >
                <ResponsiveImage 
                  src={image.url} 
                  alt={image.alt_text || ''} 
                  aspectRatio={1}
                  className="object-cover w-full h-full transition-transform hover:scale-105"
                />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl p-0 overflow-hidden bg-transparent border-none">
              <div className="bg-background rounded-lg overflow-hidden">
                <div className="relative">
                  <ResponsiveImage 
                    src={image.url} 
                    alt={image.alt_text || ''} 
                    className="w-full h-auto"
                  />
                </div>
                {image.caption && (
                  <div className="p-4 bg-background">
                    <p className="text-center italic">{image.caption}</p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
}
