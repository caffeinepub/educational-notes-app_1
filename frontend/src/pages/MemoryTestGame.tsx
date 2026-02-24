import { useEffect, useRef, KeyboardEvent } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, RotateCcw, Home, CheckCircle2, XCircle, Eye, Search } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { useMemoryTest } from '../hooks/useMemoryTest';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useCompleteLevel } from '../hooks/useQueries';
import { GameType } from '../backend';

export default function MemoryTestGame() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal().toString() || 'guest';

  const level = 1;
  const {
    phase,
    objects,
    memorizeTimeLeft,
    recallTimeLeft,
    recalledObjects,
    inputValue,
    invalidInput,
    setInputValue,
    submitGuess,
    reset,
    correctCount,
  } = useMemoryTest(level);

  const completeLevel = useCompleteLevel();
  const savedRef = useRef(false);
  const startTimeRef = useRef<bigint>(BigInt(Date.now()) * BigInt(1_000_000));

  // Reset start time when game resets
  useEffect(() => {
    if (phase === 'memorize') {
      startTimeRef.current = BigInt(Date.now()) * BigInt(1_000_000);
      savedRef.current = false;
    }
  }, [phase]);

  // Save result when game ends
  useEffect(() => {
    if ((phase === 'won' || phase === 'lost') && !savedRef.current && !completeLevel.isPending) {
      savedRef.current = true;
      completeLevel.mutate({
        player: principal,
        gameType: GameType.memoryTest,
        level: BigInt(level),
        startTime: startTimeRef.current,
        correctAnswers: BigInt(correctCount),
        totalQuestions: BigInt(objects.length),
      });
    }
  }, [phase, principal, level, correctCount, objects.length, completeLevel]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      submitGuess();
    }
  };

  const handleReset = () => {
    savedRef.current = false;
    reset();
  };

  // Memorize Phase
  if (phase === 'memorize') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" onClick={() => navigate({ to: '/' })}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">Memory Test</h1>
            <div className="w-20" />
          </div>

          {/* Instructions */}
          <Card className="mb-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-2 justify-center">
                <Eye className="h-5 w-5 text-primary" />
                <p className="text-center text-sm font-medium">
                  Memorize all the objects! They will disappear in{' '}
                  <span className="text-primary font-bold">{memorizeTimeLeft}s</span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Countdown Timer */}
          <div className="text-center mb-6">
            <div
              className={`inline-flex items-center justify-center w-20 h-20 rounded-full text-3xl font-bold border-4 transition-colors ${
                memorizeTimeLeft <= 3
                  ? 'border-destructive text-destructive bg-destructive/10'
                  : 'border-primary text-primary bg-primary/10'
              }`}
            >
              {memorizeTimeLeft}
            </div>
            <p className="text-sm text-muted-foreground mt-2">seconds to memorize</p>
          </div>

          {/* Objects Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {objects.map((obj) => (
              <Card
                key={obj.id}
                className="text-center border-border hover:border-primary/40 transition-colors"
              >
                <CardContent className="pt-4 pb-4 flex flex-col items-center gap-1">
                  <span className="text-4xl">{obj.emoji}</span>
                  <span className="text-xs font-medium text-muted-foreground">{obj.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Recall Phase
  if (phase === 'recall') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" onClick={() => navigate({ to: '/' })}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">Memory Test</h1>
            <div className="w-20" />
          </div>

          {/* Timer */}
          <div className="text-center mb-6">
            <div
              className={`inline-flex items-center justify-center w-20 h-20 rounded-full text-3xl font-bold border-4 transition-colors ${
                recallTimeLeft <= 5
                  ? 'border-destructive text-destructive bg-destructive/10'
                  : recallTimeLeft <= 10
                  ? 'border-yellow-500 text-yellow-500 bg-yellow-500/10'
                  : 'border-primary text-primary bg-primary/10'
              }`}
            >
              {recallTimeLeft}
            </div>
            <p className="text-sm text-muted-foreground mt-2">seconds remaining</p>
          </div>

          {/* Progress */}
          <Card className="mb-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-primary" />
                  <p className="text-sm font-medium">
                    Recalled:{' '}
                    <span className="text-primary font-bold">
                      {correctCount} / {objects.length}
                    </span>
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">Type object names and press Enter</p>
              </div>
            </CardContent>
          </Card>

          {/* Input */}
          <div className="mb-6">
            <div className="flex gap-2">
              <Input
                autoFocus
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type an object name..."
                className={`text-base ${
                  invalidInput ? 'border-destructive ring-1 ring-destructive' : ''
                }`}
              />
              <Button onClick={submitGuess} disabled={!inputValue.trim()}>
                Enter
              </Button>
            </div>
            {invalidInput && (
              <p className="text-xs text-destructive mt-1">
                Not found or already recalled. Try another!
              </p>
            )}
          </div>

          {/* Recalled Objects */}
          {recalledObjects.length > 0 && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Recalled objects:</p>
              <div className="flex flex-wrap gap-2">
                {recalledObjects.map((label) => {
                  const obj = objects.find((o) => o.label === label);
                  return (
                    <Badge
                      key={label}
                      variant="secondary"
                      className="text-sm py-1 px-3 bg-primary/10 text-primary border-primary/20"
                    >
                      {obj?.emoji} {label}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}

          {/* Restart */}
          <div className="mt-8">
            <Button variant="outline" onClick={handleReset} className="w-full gap-2">
              <RotateCcw className="h-4 w-4" />
              Restart Game
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Won Screen
  if (phase === 'won') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-500/10 border-4 border-green-500 mb-4">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-green-500 mb-2">You Won! 🎉</h1>
            <p className="text-muted-foreground">
              Amazing! You recalled all <strong>{objects.length}</strong> objects correctly!
            </p>
          </div>

          <Card className="mb-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
            <CardContent className="pt-6 pb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Objects Recalled</p>
                  <p className="text-2xl font-bold text-green-500">
                    {correctCount}/{objects.length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Level</p>
                  <p className="text-2xl font-bold">{level}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recalled Objects Summary */}
          <div className="mb-6 text-left">
            <p className="text-sm font-medium text-muted-foreground mb-2">Objects you recalled:</p>
            <div className="flex flex-wrap gap-2">
              {recalledObjects.map((label) => {
                const obj = objects.find((o) => o.label === label);
                return (
                  <Badge
                    key={label}
                    variant="secondary"
                    className="text-sm py-1 px-3 bg-green-500/10 text-green-600 border-green-500/20"
                  >
                    {obj?.emoji} {label}
                  </Badge>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button onClick={handleReset} className="w-full gap-2">
              <RotateCcw className="h-4 w-4" />
              Play Again
            </Button>
            <Button variant="outline" onClick={() => navigate({ to: '/' })} className="w-full gap-2">
              <Home className="h-4 w-4" />
              Back to Menu
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Lost Screen
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-destructive/10 border-4 border-destructive mb-4">
            <XCircle className="h-12 w-12 text-destructive" />
          </div>
          <h1 className="text-3xl font-bold text-destructive mb-2">Time's Up! ⏰</h1>
          <p className="text-muted-foreground">
            You recalled <strong>{correctCount}</strong> out of <strong>{objects.length}</strong>{' '}
            objects.
          </p>
        </div>

        <Card className="mb-6 bg-gradient-to-br from-destructive/10 to-red-500/10 border-destructive/20">
          <CardContent className="pt-6 pb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Recalled</p>
                <p className="text-2xl font-bold text-destructive">
                  {correctCount}/{objects.length}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Level</p>
                <p className="text-2xl font-bold">{level}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Show all objects */}
        <div className="mb-6 text-left">
          <p className="text-sm font-medium text-muted-foreground mb-2">The objects were:</p>
          <div className="flex flex-wrap gap-2">
            {objects.map((obj) => {
              const wasRecalled = recalledObjects.some(
                (r) => r.toLowerCase() === obj.label.toLowerCase()
              );
              return (
                <Badge
                  key={obj.id}
                  variant="secondary"
                  className={`text-sm py-1 px-3 ${
                    wasRecalled
                      ? 'bg-green-500/10 text-green-600 border-green-500/20'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {obj.emoji} {obj.label}
                  {wasRecalled && ' ✓'}
                </Badge>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button onClick={handleReset} className="w-full gap-2">
            <RotateCcw className="h-4 w-4" />
            Try Again
          </Button>
          <Button variant="outline" onClick={() => navigate({ to: '/' })} className="w-full gap-2">
            <Home className="h-4 w-4" />
            Back to Menu
          </Button>
        </div>
      </div>
    </div>
  );
}
