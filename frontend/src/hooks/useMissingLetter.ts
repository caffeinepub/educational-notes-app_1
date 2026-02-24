import { useState, useCallback } from 'react';
import { wordDatabase, Difficulty } from '../utils/wordDatabase';

function generateMissingLetterWord(word: string): { display: string; missingIndices: number[] } {
  const letters = word.split('');
  const totalLetters = letters.length;
  // Remove roughly half the letters, but keep at least 1 visible
  const numToRemove = Math.max(1, Math.floor(totalLetters * 0.5));
  const indices = Array.from({ length: totalLetters }, (_, i) => i);
  // Shuffle indices
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const missingIndices = indices.slice(0, numToRemove).sort((a, b) => a - b);
  const display = letters.map((l, i) => (missingIndices.includes(i) ? '_' : l)).join('');
  return { display, missingIndices };
}

function getRandomWord(difficulty: Difficulty): string {
  const db = wordDatabase[difficulty];
  const allWords = [...db.animals, ...db.fruits, ...db.dailyUse];
  return allWords[Math.floor(Math.random() * allWords.length)];
}

export function useMissingLetter() {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [currentWord, setCurrentWord] = useState<string>(() => getRandomWord('easy'));
  const [wordDisplay, setWordDisplay] = useState<string>(() => {
    const word = getRandomWord('easy');
    return generateMissingLetterWord(word).display;
  });
  const [userInput, setUserInput] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  const loadNewWord = useCallback((diff: Difficulty) => {
    const word = getRandomWord(diff);
    const { display } = generateMissingLetterWord(word);
    setCurrentWord(word);
    setWordDisplay(display);
    setUserInput('');
    setIsCorrect(null);
    setShowAnswer(false);
  }, []);

  const selectDifficulty = useCallback((diff: Difficulty) => {
    setDifficulty(diff);
    loadNewWord(diff);
    setScore(0);
    setStreak(0);
  }, [loadNewWord]);

  const handleSubmit = useCallback(() => {
    if (!userInput.trim()) return;
    const correct = userInput.trim().toLowerCase() === currentWord.toLowerCase();
    setIsCorrect(correct);
    if (correct) {
      setScore(s => s + 10);
      setStreak(s => s + 1);
      setTimeout(() => loadNewWord(difficulty), 800);
    } else {
      setStreak(0);
    }
  }, [userInput, currentWord, difficulty, loadNewWord]);

  const handleShowAnswer = useCallback(() => {
    setShowAnswer(true);
  }, []);

  const nextWord = useCallback(() => {
    loadNewWord(difficulty);
  }, [difficulty, loadNewWord]);

  return {
    difficulty,
    currentWord,
    wordDisplay,
    userInput,
    setUserInput,
    isCorrect,
    showAnswer,
    score,
    streak,
    handleSubmit,
    handleShowAnswer,
    nextWord,
    selectDifficulty,
  };
}
