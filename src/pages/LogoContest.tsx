import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Trophy, 
  Upload, 
  Heart, 
  Crown, 
  Calendar, 
  User,
  Mail,
  FileImage,
  Vote,
  Star
} from 'lucide-react';

interface LogoEntry {
  id: string;
  title: string;
  description: string | null;
  logo_url: string;
  contact_email: string | null;
  votes: number;
  is_winner: boolean;
  created_at: string;
}

const LogoContest = () => {
  const [entries, setEntries] = useState<LogoEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [submissionMode, setSubmissionMode] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    contactEmail: '',
    logoFile: null as File | null
  });

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('logo_contests')
        .select('*')
        .order('votes', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching entries:', error);
      toast({
        title: "Error",
        description: "Failed to load logo entries",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (entryId: string) => {
    try {
      // First get current votes
      const { data: current, error: fetchError } = await supabase
        .from('logo_contests')
        .select('votes')
        .eq('id', entryId)
        .single();

      if (fetchError) throw fetchError;

      // Update with incremented votes
      const { error: updateError } = await supabase
        .from('logo_contests')
        .update({ votes: (current.votes || 0) + 1 })
        .eq('id', entryId);

      if (updateError) throw updateError;

      toast({
        title: "Vote submitted!",
        description: "Thank you for voting on this design.",
      });

      // Refresh entries
      fetchEntries();
    } catch (error) {
      console.error('Error voting:', error);
      toast({
        title: "Error",
        description: "Failed to submit vote",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.logoFile) {
      toast({
        title: "Missing file",
        description: "Please select a logo file to upload",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // For demo purposes, we'll use a placeholder URL
      // In production, you'd upload to Supabase Storage
      const logoUrl = "https://via.placeholder.com/300x200?text=Logo+Submission";

      const { error } = await supabase
        .from('logo_contests')
        .insert({
          title: formData.title,
          description: formData.description,
          contact_email: formData.contactEmail,
          logo_url: logoUrl,
          votes: 0,
          is_winner: false
        });

      if (error) throw error;

      toast({
        title: "Submission successful!",
        description: "Your logo has been submitted for the contest.",
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        contactEmail: '',
        logoFile: null
      });
      setSubmissionMode(false);
      fetchEntries();
    } catch (error) {
      console.error('Error submitting:', error);
      toast({
        title: "Submission failed",
        description: "Failed to submit your logo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && entries.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center">
              <Trophy className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            District Wallet Logo Contest
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Help us design the future of community loyalty! Submit your logo design or vote for your favorites. 
            Monthly prizes for winners and recognition in our community.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!submissionMode ? (
              <Button 
                variant="hero" 
                size="lg"
                onClick={() => setSubmissionMode(true)}
              >
                <Upload className="w-5 h-5 mr-2" />
                Submit Your Design
              </Button>
            ) : (
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setSubmissionMode(false)}
              >
                <Vote className="w-5 h-5 mr-2" />
                View Gallery
              </Button>
            )}
          </div>
        </div>

        {submissionMode ? (
          /* Submission Form */
          <Card className="max-w-2xl mx-auto shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="w-5 h-5 mr-2" />
                Submit Your Logo Design
              </CardTitle>
              <CardDescription>
                Share your creative vision for District Wallet's logo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Design Title *</Label>
                  <Input
                    id="title"
                    placeholder="Give your design a name"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Tell us about your design concept and inspiration"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Contact Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logo">Logo File *</Label>
                  <div className="flex items-center space-x-2">
                    <FileImage className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="logo"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFormData({ ...formData, logoFile: e.target.files?.[0] || null })}
                      required
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Upload PNG, JPG, or SVG files. Maximum 5MB.
                  </p>
                </div>

                <Button type="submit" className="w-full" variant="hero" size="lg" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Design'}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          /* Logo Gallery */
          <>
            {/* Contest Info */}
            <Card className="mb-8 bg-gradient-card shadow-soft">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">{entries.length}</div>
                    <div className="text-sm text-muted-foreground">Total Submissions</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-success">{entries.reduce((sum, entry) => sum + (entry.votes || 0), 0)}</div>
                    <div className="text-sm text-muted-foreground">Total Votes</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-teal-accent">Monthly</div>
                    <div className="text-sm text-muted-foreground">Prize Period</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Logo Entries */}
            {entries.length === 0 ? (
              <Card className="text-center py-16">
                <CardContent>
                  <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No submissions yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Be the first to submit your logo design!
                  </p>
                  <Button variant="hero" onClick={() => setSubmissionMode(true)}>
                    <Upload className="w-4 h-4 mr-2" />
                    Submit First Design
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {entries.map((entry) => (
                  <Card key={entry.id} className="shadow-soft hover:shadow-medium transition-all duration-300">
                    <CardHeader>
                      <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                        <img 
                          src={entry.logo_url} 
                          alt={entry.title}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg flex items-center gap-2">
                            {entry.title}
                            {entry.is_winner && (
                              <Crown className="w-4 h-4 text-yellow-500" />
                            )}
                          </CardTitle>
                          {entry.description && (
                            <CardDescription className="mt-2">
                              {entry.description}
                            </CardDescription>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            {entry.votes || 0} votes
                          </Badge>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(entry.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleVote(entry.id)}
                        >
                          <Heart className="w-4 h-4 mr-1" />
                          Vote
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LogoContest;