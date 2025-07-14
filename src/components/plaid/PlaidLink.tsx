import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from '@/hooks/use-toast';
import { CreditCard, Shield, CheckCircle, AlertCircle } from 'lucide-react';

interface PlaidLinkProps {
  onSuccess?: (token: string, metadata: any) => void;
}

export const PlaidLink = ({ onSuccess }: PlaidLinkProps) => {
  const { profile, updateProfile } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);

  // Demo function to simulate Plaid connection
  const handleConnectBank = async () => {
    setIsConnecting(true);
    
    try {
      // Simulate Plaid Link flow
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful connection
      const mockToken = 'demo_access_token_' + Date.now();
      const mockMetadata = {
        institution: {
          name: 'Demo Bank',
          institution_id: 'demo_bank'
        },
        accounts: [
          {
            id: 'demo_account_id',
            name: 'Demo Checking',
            mask: '1234',
            type: 'depository',
            subtype: 'checking'
          }
        ]
      };

      // Update user profile with mock data
      await updateProfile({
        plaid_access_token: mockToken,
        bank_name: mockMetadata.institution.name,
        masked_account: `****${mockMetadata.accounts[0].mask}`,
        card_linked: true
      });

      toast({
        title: "Bank Account Connected!",
        description: "Your account has been successfully linked. You'll now earn points automatically when you shop at partner merchants.",
      });

      if (onSuccess) {
        onSuccess(mockToken, mockMetadata);
      }
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect your bank account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  if (profile?.card_linked) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center text-green-800">
                <CheckCircle className="w-5 h-5 mr-2" />
                Bank Account Connected
              </CardTitle>
              <CardDescription className="text-green-700">
                {profile.bank_name} {profile.masked_account}
              </CardDescription>
            </div>
            <Badge className="bg-green-100 text-green-800">Active</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center text-sm text-green-700">
              <CheckCircle className="w-4 h-4 mr-2" />
              <span>Automatic point earning enabled</span>
            </div>
            <div className="flex items-center text-sm text-green-700">
              <Shield className="w-4 h-4 mr-2" />
              <span>Bank-level security and encryption</span>
            </div>
            <Button variant="outline" size="sm" className="w-full">
              Manage Connection
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="w-5 h-5 mr-2" />
          Connect Your Bank Account
        </CardTitle>
        <CardDescription>
          Link your debit card to automatically earn points when you shop at partner merchants
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <Shield className="w-4 h-4 mr-2 text-green-500" />
            <span>Bank-level 256-bit encryption</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
            <span>We never store your banking credentials</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
            <span>Automatic point earning at 1,000+ merchants</span>
          </div>
          <div className="flex items-center text-sm text-amber-600">
            <AlertCircle className="w-4 h-4 mr-2" />
            <span>Demo mode - No real banking data will be collected</span>
          </div>
        </div>

        <Button 
          onClick={handleConnectBank} 
          disabled={isConnecting}
          className="w-full"
          variant="hero"
        >
          {isConnecting ? (
            <>
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
              Connecting...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Connect Bank Account (Demo)
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Powered by Plaid • Trusted by millions of users
        </p>
      </CardContent>
    </Card>
  );
};