-- Configure Supabase to allow sign-ins without email confirmation for easier testing
-- This can also be configured in the Supabase dashboard under Authentication > Settings

-- Note: This is a database-level setting that can be overridden by dashboard settings
-- The user should go to Authentication > Settings in Supabase dashboard and:
-- 1. Turn OFF "Enable email confirmations" for easier testing
-- 2. Or keep it ON for production security (users must click email link to verify)

-- For now, we'll ensure the database is properly configured for email handling
-- The actual email confirmation setting is controlled via the Supabase dashboard