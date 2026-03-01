import { useEffect, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import useMissingLetter, { MaskedChar } from '../hooks/useMissingLetter';
import useSoundEffects from '../hooks/useSoundEffects';
import { useActor } from '../hooks/useActor';
import LetterButtons from '../components/LetterButtons';

export default function MissingLetterGame() {
  const navigate = useNavigate();
  const { actor } = useActor();
  const gamePlayRecorded = useRef(false);

  const {
    maskedChars,
    score,
    streak,
    feedback,
    correctAnswer,
    handleLetterClick,
    handleClear,
    handleShowAnswer,
    handleTryAgain,
    nextWord,
  } = useMissingLetter();
  const { playSound } = useSoundEffects();

  useEffect(() => {
    if (actor && !gamePlayRecorded.current) {
      actor.recordGamePlay('MissingLetter').catch(() => {});
      gamePlayRecorded.current = true;
    }
  }, [actor]);

  const handleLetterClickWithSound = (letter: string) => {
    if (feedback !== null) return;
    playSound('click');
    handleLetterClick(letter);
  };

  useEffect(() => {
    if (feedback === 'correct') playSound('success');
    else if (feedback === 'wrong') playSound('error');
  }, [feedback]);

  const isInputDisabled = feedback === 'correct' || feedback === 'revealed';

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">🔡 Missing Letter</h1>
          <div className="text-sm text-muted-foreground">
            Score: {score} | Streak: {streak}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-8 text-center mb-6">
          {/* Word display */}
          <div className="flex justify-center flex-wrap gap-1 mb-4">
            {maskedChars.map((mc: MaskedChar, i: number) => {
              const displayChar = mc.isMasked
                ? (mc.userFilled ? mc.userFilled.toUpperCase() : '_')
                : mc.char.toUpperCase();
              const cellClass = mc.isMasked
                ? mc.userFilled
                  ? feedback === 'correct'
                    ? 'border-green-500 text-green-600 dark:text-green-400 bg-green-500/10'
                    : feedback === 'wrong'
                    ? 'border-red-500 text-red-600 dark:text-red-400 bg-red-500/10'
                    : 'border-primary text-primary'
                  : 'border-muted-foreground text-muted-foreground'
                : 'border-transparent text-foreground';

              return (
                <span
                  key={i}
                  className={`inline-block w-8 text-center text-2xl font-bold border-b-2 mx-0.5 ${cellClass}`}
                >
                  {displayChar}
                </span>
              );
            })}
          </div>

          {feedback === 'correct' && <p className="text-green-500 font-medium">✅ Sahi jawab!</p>}
          {feedback === 'wrong' && <p className="text-destructive font-medium">❌ Galat! Dobara try karo.</p>}
          {feedback === 'revealed' && correctAnswer && (
            <p className="text-blue-500 text-sm mt-1">Answer: {correctAnswer}</p>
          )}
        </div>

        <LetterButtons
          onLetterClick={handleLetterClickWithSound}
          disabled={isInputDisabled}
        />

        <div className="flex gap-3 mt-4 flex-wrap justify-center">
          <button
            onClick={() => { playSound('click'); handleClear(); }}
            className="text-sm bg-muted text-muted-foreground px-3 py-1.5 rounded-lg"
          >
            Clear
          </button>
          <button
            onClick={() => { playSound('click'); handleTryAgain(); }}
            className="text-sm bg-muted text-muted-foreground px-3 py-1.5 rounded-lg"
          >
            Try Again
          </button>
          <button
            onClick={() => { playSound('click'); handleShowAnswer(); }}
            className="text-sm bg-muted text-muted-foreground px-3 py-1.5 rounded-lg"
          >
            Answer Dikhao
          </button>
          <button
            onClick={() => { playSound('click'); nextWord(); }}
            className="text-sm bg-primary text-primary-foreground px-3 py-1.5 rounded-lg"
          >
            Next Word
          </button>
        </div>

        <div className="flex gap-3 mt-4 justify-center">
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
