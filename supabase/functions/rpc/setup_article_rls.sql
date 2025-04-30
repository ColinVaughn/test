
-- Enable Row Level Security on the articles table
ALTER TABLE IF EXISTS public.articles ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to read published articles
CREATE POLICY IF NOT EXISTS "Anyone can view published articles" 
ON public.articles FOR SELECT 
USING (status = 'published');

-- Policy to allow authors to view their own draft articles
CREATE POLICY IF NOT EXISTS "Authors can view their own articles" 
ON public.articles FOR SELECT 
USING (author_id = auth.uid());

-- Policy to allow admins to view all articles
CREATE POLICY IF NOT EXISTS "Admins can view all articles" 
ON public.articles FOR SELECT
USING (EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid()));

-- Policy to allow authors to update their own articles
CREATE POLICY IF NOT EXISTS "Authors can update their own articles" 
ON public.articles FOR UPDATE
USING (author_id = auth.uid());

-- Policy to allow admins to update any article
CREATE POLICY IF NOT EXISTS "Admins can update any article" 
ON public.articles FOR UPDATE
USING (EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid()));

-- Policy to allow admins to delete articles
CREATE POLICY IF NOT EXISTS "Admins can delete articles" 
ON public.articles FOR DELETE
USING (EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid()));
