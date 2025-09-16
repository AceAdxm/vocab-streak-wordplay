-- Configure authentication settings for seamless sign-in

-- Disable email confirmation requirement for faster testing
-- Note: This would typically be done in the Supabase dashboard under Authentication > Settings
-- But we can set up the redirect URLs and other configurations via SQL

-- Enable Google OAuth provider (this needs to be configured in the dashboard with actual Google OAuth credentials)
-- Note: The user will need to:
-- 1. Go to Google Cloud Console and create OAuth 2.0 credentials
-- 2. Add the credentials to Supabase Auth settings
-- 3. Set up the redirect URLs properly

-- For now, let's ensure our database is ready for Google auth users
-- Google auth users might not have a username initially, so let's update our trigger

-- Update the handle_new_user function to handle Google auth users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username)
  VALUES (
    NEW.id, 
    COALESCE(
      NEW.raw_user_meta_data ->> 'username',
      NEW.raw_user_meta_data ->> 'full_name',
      NEW.raw_user_meta_data ->> 'name',
      split_part(NEW.email, '@', 1)
    )
  );
  RETURN NEW;
END;
$$;