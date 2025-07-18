import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RewardCreation } from '@/components/merchant/RewardCreation';
import { POSIntegration } from '@/components/merchant/POSIntegration';
import { ContactSupport } from '@/components/support/ContactSupport';
import { LeaveReview } from '@/components/feedback/LeaveReview';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { 
  Store, 
  TrendingUp, 
  Users, 
  Gift, 
  MessageSquare,
  Plus,
  Edit,
  Eye,
  Settings,
  BarChart3,
  Zap,
  Link,
  Star
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
  pos_system?: string;
  pos_access_token?: string;
  pos_merchant_id?: string;
  pos_connected_at?: string;
  is_approved: boolean;
  total_visits: number;
  total_redemptions: number;
  total_rewards_distributed: number;
  point_multiplier?: number;
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
  const [activeTab, setActiveTab] = useState('profile');
  const [activeDialog, setActiveDialog] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
    if (!merchantData?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('rewards')
        .select('*')
        .eq('merchant_id', merchantData.id);

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
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
            <TabsTrigger value="pos">POS Integration</TabsTrigger>
            <TabsTrigger value="multiplier">Point Multiplier</TabsTrigger>
            <TabsTrigger value="messages">Support & Reviews</TabsTrigger>
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
                  <div className="space-y-2">
                    <Label htmlFor="pos_system">POS System</Label>
                    <Select 
                      value={merchantData?.pos_system || ''} 
                      onValueChange={(value) => setMerchantData(prev => prev ? {...prev, pos_system: value} : null)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your POS system" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="square">Square</SelectItem>
                        <SelectItem value="clover">Clover</SelectItem>
                        <SelectItem value="lightspeed">Lightspeed</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
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

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{merchantData?.total_visits || 0}</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Redemptions</CardTitle>
                  <Gift className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{merchantData?.total_redemptions || 0}</div>
                  <p className="text-xs text-muted-foreground">+8% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue Impact</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$2,450</div>
                  <p className="text-xs text-muted-foreground">From loyalty program</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Point Multiplier</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{merchantData?.point_multiplier || 1}x</div>
                  <p className="text-xs text-muted-foreground">Current rate</p>
                </CardContent>
              </Card>
            </div>

            {/* Analytics Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Customer Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">New Customers</span>
                      <Badge variant="secondary">23 this week</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Repeat Customers</span>
                      <Badge variant="secondary">67 this week</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Average Points Earned</span>
                      <Badge variant="secondary">45 per visit</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Conversion Rate</span>
                      <Badge variant="secondary">18.5%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Performance Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                      <p className="text-sm font-medium text-green-800">Peak Hours</p>
                      <p className="text-sm text-green-600">Most activity between 2-4 PM</p>
                    </div>
                    <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                      <p className="text-sm font-medium text-blue-800">Top Reward</p>
                      <p className="text-sm text-blue-600">$5 discount (68% of redemptions)</p>
                    </div>
                    <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
                      <p className="text-sm font-medium text-purple-800">Customer Lifetime</p>
                      <p className="text-sm text-purple-600">Average 6.2 visits per customer</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="rewards" className="space-y-6">
            <RewardCreation merchantData={merchantData} onRewardCreated={fetchRewards} />
            
            {rewards.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Rewards</CardTitle>
                  <CardDescription>Manage your existing reward offerings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {rewards.map((reward) => (
                      <div key={reward.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-medium">{reward.title}</h3>
                            <Badge variant={reward.is_active ? "default" : "secondary"}>
                              {reward.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{reward.points_required} points</p>
                          {reward.promo_code && (
                            <p className="text-xs text-muted-foreground">Code: {reward.promo_code}</p>
                          )}
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
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="pos" className="space-y-6">
            <POSIntegration 
              merchantData={merchantData} 
              onUpdate={fetchMerchantData}
            />
          </TabsContent>

          <TabsContent value="multiplier" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Point Multiplier Settings
                </CardTitle>
                <CardDescription>
                  Set how many points customers earn per dollar spent at your business
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center p-6 rounded-lg bg-gradient-to-r from-primary/10 to-success/10">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {merchantData?.point_multiplier || 1}x
                  </div>
                  <p className="text-muted-foreground">Current Point Multiplier</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Customers earn {merchantData?.point_multiplier || 1} point(s) per $1 spent
                  </p>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="multiplier">Point Multiplier (1.00 - 5.00)</Label>
                  <Input
                    id="multiplier"
                    type="number"
                    step="0.25"
                    min="1.00"
                    max="5.00"
                    value={merchantData?.point_multiplier || 1}
                    onChange={(e) => setMerchantData(prev => prev ? {...prev, point_multiplier: parseFloat(e.target.value)} : null)}
                    placeholder="1.00"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setMerchantData(prev => prev ? {...prev, point_multiplier: 1.0} : null)}
                    >
                      1x Standard
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setMerchantData(prev => prev ? {...prev, point_multiplier: 1.5} : null)}
                    >
                      1.5x Boost
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setMerchantData(prev => prev ? {...prev, point_multiplier: 2.0} : null)}
                    >
                      2x Double
                    </Button>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-semibold mb-2">How Point Multipliers Work:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Standard rate: 1 point per $1 spent</li>
                    <li>• Higher multipliers attract more customers</li>
                    <li>• Changes take effect immediately</li>
                    <li>• Consider seasonal promotions or special events</li>
                  </ul>
                </div>

                <Button onClick={saveMerchantProfile} disabled={loading} className="w-full">
                  {loading ? 'Updating...' : 'Update Point Multiplier'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Contact Support
                  </CardTitle>
                  <CardDescription>
                    Get help with your merchant account or technical issues
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Dialog open={activeDialog === 'support'} onOpenChange={(open) => setActiveDialog(open ? 'support' : null)}>
                    <DialogTrigger asChild>
                      <Button className="w-full">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Contact Support
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Contact Support</DialogTitle>
                      </DialogHeader>
                      <ContactSupport onClose={() => setActiveDialog(null)} />
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="w-5 h-5 mr-2" />
                    Leave a Review
                  </CardTitle>
                  <CardDescription>
                    Share your experience with District Wallet merchant services
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Dialog open={activeDialog === 'review'} onOpenChange={(open) => setActiveDialog(open ? 'review' : null)}>
                    <DialogTrigger asChild>
                      <Button className="w-full" variant="hero">
                        <Star className="w-4 h-4 mr-2" />
                        Leave a Review
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Leave a Review</DialogTitle>
                      </DialogHeader>
                      <LeaveReview onClose={() => setActiveDialog(null)} />
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </div>

            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="font-semibold text-blue-800 mb-2">Our Mission</h3>
                  <p className="text-blue-600 italic text-lg mb-4">
                    "Loyalty built for the community, by the community."
                  </p>
                  <p className="text-sm text-blue-600">
                    We're building something special together. Your feedback and partnership help us create 
                    a loyalty program that truly serves our community's needs.
                  </p>
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