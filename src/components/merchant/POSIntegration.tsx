import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';
import { 
  Link, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink, 
  Zap, 
  RotateCw,
  Store,
  CreditCard
} from 'lucide-react';

interface MerchantData {
  id?: string;
  pos_system?: string;
  pos_access_token?: string;
  pos_merchant_id?: string;
  pos_connected_at?: string;
}

interface POSIntegrationProps {
  merchantData: MerchantData | null;
  onUpdate: () => void;
}

interface PromoCode {
  id: string;
  code: string;
  pos_sync_status: string;
  reward_id: string;
}

export const POSIntegration = ({ merchantData, onUpdate }: POSIntegrationProps) => {
  const [connecting, setConnecting] = useState<string | null>(null);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [syncing, setSyncing] = useState<string | null>(null);

  useEffect(() => {
    if (merchantData?.id) {
      fetchPromoCodes();
    }
  }, [merchantData?.id]);

  const fetchPromoCodes = async () => {
    if (!merchantData?.id) return;

    try {
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('merchant_id', merchantData.id);

      if (error) throw error;
      setPromoCodes(data || []);
    } catch (error) {
      console.error('Error fetching promo codes:', error);
    }
  };

  const handleConnect = async (posSystem: string) => {
    if (!merchantData?.id) {
      toast({
        title: "Error",
        description: "Please save your merchant profile first",
        variant: "destructive",
      });
      return;
    }

    setConnecting(posSystem);

    try {
      // Generate authorization URLs for each POS system
      let authUrl = '';
      
      switch (posSystem) {
        case 'square':
          // Square OAuth URL - you'll need to replace with actual app credentials
          authUrl = `https://connect.squareup.com/oauth2/authorize?client_id=YOUR_SQUARE_APP_ID&scope=MERCHANT_PROFILE_READ+PAYMENTS_WRITE+ORDERS_WRITE&redirect_uri=${encodeURIComponent(window.location.origin)}/pos-callback/square&state=${merchantData.id}`;
          break;
        case 'clover':
          // Clover OAuth URL
          authUrl = `https://www.clover.com/oauth/authorize?client_id=YOUR_CLOVER_APP_ID&redirect_uri=${encodeURIComponent(window.location.origin)}/pos-callback/clover&state=${merchantData.id}`;
          break;
        case 'lightspeed':
          // Lightspeed OAuth URL
          authUrl = `https://cloud.lightspeedapp.com/oauth/authorize.php?response_type=code&client_id=YOUR_LIGHTSPEED_CLIENT_ID&scope=employee:all&redirect_uri=${encodeURIComponent(window.location.origin)}/pos-callback/lightspeed&state=${merchantData.id}`;
          break;
      }

      if (authUrl) {
        // For demo purposes, we'll simulate the connection
        // In production, you would redirect to the POS system's OAuth page
        await simulateConnection(posSystem);
      }
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setConnecting(null);
    }
  };

  const simulateConnection = async (posSystem: string) => {
    // Simulate OAuth flow for demo purposes
    try {
      const { error } = await supabase
        .from('merchants')
        .update({
          pos_system: posSystem,
          pos_access_token: `demo_token_${posSystem}`,
          pos_merchant_id: `demo_merchant_${Date.now()}`,
          pos_connected_at: new Date().toISOString()
        })
        .eq('id', merchantData!.id);

      if (error) throw error;

      toast({
        title: "Connected Successfully!",
        description: `Your ${posSystem} POS system is now connected`,
      });

      onUpdate();
    } catch (error: any) {
      throw new Error(`Failed to connect to ${posSystem}: ${error.message}`);
    }
  };

  const handleDisconnect = async () => {
    if (!merchantData?.id) return;

    try {
      const { error } = await supabase
        .from('merchants')
        .update({
          pos_system: null,
          pos_access_token: null,
          pos_merchant_id: null,
          pos_connected_at: null
        })
        .eq('id', merchantData.id);

      if (error) throw error;

      toast({
        title: "Disconnected",
        description: "POS system has been disconnected",
      });

      onUpdate();
    } catch (error: any) {
      toast({
        title: "Disconnect Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const syncPromoCode = async (promoCodeId: string) => {
    if (!merchantData?.id) return;

    setSyncing(promoCodeId);
    try {
      const { data, error } = await supabase.functions.invoke('pos-sync-promo-codes', {
        body: {
          promoCodeId,
          merchantId: merchantData.id
        }
      });

      if (error) throw error;

      if (data?.success) {
        toast({
          title: "Sync Successful",
          description: "Promo code has been synced to your POS system",
        });
        fetchPromoCodes();
      } else {
        throw new Error(data?.message || 'Sync failed');
      }
    } catch (error: any) {
      toast({
        title: "Sync Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSyncing(null);
    }
  };

  const posOptions = [
    {
      id: 'square',
      name: 'Square',
      description: 'Most popular POS system for small businesses',
      color: 'blue',
      features: ['Payment Processing', 'Inventory Management', 'Analytics', 'Customer Management']
    },
    {
      id: 'clover',
      name: 'Clover',
      description: 'Full-featured POS with advanced analytics',
      color: 'green',
      features: ['Advanced Reporting', 'Employee Management', 'Custom Apps', 'Loyalty Programs']
    },
    {
      id: 'lightspeed',
      name: 'Lightspeed',
      description: 'Cloud-based POS for retail and restaurants',
      color: 'purple',
      features: ['Multi-location', 'E-commerce Integration', 'Advanced Inventory', 'Customer Insights']
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'synced': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isConnected = merchantData?.pos_system && merchantData?.pos_access_token;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Link className="w-5 h-5 mr-2" />
            POS System Integration
          </CardTitle>
          <CardDescription>
            Connect your Point of Sale system to automatically sync rewards and promo codes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isConnected ? (
            <div className="space-y-6">
              {/* Connected Status */}
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="flex items-center justify-between">
                    <div>
                      <strong>{merchantData.pos_system?.charAt(0).toUpperCase() + merchantData.pos_system?.slice(1)} Connected</strong>
                      <p className="text-sm text-muted-foreground mt-1">
                        Connected on {new Date(merchantData.pos_connected_at!).toLocaleDateString()}
                      </p>
                    </div>
                    <Button variant="outline" onClick={handleDisconnect}>
                      Disconnect
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>

              {/* Integration Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-800">Automatic Sync</span>
                    </div>
                    <p className="text-sm text-green-600 mt-1">
                      Promo codes sync automatically with your POS
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-2">
                      <Zap className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-blue-800">Real-time Updates</span>
                    </div>
                    <p className="text-sm text-blue-600 mt-1">
                      Instant validation at checkout
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Promo Code Management */}
              {promoCodes.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Promo Code Sync Status</CardTitle>
                    <CardDescription>
                      Manage synchronization of your promo codes with {merchantData.pos_system}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {promoCodes.map((promo) => (
                        <div key={promo.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <CreditCard className="w-5 h-5 text-muted-foreground" />
                            <div>
                              <span className="font-medium">{promo.code}</span>
                              <Badge className={`ml-2 ${getStatusColor(promo.pos_sync_status)}`}>
                                {promo.pos_sync_status}
                              </Badge>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => syncPromoCode(promo.id)}
                            disabled={syncing === promo.id}
                          >
                            {syncing === promo.id ? (
                              <RotateCw className="w-4 h-4 animate-spin" />
                            ) : (
                              <RotateCw className="w-4 h-4" />
                            )}
                            Sync
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* POS Options */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {posOptions.map((pos) => (
                  <Card 
                    key={pos.id} 
                    className="border-2 hover:border-primary/50 transition-colors cursor-pointer relative"
                  >
                    <CardContent className="p-6">
                      <div className="text-center space-y-4">
                        <div className={`w-16 h-16 bg-${pos.color}-100 rounded-lg flex items-center justify-center mx-auto`}>
                          <Store className={`w-8 h-8 text-${pos.color}-600`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{pos.name}</h3>
                          <p className="text-sm text-muted-foreground">{pos.description}</p>
                        </div>
                        <div className="space-y-2">
                          {pos.features.map((feature, index) => (
                            <div key={index} className="flex items-center text-sm">
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                              {feature}
                            </div>
                          ))}
                        </div>
                        <Button
                          onClick={() => handleConnect(pos.id)}
                          disabled={connecting === pos.id}
                          className="w-full"
                        >
                          {connecting === pos.id ? 'Connecting...' : `Connect ${pos.name}`}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Integration Benefits */}
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Why integrate your POS system?</strong>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>• Automatic promo code validation at checkout</li>
                    <li>• Real-time reward redemption tracking</li>
                    <li>• Seamless customer experience</li>
                    <li>• Detailed analytics and reporting</li>
                    <li>• Reduced manual work for staff</li>
                  </ul>
                </AlertDescription>
              </Alert>

              {/* Setup Instructions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Setup Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3 text-sm">
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs mr-3 mt-0.5">1</span>
                      <div>
                        <strong>Choose your POS system</strong>
                        <p className="text-muted-foreground">Select the POS system you use in your business</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs mr-3 mt-0.5">2</span>
                      <div>
                        <strong>Authorize connection</strong>
                        <p className="text-muted-foreground">You'll be redirected to securely connect your account</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs mr-3 mt-0.5">3</span>
                      <div>
                        <strong>Automatic sync</strong>
                        <p className="text-muted-foreground">Your promo codes will automatically sync with your POS</p>
                      </div>
                    </li>
                  </ol>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};