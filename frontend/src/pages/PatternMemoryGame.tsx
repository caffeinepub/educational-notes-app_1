import { useEffect, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import PatternGrid from '../components/PatternGrid';
import GameControls from '../components/GameControls';
import GameScore from '../components/GameScore';
import { usePatternMemory } from '../hooks/usePatternMemory';
import { useGameTimer } from '../hooks/useGameTimer';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useCompleteLevel } from '../hooks/useQueries';
import { useSoundEffects } from '../hooks/useSoundEffects';
import { GameType } from '../backend';

export default function PatternMemoryGame() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal().toString() || 'guest';
  const { playClick, playSuccess, playError } = useSoundEffects();

  const {
    pattern,
    userPattern,
    phase,
    attempts,
    isComplete,
    handleCellClick,
    handleSubmit,
    resetGame,
    gridSize,
  } = usePatternMemory(1);

  const { elapsedTime, isRunning, startTimer, stopTimer, resetTimer } = useGameTimer();
  const completeLevel = useCompleteLevel();

  const prevPhaseRef = useRef(phase);

  useEffect(() => {
    if (phase === 'input' && !isRunning && !isComplete) {
      startTimer();
    }
  }, [phase, isRunning, isComplete, startTimer]);

  useEffect(() => {
    if (isComplete && isRunning) {
      stopTimer();
      playSuccess();
      completeLevel.mutate({
        player: principal,
        gameType: GameType.patternMemory,
        level: BigInt(1),
        startTime: BigInt(Date.now() - elapsedTime) * BigInt(1000000),
        correctAnswers: BigInt(1),
        totalQuestions: BigInt(1),
      });
    }
  }, [isComplete, isRunning]);

  // Detect wrong submission: phase goes back to input after a failed attempt
  useEffect(() => {
    if (prevPhaseRef.current === 'input' && phase === 'input' && attempts > 0) {
      playError();
    }
    prevPhaseRef.current = phase;
  }, [phase, attempts]);

  const handleCellClickWithSound = (row: number, col: number) => {
    if (phase === 'input') {
      playClick();
      handleCellClick(row, col);
    }
  };

  const handleSubmitWithSound = () => {
    handleSubmit();
  };

  const handleReset = () => {
    resetGame();
    resetTimer();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => navigate({ to: '/' })}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Pattern Memory</h1>
          <div className="w-20" />
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-around text-center">
              <div>
                <p className="text-sm text-muted-foreground">Phase</p>
                <p className="text-lg font-bold capitalize">{phase}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Time</p>
                <p className="text-2xl font-bold">{Math.floor(elapsedTime / 1000)}s</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Attempts</p>
                <p className="text-2xl font-bold">{attempts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div
          className="relative mx-auto"
          style={{
            backgroundImage: 'url(/assets/generated/pattern-bg.dim_800x600.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '1rem',
            padding: '2rem',
          }}
        >
          <PatternGrid
            pattern={pattern}
            userPattern={userPattern}
            phase={phase}
            onCellClick={handleCellClickWithSound}
            gridSize={gridSize}
          />
        </div>

        <div className="mt-6 flex gap-4">
          {phase === 'input' && (
            <Button onClick={handleSubmitWithSound} className="flex-1">
              Submit Pattern
            </Button>
          )}
          <GameControls onRestart={handleReset} />
        </div>

        {isComplete && (
          <GameScore
            timeTaken={elapsedTime}
            moves={attempts}
            level={1}
            onPlayAgain={handleReset}
            onBackToMenu={() => navigate({ to: '/' })}
          />
        )}
      </div>
    </div>
  );
}
