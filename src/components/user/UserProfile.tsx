import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { User, Calendar, Mail, Key } from 'lucide-react';

export const UserProfile = () => {
  const { user, profile, updateProfile } = useAuth();
  const [firstName, setFirstName] = useState(profile?.first_name || '');
  const [lastName, setLastName] = useState(profile?.last_name || '');
  const [email, setEmail] = useState(profile?.email || '');
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const { error } = await updateProfile({
        first_name: firstName,
        last_name: lastName,
        email: email
      });

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user?.email || '', {
        redirectTo: `${window.location.origin}/auth`
      });

      if (error) throw error;

      toast({
        title: "Reset Email Sent",
        description: "Check your email for password reset instructions.",
      });
    } catch (error: any) {
      toast({
        title: "Reset Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="w-5 h-5 mr-2" />
          User Profile
        </CardTitle>
        <CardDescription>
          Manage your account information and settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Account Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Account Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter first name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter last name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                placeholder="Enter email"
              />
            </div>
          </div>

          <Button 
            onClick={handleUpdateProfile} 
            disabled={loading}
            className="w-full md:w-auto"
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </Button>
        </div>

        {/* Account Details */}
        <div className="space-y-4 pt-6 border-t">
          <h3 className="text-lg font-semibold">Account Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Date Joined</p>
                <p className="text-sm text-muted-foreground">
                  {profile?.created_at ? formatDate(profile.created_at) : 'N/A'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
              <User className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Username</p>
                <p className="text-sm text-muted-foreground">
                  {profile?.first_name && profile?.last_name 
                    ? `${profile.first_name} ${profile.last_name}`
                    : 'Not set'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="space-y-4 pt-6 border-t">
          <h3 className="text-lg font-semibold">Security</h3>
          
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div className="flex items-center space-x-3">
              <Key className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Password</p>
                <p className="text-sm text-muted-foreground">Reset your password</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleResetPassword}>
              Reset Password
            </Button>
          </div>
        </div>

        {/* Points & Stats */}
        <div className="space-y-4 pt-6 border-t">
          <h3 className="text-lg font-semibold">Rewards Summary</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-primary/10">
              <p className="text-2xl font-bold text-primary">{profile?.total_points || 0}</p>
              <p className="text-sm text-muted-foreground">Total Points</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-success/10">
              <p className="text-2xl font-bold text-success">{profile?.referrals_made || 0}</p>
              <p className="text-sm text-muted-foreground">Referrals</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-secondary/10">
              <p className="text-2xl font-bold text-secondary">{profile?.card_linked ? 'Yes' : 'No'}</p>
              <p className="text-sm text-muted-foreground">Card Linked</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};