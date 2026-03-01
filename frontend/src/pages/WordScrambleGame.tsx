import { useEffect, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import useWordScramble from '../hooks/useWordScramble';
import useSoundEffects from '../hooks/useSoundEffects';
import { useActor } from '../hooks/useActor';

export default function WordScrambleGame() {
  const navigate = useNavigate();
  const { actor } = useActor();
  const gamePlayRecorded = useRef(false);

  const {
    scrambledWord,
    originalWord,
    inputValue,
    setInputValue,
    score,
    streak,
    wrongAttempt,
    feedback,
    handleSubmit,
    nextWord,
  } = useWordScramble();
  const { playSound } = useSoundEffects();

  useEffect(() => {
    if (actor && !gamePlayRecorded.current) {
      actor.recordGamePlay('WordScramble').catch(() => {});
      gamePlayRecorded.current = true;
    }
  }, [actor]);

  const handleSubmitWithSound = () => {
    playSound('click');
    const wasCorrect = inputValue.trim().toLowerCase() === originalWord.toLowerCase();
    handleSubmit();
    setTimeout(() => playSound(wasCorrect ? 'success' : 'error'), 50);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">🔤 Word Scramble</h1>
          <div className="text-sm text-muted-foreground">
            Score: {score} | Streak: {streak}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-8 text-center mb-6">
          <p className="text-muted-foreground text-sm mb-2">Scrambled Word:</p>
          <p className="text-4xl font-bold tracking-widest text-primary">{scrambledWord.toUpperCase()}</p>
          {wrongAttempt && (
            <p className="text-destructive text-sm mt-2">❌ Galat! Dobara try karo.</p>
          )}
          {feedback === 'correct' && (
            <p className="text-green-500 text-sm mt-2">✅ Sahi! Answer: {originalWord}</p>
          )}
        </div>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmitWithSound()}
            placeholder="Sahi word type karo..."
            className="flex-1 border border-border rounded-lg px-3 py-2 bg-background text-foreground"
          />
          <button
            onClick={handleSubmitWithSound}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium"
          >
            Submit
          </button>
        </div>

        <div className="flex gap-4 mb-4 justify-center">
          <button
            onClick={() => { playSound('click'); nextWord(); }}
            className="text-sm text-muted-foreground underline"
          >
            Skip Word
          </button>
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => { playSound('click'); nextWord(); }}
            className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg font-medium"
          >
            🔄 Next
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
