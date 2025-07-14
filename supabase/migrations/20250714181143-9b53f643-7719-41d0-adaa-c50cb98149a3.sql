-- Add role column to profiles table and update the handle_new_user function
ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'user';

-- Update the handle_new_user function to set the role from user metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, referral_code, role)
  VALUES (
    NEW.id,
    NEW.email,
    generate_referral_code(),
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'user')
  );
  RETURN NEW;
END;
$$;