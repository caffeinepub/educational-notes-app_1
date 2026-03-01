import { useEffect, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import useStroopEffect from '../hooks/useStroopEffect';
import useSoundEffects from '../hooks/useSoundEffects';
import { useActor } from '../hooks/useActor';
import GameScore from '../components/GameScore';

export default function StroopEffectGame() {
  const navigate = useNavigate();
  const { actor } = useActor();
  const gamePlayRecorded = useRef(false);

  const level = 1;
  const {
    currentWord,
    displayColor,
    score,
    round,
    totalRounds,
    timeRemaining,
    isComplete,
    handleAnswer,
    reset,
  } = useStroopEffect(level);
  const { playSound } = useSoundEffects();
  const prevScoreRef = useRef(score);

  useEffect(() => {
    if (actor && !gamePlayRecorded.current) {
      actor.recordGamePlay('StroopEffect').catch(() => {});
      gamePlayRecorded.current = true;
    }
  }, [actor]);

  useEffect(() => {
    if (isComplete) playSound('success');
  }, [isComplete]);

  useEffect(() => {
    if (score > prevScoreRef.current) {
      playSound('success');
    } else if (score < prevScoreRef.current) {
      playSound('error');
    }
    prevScoreRef.current = score;
  }, [score]);

  const handleAnswerWithSound = (color: string) => {
    playSound('click');
    handleAnswer(color);
  };

  const COLOR_STYLES: Record<string, string> = {
    Red: 'bg-red-500 hover:bg-red-600 text-white',
    Blue: 'bg-blue-500 hover:bg-blue-600 text-white',
    Green: 'bg-green-500 hover:bg-green-600 text-white',
    Yellow: 'bg-yellow-400 hover:bg-yellow-500 text-black',
  };

  const TEXT_COLORS: Record<string, string> = {
    Red: '#ef4444',
    Blue: '#3b82f6',
    Green: '#22c55e',
    Yellow: '#eab308',
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-foreground">🎨 Stroop Effect</h1>
          <div className="text-sm text-muted-foreground">
            Round: {round}/{totalRounds} | Score: {score} | Time: {timeRemaining}s
          </div>
        </div>

        {!isComplete && (
          <div className="text-center">
            <div className="bg-card border border-border rounded-xl p-12 mb-8">
              <p
                className="text-6xl font-bold"
                style={{ color: TEXT_COLORS[displayColor] || '#ffffff' }}
              >
                {currentWord}
              </p>
              <p className="text-muted-foreground text-sm mt-4">Ink ka rang chunein (word ka nahi)</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {['Red', 'Blue', 'Green', 'Yellow'].map((color) => (
                <button
                  key={color}
                  onClick={() => handleAnswerWithSound(color)}
                  className={`py-4 rounded-xl font-bold text-lg transition-transform active:scale-95 ${COLOR_STYLES[color]}`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        {isComplete && (
          <div className="text-center py-8">
            <p className="text-4xl mb-4">🎯</p>
            <p className="text-xl font-bold text-foreground mb-2">Game Over!</p>
            <p className="text-muted-foreground mb-2">Score: {score} / {totalRounds}</p>
            <p className="text-lg font-bold text-primary mb-6">
              Accuracy: {Math.round((score / totalRounds) * 100)}%
            </p>
          </div>
        )}

        <div className="flex gap-3 mt-6 justify-center">
          <button
            onClick={reset}
            className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg font-medium"
          >
            🔄 Reset
          </button>
          <button
            onClick={() => navigate({ to: '/' })}
            className="bg-muted text-muted-foreground px-4 py-2 rounded-lg font-medium"
          >
            🏠 Home
          </button>
        </div>

        {isComplete && (
          <GameScore
            score={score}
            elapsedTime={0}
            moves={totalRounds}
            onPlayAgain={reset}
            onMenu={() => navigate({ to: '/' })}
          />
        )}
      </div>
    </div>
  );
}
