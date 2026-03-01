import { useEffect, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import useFillInTheBlanks from '../hooks/useFillInTheBlanks';
import useSoundEffects from '../hooks/useSoundEffects';
import { useActor } from '../hooks/useActor';

export default function FillInTheBlanksGame() {
  const navigate = useNavigate();
  const { actor } = useActor();
  const gamePlayRecorded = useRef(false);

  const {
    currentSentence,
    inputValue,
    setInputValue,
    score,
    streak,
    wrongAttemptCount,
    feedback,
    showAnswer,
    handleSubmit,
    handleShowAnswer,
  } = useFillInTheBlanks();
  const { playSound } = useSoundEffects();

  useEffect(() => {
    if (actor && !gamePlayRecorded.current) {
      actor.recordGamePlay('FillInTheBlanks').catch(() => {});
      gamePlayRecorded.current = true;
    }
  }, [actor]);

  useEffect(() => {
    if (feedback === 'correct') playSound('success');
    else if (feedback === 'wrong') playSound('error');
  }, [feedback]);

  const handleSubmitWithSound = () => {
    playSound('click');
    handleSubmit();
  };

  const handleShowAnswerWithSound = () => {
    playSound('click');
    handleShowAnswer();
  };

  const parts = currentSentence.text.split('___');

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">📝 Fill in the Blanks</h1>
          <div className="text-sm text-muted-foreground">
            Score: {score} | Streak: {streak}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-8 text-center mb-6">
          <div className="text-xl font-medium text-foreground mb-4">
            <span>{parts[0]}</span>
            <span className="inline-block mx-1 px-3 py-1 rounded-md bg-primary/10 border-b-2 border-primary text-primary font-bold min-w-[80px]">
              {showAnswer ? currentSentence.answer : feedback === 'correct' ? inputValue : '___'}
            </span>
            <span>{parts[1] ?? ''}</span>
          </div>

          {feedback === 'correct' && (
            <p className="text-green-500 text-sm">✅ Sahi jawab!</p>
          )}
          {feedback === 'wrong' && !showAnswer && (
            <p className="text-destructive text-sm">
              ❌ Galat! {wrongAttemptCount >= 2 ? 'Answer reveal kar sakte ho.' : 'Dobara try karo!'}
            </p>
          )}
          {showAnswer && (
            <p className="text-blue-500 text-sm mt-1">Answer: {currentSentence.answer}</p>
          )}
        </div>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmitWithSound()}
            placeholder="Blank fill karo..."
            disabled={feedback === 'correct' || showAnswer}
            className="flex-1 border border-border rounded-lg px-3 py-2 bg-background text-foreground disabled:opacity-50"
          />
          <button
            onClick={handleSubmitWithSound}
            disabled={feedback === 'correct' || showAnswer || !inputValue.trim()}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium disabled:opacity-50"
          >
            Submit
          </button>
        </div>

        {wrongAttemptCount >= 2 && !showAnswer && feedback !== 'correct' && (
          <div className="text-center mb-4">
            <button
              onClick={handleShowAnswerWithSound}
              className="text-sm text-muted-foreground underline"
            >
              Answer Dikhao
            </button>
          </div>
        )}

        <div className="flex gap-3 justify-center mt-4">
          <button
            onClick={() => { playSound('click'); handleShowAnswer(); }}
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
