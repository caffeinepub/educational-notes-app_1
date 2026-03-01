import { useState, useCallback } from 'react';
import { getRandomWord } from '../utils/wordDatabase';

export interface MaskedChar {
  char: string;
  isMasked: boolean;
  userFilled: string | null; // letter filled by user, null if not yet filled
}

function buildMaskedChars(word: string): MaskedChar[] {
  if (word.length <= 2) {
    return word.split('').map((char, i) => ({
      char,
      isMasked: i === 1,
      userFilled: null,
    }));
  }
  const positions = new Set<number>();
  const maskCount = Math.max(1, Math.floor(word.length / 3));
  while (positions.size < maskCount) {
    positions.add(1 + Math.floor(Math.random() * (word.length - 1)));
  }
  return word.split('').map((char, i) => ({
    char,
    isMasked: positions.has(i),
    userFilled: null,
  }));
}

function initState(difficulty: 'easy' | 'hard') {
  const word = getRandomWord(difficulty);
  return { word, maskedChars: buildMaskedChars(word) };
}

export default function useMissingLetter() {
  const [difficulty, setDifficulty] = useState<'easy' | 'hard'>('easy');
  const [currentWord, setCurrentWord] = useState<string>(() => initState('easy').word);
  const [maskedChars, setMaskedChars] = useState<MaskedChar[]>(() => initState('easy').maskedChars);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | 'revealed' | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState<string>('');

  const loadNewWord = useCallback((diff: 'easy' | 'hard') => {
    const word = getRandomWord(diff);
    setCurrentWord(word);
    setMaskedChars(buildMaskedChars(word));
    setFeedback(null);
    setCorrectAnswer('');
  }, []);

  const selectDifficulty = useCallback((diff: 'easy' | 'hard') => {
    setDifficulty(diff);
    loadNewWord(diff);
  }, [loadNewWord]);

  const nextWord = useCallback(() => {
    loadNewWord(difficulty);
  }, [difficulty, loadNewWord]);

  // Returns index of the next unfilled blank, or -1 if all filled
  const nextBlankIndex = useCallback((chars: MaskedChar[]): number => {
    return chars.findIndex((c) => c.isMasked && c.userFilled === null);
  }, []);

  const allBlanksFilled = useCallback((chars: MaskedChar[]): boolean => {
    return chars.every((c) => !c.isMasked || c.userFilled !== null);
  }, []);

  const handleLetterClick = useCallback((letter: string) => {
    if (feedback !== null) return;

    setMaskedChars((prev) => {
      const idx = prev.findIndex((c) => c.isMasked && c.userFilled === null);
      if (idx === -1) return prev;

      const updated = prev.map((c, i) =>
        i === idx ? { ...c, userFilled: letter.toLowerCase() } : c
      );

      // Check if all blanks are now filled → auto-submit
      const allFilled = updated.every((c) => !c.isMasked || c.userFilled !== null);
      if (allFilled) {
        const userAnswer = updated.map((c) => (c.isMasked ? c.userFilled! : c.char)).join('');
        const word = currentWord;
        setTimeout(() => {
          if (userAnswer.toLowerCase() === word.toLowerCase()) {
            setScore((s) => s + 1);
            setStreak((s) => s + 1);
            setFeedback('correct');
            setCorrectAnswer(word);
            setTimeout(() => loadNewWord(difficulty), 1500);
          } else {
            setStreak(0);
            setFeedback('wrong');
            setCorrectAnswer(word);
          }
        }, 0);
      }

      return updated;
    });
  }, [feedback, currentWord, difficulty, loadNewWord]);

  const handleClear = useCallback(() => {
    if (feedback === 'correct' || feedback === 'revealed') return;
    setMaskedChars((prev) =>
      prev.map((c) => (c.isMasked ? { ...c, userFilled: null } : c))
    );
    setFeedback(null);
    setCorrectAnswer('');
  }, [feedback]);

  const handleShowAnswer = useCallback(() => {
    setCorrectAnswer(currentWord);
    setFeedback('revealed');
    setStreak(0);
    // Reveal all blanks with correct letters
    setMaskedChars((prev) =>
      prev.map((c) => (c.isMasked ? { ...c, userFilled: c.char } : c))
    );
    setTimeout(() => loadNewWord(difficulty), 2000);
  }, [currentWord, difficulty, loadNewWord]);

  const handleTryAgain = useCallback(() => {
    // Clear user-filled letters and reset feedback to let user try again
    setMaskedChars((prev) =>
      prev.map((c) => (c.isMasked ? { ...c, userFilled: null } : c))
    );
    setFeedback(null);
    setCorrectAnswer('');
  }, []);

  const filledCount = maskedChars.filter((c) => c.isMasked && c.userFilled !== null).length;
  const totalBlanks = maskedChars.filter((c) => c.isMasked).length;
  const isAllFilled = filledCount === totalBlanks;
  const hasAnyFilled = filledCount > 0;

  return {
    difficulty,
    currentWord,
    maskedChars,
    score,
    streak,
    feedback,
    correctAnswer,
    isAllFilled,
    hasAnyFilled,
    filledCount,
    totalBlanks,
    selectDifficulty,
    nextWord,
    handleLetterClick,
    handleClear,
    handleShowAnswer,
    handleTryAgain,
  };
}
