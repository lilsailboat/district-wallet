import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SquareConnectRequest {
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

    const { authorizationCode, merchantId }: SquareConnectRequest = await req.json();

    // Exchange authorization code for access token
    const squareTokenResponse = await fetch('https://connect.squareup.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: Deno.env.get('SQUARE_APPLICATION_ID'),
        client_secret: Deno.env.get('SQUARE_APPLICATION_SECRET'),
        code: authorizationCode,
        grant_type: 'authorization_code'
      })
    });

    if (!squareTokenResponse.ok) {
      const error = await squareTokenResponse.json();
      console.error('Square token exchange failed:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to connect to Square' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const tokenData = await squareTokenResponse.json();

    // Update merchant record with Square connection details
    const { error: updateError } = await supabase
      .from('merchants')
      .update({
        pos_system: 'square',
        pos_access_token: tokenData.access_token,
        pos_refresh_token: tokenData.refresh_token,
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

    // Sync existing promo codes with Square
    const { data: promoCodes } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('merchant_id', merchantId);

    if (promoCodes && promoCodes.length > 0) {
      // Create discounts in Square for each promo code
      for (const promo of promoCodes) {
        try {
          await fetch(`https://connect.squareup.com/v2/catalog/objects`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${tokenData.access_token}`,
              'Content-Type': 'application/json',
              'Square-Version': '2023-10-18'
            },
            body: JSON.stringify({
              idempotency_key: `promo-${promo.id}`,
              object: {
                type: 'DISCOUNT',
                id: `#${promo.code}`,
                discount_data: {
                  name: promo.code,
                  discount_type: 'FIXED_AMOUNT',
                  amount_money: {
                    amount: 500, // $5.00 in cents - you might want to make this configurable
                    currency: 'USD'
                  }
                }
              }
            })
          });

          // Update promo code status
          await supabase
            .from('promo_codes')
            .update({ pos_sync_status: 'synced' })
            .eq('id', promo.id);

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
        message: 'Successfully connected to Square',
        merchantId: tokenData.merchant_id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error('Square connection error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});