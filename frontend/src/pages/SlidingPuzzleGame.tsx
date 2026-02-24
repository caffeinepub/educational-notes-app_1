import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import SlidingTile from '../components/SlidingTile';
import GameControls from '../components/GameControls';
import GameScore from '../components/GameScore';
import { useSlidingPuzzle } from '../hooks/useSlidingPuzzle';
import { useGameTimer } from '../hooks/useGameTimer';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useCompleteLevel } from '../hooks/useQueries';
import { GameType } from '../backend';

export default function SlidingPuzzleGame() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal().toString() || 'guest';
  
  const { tiles, emptyIndex, moves, isComplete, handleTileClick, resetPuzzle, gridSize } = useSlidingPuzzle(1);
  const { elapsedTime, isRunning, startTimer, stopTimer, resetTimer } = useGameTimer();
  const completeLevel = useCompleteLevel();

  useEffect(() => {
    if (tiles.length > 0 && !isRunning && !isComplete) {
      startTimer();
    }
  }, [tiles, isRunning, isComplete, startTimer]);

  useEffect(() => {
    if (isComplete && isRunning) {
      stopTimer();
      
      completeLevel.mutate({
        player: principal,
        gameType: GameType.slidingPuzzle,
        level: BigInt(1),
        startTime: BigInt(Date.now() - elapsedTime) * BigInt(1000000),
        correctAnswers: BigInt(1),
        totalQuestions: BigInt(1),
      });
    }
  }, [isComplete, isRunning, stopTimer, elapsedTime, principal, completeLevel]);

  const handleReset = () => {
    resetPuzzle();
    resetTimer();
    startTimer();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => navigate({ to: '/' })}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Sliding Puzzle</h1>
          <div className="w-20" />
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-around text-center">
              <div>
                <p className="text-sm text-muted-foreground">Time</p>
                <p className="text-2xl font-bold">{Math.floor(elapsedTime / 1000)}s</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Moves</p>
                <p className="text-2xl font-bold">{moves}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div
          className="grid gap-2 mx-auto bg-card p-4 rounded-lg border border-border"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
            maxWidth: `${gridSize * 100}px`,
          }}
        >
          {tiles.map((tile, index) => (
            <SlidingTile
              key={index}
              value={tile}
              isEmpty={index === emptyIndex}
              onClick={() => handleTileClick(index)}
            />
          ))}
        </div>

        <div className="mt-6">
          <GameControls onRestart={handleReset} />
        </div>

        {isComplete && (
          <GameScore
            timeTaken={elapsedTime}
            moves={moves}
            level={1}
            onPlayAgain={handleReset}
            onBackToMenu={() => navigate({ to: '/' })}
          />
        )}
      </div>
    </div>
  );
}
