import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { 
  Trophy, 
  Heart, 
  Crown, 
  Calendar, 
  User,
  Star,
  TrendingUp,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

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

const VoteOnDesigns = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<LogoEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [votedEntries, setVotedEntries] = useState<Set<string>>(new Set());

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
    if (votedEntries.has(entryId)) {
      toast({
        title: "Already voted",
        description: "You've already voted for this design.",
        variant: "destructive",
      });
      return;
    }

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

      // Track vote locally
      setVotedEntries(prev => new Set([...prev, entryId]));

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const topEntry = entries[0];
  const otherEntries = entries.slice(1);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link to="/logo-contest">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Contest
              </Button>
            </Link>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center">
                <Trophy className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Vote on Designs
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4">
              Help choose the future of District Wallet! Vote for your favorite logo designs.
            </p>
            <p className="text-sm text-primary font-medium">
              Loyalty built for the community, by the community.
            </p>
          </div>
        </div>

        {/* Voting Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-card shadow-soft">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-primary">{entries.length}</div>
              <div className="text-sm text-muted-foreground">Total Designs</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card shadow-soft">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-success">{entries.reduce((sum, entry) => sum + (entry.votes || 0), 0)}</div>
              <div className="text-sm text-muted-foreground">Total Votes</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card shadow-soft">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-teal-accent">{votedEntries.size}</div>
              <div className="text-sm text-muted-foreground">Your Votes</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card shadow-soft">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-primary">Monthly</div>
              <div className="text-sm text-muted-foreground">Prize Period</div>
            </CardContent>
          </Card>
        </div>

        {entries.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No submissions yet</h3>
              <p className="text-muted-foreground mb-6">
                Be the first to submit your logo design!
              </p>
              <Link to="/logo-contest">
                <Button variant="hero">
                  View Contest Details
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Leading Design */}
            {topEntry && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Crown className="w-5 h-5 text-yellow-500" />
                  <h2 className="text-2xl font-bold">Current Leader</h2>
                </div>
                <Card className="border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 shadow-medium">
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                      <div className="aspect-video bg-white rounded-lg p-6 flex items-center justify-center shadow-soft">
                        <img 
                          src={topEntry.logo_url} 
                          alt={topEntry.title}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            {topEntry.title}
                            <Crown className="w-6 h-6 text-yellow-500" />
                          </h3>
                          {topEntry.description && (
                            <p className="text-muted-foreground mt-2">{topEntry.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant="secondary" className="text-lg px-3 py-1">
                            <Heart className="w-4 h-4 mr-1" />
                            {topEntry.votes || 0} votes
                          </Badge>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(topEntry.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <Button 
                          onClick={() => handleVote(topEntry.id)}
                          disabled={votedEntries.has(topEntry.id)}
                          variant="hero"
                          size="lg"
                          className="w-full"
                        >
                          {votedEntries.has(topEntry.id) ? (
                            <>
                              <Star className="w-5 h-5 mr-2" />
                              Voted!
                            </>
                          ) : (
                            <>
                              <Heart className="w-5 h-5 mr-2" />
                              Vote for This Design
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Other Designs */}
            {otherEntries.length > 0 && (
              <>
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <h2 className="text-2xl font-bold">All Designs</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {otherEntries.map((entry, index) => (
                    <Card key={entry.id} className="shadow-soft hover:shadow-medium transition-all duration-300 group">
                      <CardHeader>
                        <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                          <img 
                            src={entry.logo_url} 
                            alt={entry.title}
                            className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="text-xs">
                                #{index + 2}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {new Date(entry.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <CardTitle className="text-lg">{entry.title}</CardTitle>
                            {entry.description && (
                              <CardDescription className="mt-2 text-sm">
                                {entry.description}
                              </CardDescription>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-center">
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              {entry.votes || 0} votes
                            </Badge>
                          </div>
                          <Button 
                            variant={votedEntries.has(entry.id) ? "outline" : "default"}
                            size="sm"
                            onClick={() => handleVote(entry.id)}
                            disabled={votedEntries.has(entry.id)}
                            className="w-full"
                          >
                            {votedEntries.has(entry.id) ? (
                              <>
                                <Star className="w-4 h-4 mr-1" />
                                Voted!
                              </>
                            ) : (
                              <>
                                <Heart className="w-4 h-4 mr-1" />
                                Vote
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default VoteOnDesigns;
