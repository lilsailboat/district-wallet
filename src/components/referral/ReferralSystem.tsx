import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Users, Copy, Share, Gift } from 'lucide-react';

export const ReferralSystem = () => {
  const { profile, updateProfile } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const referralLink = `${window.location.origin}/auth?ref=${profile?.referral_code}`;

  const handleSendReferral = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter an email address to send the referral.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // In a real app, you'd send this through an email service
      // For now, we'll just copy to clipboard and show a success message
      
      const referralMessage = `Join District Wallet and earn rewards when you shop local! Use my referral code: ${profile?.referral_code} or click this link: ${referralLink}`;
      
      await navigator.clipboard.writeText(referralMessage);
      
      toast({
        title: "Referral Message Copied!",
        description: "The referral message has been copied to your clipboard. You can now send it manually.",
      });

      setEmail('');
    } catch (error) {
      toast({
        title: "Failed to Copy",
        description: "Unable to copy referral message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyReferralCode = async () => {
    try {
      await navigator.clipboard.writeText(profile?.referral_code || '');
      toast({
        title: "Code Copied!",
        description: "Your referral code has been copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy referral code.",
        variant: "destructive",
      });
    }
  };

  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      toast({
        title: "Link Copied!",
        description: "Your referral link has been copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy referral link.",
        variant: "destructive",
      });
    }
  };

  const shareReferral = async () => {
    const shareData = {
      title: 'Join District Wallet',
      text: `Join District Wallet and earn rewards when you shop local! Use my referral code: ${profile?.referral_code}`,
      url: referralLink,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback to copying
        await copyReferralLink();
      }
    } catch (error) {
      console.log('Share failed:', error);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="w-5 h-5 mr-2" />
          Refer Friends & Earn
        </CardTitle>
        <CardDescription>
          Share District Wallet with friends and both of you earn bonus points!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Referral Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 rounded-lg bg-primary/10">
            <p className="text-2xl font-bold text-primary">{profile?.referrals_made || 0}</p>
            <p className="text-sm text-muted-foreground">Friends Referred</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-success/10">
            <p className="text-2xl font-bold text-success">{(profile?.referrals_made || 0) * 100}</p>
            <p className="text-sm text-muted-foreground">Bonus Points Earned</p>
          </div>
        </div>

        {/* How it Works */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">How It Works</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">1</div>
              <p className="text-sm">Share your referral code or link with friends</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">2</div>
              <p className="text-sm">They sign up and link their bank account</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">3</div>
              <p className="text-sm">Both of you earn 100 bonus points!</p>
            </div>
          </div>
        </div>

        {/* Referral Code */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Your Referral Code</h3>
          <div className="flex items-center space-x-2">
            <Input
              value={profile?.referral_code || ''}
              readOnly
              className="flex-1 font-mono text-center text-lg font-bold"
            />
            <Button variant="outline" onClick={copyReferralCode}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Referral Link */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Your Referral Link</h3>
          <div className="flex items-center space-x-2">
            <Input
              value={referralLink}
              readOnly
              className="flex-1 text-sm"
            />
            <Button variant="outline" onClick={copyReferralLink}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Share Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button onClick={shareReferral} className="w-full">
            <Share className="w-4 h-4 mr-2" />
            Share Referral
          </Button>
          <div className="space-y-2">
            <Label htmlFor="email">Send via Email (Manual)</Label>
            <div className="flex space-x-2">
              <Input
                id="email"
                type="email"
                placeholder="friend@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button onClick={handleSendReferral} disabled={loading}>
                {loading ? 'Copying...' : 'Copy Message'}
              </Button>
            </div>
          </div>
        </div>

        {/* Bonus Info */}
        <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-success/10 border border-primary/20">
          <div className="flex items-center space-x-3">
            <Gift className="w-8 h-8 text-primary" />
            <div>
              <h4 className="font-semibold text-primary">Earn More Rewards!</h4>
              <p className="text-sm text-muted-foreground">
                The more friends you refer, the more bonus points you earn. There's no limit!
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};