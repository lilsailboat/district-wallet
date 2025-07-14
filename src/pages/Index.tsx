import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Smartphone, 
  Gift, 
  TrendingUp, 
  Users, 
  Store, 
  Shield, 
  Star,
  CheckCircle,
  ArrowRight,
  Trophy,
  Heart,
  MapPin
} from 'lucide-react';

const Index = () => {
  const features = [
    {
      icon: CreditCard,
      title: "Link Your Card",
      description: "Securely connect your debit card to automatically earn points at partner merchants"
    },
    {
      icon: TrendingUp,
      title: "Earn Points",
      description: "Get 1 point for every $1 spent at participating local businesses"
    },
    {
      icon: Gift,
      title: "Redeem Rewards",
      description: "Use your points for discounts and free items at any partner location"
    }
  ];

  const benefits = [
    {
      icon: Users,
      title: "For Customers",
      items: ["Automatic point earning", "No apps to remember", "Redeem anywhere", "Refer friends for bonuses"]
    },
    {
      icon: Store,
      title: "For Merchants", 
      items: ["Attract new customers", "Increase loyalty", "Simple integration", "Valuable analytics"]
    },
    {
      icon: Heart,
      title: "For Community",
      items: ["Support local business", "Scholarship fund donations", "Economic development", "Stronger neighborhoods"]
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Local Customer",
      content: "I love how easy it is to earn rewards just by shopping at my favorite local spots. The automatic point earning is a game-changer!",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Coffee Shop Owner",
      content: "District Wallet has brought so many new customers to our shop. The referral system really works to grow our community.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Restaurant Manager",
      content: "The analytics we get help us understand our customers better. Plus, the loyalty program keeps people coming back.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background font-inter">
      {/* Hero Section */}
      <section className="relative bg-gradient-hero text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center space-y-8 animate-fade-in">
            <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
              🚀 Now Live in Washington DC
            </Badge>
            
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
              Loyalty Rewards for
              <span className="block bg-gradient-to-r from-teal-light to-white bg-clip-text text-transparent">
                Local Communities
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto">
              Earn points automatically when you shop local. Redeem rewards anywhere in our partner network. 
              Support your community with every purchase.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button variant="hero" size="xl" className="animate-glow">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Join District Wallet
                </Button>
              </Link>
              <Button variant="outline" size="xl" className="border-white/30 text-white hover:bg-white/10">
                <Store className="w-5 h-5 mr-2" />
                Become a Partner
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              How District Wallet Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple, automatic, and rewarding. Start earning points with every local purchase.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center bg-gradient-card shadow-soft hover:shadow-medium transition-all duration-300 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Benefits for Everyone
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              District Wallet creates value for customers, merchants, and the entire community
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="bg-card shadow-soft hover:shadow-medium transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-semibold">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {benefit.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-success mr-3 flex-shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Logo Contest Section */}
      <section className="py-24 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Help Design Our Future
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We're looking for the perfect logo to represent District Wallet. 
              Submit your design and vote for your favorites. Monthly prizes for winners!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/logo-contest">
                <Button variant="hero" size="lg">
                  <Trophy className="w-5 h-5 mr-2" />
                  Join Logo Contest
                </Button>
              </Link>
              <Link to="/logo-contest">
                <Button variant="outline" size="lg">
                  <Star className="w-5 h-5 mr-2" />
                  Vote on Designs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              What People Are Saying
            </h2>
            <p className="text-xl text-muted-foreground">
              Real feedback from our community members
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-card shadow-soft">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-hero text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Start Earning Rewards?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of DC residents who are already earning points and supporting local businesses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button variant="hero" size="xl" className="bg-white text-primary hover:bg-white/90">
                <CreditCard className="w-5 h-5 mr-2" />
                Get Started Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
