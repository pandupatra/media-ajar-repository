-- Fix infinite recursion detected in policy for relation "profiles"
--
-- The common cause is an RLS policy on `profiles` that queries `profiles`
-- again (e.g. checking `role = 'admin'` with a sub-SELECT). PostgreSQL
-- re-applies RLS on every inner query, causing infinite recursion.
--
-- Solution: use a SECURITY DEFINER helper function that bypasses RLS
-- when checking the admin role.

-- 1. Helper function: checks if a given user_id is an admin.
--    SECURITY DEFINER lets it read profiles without re-triggering RLS.
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND role = 'admin'
  );
END;
$$;

-- 2. Lock down the helper: only the database owner can define it;
--    authenticated + anon users only need EXECUTE.
REVOKE EXECUTE ON FUNCTION public.is_admin(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO anon;

-- 3. Drop any existing profiles policies that might be recursive.
--    (Names here cover the Supabase default templates + common names.)
DROP POLICY IF EXISTS "profiles_select" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON public.profiles;
DROP POLICY IF EXISTS "Enable delete for users based on id" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can delete all profiles" ON public.profiles;

-- 4. Ensure RLS is enabled on the table.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 5. Re-create non-recursive policies.
--    SELECT: users can read their own profile; admins can read all.
CREATE POLICY "profiles_select" ON public.profiles
  FOR SELECT USING (
    auth.uid() = id OR public.is_admin(auth.uid())
  );

--    INSERT: users can insert their own profile; admins can insert any.
CREATE POLICY "profiles_insert" ON public.profiles
  FOR INSERT WITH CHECK (
    auth.uid() = id OR public.is_admin(auth.uid())
  );

--    UPDATE: users can update their own profile; admins can update any.
CREATE POLICY "profiles_update" ON public.profiles
  FOR UPDATE USING (
    auth.uid() = id OR public.is_admin(auth.uid())
  ) WITH CHECK (
    auth.uid() = id OR public.is_admin(auth.uid())
  );

--    DELETE: only admins can delete profiles.
CREATE POLICY "profiles_delete" ON public.profiles
  FOR DELETE USING (
    public.is_admin(auth.uid())
  );
