import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, RotateCcw, Trophy } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import CardGrid from '../components/CardGrid';
import GameControls from '../components/GameControls';
import GameScore from '../components/GameScore';
import { useCardGame } from '../hooks/useCardGame';
import { useGameTimer } from '../hooks/useGameTimer';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useCompleteLevel } from '../hooks/useQueries';
import { GameType } from '../backend';

export default function CardMatchingGame() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal().toString() || 'guest';
  
  const { cards, flippedIndices, matchedPairs, moves, isComplete, handleCardClick, resetGame, gridSize } = useCardGame(1);
  const { elapsedTime, isRunning, startTimer, stopTimer, resetTimer } = useGameTimer();
  const completeLevel = useCompleteLevel();

  useEffect(() => {
    if (cards.length > 0 && !isRunning && !isComplete) {
      startTimer();
    }
  }, [cards, isRunning, isComplete, startTimer]);

  useEffect(() => {
    if (isComplete && isRunning) {
      stopTimer();
      
      // Save completion to backend
      const totalPairs = cards.length / 2;
      completeLevel.mutate({
        player: principal,
        gameType: GameType.cardMatching,
        level: BigInt(1),
        startTime: BigInt(Date.now() - elapsedTime) * BigInt(1000000),
        correctAnswers: BigInt(matchedPairs),
        totalQuestions: BigInt(totalPairs),
      });
    }
  }, [isComplete, isRunning, stopTimer, elapsedTime, matchedPairs, cards.length, principal, completeLevel]);

  const handleReset = () => {
    resetGame();
    resetTimer();
    startTimer();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => navigate({ to: '/' })}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Card Matching</h1>
          <div className="w-20" />
        </div>

        {/* Game Stats */}
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
              <div>
                <p className="text-sm text-muted-foreground">Pairs</p>
                <p className="text-2xl font-bold">
                  {matchedPairs}/{cards.length / 2}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Game Board */}
        <CardGrid
          cards={cards}
          flippedIndices={flippedIndices}
          matchedPairs={matchedPairs}
          onCardClick={handleCardClick}
          gridSize={gridSize}
        />

        {/* Controls */}
        <div className="mt-6">
          <GameControls onRestart={handleReset} />
        </div>

        {/* Completion Modal */}
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
