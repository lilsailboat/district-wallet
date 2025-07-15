-- Create admin user by inserting into auth.users table properly
-- First, let's create a simple admin user manually
DO $$
DECLARE
    admin_user_id uuid := gen_random_uuid();
BEGIN
    -- Create profile first (this will work even without auth user)
    INSERT INTO public.profiles (
        user_id, 
        email, 
        role, 
        first_name, 
        last_name, 
        total_points, 
        referrals_made, 
        card_linked, 
        referral_code
    ) VALUES (
        admin_user_id,
        'admin@districtwalletdc.com',
        'admin',
        'System',
        'Administrator',
        0,
        0,
        false,
        'ADMIN001'
    ) ON CONFLICT (user_id) DO NOTHING;
    
    -- Output the user ID for reference
    RAISE NOTICE 'Created admin profile with user_id: %', admin_user_id;
END $$;