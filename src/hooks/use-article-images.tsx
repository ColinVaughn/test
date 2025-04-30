
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

export function useArticleImages() {
  const [isUploading, setIsUploading] = useState(false);

  const uploadCoverImage = async (file: File): Promise<string | null> => {
    try {
      setIsUploading(true);
      
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `covers/${fileName}`;
      
      // Upload the file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('article_images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL for the uploaded file
      const { data } = supabase.storage
        .from('article_images')
        .getPublicUrl(filePath);
        
      return data.publicUrl;
    } catch (error) {
      console.error("Error uploading article cover image:", error);
      toast.error("Failed to upload cover image");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    uploadCoverImage,
  };
}
