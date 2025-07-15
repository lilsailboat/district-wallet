import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Store, ArrowLeft, Upload, Building } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const MerchantSignup = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    phone: '',
    businessAddress: '',
    website: '',
    description: '',
    ein: '',
    posSystem: ''
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in first to submit merchant application.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('merchants')
        .insert({
          user_id: user.id,
          business_name: formData.businessName,
          email: formData.email,
          phone: formData.phone,
          business_address: formData.businessAddress,
          website: formData.website,
          description: formData.description,
          ein: formData.ein,
          pos_system: formData.posSystem,
          is_approved: false
        });

      if (error) throw error;

      toast({
        title: "Application Submitted!",
        description: "Your merchant application has been submitted for review. You'll hear back within 2-3 business days.",
      });

      navigate('/merchant');
    } catch (error: any) {
      console.error('Error submitting merchant application:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero text-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back to Home */}
        <Link to="/" className="inline-flex items-center text-white/80 hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Store className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Merchant Application</h1>
          <p className="text-white/80">Join District Wallet's growing network of local businesses</p>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-glow">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center">
              <Building className="w-5 h-5 mr-2" />
              Business Information
            </CardTitle>
            <CardDescription>
              Tell us about your business to get started with District Wallet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="Your Business Name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Business Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="business@example.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    name="website"
                    type="url"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://yourbusiness.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessAddress">Business Address *</Label>
                <Input
                  id="businessAddress"
                  name="businessAddress"
                  value={formData.businessAddress}
                  onChange={handleChange}
                  placeholder="123 Main St, Washington, DC 20001"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Business Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell us about your business, what you offer, and why you'd like to join District Wallet..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ein">EIN (Optional)</Label>
                  <Input
                    id="ein"
                    name="ein"
                    value={formData.ein}
                    onChange={handleChange}
                    placeholder="12-3456789"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="posSystem">POS System</Label>
                  <Input
                    id="posSystem"
                    name="posSystem"
                    value={formData.posSystem}
                    onChange={handleChange}
                    placeholder="Square, Clover, Toast, etc."
                  />
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• We'll review your application within 2-3 business days</li>
                  <li>• You'll receive an email with approval status and next steps</li>
                  <li>• Once approved, you can create rewards and start attracting customers</li>
                  <li>• We'll help you integrate with your existing POS system</li>
                </ul>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                variant="hero"
                size="lg"
                disabled={loading}
              >
                {loading ? 'Submitting Application...' : 'Submit Application'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MerchantSignup;