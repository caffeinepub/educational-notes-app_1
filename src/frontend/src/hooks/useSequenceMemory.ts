import { useState, useEffect, useCallback } from 'react';
import { getDifficultyConfig } from '../utils/difficultyConfig';

type Phase = 'display' | 'input' | 'complete';

export function useSequenceMemory(level: number) {
  const config = getDifficultyConfig('sequenceMemory', level);
  const sequenceLength = config.sequenceLength || 4;

  const [sequence, setSequence] = useState<string[]>([]);
  const [userSequence, setUserSequence] = useState<string[]>([]);
  const [phase, setPhase] = useState<Phase>('display');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const generateSequence = useCallback(() => {
    const items = ['🔴', '🟢', '🔵', '🟡', '🟣', '🟠', '⚫', '⚪'];
    const newSequence: string[] = [];
    for (let i = 0; i < sequenceLength; i++) {
      newSequence.push(items[Math.floor(Math.random() * items.length)]);
    }
    return newSequence;
  }, [sequenceLength]);

  useEffect(() => {
    const newSequence = generateSequence();
    setSequence(newSequence);
    setUserSequence([]);
    setPhase('display');
    setCurrentIndex(0);
    setAttempts(0);
    setIsComplete(false);

    let index = 0;
    const interval = setInterval(() => {
      index++;
      if (index < newSequence.length) {
        setCurrentIndex(index);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setPhase('input');
          setCurrentIndex(-1);
        }, 500);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [generateSequence]);

  const handleItemClick = useCallback((item: string) => {
    const newUserSequence = [...userSequence, item];
    setUserSequence(newUserSequence);

    if (newUserSequence.length === sequence.length) {
      setAttempts((prev) => prev + 1);
      
      const isCorrect = newUserSequence.every((val, idx) => val === sequence[idx]);
      
      if (isCorrect) {
        setPhase('complete');
        setIsComplete(true);
      } else {
        setTimeout(() => {
          setUserSequence([]);
        }, 1000);
      }
    }
  }, [userSequence, sequence]);

  const resetGame = useCallback(() => {
    const newSequence = generateSequence();
    setSequence(newSequence);
    setUserSequence([]);
    setPhase('display');
    setCurrentIndex(0);
    setAttempts(0);
    setIsComplete(false);

    let index = 0;
    const interval = setInterval(() => {
      index++;
      if (index < newSequence.length) {
        setCurrentIndex(index);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setPhase('input');
          setCurrentIndex(-1);
        }, 500);
      }
    }, 800);
  }, [generateSequence]);

  return {
    sequence,
    userSequence,
    phase,
    currentIndex,
    attempts,
    isComplete,
    handleItemClick,
    resetGame,
  };
}
