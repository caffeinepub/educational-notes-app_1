import React from 'react';
import useWordScramble from '../hooks/useWordScramble';
import useSoundEffects from '../hooks/useSoundEffects';
import GameControls from '../components/GameControls';
import { Shuffle, Star, Flame } from 'lucide-react';

export default function WordScrambleGame() {
  const { originalWord, scrambledWord, inputValue, setInputValue, score, streak, wrongAttempt, feedback, handleSubmit, nextWord } = useWordScramble();
  const { playSound } = useSoundEffects();

  const onSubmit = () => {
    playSound('click');
    handleSubmit();
    setTimeout(() => {
      if (inputValue.trim().toLowerCase() === originalWord.toLowerCase()) {
        playSound('success');
      } else {
        playSound('error');
      }
    }, 50);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Word Scramble</h1>
          <p className="text-muted-foreground text-sm">Unscramble the letters!</p>
        </div>
        <GameControls onRestart={nextWord} />
      </div>

      <div className="flex items-center gap-6 mb-6 bg-surface rounded-xl p-4 border border-border">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Star size={16} />
          <span className="font-bold text-foreground">{score} points</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Flame size={16} />
          <span className="font-bold text-foreground">{streak} streak</span>
        </div>
      </div>

      <div className="bg-surface rounded-2xl border border-border p-8 text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2 text-muted-foreground">
          <Shuffle size={16} />
          <span className="text-sm">Scrambled Word</span>
        </div>
        <div className="text-5xl font-extrabold tracking-widest text-primary mb-2">
          {scrambledWord.toUpperCase()}
        </div>
        {wrongAttempt && (
          <p className="text-destructive text-sm mt-2">Wrong! Try again.</p>
        )}
        {feedback === 'correct' && (
          <p className="text-green-500 text-sm mt-2">✅ Correct! Well done!</p>
        )}
      </div>

      <div className="flex gap-3">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
          placeholder="Type your answer..."
          className="flex-1 px-4 py-3 rounded-xl border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          onClick={onSubmit}
          className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors"
        >
          Check
        </button>
      </div>

      <button
        onClick={nextWord}
        className="mt-4 w-full py-2 rounded-xl border border-border text-muted-foreground hover:bg-muted transition-colors text-sm"
      >
        Skip Word
      </button>
    </div>
  );
}
