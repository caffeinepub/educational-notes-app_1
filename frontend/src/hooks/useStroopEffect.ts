import { useState, useEffect, useCallback, useRef } from 'react';
import { getDifficultyConfig } from '../utils/difficultyConfig';

interface StroopEffectState {
  currentWord: string;
  currentColor: string;
  displayColor: string;
  round: number;
  score: number;
  correctAnswers: number;
  timeRemaining: number;
  isComplete: boolean;
  gameOver: boolean;
}

const colors = ['Red', 'Blue', 'Green', 'Yellow'];

function generateColorPair(): { word: string; displayColor: string } {
  const word = colors[Math.floor(Math.random() * colors.length)];
  let displayColor = colors[Math.floor(Math.random() * colors.length)];
  
  // Ensure word and display color are different
  while (displayColor === word) {
    displayColor = colors[Math.floor(Math.random() * colors.length)];
  }
  
  return { word, displayColor };
}

export function useStroopEffect(level: number) {
  const config = getDifficultyConfig('stroopEffect', level);
  const timerDuration = config.timerDuration || 30000; // Default 30 seconds
  
  const [state, setState] = useState<StroopEffectState>(() => {
    const { word, displayColor } = generateColorPair();
    return {
      currentWord: word,
      currentColor: word,
      displayColor,
      round: 1,
      score: 0,
      correctAnswers: 0,
      timeRemaining: timerDuration,
      isComplete: false,
      gameOver: false,
    };
  });

  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    if (state.isComplete || state.gameOver) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    startTimeRef.current = Date.now();
    
    timerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = Math.max(0, timerDuration - elapsed);
      
      setState((prev) => {
        if (remaining <= 0) {
          return { ...prev, timeRemaining: 0, gameOver: true };
        }
        return { ...prev, timeRemaining: remaining };
      });
    }, 100);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [state.isComplete, state.gameOver, timerDuration]);

  const handleColorSelect = useCallback((selectedColor: string) => {
    setState((prev) => {
      if (prev.isComplete || prev.gameOver) return prev;

      const isCorrect = selectedColor === prev.displayColor;
      const newScore = isCorrect ? prev.score + 10 : prev.score;
      const newCorrectAnswers = isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers;
      const newRound = prev.round + 1;

      // Check if game is complete (30 rounds)
      if (newRound > 30) {
        return {
          ...prev,
          score: newScore,
          correctAnswers: newCorrectAnswers,
          isComplete: true,
        };
      }

      // Generate new color pair
      const { word, displayColor } = generateColorPair();

      return {
        ...prev,
        currentWord: word,
        currentColor: word,
        displayColor,
        round: newRound,
        score: newScore,
        correctAnswers: newCorrectAnswers,
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    const { word, displayColor } = generateColorPair();
    setState({
      currentWord: word,
      currentColor: word,
      displayColor,
      round: 1,
      score: 0,
      correctAnswers: 0,
      timeRemaining: timerDuration,
      isComplete: false,
      gameOver: false,
    });
    startTimeRef.current = Date.now();
  }, [timerDuration]);

  return {
    currentWord: state.currentWord,
    currentColor: state.currentColor,
    displayColor: state.displayColor,
    round: state.round,
    score: state.score,
    correctAnswers: state.correctAnswers,
    timeRemaining: state.timeRemaining,
    isComplete: state.isComplete,
    gameOver: state.gameOver,
    handleColorSelect,
    resetGame,
  };
}
