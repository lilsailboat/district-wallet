import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { 
  Store, 
  TrendingUp, 
  Users, 
  Gift, 
  QrCode, 
  MessageSquare,
  Plus,
  Edit,
  Eye
} from 'lucide-react';

interface MerchantData {
  id?: string;
  business_name: string;
  email: string;
  phone?: string;
  website?: string;
  business_address?: string;
  description?: string;
  logo_url?: string;
  is_approved: boolean;
  total_visits: number;
  total_redemptions: number;
  total_rewards_distributed: number;
}

interface Reward {
  id: string;
  title: string;
  description: string;
  points_required: number;
  is_active: boolean;
  image_url?: string;
  promo_code?: string;
  expiration_date?: string;
}

const MerchantDashboard = () => {
  const { user, profile } = useAuth();
  const [merchantData, setMerchantData] = useState<MerchantData | null>(null);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (user) {
      fetchMerchantData();
      fetchRewards();
    }
  }, [user]);

  const fetchMerchantData = async () => {
    try {
      const { data, error } = await supabase
        .from('merchants')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setMerchantData(data || {
        business_name: '',
        email: user?.email || '',
        phone: '',
        website: '',
        business_address: '',
        description: '',
        logo_url: '',
        is_approved: false,
        total_visits: 0,
        total_redemptions: 0,
        total_rewards_distributed: 0
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load merchant data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRewards = async () => {
    try {
      const { data, error } = await supabase
        .from('rewards')
        .select('*')
        .eq('merchant_id', merchantData?.id || '');

      if (error) throw error;
      setRewards(data || []);
    } catch (error: any) {
      console.error('Error fetching rewards:', error);
    }
  };

  const saveMerchantProfile = async () => {
    if (!merchantData || !user) return;

    try {
      setLoading(true);
      
      if (merchantData.id) {
        // Update existing merchant
        const { error } = await supabase
          .from('merchants')
          .update(merchantData)
          .eq('id', merchantData.id);
        
        if (error) throw error;
      } else {
        // Create new merchant profile
        const { data, error } = await supabase
          .from('merchants')
          .insert({
            ...merchantData,
            user_id: user.id
          })
          .select()
          .single();
        
        if (error) throw error;
        setMerchantData(data);
      }

      toast({
        title: "Success",
        description: "Merchant profile saved successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !merchantData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Merchant Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {profile?.first_name || 'Merchant'}
          </p>
        </div>

        {!merchantData?.is_approved && (
          <Card className="mb-8 border-amber-200 bg-amber-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                <p className="text-amber-800">
                  Your merchant account is pending approval. Complete your profile to speed up the process.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
            <TabsTrigger value="qr">QR Code</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Store className="w-5 h-5 mr-2" />
                  Business Profile
                </CardTitle>
                <CardDescription>
                  Update your business information and settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="business_name">Business Name</Label>
                    <Input
                      id="business_name"
                      value={merchantData?.business_name || ''}
                      onChange={(e) => setMerchantData(prev => prev ? {...prev, business_name: e.target.value} : null)}
                      placeholder="Enter business name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={merchantData?.email || ''}
                      onChange={(e) => setMerchantData(prev => prev ? {...prev, email: e.target.value} : null)}
                      placeholder="Enter email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={merchantData?.phone || ''}
                      onChange={(e) => setMerchantData(prev => prev ? {...prev, phone: e.target.value} : null)}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={merchantData?.website || ''}
                      onChange={(e) => setMerchantData(prev => prev ? {...prev, website: e.target.value} : null)}
                      placeholder="Enter website URL"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business_address">Business Address</Label>
                  <Input
                    id="business_address"
                    value={merchantData?.business_address || ''}
                    onChange={(e) => setMerchantData(prev => prev ? {...prev, business_address: e.target.value} : null)}
                    placeholder="Enter business address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={merchantData?.description || ''}
                    onChange={(e) => setMerchantData(prev => prev ? {...prev, description: e.target.value} : null)}
                    placeholder="Describe your business"
                    rows={4}
                  />
                </div>
                <Button onClick={saveMerchantProfile} disabled={loading}>
                  {loading ? 'Saving...' : 'Save Profile'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{merchantData?.total_visits || 0}</div>
                  <p className="text-xs text-muted-foreground">Customer visits</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Redemptions</CardTitle>
                  <Gift className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{merchantData?.total_redemptions || 0}</div>
                  <p className="text-xs text-muted-foreground">Rewards redeemed</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Rewards Distributed</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{merchantData?.total_rewards_distributed || 0}</div>
                  <p className="text-xs text-muted-foreground">Total distributed</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="rewards" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Manage Rewards</CardTitle>
                    <CardDescription>Create and manage your reward offerings</CardDescription>
                  </div>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Reward
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {rewards.length === 0 ? (
                  <div className="text-center py-8">
                    <Gift className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No rewards created yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {rewards.map((reward) => (
                      <div key={reward.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">{reward.title}</h3>
                          <p className="text-sm text-muted-foreground">{reward.points_required} points</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="qr" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <QrCode className="w-5 h-5 mr-2" />
                  QR Code for In-Store Redemptions
                </CardTitle>
                <CardDescription>
                  Display this QR code in your store for customers to scan and redeem rewards
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="w-64 h-64 mx-auto bg-muted rounded-lg flex items-center justify-center mb-4">
                  <QrCode className="w-32 h-32 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">QR Code will be generated after merchant approval</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Support Messages
                </CardTitle>
                <CardDescription>
                  Contact support for assistance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No messages yet</p>
                  <Button className="mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    Contact Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MerchantDashboard;