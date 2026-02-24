import { useState, useCallback } from 'react';
import { getAllWords } from '../utils/wordDatabase';

function shuffleWord(word: string): string {
  const letters = word.split('');
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }
  const scrambled = letters.join('');
  // Ensure scrambled is different from original (for short words, retry)
  if (scrambled === word && word.length > 1) return shuffleWord(word);
  return scrambled;
}

function getRandomWord(): string {
  const allWords = [...getAllWords('easy'), ...getAllWords('hard')];
  return allWords[Math.floor(Math.random() * allWords.length)];
}

export function useWordScramble() {
  const [originalWord, setOriginalWord] = useState<string>(() => getRandomWord());
  const [scrambledWord, setScrambledWord] = useState<string>(() => {
    const w = getRandomWord();
    return shuffleWord(w);
  });
  const [userInput, setUserInput] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [wrongAttempt, setWrongAttempt] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  const loadNewWord = useCallback(() => {
    const word = getRandomWord();
    setOriginalWord(word);
    setScrambledWord(shuffleWord(word));
    setUserInput('');
    setIsCorrect(null);
    setWrongAttempt(false);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!userInput.trim()) return;
    const correct = userInput.trim().toLowerCase() === originalWord.toLowerCase();
    setIsCorrect(correct);
    if (correct) {
      setScore(s => s + 10);
      setStreak(s => s + 1);
      setWrongAttempt(false);
      setTimeout(() => loadNewWord(), 800);
    } else {
      setWrongAttempt(true);
      setStreak(0);
    }
  }, [userInput, originalWord, loadNewWord]);

  const nextWord = useCallback(() => {
    loadNewWord();
  }, [loadNewWord]);

  return {
    originalWord,
    scrambledWord,
    userInput,
    setUserInput,
    isCorrect,
    wrongAttempt,
    score,
    streak,
    handleSubmit,
    nextWord,
  };
}
