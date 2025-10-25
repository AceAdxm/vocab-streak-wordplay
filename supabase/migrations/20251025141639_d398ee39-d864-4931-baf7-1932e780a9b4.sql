-- Fix search_path for generate_join_code function
CREATE OR REPLACE FUNCTION public.generate_join_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$;

-- Fix search_path for set_join_code function
CREATE OR REPLACE FUNCTION public.set_join_code()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.join_code IS NULL THEN
    NEW.join_code := public.generate_join_code();
    -- Ensure uniqueness
    WHILE EXISTS (SELECT 1 FROM public.classes WHERE join_code = NEW.join_code) LOOP
      NEW.join_code := public.generate_join_code();
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$;