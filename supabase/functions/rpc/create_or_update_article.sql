
CREATE OR REPLACE FUNCTION public.create_or_update_article(
  p_id UUID DEFAULT NULL,
  p_title TEXT,
  p_content TEXT,
  p_excerpt TEXT,
  p_cover_image TEXT,
  p_featured BOOLEAN,
  p_slug TEXT,
  p_status TEXT DEFAULT 'draft',
  p_meta_description TEXT DEFAULT NULL,
  p_canonical_url TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_article_id UUID;
BEGIN
  -- Get the current user ID
  v_user_id := auth.uid();
  
  -- Check if user is authenticated
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated to perform this action';
  END IF;
  
  -- If we're updating an existing article
  IF p_id IS NOT NULL THEN
    -- Check if the user is the author of the article
    IF NOT EXISTS (
      SELECT 1 FROM public.articles 
      WHERE id = p_id AND author_id = v_user_id
    ) THEN
      -- Check if the user is an admin
      IF NOT EXISTS (
        SELECT 1 FROM public.admins 
        WHERE user_id = v_user_id
      ) THEN
        RAISE EXCEPTION 'You do not have permission to edit this article';
      END IF;
    END IF;
    
    -- Update the article
    UPDATE public.articles
    SET 
      title = p_title,
      content = p_content,
      excerpt = p_excerpt,
      cover_image = p_cover_image,
      featured = p_featured,
      slug = p_slug,
      status = p_status,
      meta_description = p_meta_description,
      canonical_url = p_canonical_url,
      updated_at = now()
    WHERE id = p_id
    RETURNING id INTO v_article_id;
  ELSE
    -- Insert a new article
    INSERT INTO public.articles (
      title, 
      content, 
      excerpt, 
      cover_image, 
      featured, 
      slug, 
      status, 
      author_id,
      meta_description,
      canonical_url
    )
    VALUES (
      p_title,
      p_content,
      p_excerpt,
      p_cover_image,
      p_featured,
      p_slug,
      p_status,
      v_user_id,
      p_meta_description,
      p_canonical_url
    )
    RETURNING id INTO v_article_id;
  END IF;
  
  RETURN v_article_id;
END;
$$;
