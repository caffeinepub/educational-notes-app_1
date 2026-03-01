import { useEffect, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import useSpeedTyping, { CharStatus } from '../hooks/useSpeedTyping';
import useSoundEffects from '../hooks/useSoundEffects';
import { useActor } from '../hooks/useActor';

export default function SpeedTypingGame() {
  const navigate = useNavigate();
  const { actor } = useActor();
  const gamePlayRecorded = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    targetText,
    typedText,
    charStatuses,
    isGameActive,
    isGameOver,
    timeRemaining,
    wpm,
    accuracy,
    handleInput,
    reset,
  } = useSpeedTyping();
  const { playSound } = useSoundEffects();

  useEffect(() => {
    if (actor && !gamePlayRecorded.current) {
      actor.recordGamePlay('SpeedTyping').catch(() => {});
      gamePlayRecorded.current = true;
    }
  }, [actor]);

  useEffect(() => {
    if (isGameOver) {
      playSound(accuracy >= 80 ? 'success' : 'error');
    }
  }, [isGameOver]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-foreground">⌨️ Speed Typing</h1>
          <div className="text-sm text-muted-foreground">
            {isGameActive ? `Time: ${timeRemaining}s` : isGameOver ? 'Game Over!' : 'Ready?'}
          </div>
        </div>

        {isGameOver ? (
          <div className="bg-card border border-border rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">{accuracy >= 80 ? '🏆' : '📝'}</div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Time's Up!</h2>
            <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto mb-6">
              <div className="bg-background rounded-xl p-4">
                <p className="text-xs text-muted-foreground mb-1">WPM</p>
                <p className="text-2xl font-bold text-primary">{wpm}</p>
              </div>
              <div className="bg-background rounded-xl p-4">
                <p className="text-xs text-muted-foreground mb-1">Accuracy</p>
                <p className="text-2xl font-bold text-primary">{accuracy}%</p>
              </div>
            </div>
            <button
              onClick={reset}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Target text display */}
            <div className="bg-card border border-border rounded-2xl p-6 font-mono text-lg leading-relaxed">
              {targetText.split('').map((char, i) => {
                const status: CharStatus = charStatuses[i] ?? 'pending';
                return (
                  <span
                    key={i}
                    className={
                      status === 'correct'
                        ? 'text-green-500'
                        : status === 'incorrect'
                        ? 'text-red-500 bg-red-500/20'
                        : i === typedText.length
                        ? 'border-b-2 border-primary text-foreground'
                        : 'text-muted-foreground'
                    }
                  >
                    {char}
                  </span>
                );
              })}
            </div>

            {/* Stats bar */}
            {isGameActive && (
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span>⏱ {timeRemaining}s</span>
                <span>⚡ {wpm} WPM</span>
                <span>🎯 {accuracy}%</span>
              </div>
            )}

            {/* Input */}
            <input
              ref={inputRef}
              type="text"
              value={typedText}
              onChange={(e) => handleInput(e.target.value)}
              disabled={isGameOver}
              placeholder={isGameActive ? 'Keep typing...' : 'Start typing to begin!'}
              className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary"
            />

            {!isGameActive && (
              <p className="text-center text-muted-foreground text-sm">
                ⌨️ Start typing to begin the 60-second countdown!
              </p>
            )}
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
      </div>
    </div>
  );
}
