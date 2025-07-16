import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { CheckCircle, Copy, Store, Calendar, QrCode } from 'lucide-react';

interface Reward {
  id: string;
  title: string;
  description: string;
  points_required: number;
  promo_code?: string;
  expiration_date?: string;
  merchant: {
    business_name: string;
  };
}

interface RedeemModalProps {
  reward: Reward | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const RedeemModal = ({ reward, isOpen, onClose, onSuccess }: RedeemModalProps) => {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [redeemed, setRedeemed] = useState(false);
  const [promoCode, setPromoCode] = useState<string>('');

  if (!reward) return null;

  const handleRedeem = async () => {
    if (!user || !profile) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to redeem rewards",
        variant: "destructive",
      });
      return;
    }

    if (profile.total_points < reward.points_required) {
      toast({
        title: "Insufficient Points",
        description: `You need ${reward.points_required} points to redeem this reward.`,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Generate a unique promo code
      const generatedCode = `DW-${reward.id.substring(0, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`;

      // Create redemption record
      const { error: redemptionError } = await supabase
        .from('redemptions')
        .insert({
          user_id: user.id,
          reward_id: reward.id,
          points_used: reward.points_required,
          promo_code: generatedCode
        });

      if (redemptionError) throw redemptionError;

      // Create promo code entry for POS sync (with a placeholder merchant_id for now)
      const { error: promoError } = await supabase
        .from('promo_codes')
        .insert({
          code: generatedCode,
          reward_id: reward.id,
          merchant_id: 'temp-merchant-id', // This would need proper merchant ID from rewards table
          used_by: user.id,
          expires_at: reward.expiration_date ? new Date(reward.expiration_date).toISOString() : null,
          pos_sync_status: 'pending'
        });

      if (promoError) throw promoError;

      // Update user's total points
      const newPoints = profile.total_points - reward.points_required;
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ total_points: newPoints })
        .eq('user_id', user.id);

      if (profileError) throw profileError;

      setPromoCode(generatedCode);
      setRedeemed(true);

      toast({
        title: "Reward Redeemed!",
        description: `Successfully redeemed ${reward.title}`,
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast({
        title: "Redemption Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyPromoCode = async () => {
    try {
      await navigator.clipboard.writeText(promoCode);
      toast({
        title: "Code Copied!",
        description: "Promo code copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy promo code",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    setRedeemed(false);
    setPromoCode('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {redeemed ? (
              <>
                <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                Reward Redeemed!
              </>
            ) : (
              <>
                <Store className="w-5 h-5 mr-2" />
                Redeem Reward
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {redeemed ? "Your reward is ready to use!" : `Redeem ${reward.title} for ${reward.points_required} points`}
          </DialogDescription>
        </DialogHeader>

        {redeemed ? (
          <div className="space-y-4">
            {/* Success State */}
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                  <div>
                    <h3 className="text-lg font-semibold text-green-800">{reward.title}</h3>
                    <p className="text-sm text-green-600">{reward.merchant.business_name}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Promo Code */}
            <div className="space-y-3">
              <h4 className="font-semibold">Your Promo Code:</h4>
              <div className="flex items-center space-x-2">
                <div className="flex-1 p-3 bg-muted rounded-lg text-center">
                  <p className="font-mono text-lg font-bold">{promoCode}</p>
                </div>
                <Button variant="outline" onClick={copyPromoCode}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-3">
              <h4 className="font-semibold">How to Use:</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Show this code at {reward.merchant.business_name}</p>
                <p>• Present it at checkout or mention it to staff</p>
                <p>• Code is synced with their POS system</p>
                {reward.expiration_date && (
                  <p className="flex items-center text-amber-600">
                    <Calendar className="w-4 h-4 mr-1" />
                    Expires: {new Date(reward.expiration_date).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            <Button onClick={handleClose} className="w-full">
              Done
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Reward Details */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">Reward:</span>
                <span>{reward.title}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Merchant:</span>
                <span>{reward.merchant.business_name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Points Required:</span>
                <span className="font-bold">{reward.points_required}</span>
              </div>
              {profile && (
                <div className="flex items-center justify-between">
                  <span className="font-medium">Your Points:</span>
                  <span className={profile.total_points >= reward.points_required ? 'text-green-600' : 'text-red-600'}>
                    {profile.total_points}
                  </span>
                </div>
              )}
              {reward.expiration_date && (
                <div className="flex items-center justify-between">
                  <span className="font-medium">Expires:</span>
                  <span>{new Date(reward.expiration_date).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm">{reward.description}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={handleRedeem} 
                disabled={loading || !profile || profile.total_points < reward.points_required}
                className="flex-1"
              >
                {loading ? 'Redeeming...' : 'Redeem Now'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};