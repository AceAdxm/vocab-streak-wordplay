-- Enable real-time updates for profiles table to make leaderboard update automatically

-- 1. Set replica identity to FULL so we get complete row data during updates
ALTER TABLE public.profiles REPLICA IDENTITY FULL;

-- 2. Add the profiles table to the supabase_realtime publication to enable real-time functionality
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;