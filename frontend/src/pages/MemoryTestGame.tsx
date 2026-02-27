import React, { useEffect, useRef } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import useMemoryTest from '../hooks/useMemoryTest';
import useSoundEffects from '../hooks/useSoundEffects';
import { useCompleteMemoryTest } from '../hooks/useQueries';
import GameControls from '../components/GameControls';
import { Brain, Clock } from 'lucide-react';

const LEVEL = 1;

export default function MemoryTestGame() {
  const { identity } = useInternetIdentity();
  const {
    objects, phase, countdown, guessed, inputValue, setInputValue,
    correctAnswers, isComplete, submitGuess, reset,
  } = useMemoryTest(LEVEL);
  const { playSound } = useSoundEffects();
  const { mutate: completeMemoryTest } = useCompleteMemoryTest();
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    startTimeRef.current = Date.now();
  }, []);

  useEffect(() => {
    if (isComplete && identity) {
      const timeTaken = BigInt(Date.now() - startTimeRef.current) * BigInt(1_000_000);
      const player = identity.getPrincipal().toString();
      const score = BigInt(correctAnswers * 100);
      completeMemoryTest({
        player,
        level: BigInt(LEVEL),
        correctAnswers: BigInt(correctAnswers),
        streak: BigInt(correctAnswers),
        hintsUsed: BigInt(0),
        timeTaken,
        score,
      });
    }
  }, [isComplete]);

  const handleSubmit = () => {
    playSound('click');
    submitGuess();
    if (phase === 'recall') {
      const correct = objects.includes(inputValue.trim()) && !guessed.includes(inputValue.trim());
      setTimeout(() => playSound(correct ? 'success' : 'error'), 100);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Memory Test</h1>
          <p className="text-muted-foreground text-sm">Memorize and recall the objects!</p>
        </div>
        <GameControls onRestart={reset} />
      </div>

      {/* Phase: Memorize */}
      {phase === 'memorize' && (
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4 text-primary">
            <Clock size={20} />
            <span className="text-xl font-bold">{countdown}s</span>
          </div>
          <p className="text-muted-foreground mb-6">Memorize these objects!</p>
          <div className="grid grid-cols-5 gap-4 max-w-md mx-auto">
            {objects.map((obj, i) => (
              <div key={i} className="text-4xl text-center p-2 bg-surface rounded-xl border border-border shadow">
                {obj}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Phase: Recall */}
      {phase === 'recall' && (
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4 text-accent">
            <Clock size={20} />
            <span className="text-xl font-bold">{countdown}s</span>
          </div>
          <p className="text-muted-foreground mb-4">Type the objects you remember!</p>
          <div className="flex gap-2 max-w-sm mx-auto mb-6">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Type an emoji or name..."
              className="flex-1 px-4 py-2 rounded-xl border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={handleSubmit}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors"
            >
              Submit
            </button>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {guessed.map((g, i) => (
              <span key={i} className="text-2xl bg-green-500/20 border border-green-500/40 rounded-lg px-3 py-1">
                {g}
              </span>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            {correctAnswers} / {objects.length} recalled
          </p>
        </div>
      )}

      {/* Phase: Won */}
      {phase === 'won' && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-primary mb-2">Excellent!</h2>
          <p className="text-muted-foreground mb-6">You recalled all {objects.length} objects!</p>
          <button
            onClick={reset}
            className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors"
          >
            Play Again
          </button>
        </div>
      )}

      {/* Phase: Lost */}
      {phase === 'lost' && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⏰</div>
          <h2 className="text-2xl font-bold text-destructive mb-2">Time's Up!</h2>
          <p className="text-muted-foreground mb-2">You recalled {correctAnswers} / {objects.length} objects.</p>
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {objects.map((obj, i) => (
              <span key={i} className={`text-2xl rounded-lg px-3 py-1 border ${guessed.includes(obj) ? 'bg-green-500/20 border-green-500/40' : 'bg-red-500/20 border-red-500/40'}`}>
                {obj}
              </span>
            ))}
          </div>
          <button
            onClick={reset}
            className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
