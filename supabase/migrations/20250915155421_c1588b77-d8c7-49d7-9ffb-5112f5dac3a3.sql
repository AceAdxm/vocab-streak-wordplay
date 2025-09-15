-- Fix RLS policy warning for user sign up table by adding proper RLS policies
-- This table appears to not have any policies which is flagged by the linter

-- Check if "user sign up" table actually needs RLS or if it should be dropped
-- Since it seems like an unused table, let's add a basic policy or consider dropping it

-- Add RLS policies to "user sign up" table if it needs to exist
-- First, enable RLS if not already enabled
ALTER TABLE "user sign up" ENABLE ROW LEVEL SECURITY;

-- Add a restrictive policy - only allow service role access since this table seems unused
CREATE POLICY "Service role only access to user sign up" 
ON "user sign up" 
FOR ALL 
USING (false) 
WITH CHECK (false);

-- Alternatively, if this table is not needed, it should be dropped:
-- DROP TABLE IF EXISTS "user sign up";