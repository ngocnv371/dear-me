-- initialize Supabase tables (PostgreSQL) with RLS

-- profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id serial PRIMARY KEY, -- separate id from user_id on purpose
  user_id uuid not null references auth.users on delete cascade,
  name text
);

ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read all profiles (for leaderboard display)
CREATE POLICY "Allow public to read all profiles"
  ON public.profiles
  FOR SELECT
  TO public
  USING (true);

-- Allow users to insert their own profile (via trigger)
CREATE POLICY "Allow users to insert own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update only their own profile
CREATE POLICY "Allow users to update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own profile
CREATE POLICY "Allow users to delete own profile"
  ON public.profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Trigger to create profile on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER set search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name)
  VALUES (NEW.id, new.raw_user_meta_data->>'name')
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();
