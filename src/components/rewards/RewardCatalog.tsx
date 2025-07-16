import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { RedeemModal } from './RedeemModal';
import { Gift, Search, Filter, Star, Store } from 'lucide-react';

interface Reward {
  id: string;
  title: string;
  description: string;
  points_required: number;
  is_active: boolean;
  image_url?: string;
  promo_code?: string;
  expiration_date?: string;
  merchant: {
    business_name: string;
    logo_url?: string;
  };
}

interface RewardCatalogProps {
  onRedeemReward?: (reward: Reward) => void;
}

export const RewardCatalog = ({ onRedeemReward }: RewardCatalogProps) => {
  const { user, profile } = useAuth();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [filteredRewards, setFilteredRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('points_asc');
  const [filterByMerchant, setFilterByMerchant] = useState('all');
  const [merchants, setMerchants] = useState<Array<{ id: string; business_name: string }>>([]);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);

  useEffect(() => {
    fetchRewards();
    fetchMerchants();
  }, []);

  useEffect(() => {
    filterAndSortRewards();
  }, [rewards, searchTerm, sortBy, filterByMerchant]);

  const fetchRewards = async () => {
    try {
      const { data, error } = await supabase
        .from('rewards')
        .select(`
          *,
          merchant:merchants(business_name, logo_url)
        `)
        .eq('is_active', true);

      if (error) throw error;
      setRewards(data || []);
    } catch (error) {
      console.error('Error fetching rewards:', error);
      toast({
        title: "Error",
        description: "Failed to load rewards",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMerchants = async () => {
    try {
      const { data, error } = await supabase
        .from('merchants')
        .select('id, business_name')
        .eq('is_approved', true);

      if (error) throw error;
      setMerchants(data || []);
    } catch (error) {
      console.error('Error fetching merchants:', error);
    }
  };

  const filterAndSortRewards = () => {
    let filtered = rewards.filter(reward => {
      const matchesSearch = reward.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           reward.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           reward.merchant.business_name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesMerchant = filterByMerchant === 'all' || 
                             reward.merchant.business_name === filterByMerchant;
      
      return matchesSearch && matchesMerchant;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'points_asc':
          return a.points_required - b.points_required;
        case 'points_desc':
          return b.points_required - a.points_required;
        case 'name_asc':
          return a.title.localeCompare(b.title);
        case 'name_desc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    setFilteredRewards(filtered);
  };

  const handleRedeemReward = (reward: Reward) => {
    setSelectedReward(reward);
    setIsRedeemModalOpen(true);
  };

  const handleRedeemSuccess = () => {
    setIsRedeemModalOpen(false);
    setSelectedReward(null);
    if (onRedeemReward && selectedReward) {
      onRedeemReward(selectedReward);
    }
    fetchRewards();
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Reward Catalog</h2>
          <p className="text-muted-foreground">
            {profile && `You have ${profile.total_points} points available`}
          </p>
        </div>
        <Gift className="w-8 h-8 text-primary" />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search rewards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="points_asc">Points (Low to High)</SelectItem>
            <SelectItem value="points_desc">Points (High to Low)</SelectItem>
            <SelectItem value="name_asc">Name (A to Z)</SelectItem>
            <SelectItem value="name_desc">Name (Z to A)</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterByMerchant} onValueChange={setFilterByMerchant}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by merchant" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Merchants</SelectItem>
            {merchants.map((merchant) => (
              <SelectItem key={merchant.id} value={merchant.business_name}>
                {merchant.business_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredRewards.length === 0 ? (
        <div className="text-center py-12">
          <Gift className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No rewards found</h3>
          <p className="text-muted-foreground">
            {searchTerm || filterByMerchant !== 'all' 
              ? "Try adjusting your search or filters"
              : "Check back later for new rewards"
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRewards.map((reward) => (
            <Card key={reward.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{reward.title}</CardTitle>
                    <div className="flex items-center mt-1">
                      <Store className="w-4 h-4 text-muted-foreground mr-1" />
                      <span className="text-sm text-muted-foreground">
                        {reward.merchant.business_name}
                      </span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="ml-2">
                    {reward.points_required} pts
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  {reward.description}
                </CardDescription>
                
                {reward.expiration_date && (
                  <p className="text-xs text-muted-foreground mb-4">
                    Expires: {new Date(reward.expiration_date).toLocaleDateString()}
                  </p>
                )}

                <Button
                  onClick={() => handleRedeemReward(reward)}
                  disabled={!profile || profile.total_points < reward.points_required}
                  className="w-full"
                  variant={profile && profile.total_points >= reward.points_required ? "default" : "outline"}
                >
                  {profile && profile.total_points >= reward.points_required 
                    ? "Redeem Now" 
                    : `Need ${reward.points_required - (profile?.total_points || 0)} more points`
                  }
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <RedeemModal
        reward={selectedReward}
        isOpen={isRedeemModalOpen}
        onClose={() => {
          setIsRedeemModalOpen(false);
          setSelectedReward(null);
        }}
        onSuccess={handleRedeemSuccess}
      />
    </div>
  );
};