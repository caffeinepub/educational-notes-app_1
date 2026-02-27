import React, { useRef, useEffect } from 'react';
import useSoundEffects from '../hooks/useSoundEffects';
import useSpeedTyping from '../hooks/useSpeedTyping';
import GameControls from '../components/GameControls';
import { Clock, Zap, Target } from 'lucide-react';

export default function SpeedTypingGame() {
  const { targetText, typedText, charStatuses, isGameActive, isGameOver, timeRemaining, wpm, accuracy, handleInput, reset } = useSpeedTyping();
  const { playSound } = useSoundEffects();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isGameOver) {
      playSound(accuracy >= 80 ? 'success' : 'error');
    }
  }, [isGameOver]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Speed Typing</h1>
          <p className="text-muted-foreground text-sm">Type as fast and accurately as you can!</p>
        </div>
        <GameControls onRestart={reset} />
      </div>

      <div className="flex items-center gap-6 mb-6 bg-surface rounded-xl p-4 border border-border">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock size={16} />
          <span className={`font-mono font-bold ${timeRemaining <= 10 ? 'text-destructive' : 'text-foreground'}`}>
            {timeRemaining}s
          </span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Zap size={16} />
          <span className="font-bold text-foreground">{wpm} WPM</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Target size={16} />
          <span className="font-bold text-foreground">{accuracy}%</span>
        </div>
      </div>

      {isGameOver ? (
        <div className="text-center py-12 bg-surface rounded-2xl border border-border">
          <div className="text-6xl mb-4">{accuracy >= 80 ? '🏆' : '📝'}</div>
          <h2 className="text-2xl font-bold text-primary mb-4">Time's Up!</h2>
          <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto mb-6">
            <div className="bg-muted rounded-xl p-4">
              <p className="text-xs text-muted-foreground mb-1">WPM</p>
              <p className="text-2xl font-bold text-primary">{wpm}</p>
            </div>
            <div className="bg-muted rounded-xl p-4">
              <p className="text-xs text-muted-foreground mb-1">Accuracy</p>
              <p className="text-2xl font-bold text-primary">{accuracy}%</p>
            </div>
          </div>
          <button
            onClick={reset}
            className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Target text display */}
          <div className="bg-surface rounded-2xl border border-border p-6 font-mono text-lg leading-relaxed">
            {targetText.split('').map((char, i) => (
              <span
                key={i}
                className={
                  charStatuses[i] === 'correct' ? 'text-green-500' :
                  charStatuses[i] === 'incorrect' ? 'text-red-500 bg-red-500/20' :
                  i === typedText.length ? 'border-b-2 border-primary text-foreground' :
                  'text-muted-foreground'
                }
              >
                {char}
              </span>
            ))}
          </div>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={typedText}
            onChange={(e) => handleInput(e.target.value)}
            disabled={isGameOver}
            placeholder={isGameActive ? 'Keep typing...' : 'Start typing to begin!'}
            className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary"
          />

          {!isGameActive && (
            <p className="text-center text-muted-foreground text-sm">
              ⌨️ Start typing to begin the 60-second countdown!
            </p>
          )}
        </div>
      )}
    </div>
  );
}
