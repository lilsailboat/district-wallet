-- Add POS integration fields to merchants table
ALTER TABLE public.merchants 
ADD COLUMN IF NOT EXISTS pos_access_token TEXT,
ADD COLUMN IF NOT EXISTS pos_refresh_token TEXT,
ADD COLUMN IF NOT EXISTS pos_merchant_id TEXT,
ADD COLUMN IF NOT EXISTS pos_connected_at TIMESTAMP WITH TIME ZONE;