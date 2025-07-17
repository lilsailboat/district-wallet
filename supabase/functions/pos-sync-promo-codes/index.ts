import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SyncRequest {
  promoCodeId: string;
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

    const { promoCodeId, merchantId }: SyncRequest = await req.json();

    // Get merchant and promo code data
    const { data: merchant, error: merchantError } = await supabase
      .from('merchants')
      .select('*')
      .eq('id', merchantId)
      .single();

    if (merchantError || !merchant) {
      return new Response(
        JSON.stringify({ error: 'Merchant not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    const { data: promoCode, error: promoError } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('id', promoCodeId)
      .single();

    if (promoError || !promoCode) {
      return new Response(
        JSON.stringify({ error: 'Promo code not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    if (!merchant.pos_access_token || !merchant.pos_system) {
      return new Response(
        JSON.stringify({ error: 'POS system not connected' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    let syncResult = false;

    // Sync based on POS system
    switch (merchant.pos_system) {
      case 'square':
        syncResult = await syncToSquare(merchant, promoCode);
        break;
      case 'clover':
        syncResult = await syncToClover(merchant, promoCode);
        break;
      case 'lightspeed':
        syncResult = await syncToLightspeed(merchant, promoCode);
        break;
      default:
        return new Response(
          JSON.stringify({ error: 'Unsupported POS system' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
    }

    // Update sync status
    const newStatus = syncResult ? 'synced' : 'failed';
    await supabase
      .from('promo_codes')
      .update({ 
        pos_sync_status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', promoCodeId);

    return new Response(
      JSON.stringify({ 
        success: syncResult,
        message: syncResult ? 'Promo code synced successfully' : 'Failed to sync promo code'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error('Sync error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

async function syncToSquare(merchant: any, promoCode: any): Promise<boolean> {
  try {
    const response = await fetch(`https://connect.squareup.com/v2/catalog/objects`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${merchant.pos_access_token}`,
        'Content-Type': 'application/json',
        'Square-Version': '2023-10-18'
      },
      body: JSON.stringify({
        idempotency_key: `promo-${promoCode.id}-${Date.now()}`,
        object: {
          type: 'DISCOUNT',
          id: `#${promoCode.code}`,
          discount_data: {
            name: promoCode.code,
            discount_type: 'FIXED_AMOUNT',
            amount_money: {
              amount: 500, // $5.00 in cents
              currency: 'USD'
            }
          }
        }
      })
    });

    return response.ok;
  } catch (error) {
    console.error('Square sync error:', error);
    return false;
  }
}

async function syncToClover(merchant: any, promoCode: any): Promise<boolean> {
  try {
    const response = await fetch(`https://api.clover.com/v3/merchants/${merchant.pos_merchant_id}/discounts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${merchant.pos_access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: promoCode.code,
        amount: 500, // $5.00 in cents
        percentage: null
      })
    });

    return response.ok;
  } catch (error) {
    console.error('Clover sync error:', error);
    return false;
  }
}

async function syncToLightspeed(merchant: any, promoCode: any): Promise<boolean> {
  try {
    const response = await fetch(`https://api.lightspeedapp.com/API/Account/${merchant.pos_merchant_id}/Discount.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${merchant.pos_access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        Discount: {
          name: promoCode.code,
          type: 'amount',
          amount: '5.00',
          couponCode: promoCode.code
        }
      })
    });

    return response.ok;
  } catch (error) {
    console.error('Lightspeed sync error:', error);
    return false;
  }
}