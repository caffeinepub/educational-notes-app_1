import { useState, useCallback } from 'react';
import { getRandomWord } from '../utils/wordDatabase';

function scramble(word: string): string {
  const arr = word.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  const result = arr.join('');
  return result === word ? scramble(word) : result;
}

export default function useWordScramble() {
  const [originalWord, setOriginalWord] = useState(() => getRandomWord('easy'));
  const [scrambledWord, setScrambledWord] = useState(() => {
    const w = getRandomWord('easy');
    return scramble(w);
  });
  const [inputValue, setInputValue] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [wrongAttempt, setWrongAttempt] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const nextWord = useCallback(() => {
    const word = getRandomWord('easy');
    setOriginalWord(word);
    setScrambledWord(scramble(word));
    setInputValue('');
    setWrongAttempt(false);
    setFeedback(null);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!inputValue.trim()) return;
    const correct = inputValue.trim().toLowerCase() === originalWord.toLowerCase();
    if (correct) {
      setScore((s) => s + 1);
      setStreak((s) => s + 1);
      setFeedback('correct');
      setWrongAttempt(false);
      setTimeout(nextWord, 800);
    } else {
      setStreak(0);
      setWrongAttempt(true);
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 800);
    }
    setInputValue('');
  }, [inputValue, originalWord, nextWord]);

  return {
    originalWord,
    scrambledWord,
    inputValue,
    setInputValue,
    score,
    streak,
    wrongAttempt,
    feedback,
    handleSubmit,
    nextWord,
  };
}
