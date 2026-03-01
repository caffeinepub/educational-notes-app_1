import { useEffect, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import useMemoryTest from '../hooks/useMemoryTest';
import useSoundEffects from '../hooks/useSoundEffects';
import { useActor } from '../hooks/useActor';

export default function MemoryTestGame() {
  const navigate = useNavigate();
  const { actor } = useActor();
  const gamePlayRecorded = useRef(false);

  const level = 1;
  const {
    objects,
    phase,
    countdown,
    guessed,
    inputValue,
    setInputValue,
    correctAnswers,
    isComplete,
    submitGuess,
    reset,
  } = useMemoryTest(level);
  const { playSound } = useSoundEffects();

  useEffect(() => {
    if (actor && !gamePlayRecorded.current) {
      actor.recordGamePlay('MemoryTest').catch(() => {});
      gamePlayRecorded.current = true;
    }
  }, [actor]);

  const handleSubmit = () => {
    playSound('click');
    const prevCorrect = correctAnswers;
    submitGuess();
    // Sound feedback based on whether the guess was correct
    setTimeout(() => {
      if (correctAnswers > prevCorrect) playSound('success');
    }, 50);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">🧠 Memory Test</h1>
          <div className="flex gap-2">
            <button
              onClick={reset}
              className="bg-secondary text-secondary-foreground px-3 py-1.5 rounded-lg text-sm font-medium"
            >
              🔄 Reset
            </button>
            <button
              onClick={() => navigate({ to: '/' })}
              className="bg-muted text-muted-foreground px-3 py-1.5 rounded-lg text-sm font-medium"
            >
              🏠 Home
            </button>
          </div>
        </div>

        {phase === 'memorize' && (
          <div className="text-center">
            <p className="text-lg text-muted-foreground mb-2">Yaad karo! ({countdown}s)</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
              {objects.map((obj, i) => (
                <div key={i} className="bg-card border border-border rounded-lg p-3 text-center font-medium text-2xl">
                  {obj}
                </div>
              ))}
            </div>
          </div>
        )}

        {phase === 'recall' && (
          <div className="text-center">
            <p className="text-lg text-muted-foreground mb-4">Kya yaad hai? ({countdown}s)</p>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder="Object ka naam likho..."
                className="flex-1 border border-border rounded-lg px-3 py-2 bg-background text-foreground"
              />
              <button
                onClick={handleSubmit}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium"
              >
                Submit
              </button>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {guessed.map((obj, i) => (
                <span key={i} className="bg-green-500/20 text-green-700 dark:text-green-300 px-2 py-1 rounded text-sm">
                  ✓ {obj}
                </span>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              {correctAnswers} / {objects.length} recalled
            </p>
          </div>
        )}

        {phase === 'won' && (
          <div className="text-center py-8">
            <p className="text-4xl mb-4">🎉</p>
            <p className="text-xl font-bold text-foreground">Shabash! Sab yaad tha!</p>
            <button onClick={reset} className="mt-4 bg-primary text-primary-foreground px-6 py-2 rounded-lg">
              Dobara Khelo
            </button>
          </div>
        )}

        {phase === 'lost' && (
          <div className="text-center py-8">
            <p className="text-4xl mb-4">😔</p>
            <p className="text-xl font-bold text-foreground">Time khatam!</p>
            <p className="text-muted-foreground mb-4">{correctAnswers} / {objects.length} yaad the</p>
            <button onClick={reset} className="mt-4 bg-primary text-primary-foreground px-6 py-2 rounded-lg">
              Dobara Khelo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
