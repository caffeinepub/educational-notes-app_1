import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useActor } from '../hooks/useActor';
import { AnalyticsView } from '../backend';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Lock, Users, Monitor, Gamepad2, BarChart3, Eye, EyeOff, RefreshCw, ArrowLeft } from 'lucide-react';

const GAME_LABELS: Record<string, string> = {
  CardMatching: '🃏 Card Matching',
  MemoryTest: '🧠 Memory Test',
  PatternMemory: '🔲 Pattern Memory',
  SequenceMemory: '🔢 Sequence Memory',
  SlidingPuzzle: '🧩 Sliding Puzzle',
  SpeedTyping: '⌨️ Speed Typing',
  StroopEffect: '🎨 Stroop Effect',
  WordScramble: '🔤 Word Scramble',
  FillInTheBlanks: '📝 Fill in the Blanks',
  MissingLetter: '🔡 Missing Letter',
};

export default function AdminPage() {
  const { actor } = useActor();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [analytics, setAnalytics] = useState<AnalyticsView | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) return;
    setLoading(true);
    setError('');
    try {
      const result = await actor.getAnalytics(password);
      if (result === null) {
        setError('❌ Galat password! Dobara try karein.');
        setAuthenticated(false);
      } else {
        setAnalytics(result);
        setAuthenticated(true);
      }
    } catch (err) {
      setError('⚠️ Kuch error aaya. Dobara try karein.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!actor || !authenticated) return;
    setLoading(true);
    try {
      const result = await actor.getAnalytics(password);
      if (result !== null) {
        setAnalytics(result);
      }
    } catch (err) {
      // silent
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setAnalytics(null);
    setPassword('');
    setError('');
  };

  const totalGamePlays = analytics
    ? analytics.gamePlayCounts.reduce((sum, [, count]) => sum + Number(count), 0)
    : 0;

  const sortedGameCounts = analytics
    ? [...analytics.gamePlayCounts].sort((a, b) => Number(b[1]) - Number(a[1]))
    : [];

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          {/* Back button */}
          <button
            onClick={() => navigate({ to: '/' })}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft size={16} />
            Home par wapas jao
          </button>

          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-muted-foreground mt-1 text-sm">Memory Increase — Analytics Dashboard</p>
          </div>

          <Card className="border-border shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-center">🔐 Secure Login</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Admin Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password enter karein..."
                      className="pr-10 h-12 text-base"
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 min-w-[32px] min-h-[32px] flex items-center justify-center"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 text-base"
                  disabled={loading || !actor || !password}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Verifying...
                    </span>
                  ) : (
                    'Login'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-muted-foreground mt-4">
            Yeh page sirf admin ke liye hai
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
              <BarChart3 className="w-6 h-6 sm:w-7 sm:h-7 text-primary shrink-0" />
              Analytics Dashboard
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Memory Increase — Admin Panel</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
              className="min-h-[40px]"
            >
              <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="min-h-[40px]"
            >
              Logout
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: '/' })}
              className="min-h-[40px]"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Home
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <Card className="border-border">
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Visitors</p>
                  <p className="text-2xl font-bold text-foreground">
                    {analytics ? Number(analytics.totalVisitors).toLocaleString() : '0'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                  <Monitor className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Sessions</p>
                  <p className="text-2xl font-bold text-foreground">
                    {analytics ? Number(analytics.totalSessions).toLocaleString() : '0'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0">
                  <Gamepad2 className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Game Plays</p>
                  <p className="text-2xl font-bold text-foreground">
                    {totalGamePlays.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Game Play Counts */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Gamepad2 className="w-5 h-5 text-primary" />
              Game Play Counts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sortedGameCounts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Gamepad2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Abhi tak koi game nahi khela gaya</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedGameCounts.map(([gameName, count], index) => {
                  const label = GAME_LABELS[gameName] || gameName;
                  const countNum = Number(count);
                  const maxCount = sortedGameCounts.length > 0 ? Number(sortedGameCounts[0][1]) : 1;
                  const percentage = maxCount > 0 ? (countNum / maxCount) * 100 : 0;

                  return (
                    <div key={gameName} className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          {index === 0 && <Badge className="text-xs px-1.5 py-0 shrink-0">🏆 #1</Badge>}
                          <span className="text-sm font-medium text-foreground truncate">{label}</span>
                        </div>
                        <span className="text-sm font-bold text-primary shrink-0">{countNum.toLocaleString()} plays</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* All 10 games — show 0 for unplayed */}
            {(() => {
              const playedGames = new Set(sortedGameCounts.map(([name]) => name));
              const unplayedGames = Object.keys(GAME_LABELS).filter(g => !playedGames.has(g));
              if (unplayedGames.length === 0) return null;
              return (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-2">Abhi tak nahi khele gaye:</p>
                  <div className="flex flex-wrap gap-2">
                    {unplayedGames.map(game => (
                      <div key={game} className="flex items-center gap-1 text-xs text-muted-foreground bg-muted rounded-md px-2 py-1">
                        <span>{GAME_LABELS[game]}</span>
                        <span className="font-bold">— 0</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6 pb-4">
          Data ICP Motoko backend mein securely stored hai
        </p>
      </div>
    </div>
  );
}
