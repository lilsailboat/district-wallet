import { useState } from 'react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  CreditCard, 
  Gift, 
  TrendingUp, 
  Users, 
  Star, 
  Calendar,
  ExternalLink,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

export const DemoModal = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const demoSteps = [
    {
      title: "Link Your Card",
      description: "Securely connect your debit card with Plaid integration",
      icon: CreditCard,
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-teal-50 p-6 rounded-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Bank Connection</h4>
                <p className="text-sm text-gray-600">Plaid Secure Integration</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                256-bit SSL encryption
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Read-only access to transactions
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Automatic point calculation
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Your banking information is protected with bank-level security. We only read transaction data to award points.
          </p>
        </div>
      )
    },
    {
      title: "Earn Points Automatically",
      description: "Get 1 point per $1 spent at partner merchants",
      icon: TrendingUp,
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">$25</div>
                <div className="text-sm text-gray-600">Coffee Shop Purchase</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">25</div>
                <div className="text-sm text-gray-600">Points Earned</div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-white rounded border">
              <div className="flex items-center justify-between text-sm">
                <span>Joe's Coffee</span>
                <Badge variant="secondary">+25 pts</Badge>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Points are automatically added to your account when you shop at any participating merchant.
          </p>
        </div>
      )
    },
    {
      title: "Redeem Rewards",
      description: "Use points for discounts and free items anywhere",
      icon: Gift,
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white rounded border">
                <div className="flex items-center space-x-3">
                  <Gift className="w-5 h-5 text-purple-600" />
                  <div>
                    <div className="font-medium">Free Coffee</div>
                    <div className="text-sm text-gray-600">Joe's Coffee</div>
                  </div>
                </div>
                <Badge variant="outline">50 pts</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded border">
                <div className="flex items-center space-x-3">
                  <Gift className="w-5 h-5 text-purple-600" />
                  <div>
                    <div className="font-medium">20% Off Meal</div>
                    <div className="text-sm text-gray-600">Tony's Pizza</div>
                  </div>
                </div>
                <Badge variant="outline">100 pts</Badge>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Redeem points at any participating merchant. QR codes make redemption instant and easy.
          </p>
        </div>
      )
    },
    {
      title: "Refer Friends",
      description: "Earn bonus points when friends join District Wallet",
      icon: Users,
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-lg">
            <div className="text-center space-y-4">
              <div className="flex justify-center space-x-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Users className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="text-sm text-gray-600">Share Link</div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 mt-3" />
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Star className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-sm text-gray-600">Earn 100 pts</div>
                </div>
              </div>
              <div className="p-3 bg-white rounded border">
                <div className="text-sm font-mono text-gray-700">
                  districtwalletdc.com/ref/USER123
                </div>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Get 100 bonus points for each friend who signs up and links their card using your referral code.
          </p>
        </div>
      )
    }
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg">
          <Play className="w-5 h-5 mr-2" />
          View Demo
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">District Wallet Demo</DialogTitle>
          <DialogDescription>
            See how easy it is to earn and redeem rewards with District Wallet
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Indicator */}
          <div className="flex justify-center space-x-2">
            {demoSteps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index === currentStep ? 'bg-primary' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Current Step */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  {React.createElement(demoSteps[currentStep].icon, {
                    className: "w-5 h-5 text-primary"
                  })}
                </div>
                <div>
                  <CardTitle>{demoSteps[currentStep].title}</CardTitle>
                  <CardDescription>{demoSteps[currentStep].description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {demoSteps[currentStep].content}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            <div className="flex space-x-2">
              {currentStep === demoSteps.length - 1 ? (
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => window.open('https://calendly.com/districtwalletdc/30min', '_blank')}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Meeting
                  </Button>
                  <Button onClick={() => window.location.href = '/auth'}>
                    Get Started
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setCurrentStep(Math.min(demoSteps.length - 1, currentStep + 1))}
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-lg text-center">
            <h3 className="text-lg font-semibold mb-2">Ready to Get Started?</h3>
            <p className="text-muted-foreground mb-4">
              Join thousands of DC residents earning rewards at local businesses
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => window.open('https://calendly.com/districtwalletdc/30min', '_blank')}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Book a Demo Call
              </Button>
              <Button onClick={() => window.location.href = '/auth'}>
                <CreditCard className="w-4 h-4 mr-2" />
                Sign Up Now
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};