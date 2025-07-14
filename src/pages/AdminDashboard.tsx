import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { 
  Shield, 
  Users, 
  Store, 
  Activity,
  CheckCircle,
  XCircle,
  Send,
  TestTube,
  BarChart3
} from 'lucide-react';

interface SystemMetrics {
  totalUsers: number;
  totalMerchants: number;
  totalTransactions: number;
  totalRedemptions: number;
  pendingMerchants: number;
}

interface MerchantApplication {
  id: string;
  business_name: string;
  email: string;
  phone?: string;
  is_approved: boolean;
  created_at: string;
}

const AdminDashboard = () => {
  const { profile } = useAuth();
  const [metrics, setMetrics] = useState<SystemMetrics>({
    totalUsers: 0,
    totalMerchants: 0,
    totalTransactions: 0,
    totalRedemptions: 0,
    pendingMerchants: 0
  });
  const [merchantApplications, setMerchantApplications] = useState<MerchantApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchSystemMetrics();
    fetchMerchantApplications();
  }, []);

  const fetchSystemMetrics = async () => {
    try {
      // Fetch user count
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch merchant count
      const { count: merchantCount } = await supabase
        .from('merchants')
        .select('*', { count: 'exact', head: true });

      // Fetch transaction count
      const { count: transactionCount } = await supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true });

      // Fetch redemption count
      const { count: redemptionCount } = await supabase
        .from('redemptions')
        .select('*', { count: 'exact', head: true });

      // Fetch pending merchant applications
      const { count: pendingCount } = await supabase
        .from('merchants')
        .select('*', { count: 'exact', head: true })
        .eq('is_approved', false);

      setMetrics({
        totalUsers: userCount || 0,
        totalMerchants: merchantCount || 0,
        totalTransactions: transactionCount || 0,
        totalRedemptions: redemptionCount || 0,
        pendingMerchants: pendingCount || 0
      });
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMerchantApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('merchants')
        .select('id, business_name, email, phone, is_approved, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMerchantApplications(data || []);
    } catch (error) {
      console.error('Error fetching merchant applications:', error);
    }
  };

  const approveMerchant = async (merchantId: string) => {
    try {
      const { error } = await supabase
        .from('merchants')
        .update({ is_approved: true })
        .eq('id', merchantId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Merchant application approved",
      });

      fetchMerchantApplications();
      fetchSystemMetrics();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const rejectMerchant = async (merchantId: string) => {
    try {
      const { error } = await supabase
        .from('merchants')
        .delete()
        .eq('id', merchantId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Merchant application rejected",
      });

      fetchMerchantApplications();
      fetchSystemMetrics();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const simulateTransaction = async () => {
    // This would simulate a test transaction for testing purposes
    toast({
      title: "Test Transaction",
      description: "Test transaction simulated successfully",
    });
  };

  if (loading) {
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
          <h1 className="text-3xl font-bold text-foreground flex items-center">
            <Shield className="w-8 h-8 mr-3" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {profile?.first_name || 'Admin'}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="merchants">Merchants</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="testing">Testing</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">Registered users</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Merchants</CardTitle>
                  <Store className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.totalMerchants}</div>
                  <p className="text-xs text-muted-foreground">
                    {metrics.pendingMerchants} pending approval
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.totalTransactions}</div>
                  <p className="text-xs text-muted-foreground">Total transactions</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Redemptions</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.totalRedemptions}</div>
                  <p className="text-xs text-muted-foreground">Rewards redeemed</p>
                </CardContent>
              </Card>
            </div>

            {metrics.pendingMerchants > 0 && (
              <Card className="border-amber-200 bg-amber-50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                      <p className="text-amber-800 font-medium">
                        {metrics.pendingMerchants} merchant application(s) pending approval
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setActiveTab('merchants')}
                    >
                      Review Applications
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="merchants" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Merchant Applications</CardTitle>
                <CardDescription>
                  Review and approve merchant applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {merchantApplications.length === 0 ? (
                    <div className="text-center py-8">
                      <Store className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No merchant applications</p>
                    </div>
                  ) : (
                    merchantApplications.map((merchant) => (
                      <div key={merchant.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium">{merchant.business_name}</h3>
                            <Badge variant={merchant.is_approved ? "default" : "secondary"}>
                              {merchant.is_approved ? "Approved" : "Pending"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{merchant.email}</p>
                          <p className="text-xs text-muted-foreground">
                            Applied: {new Date(merchant.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        {!merchant.is_approved && (
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => approveMerchant(merchant.id)}
                              className="text-green-600 hover:text-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => rejectMerchant(merchant.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  View and manage user accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">User management features coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="testing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TestTube className="w-5 h-5 mr-2" />
                  Testing Suite
                </CardTitle>
                <CardDescription>
                  Simulate transactions and test platform functionality
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button onClick={simulateTransaction} variant="outline">
                    <Activity className="w-4 h-4 mr-2" />
                    Simulate Transaction
                  </Button>
                  <Button variant="outline">
                    <Users className="w-4 h-4 mr-2" />
                    Test Referral
                  </Button>
                  <Button variant="outline">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Test Redemption
                  </Button>
                  <Button variant="outline">
                    <Send className="w-4 h-4 mr-2" />
                    Test Notifications
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Announcements</CardTitle>
                <CardDescription>
                  Send messages to users and merchants
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input placeholder="Message title" />
                  <Input placeholder="Message content" />
                  <div className="flex space-x-2">
                    <Button>
                      <Send className="w-4 h-4 mr-2" />
                      Send to Users
                    </Button>
                    <Button variant="outline">
                      <Send className="w-4 h-4 mr-2" />
                      Send to Merchants
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;