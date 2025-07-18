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
  Star, 
  Send, 
  MessageSquare,
  ThumbsUp
} from 'lucide-react';

interface LeaveReviewProps {
  onClose?: () => void;
}

export const LeaveReview = ({ onClose }: LeaveReviewProps) => {
  const { user, profile } = useAuth();
  const [formData, setFormData] = useState({
    rating: '',
    title: '',
    review: '',
    category: '',
    wouldRecommend: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate review submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Review Submitted!",
        description: "Thank you for your feedback! Your review helps us improve District Wallet.",
      });

      // Reset form
      setFormData({
        rating: '',
        title: '',
        review: '',
        category: '',
        wouldRecommend: ''
      });

      if (onClose) {
        onClose();
      }
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Unable to submit your review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const reviewCategories = [
    { value: 'overall', label: 'Overall Experience' },
    { value: 'rewards', label: 'Rewards Program' },
    { value: 'merchants', label: 'Partner Merchants' },
    { value: 'app', label: 'App Experience' },
    { value: 'support', label: 'Customer Support' },
    { value: 'community', label: 'Community Aspect' }
  ];

  const renderStars = (rating: string) => {
    const stars = [];
    const numRating = parseInt(rating) || 0;
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => setFormData({ ...formData, rating: i.toString() })}
          className={`w-8 h-8 ${i <= numRating ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
        >
          <Star className="w-full h-full fill-current" />
        </button>
      );
    }
    return stars;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Leave a Review</h2>
        <p className="text-muted-foreground">
          Share your experience with District Wallet and help us build a better community loyalty program.
        </p>
      </div>

      {/* Review Form */}
      <Card>
        <CardHeader>
          <CardTitle>Your Feedback Matters</CardTitle>
          <CardDescription>
            Help us improve by sharing your honest experience with District Wallet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating */}
            <div className="space-y-3">
              <Label>Overall Rating *</Label>
              <div className="flex items-center space-x-1">
                {renderStars(formData.rating)}
                {formData.rating && (
                  <span className="ml-3 text-sm text-muted-foreground">
                    {formData.rating}/5 stars
                  </span>
                )}
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Review Category *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="What aspect would you like to review?" />
                </SelectTrigger>
                <SelectContent>
                  {reviewCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Review Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Summarize your experience in a few words"
                required
              />
            </div>

            {/* Review Text */}
            <div className="space-y-2">
              <Label htmlFor="review">Your Review *</Label>
              <Textarea
                id="review"
                value={formData.review}
                onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                placeholder="Tell us about your experience with District Wallet. What did you like? What could be improved?"
                rows={6}
                required
              />
              <p className="text-xs text-muted-foreground">
                Please be honest and constructive. Your feedback helps us improve the experience for everyone.
              </p>
            </div>

            {/* Would Recommend */}
            <div className="space-y-2">
              <Label htmlFor="recommend">Would you recommend District Wallet? *</Label>
              <Select 
                value={formData.wouldRecommend} 
                onValueChange={(value) => setFormData({ ...formData, wouldRecommend: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="definitely">Definitely</SelectItem>
                  <SelectItem value="probably">Probably</SelectItem>
                  <SelectItem value="maybe">Maybe</SelectItem>
                  <SelectItem value="probably-not">Probably not</SelectItem>
                  <SelectItem value="definitely-not">Definitely not</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Mission Statement */}
            <div className="bg-gradient-to-r from-primary/10 to-blue/10 p-6 rounded-lg border border-primary/20">
              <div className="flex items-center mb-3">
                <ThumbsUp className="w-5 h-5 text-primary mr-2" />
                <h3 className="font-semibold text-primary">Our Mission</h3>
              </div>
              <p className="text-sm text-muted-foreground italic">
                "Loyalty built for the community, by the community."
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Your feedback helps us stay true to this mission and build something that truly serves our community.
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || !formData.rating || !formData.title || !formData.review || !formData.category || !formData.wouldRecommend}
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
                  Submit Review
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};