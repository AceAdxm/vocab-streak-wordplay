-- Create table to track used verification codes
CREATE TABLE IF NOT EXISTS public.used_verification_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  used_by uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  used_at timestamp with time zone DEFAULT now(),
  class_id uuid REFERENCES public.classes(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE public.used_verification_codes ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view used codes (to check if valid)
CREATE POLICY "Anyone can view used codes"
  ON public.used_verification_codes
  FOR SELECT
  USING (true);

-- Policy: Teachers can insert codes when creating classes
CREATE POLICY "Teachers can insert verification codes"
  ON public.used_verification_codes
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'teacher'));

-- Add index for faster lookups
CREATE INDEX idx_used_verification_codes_code ON public.used_verification_codes(code);