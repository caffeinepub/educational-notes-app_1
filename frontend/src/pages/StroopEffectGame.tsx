import React, { useEffect } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import useStroopEffect from '../hooks/useStroopEffect';
import useSoundEffects from '../hooks/useSoundEffects';
import { useCompleteLevel } from '../hooks/useQueries';
import { GameType } from '../backend';
import StroopDisplay from '../components/StroopDisplay';
import GameControls from '../components/GameControls';
import { Clock, Target } from 'lucide-react';

const LEVEL = 1;

export default function StroopEffectGame() {
  const { identity } = useInternetIdentity();
  const { currentWord, displayColor, score, round, totalRounds, timeRemaining, isComplete, lastCorrect, handleAnswer, reset } = useStroopEffect(LEVEL);
  const { playSound } = useSoundEffects();
  const { mutate: completeLevel } = useCompleteLevel();
  const startTimeRef = React.useRef<bigint>(BigInt(0));

  useEffect(() => {
    startTimeRef.current = BigInt(Date.now()) * BigInt(1_000_000);
  }, []);

  useEffect(() => {
    if (isComplete && identity) {
      completeLevel({
        player: identity.getPrincipal().toString(),
        gameType: GameType.stroopEffect,
        level: BigInt(LEVEL),
        startTime: startTimeRef.current,
        correctAnswers: BigInt(score),
        totalQuestions: BigInt(totalRounds),
      });
    }
  }, [isComplete]);

  const handleAnswerClick = (color: string) => {
    playSound('click');
    handleAnswer(color);
    setTimeout(() => playSound(lastCorrect === null || lastCorrect ? 'success' : 'error'), 50);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Stroop Effect</h1>
          <p className="text-muted-foreground text-sm">Name the ink color, not the word!</p>
        </div>
        <GameControls onRestart={reset} />
      </div>

      <div className="flex items-center gap-6 mb-6 bg-surface rounded-xl p-4 border border-border">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock size={16} />
          <span className="font-mono font-bold text-foreground">{timeRemaining}s</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Target size={16} />
          <span className="font-bold text-foreground">{score} correct</span>
        </div>
        <div className="ml-auto text-sm text-muted-foreground">
          Round {round}/{totalRounds}
        </div>
      </div>

      {isComplete ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎯</div>
          <h2 className="text-2xl font-bold text-primary mb-2">Game Over!</h2>
          <p className="text-muted-foreground mb-2">You scored {score} out of {totalRounds}</p>
          <p className="text-lg font-bold text-foreground mb-6">
            Accuracy: {Math.round((score / totalRounds) * 100)}%
          </p>
          <button
            onClick={reset}
            className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors"
          >
            Play Again
          </button>
        </div>
      ) : (
        <div className="bg-surface rounded-2xl border border-border p-8">
          <StroopDisplay
            word={currentWord}
            displayColor={displayColor}
            onAnswer={handleAnswerClick}
          />
        </div>
      )}
    </div>
  );
}
