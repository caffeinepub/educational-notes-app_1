import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import SequenceItem from '../components/SequenceItem';
import GameControls from '../components/GameControls';
import GameScore from '../components/GameScore';
import { useSequenceMemory } from '../hooks/useSequenceMemory';
import { useGameTimer } from '../hooks/useGameTimer';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useCompleteLevel } from '../hooks/useQueries';
import { GameType } from '../backend';

export default function SequenceMemoryGame() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal().toString() || 'guest';
  
  const {
    sequence,
    userSequence,
    phase,
    currentIndex,
    attempts,
    isComplete,
    handleItemClick,
    resetGame,
  } = useSequenceMemory(1);
  
  const { elapsedTime, isRunning, startTimer, stopTimer, resetTimer } = useGameTimer();
  const completeLevel = useCompleteLevel();

  useEffect(() => {
    if (phase === 'input' && !isRunning && !isComplete) {
      startTimer();
    }
  }, [phase, isRunning, isComplete, startTimer]);

  useEffect(() => {
    if (isComplete && isRunning) {
      stopTimer();
      
      completeLevel.mutate({
        player: principal,
        gameType: GameType.sequenceMemory,
        level: BigInt(1),
        startTime: BigInt(Date.now() - elapsedTime) * BigInt(1000000),
        correctAnswers: BigInt(1),
        totalQuestions: BigInt(1),
      });
    }
  }, [isComplete, isRunning, stopTimer, elapsedTime, principal, completeLevel]);

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
          <h1 className="text-2xl font-bold">Sequence Memory</h1>
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

        <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
          {sequence.map((item, index) => (
            <SequenceItem
              key={index}
              value={item}
              isActive={phase === 'display' && index === currentIndex}
              isSelected={userSequence.includes(item)}
              onClick={() => handleItemClick(item)}
              disabled={phase !== 'input'}
            />
          ))}
        </div>

        <div className="mt-6">
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
