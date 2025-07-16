import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { Plus, Gift, Calendar } from 'lucide-react';

interface MerchantData {
  id?: string;
}

interface RewardCreationProps {
  merchantData: MerchantData | null;
  onRewardCreated?: () => void;
}

export const RewardCreation = ({ merchantData, onRewardCreated }: RewardCreationProps) => {
  const { user } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pointsRequired, setPointsRequired] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [isActive, setIsActive] = useState(true);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPointsRequired('');
    setPromoCode('');
    setExpirationDate('');
    setIsActive(true);
    setIsCreating(false);
  };

  const handleCreateReward = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchantData || !user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('rewards')
        .insert({
          title,
          description,
          points_required: parseInt(pointsRequired),
          promo_code: promoCode || null,
          expiration_date: expirationDate || null,
          is_active: isActive,
          merchant_id: merchantData.id
        })
        .select()
        .single();

      if (error) throw error;

      // Create initial promo codes for the reward
      if (promoCode) {
        const promoCodes = [];
        for (let i = 1; i <= 10; i++) {
          promoCodes.push({
            code: `${promoCode}-${i.toString().padStart(3, '0')}`,
            reward_id: data.id,
            merchant_id: merchantData.id,
            expires_at: expirationDate || null
          });
        }

        const { error: promoError } = await supabase
          .from('promo_codes')
          .insert(promoCodes);

        if (promoError) {
          console.warn('Failed to create promo codes:', promoError);
        }
      }

      toast({
        title: "Reward Created!",
        description: `${title} has been added to your rewards catalog.`,
      });

      resetForm();
      if (onRewardCreated) {
        onRewardCreated();
      }
    } catch (error: any) {
      toast({
        title: "Creation Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isCreating) {
    return (
      <div className="text-center py-8">
        <Gift className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground mb-4">No rewards created yet</p>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Your First Reward
        </Button>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Create New Reward
        </CardTitle>
        <CardDescription>
          Add a new reward for customers to redeem with their points
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCreateReward} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Reward Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., $5 off your next purchase"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="points">Points Required *</Label>
              <Input
                id="points"
                type="number"
                value={pointsRequired}
                onChange={(e) => setPointsRequired(e.target.value)}
                placeholder="e.g., 500"
                min="1"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the reward offer in detail..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="promo-code">Promo Code Prefix</Label>
              <Input
                id="promo-code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                placeholder="e.g., SAVE5"
                maxLength={10}
              />
              <p className="text-xs text-muted-foreground">
                Multiple codes will be generated (e.g., SAVE5-001, SAVE5-002...)
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiration">Expiration Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="expiration"
                  type="date"
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                  className="pl-10"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
            <Label htmlFor="active">Active (customers can redeem immediately)</Label>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !title || !pointsRequired}
              className="flex-1"
            >
              {loading ? 'Creating...' : 'Create Reward'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};