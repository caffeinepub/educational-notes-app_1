import { useState, useCallback } from 'react';
import { getRandomWord } from '../utils/wordDatabase';

function maskWord(word: string): string {
  if (word.length <= 2) return word[0] + '_';
  const positions = new Set<number>();
  const maskCount = Math.max(1, Math.floor(word.length / 3));
  while (positions.size < maskCount) {
    positions.add(1 + Math.floor(Math.random() * (word.length - 1)));
  }
  return word.split('').map((ch, i) => positions.has(i) ? '_' : ch).join('');
}

export default function useMissingLetter() {
  const [difficulty, setDifficulty] = useState<'easy' | 'hard'>('easy');
  const [currentWord, setCurrentWord] = useState(() => getRandomWord('easy'));
  const [wordDisplay, setWordDisplay] = useState(() => maskWord(getRandomWord('easy')));
  const [inputValue, setInputValue] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | 'revealed' | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const selectDifficulty = useCallback((diff: 'easy' | 'hard') => {
    setDifficulty(diff);
    const word = getRandomWord(diff);
    setCurrentWord(word);
    setWordDisplay(maskWord(word));
    setInputValue('');
    setFeedback(null);
    setShowAnswer(false);
  }, []);

  const nextWord = useCallback(() => {
    const word = getRandomWord(difficulty);
    setCurrentWord(word);
    setWordDisplay(maskWord(word));
    setInputValue('');
    setFeedback(null);
    setShowAnswer(false);
  }, [difficulty]);

  const handleSubmit = useCallback(() => {
    if (!inputValue.trim()) return;
    const correct = inputValue.trim().toLowerCase() === currentWord.toLowerCase();
    if (correct) {
      setScore((s) => s + 1);
      setStreak((s) => s + 1);
      setFeedback('correct');
      setTimeout(nextWord, 1000);
    } else {
      setStreak(0);
      setFeedback('wrong');
    }
    setInputValue('');
  }, [inputValue, currentWord, nextWord]);

  const handleShowAnswer = useCallback(() => {
    setShowAnswer(true);
    setFeedback('revealed');
    setStreak(0);
    setTimeout(nextWord, 2000);
  }, [nextWord]);

  return {
    difficulty,
    currentWord,
    wordDisplay,
    inputValue,
    setInputValue,
    score,
    streak,
    feedback,
    showAnswer,
    selectDifficulty,
    handleSubmit,
    handleShowAnswer,
  };
}
