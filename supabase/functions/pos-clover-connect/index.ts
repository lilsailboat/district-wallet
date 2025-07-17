import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CloverConnectRequest {
  authorizationCode: string;
  merchantId: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the authenticated user
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabase.auth.getUser(token);

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    const { authorizationCode, merchantId }: CloverConnectRequest = await req.json();

    // Exchange authorization code for access token with Clover
    const cloverTokenResponse = await fetch('https://www.clover.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: Deno.env.get('CLOVER_APP_ID') || '',
        client_secret: Deno.env.get('CLOVER_APP_SECRET') || '',
        code: authorizationCode,
        grant_type: 'authorization_code'
      })
    });

    if (!cloverTokenResponse.ok) {
      const error = await cloverTokenResponse.text();
      console.error('Clover token exchange failed:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to connect to Clover' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const tokenData = await cloverTokenResponse.json();

    // Get merchant information from Clover
    const merchantResponse = await fetch(`https://api.clover.com/v3/merchants/${tokenData.merchant_id}`, {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
      }
    });

    const cloverMerchant = await merchantResponse.json();

    // Update merchant record with Clover connection details
    const { error: updateError } = await supabase
      .from('merchants')
      .update({
        pos_system: 'clover',
        pos_access_token: tokenData.access_token,
        pos_merchant_id: tokenData.merchant_id,
        pos_connected_at: new Date().toISOString()
      })
      .eq('id', merchantId)
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Failed to update merchant:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to save connection' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Sync existing promo codes with Clover
    const { data: promoCodes } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('merchant_id', merchantId);

    if (promoCodes && promoCodes.length > 0) {
      // Create discounts in Clover for each promo code
      for (const promo of promoCodes) {
        try {
          const discountResponse = await fetch(`https://api.clover.com/v3/merchants/${tokenData.merchant_id}/discounts`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${tokenData.access_token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: promo.code,
              amount: 500, // $5.00 in cents
              percentage: null
            })
          });

          if (discountResponse.ok) {
            await supabase
              .from('promo_codes')
              .update({ pos_sync_status: 'synced' })
              .eq('id', promo.id);
          } else {
            throw new Error(`Failed to create discount: ${discountResponse.statusText}`);
          }

        } catch (error) {
          console.error(`Failed to sync promo code ${promo.code}:`, error);
          await supabase
            .from('promo_codes')
            .update({ pos_sync_status: 'failed' })
            .eq('id', promo.id);
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Successfully connected to Clover',
        merchantId: tokenData.merchant_id,
        merchantName: cloverMerchant.name
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error('Clover connection error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});