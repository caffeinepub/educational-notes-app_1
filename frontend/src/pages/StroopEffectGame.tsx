import { useEffect, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import GameControls from '../components/GameControls';
import GameScore from '../components/GameScore';
import StroopDisplay from '../components/StroopDisplay';
import { useStroopEffect } from '../hooks/useStroopEffect';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useCompleteLevel } from '../hooks/useQueries';
import { useSoundEffects } from '../hooks/useSoundEffects';
import { GameType } from '../backend';

export default function StroopEffectGame() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal().toString() || 'guest';
  const { playClick, playSuccess, playError } = useSoundEffects();

  const level = 1;
  const {
    currentWord,
    currentColor,
    displayColor,
    round,
    score,
    correctAnswers,
    timeRemaining,
    isComplete,
    gameOver,
    handleColorSelect,
    resetGame,
  } = useStroopEffect(level);

  const completeLevel = useCompleteLevel();

  const prevCorrectAnswersRef = useRef(correctAnswers);
  const prevRoundRef = useRef(round);

  useEffect(() => {
    if (isComplete && !completeLevel.isPending) {
      const startTime = BigInt(Date.now() - 30000) * BigInt(1000000);
      completeLevel.mutate({
        player: principal,
        gameType: GameType.stroopEffect,
        level: BigInt(level),
        startTime,
        correctAnswers: BigInt(correctAnswers),
        totalQuestions: BigInt(30),
      });
    }
  }, [isComplete]);

  // Detect correct/wrong answer by watching round and correctAnswers change
  useEffect(() => {
    if (round > prevRoundRef.current) {
      if (correctAnswers > prevCorrectAnswersRef.current) {
        playSuccess();
      } else {
        playError();
      }
      prevCorrectAnswersRef.current = correctAnswers;
      prevRoundRef.current = round;
    }
  }, [round, correctAnswers]);

  const handleColorSelectWithSound = (color: string) => {
    playClick();
    handleColorSelect(color);
  };

  const handleReset = () => {
    resetGame();
    prevCorrectAnswersRef.current = 0;
    prevRoundRef.current = 1;
  };

  const totalTime = 30000;
  const elapsedTime = totalTime - timeRemaining;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => navigate({ to: '/' })}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Stroop Effect</h1>
          <div className="w-20" />
        </div>

        {/* Instructions */}
        <Card className="mb-6 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border-yellow-500/20">
          <CardContent className="pt-6">
            <p className="text-center text-sm">
              <strong>How to Play:</strong> Click the button that matches the <strong>color of the text</strong>, not what the word says!
            </p>
          </CardContent>
        </Card>

        {/* Game Stats */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-around text-center">
              <div>
                <p className="text-sm text-muted-foreground">Time Left</p>
                <p className={`text-2xl font-bold ${timeRemaining < 10000 ? 'text-destructive' : ''}`}>
                  {Math.ceil(timeRemaining / 1000)}s
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Round</p>
                <p className="text-2xl font-bold">{round}/30</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Score</p>
                <p className="text-2xl font-bold">{score}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Level</p>
                <p className="text-2xl font-bold">{level}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Game Display */}
        {!isComplete && !gameOver && (
          <StroopDisplay
            word={currentWord}
            wordColor={currentColor}
            displayColor={displayColor}
            onColorSelect={handleColorSelectWithSound}
          />
        )}

        {/* Game Over Message */}
        {gameOver && !isComplete && (
          <Card className="mb-6 bg-destructive/10 border-destructive/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Time's Up!</h2>
                <p className="text-muted-foreground mb-4">
                  You completed {round - 1} out of 30 rounds
                </p>
                <p className="text-lg">
                  Score: <strong>{score}</strong> | Correct: <strong>{correctAnswers}</strong>
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Controls */}
        <div className="mt-6">
          <GameControls onRestart={handleReset} />
        </div>

        {/* Completion Modal */}
        {isComplete && (
          <GameScore
            timeTaken={elapsedTime}
            moves={30 - correctAnswers}
            level={level}
            onPlayAgain={handleReset}
            onBackToMenu={() => navigate({ to: '/' })}
          />
        )}
      </div>
    </div>
  );
}
