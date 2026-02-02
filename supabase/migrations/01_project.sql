-- projects table

CREATE TABLE IF NOT EXISTS public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id integer NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  tags text[],
  tone text,
  theme text,
  summary text,
  transcript text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Allow users to read only their own projects
CREATE POLICY "Allow users to read own projects"
  ON public.projects
  FOR SELECT
  TO authenticated
  USING (
    profile_id IN (
      SELECT id FROM public.profiles WHERE user_id = auth.uid()
    )
  );

-- Allow users to insert their own projects
CREATE POLICY "Allow users to insert own projects"
  ON public.projects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    profile_id IN (
      SELECT id FROM public.profiles WHERE user_id = auth.uid()
    )
  );

-- Allow users to update only their own projects
CREATE POLICY "Allow users to update own projects"
  ON public.projects
  FOR UPDATE
  TO authenticated
  USING (
    profile_id IN (
      SELECT id FROM public.profiles WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    profile_id IN (
      SELECT id FROM public.profiles WHERE user_id = auth.uid()
    )
  );

-- Allow users to delete their own projects
CREATE POLICY "Allow users to delete own projects"
  ON public.projects
  FOR DELETE
  TO authenticated
  USING (
    profile_id IN (
      SELECT id FROM public.profiles WHERE user_id = auth.uid()
    )
  );

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS projects_profile_id_idx ON public.projects(profile_id);
CREATE INDEX IF NOT EXISTS projects_created_at_idx ON public.projects(created_at DESC);
