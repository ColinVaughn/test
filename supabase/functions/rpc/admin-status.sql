
-- Function to check if a user is an admin
CREATE OR REPLACE FUNCTION public.get_admin_status(user_id_param UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admins
    WHERE user_id = user_id_param
  );
END;
$$;
