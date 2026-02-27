import { useState, useCallback } from 'react';
import { getRandomSentence, type Sentence } from '../utils/sentenceDatabase';

export default function useFillInTheBlanks() {
  const [currentSentence, setCurrentSentence] = useState<Sentence>(getRandomSentence);
  const [inputValue, setInputValue] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [wrongAttemptCount, setWrongAttemptCount] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | 'revealed' | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const nextSentence = useCallback(() => {
    setCurrentSentence(getRandomSentence());
    setInputValue('');
    setWrongAttemptCount(0);
    setFeedback(null);
    setShowAnswer(false);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!inputValue.trim()) return;
    const correct = inputValue.trim().toLowerCase() === currentSentence.answer.toLowerCase();
    if (correct) {
      setScore((s) => s + 1);
      setStreak((s) => s + 1);
      setFeedback('correct');
      setTimeout(nextSentence, 1000);
    } else {
      setStreak(0);
      setWrongAttemptCount((c) => c + 1);
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 800);
    }
    setInputValue('');
  }, [inputValue, currentSentence, nextSentence]);

  const handleShowAnswer = useCallback(() => {
    setShowAnswer(true);
    setFeedback('revealed');
    setStreak(0);
    setTimeout(nextSentence, 2000);
  }, [nextSentence]);

  return {
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
  };
}
