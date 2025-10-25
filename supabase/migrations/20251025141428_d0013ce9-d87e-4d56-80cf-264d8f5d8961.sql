-- Create an enum for user roles
CREATE TYPE public.app_role AS ENUM ('student', 'teacher', 'admin');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Anyone can view roles"
  ON public.user_roles
  FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage roles"
  ON public.user_roles
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Create classes table
CREATE TABLE public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  school_name TEXT,
  teacher_id UUID NOT NULL,
  description TEXT,
  join_code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on classes
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

-- RLS policies for classes
CREATE POLICY "Anyone can view classes"
  ON public.classes
  FOR SELECT
  USING (true);

CREATE POLICY "Teachers can create classes"
  ON public.classes
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'teacher') AND auth.uid() = teacher_id);

CREATE POLICY "Teachers can update their own classes"
  ON public.classes
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'teacher') AND auth.uid() = teacher_id);

CREATE POLICY "Teachers can delete their own classes"
  ON public.classes
  FOR DELETE
  USING (public.has_role(auth.uid(), 'teacher') AND auth.uid() = teacher_id);

-- Create class_members table
CREATE TABLE public.class_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (class_id, user_id)
);

-- Enable RLS on class_members
ALTER TABLE public.class_members ENABLE ROW LEVEL SECURITY;

-- RLS policies for class_members
CREATE POLICY "Anyone can view class members"
  ON public.class_members
  FOR SELECT
  USING (true);

CREATE POLICY "Users can join classes"
  ON public.class_members
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Teachers can manage their class members"
  ON public.class_members
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.classes
      WHERE classes.id = class_members.class_id
      AND classes.teacher_id = auth.uid()
      AND public.has_role(auth.uid(), 'teacher')
    )
  );

-- Create badges table for monthly achievements
CREATE TABLE public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  badge_type TEXT NOT NULL,
  rank INTEGER NOT NULL,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  awarded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, month, year)
);

-- Enable RLS on badges
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

-- RLS policies for badges
CREATE POLICY "Anyone can view badges"
  ON public.badges
  FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage badges"
  ON public.badges
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Function to generate random join code
CREATE OR REPLACE FUNCTION public.generate_join_code()
RETURNS TEXT
LANGUAGE plpgsql
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

-- Trigger to auto-generate join code
CREATE OR REPLACE FUNCTION public.set_join_code()
RETURNS TRIGGER
LANGUAGE plpgsql
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

CREATE TRIGGER before_insert_classes
  BEFORE INSERT ON public.classes
  FOR EACH ROW
  EXECUTE FUNCTION public.set_join_code();

-- Trigger to update updated_at on classes
CREATE TRIGGER update_classes_updated_at
  BEFORE UPDATE ON public.classes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to automatically assign student role to new users
CREATE OR REPLACE FUNCTION public.assign_default_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student')
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_assign_role
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.assign_default_role();