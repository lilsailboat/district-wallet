import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UserProfile } from '@/components/user/UserProfile';
import { ReferralSystem } from '@/components/referral/ReferralSystem';
import { PlaidLink } from '@/components/plaid/PlaidLink';
import { RewardCatalog } from '@/components/rewards/RewardCatalog';
import { ContactSupport } from '@/components/support/ContactSupport';
import { LeaveReview } from '@/components/feedback/LeaveReview';
import { 
  CreditCard, 
  TrendingUp, 
  Users, 
  Gift, 
  Calendar,
  MapPin,
  DollarSign,
  ExternalLink,
  User,
  Settings,
  MessageSquare,
  Star
} from 'lucide-react';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [activeDialog, setActiveDialog] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Mock data for demo
  const userStats = {
    totalPoints: 2487,
    thisMonthEarned: 156,
    referralsMade: 3,
    rewardsRedeemed: 2
  };

  const recentTransactions = [
    { id: 1, merchant: "Corner Coffee", amount: 12.50, points: 13, date: "2024-01-15" },
    { id: 2, merchant: "Local Bookstore", amount: 24.99, points: 25, date: "2024-01-14" },
    { id: 3, merchant: "Farmers Market", amount: 18.75, points: 19, date: "2024-01-13" },
    { id: 4, merchant: "District Deli", amount: 15.25, points: 15, date: "2024-01-12" },
  ];

  const availableRewards = [
    { id: 1, title: "$5 off at Corner Coffee", points: 500, merchant: "Corner Coffee", expires: "2024-02-15" },
    { id: 2, title: "Free pastry with purchase", points: 300, merchant: "District Deli", expires: "2024-02-20" },
    { id: 3, title: "10% off books", points: 800, merchant: "Local Bookstore", expires: "2024-02-25" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back! 👋
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening with your rewards account
            </p>
          </div>
          <Dialog open={activeDialog === 'profile'} onOpenChange={(open) => setActiveDialog(open ? 'profile' : null)}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>User Profile</DialogTitle>
              </DialogHeader>
              <UserProfile />
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-card shadow-soft hover:shadow-medium transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Points</p>
                  <p className="text-2xl font-bold text-foreground">{userStats.totalPoints.toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-soft hover:shadow-medium transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold text-foreground">{userStats.thisMonthEarned}</p>
                </div>
                <div className="h-12 w-12 bg-success/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-soft hover:shadow-medium transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Referrals Made</p>
                  <p className="text-2xl font-bold text-foreground">{userStats.referralsMade}</p>
                </div>
                <div className="h-12 w-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-soft hover:shadow-medium transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Rewards Used</p>
                  <p className="text-2xl font-bold text-foreground">{userStats.rewardsRedeemed}</p>
                </div>
                <div className="h-12 w-12 bg-teal-accent/10 rounded-lg flex items-center justify-center">
                  <Gift className="h-6 w-6 text-teal-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Transactions */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Recent Transactions
              </CardTitle>
              <CardDescription>
                Your latest purchases at partner merchants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{transaction.merchant}</p>
                        <p className="text-sm text-muted-foreground">{transaction.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">${transaction.amount}</p>
                      <p className="text-sm text-success">+{transaction.points} pts</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Transactions
              </Button>
            </CardContent>
          </Card>

          {/* Available Rewards */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Gift className="w-5 h-5 mr-2" />
                Available Rewards
              </CardTitle>
              <CardDescription>
                Redeem your points for these great offers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {availableRewards.map((reward) => (
                  <div key={reward.id} className="p-4 rounded-lg bg-muted/50 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{reward.title}</h4>
                        <p className="text-sm text-muted-foreground">{reward.merchant}</p>
                      </div>
                      <Badge variant="secondary" className="ml-2">
                        {reward.points} pts
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-1" />
                        Expires {reward.expires}
                      </div>
                      <Button 
                        size="sm" 
                        variant="hero"
                        disabled={userStats.totalPoints < reward.points}
                      >
                        Redeem
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                <ExternalLink className="w-4 h-4 mr-2" />
                Browse All Rewards
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8 shadow-soft">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks to manage your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Dialog open={activeDialog === 'referral'} onOpenChange={(open) => setActiveDialog(open ? 'referral' : null)}>
                <DialogTrigger asChild>
                  <Button variant="fintech" className="h-20 flex-col">
                    <Users className="w-6 h-6 mb-2" />
                    Refer Friends
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Refer Friends</DialogTitle>
                  </DialogHeader>
                  <ReferralSystem />
                </DialogContent>
              </Dialog>

              <Dialog open={activeDialog === 'plaid'} onOpenChange={(open) => setActiveDialog(open ? 'plaid' : null)}>
                <DialogTrigger asChild>
                  <Button variant="fintech" className="h-20 flex-col">
                    <CreditCard className="w-6 h-6 mb-2" />
                    Manage Bank Account
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Bank Account Management</DialogTitle>
                  </DialogHeader>
                  <PlaidLink />
                </DialogContent>
              </Dialog>

              <Dialog open={activeDialog === 'rewards'} onOpenChange={(open) => setActiveDialog(open ? 'rewards' : null)}>
                <DialogTrigger asChild>
                  <Button variant="fintech" className="h-20 flex-col">
                    <Gift className="w-6 h-6 mb-2" />
                    Browse Rewards
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>All Rewards</DialogTitle>
                  </DialogHeader>
                  <RewardCatalog />
                </DialogContent>
              </Dialog>

              <Dialog open={activeDialog === 'support'} onOpenChange={(open) => setActiveDialog(open ? 'support' : null)}>
                <DialogTrigger asChild>
                  <Button variant="fintech" className="h-20 flex-col">
                    <MessageSquare className="w-6 h-6 mb-2" />
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

              <Dialog open={activeDialog === 'review'} onOpenChange={(open) => setActiveDialog(open ? 'review' : null)}>
                <DialogTrigger asChild>
                  <Button variant="fintech" className="h-20 flex-col">
                    <Star className="w-6 h-6 mb-2" />
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;