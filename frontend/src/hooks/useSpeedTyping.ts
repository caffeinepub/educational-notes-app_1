import { useState, useCallback, useEffect, useRef } from 'react';
import { getAllWords } from '../utils/wordDatabase';

const GAME_DURATION = 60; // seconds

function generateTargetText(): string {
  const words = getAllWords('easy');
  const selected: string[] = [];
  for (let i = 0; i < 30; i++) {
    selected.push(words[Math.floor(Math.random() * words.length)]);
  }
  return selected.join(' ');
}

export type CharStatus = 'correct' | 'incorrect' | 'pending';

export function useSpeedTyping() {
  const [targetText, setTargetText] = useState<string>(() => generateTargetText());
  const [userInput, setUserInput] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(GAME_DURATION);
  const [isGameActive, setIsGameActive] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const charStatuses: CharStatus[] = targetText.split('').map((char, i) => {
    if (i >= userInput.length) return 'pending';
    return userInput[i] === char ? 'correct' : 'incorrect';
  });

  const correctChars = charStatuses.filter(s => s === 'correct').length;
  const incorrectChars = charStatuses.filter(s => s === 'incorrect').length;
  const totalTyped = userInput.length;

  // WPM: (correct chars / 5) / minutes elapsed
  const minutesElapsed = (GAME_DURATION - timeRemaining) / 60;
  const wpm = minutesElapsed > 0 ? Math.round((correctChars / 5) / minutesElapsed) : 0;
  const accuracy = totalTyped > 0 ? Math.round((correctChars / totalTyped) * 100) : 100;

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startGame = useCallback(() => {
    setTargetText(generateTargetText());
    setUserInput('');
    setTimeRemaining(GAME_DURATION);
    setIsGameActive(true);
    setIsGameOver(false);
  }, []);

  const handleInput = useCallback((value: string) => {
    if (!isGameActive || isGameOver) return;
    // Don't allow typing beyond target text length
    if (value.length <= targetText.length) {
      setUserInput(value);
    }
  }, [isGameActive, isGameOver, targetText.length]);

  const resetGame = useCallback(() => {
    stopTimer();
    setTargetText(generateTargetText());
    setUserInput('');
    setTimeRemaining(GAME_DURATION);
    setIsGameActive(false);
    setIsGameOver(false);
  }, [stopTimer]);

  useEffect(() => {
    if (isGameActive && !isGameOver) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            timerRef.current = null;
            setIsGameActive(false);
            setIsGameOver(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isGameActive, isGameOver]);

  return {
    targetText,
    userInput,
    timeRemaining,
    isGameActive,
    isGameOver,
    wpm,
    accuracy,
    correctChars,
    incorrectChars,
    charStatuses,
    startGame,
    handleInput,
    resetGame,
  };
}
