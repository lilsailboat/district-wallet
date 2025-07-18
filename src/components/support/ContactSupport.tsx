import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/components/auth/AuthProvider';
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Send
} from 'lucide-react';

interface ContactSupportProps {
  onClose?: () => void;
}

export const ContactSupport = ({ onClose }: ContactSupportProps) => {
  const { user, profile } = useAuth();
  const [formData, setFormData] = useState({
    subject: '',
    category: '',
    priority: 'medium',
    message: '',
    email: user?.email || '',
    phone: profile?.phone || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate support ticket submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Support Request Submitted",
        description: "Thank you for contacting us! We'll get back to you within 24 hours.",
      });

      // Reset form
      setFormData({
        subject: '',
        category: '',
        priority: 'medium',
        message: '',
        email: user?.email || '',
        phone: profile?.phone || ''
      });

      if (onClose) {
        onClose();
      }
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Unable to submit your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const supportCategories = [
    { value: 'account', label: 'Account Issues' },
    { value: 'rewards', label: 'Rewards & Points' },
    { value: 'merchant', label: 'Merchant Support' },
    { value: 'technical', label: 'Technical Issues' },
    { value: 'billing', label: 'Billing & Payments' },
    { value: 'general', label: 'General Questions' }
  ];

  const priorityLevels = [
    { value: 'low', label: 'Low', description: 'General question or feedback' },
    { value: 'medium', label: 'Medium', description: 'Standard support request' },
    { value: 'high', label: 'High', description: 'Urgent issue affecting service' },
    { value: 'critical', label: 'Critical', description: 'Service completely unavailable' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Contact Support</h2>
        <p className="text-muted-foreground">
          We're here to help! Send us a message and we'll respond as soon as possible.
        </p>
      </div>

      {/* Contact Methods */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4 text-center">
            <Mail className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="font-medium text-blue-800">Email Support</p>
            <p className="text-sm text-blue-600">support@districtwallet.com</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 text-center">
            <Phone className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p className="font-medium text-green-800">Phone Support</p>
            <p className="text-sm text-green-600">(555) 123-4567</p>
          </CardContent>
        </Card>
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4 text-center">
            <Clock className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <p className="font-medium text-orange-800">Response Time</p>
            <p className="text-sm text-orange-600">Within 24 hours</p>
          </CardContent>
        </Card>
      </div>

      {/* Support Form */}
      <Card>
        <CardHeader>
          <CardTitle>Submit a Support Request</CardTitle>
          <CardDescription>
            Fill out the form below and we'll get back to you as soon as possible
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Brief description of your issue"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {supportCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority *</Label>
                <Select 
                  value={formData.priority} 
                  onValueChange={(value) => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityLevels.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        <div>
                          <div className="font-medium">{priority.label}</div>
                          <div className="text-xs text-muted-foreground">{priority.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Please describe your issue in detail..."
                rows={6}
                required
              />
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-foreground">Before submitting:</p>
                  <ul className="mt-1 space-y-1 text-muted-foreground">
                    <li>• Check our FAQ section for common solutions</li>
                    <li>• Include any error messages or screenshots if applicable</li>
                    <li>• Provide your account email for faster resolution</li>
                  </ul>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || !formData.subject || !formData.category || !formData.message}
              variant="hero"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Support Request
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Additional Resources */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center mb-3">
            <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="font-semibold text-blue-800">Additional Resources</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-blue-800 mb-1">Self-Service Options:</p>
              <ul className="space-y-1 text-blue-600">
                <li>• Account settings and profile management</li>
                <li>• Rewards and points history</li>
                <li>• Merchant directory and locations</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-blue-800 mb-1">Community:</p>
              <ul className="space-y-1 text-blue-600">
                <li>• Join our Discord community</li>
                <li>• Follow us on social media</li>
                <li>• Participate in the logo contest</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};