import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Trophy, Target, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useGetPlayerGameState, useGetPlayerHighScores } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function ProgressPage() {
  const navigate = useNavigate();
  const { identity, loginStatus } = useInternetIdentity();
  const principal = identity?.getPrincipal().toString() || 'guest';
  
  const { data: gameState, isLoading: stateLoading } = useGetPlayerGameState(principal);
  const { data: highScores, isLoading: scoresLoading } = useGetPlayerHighScores(principal);

  const isLoggedIn = loginStatus === 'success' && identity;

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" onClick={() => navigate({ to: '/' })}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">Progress</h1>
            <div className="w-20" />
          </div>
          
          <Card className="mt-8">
            <CardContent className="pt-6">
              <Trophy className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">Login to Track Progress</h2>
              <p className="text-muted-foreground mb-4">
                Sign in to save your scores and track your improvement across all puzzle types.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => navigate({ to: '/' })}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Your Progress</h1>
          <div className="w-20" />
        </div>

        {/* Current Level */}
        {gameState && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Current Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-lg bg-muted">
                  <p className="text-sm text-muted-foreground">Level</p>
                  <p className="text-2xl font-bold">{Number(gameState.currentLevel)}</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted">
                  <p className="text-sm text-muted-foreground">Score</p>
                  <p className="text-2xl font-bold">{Number(gameState.score)}</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted">
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="text-2xl font-bold">{Math.floor(Number(gameState.timeTaken) / 1000000000)}s</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted">
                  <p className="text-sm text-muted-foreground">Unlocked</p>
                  <p className="text-2xl font-bold">{gameState.unlockedPuzzles.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* High Scores */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              High Scores
            </CardTitle>
          </CardHeader>
          <CardContent>
            {scoresLoading ? (
              <p className="text-center text-muted-foreground">Loading scores...</p>
            ) : highScores && highScores.length > 0 ? (
              <div className="space-y-2">
                {highScores.slice(0, 10).map((score, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-muted-foreground">#{index + 1}</span>
                      <div>
                        <p className="font-semibold">Level {Number(score.level)}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {Math.floor(Number(score.timeTaken) / 1000000000)}s
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-primary">{Number(score.score)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No high scores yet. Start playing to set your first record!
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
