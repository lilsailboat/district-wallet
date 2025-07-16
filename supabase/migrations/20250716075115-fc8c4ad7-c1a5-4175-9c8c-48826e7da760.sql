-- Fix admin user creation and add proper admin user
-- First, let's check if we have any admin users and add redemption codes sync

-- Create a proper admin user entry
DO $$
BEGIN
    -- Check if admin profile exists and update/create accordingly
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE email = 'admin@districtwalletdc.com') THEN
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
            gen_random_uuid(),
            'admin@districtwalletdc.com',
            'admin',
            'System',
            'Administrator',
            0,
            0,
            false,
            'ADMIN001'
        );
        RAISE NOTICE 'Created admin profile';
    END IF;
END $$;

-- Add a table for promo codes that sync with POS systems
CREATE TABLE IF NOT EXISTS public.promo_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    reward_id UUID REFERENCES public.rewards(id) ON DELETE CASCADE,
    merchant_id UUID REFERENCES public.merchants(id) ON DELETE CASCADE,
    is_used BOOLEAN DEFAULT false,
    used_by UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    pos_sync_status TEXT DEFAULT 'pending', -- pending, synced, failed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on promo_codes
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;

-- Create policies for promo_codes
CREATE POLICY "Users can view their own promo codes"
ON public.promo_codes
FOR SELECT
USING (auth.uid() = used_by);

CREATE POLICY "Merchants can manage their promo codes"
ON public.promo_codes
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.merchants 
        WHERE merchants.id = promo_codes.merchant_id 
        AND merchants.user_id = auth.uid()
    )
);

-- Add point multipliers to merchants table
ALTER TABLE public.merchants 
ADD COLUMN IF NOT EXISTS point_multiplier DECIMAL(3,2) DEFAULT 1.00;

-- Add referral system enhancements
CREATE TABLE IF NOT EXISTS public.referral_bonuses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id UUID NOT NULL,
    referee_id UUID NOT NULL,
    bonus_points INTEGER DEFAULT 100,
    status TEXT DEFAULT 'pending', -- pending, completed, expired
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(referrer_id, referee_id)
);

-- Enable RLS on referral_bonuses
ALTER TABLE public.referral_bonuses ENABLE ROW LEVEL SECURITY;

-- Create policies for referral_bonuses
CREATE POLICY "Users can view their own referral bonuses"
ON public.referral_bonuses
FOR SELECT
USING (auth.uid() = referrer_id OR auth.uid() = referee_id);

-- Create trigger for updated_at on promo_codes
CREATE TRIGGER update_promo_codes_updated_at
    BEFORE UPDATE ON public.promo_codes
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_promo_codes_reward_id ON public.promo_codes(reward_id);
CREATE INDEX IF NOT EXISTS idx_promo_codes_merchant_id ON public.promo_codes(merchant_id);
CREATE INDEX IF NOT EXISTS idx_promo_codes_used_by ON public.promo_codes(used_by);
CREATE INDEX IF NOT EXISTS idx_referral_bonuses_referrer ON public.referral_bonuses(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referral_bonuses_referee ON public.referral_bonuses(referee_id);