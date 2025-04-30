
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

/**
 * Uploads an image to Supabase storage
 * @param file - The file to upload
 * @returns The public URL of the uploaded image or empty string if upload failed
 */
export const uploadImageToSupabase = async (file: File): Promise<string> => {
  try {
    // Create a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `editor/${fileName}`;
    
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
    console.error("Error uploading image:", error);
    toast.error("Failed to upload image");
    return '';
  }
};
