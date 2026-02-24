import { useState, useCallback } from 'react';
import { sentenceDatabase, SentenceEntry } from '../utils/sentenceDatabase';

function getRandomSentence(exclude?: SentenceEntry): SentenceEntry {
  const pool = exclude
    ? sentenceDatabase.filter(s => s.text !== exclude.text)
    : sentenceDatabase;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function useFillInTheBlanks() {
  const [currentSentence, setCurrentSentence] = useState<SentenceEntry>(() => getRandomSentence());
  const [userInput, setUserInput] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [wrongAttemptCount, setWrongAttemptCount] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  const loadNextSentence = useCallback(() => {
    setCurrentSentence(prev => getRandomSentence(prev));
    setUserInput('');
    setIsCorrect(null);
    setWrongAttemptCount(0);
    setShowAnswer(false);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!userInput.trim()) return;
    const correct = userInput.trim().toLowerCase() === currentSentence.answer.toLowerCase();
    setIsCorrect(correct);
    if (correct) {
      setScore(s => s + 10);
      setStreak(s => s + 1);
      setTimeout(() => loadNextSentence(), 800);
    } else {
      setWrongAttemptCount(c => c + 1);
      setStreak(0);
    }
  }, [userInput, currentSentence, loadNextSentence]);

  const handleShowAnswer = useCallback(() => {
    setShowAnswer(true);
  }, []);

  const nextSentence = useCallback(() => {
    loadNextSentence();
  }, [loadNextSentence]);

  return {
    currentSentence,
    userInput,
    setUserInput,
    isCorrect,
    wrongAttemptCount,
    showAnswer,
    score,
    streak,
    handleSubmit,
    handleShowAnswer,
    nextSentence,
  };
}
