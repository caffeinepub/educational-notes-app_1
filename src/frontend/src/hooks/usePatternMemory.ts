import { useState, useEffect, useCallback } from 'react';
import { getDifficultyConfig } from '../utils/difficultyConfig';

type Phase = 'memorize' | 'input' | 'complete';

export function usePatternMemory(level: number) {
  const config = getDifficultyConfig('patternMemory', level);
  const gridSize = config.gridSize;
  const patternCount = config.patternCount || Math.floor((gridSize * gridSize) / 3);

  const [pattern, setPattern] = useState<boolean[][]>([]);
  const [userPattern, setUserPattern] = useState<boolean[][]>([]);
  const [phase, setPhase] = useState<Phase>('memorize');
  const [attempts, setAttempts] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const generatePattern = useCallback(() => {
    const newPattern = Array(gridSize)
      .fill(null)
      .map(() => Array(gridSize).fill(false));

    let count = 0;
    while (count < patternCount) {
      const row = Math.floor(Math.random() * gridSize);
      const col = Math.floor(Math.random() * gridSize);
      if (!newPattern[row][col]) {
        newPattern[row][col] = true;
        count++;
      }
    }

    return newPattern;
  }, [gridSize, patternCount]);

  useEffect(() => {
    const newPattern = generatePattern();
    setPattern(newPattern);
    setUserPattern(
      Array(gridSize)
        .fill(null)
        .map(() => Array(gridSize).fill(false))
    );
    setPhase('memorize');
    setAttempts(0);
    setIsComplete(false);

    const timer = setTimeout(() => {
      setPhase('input');
    }, 3000);

    return () => clearTimeout(timer);
  }, [generatePattern, gridSize]);

  const handleCellClick = useCallback((row: number, col: number) => {
    setUserPattern((prev) => {
      const newPattern = prev.map((r) => [...r]);
      newPattern[row][col] = !newPattern[row][col];
      return newPattern;
    });
  }, []);

  const checkPattern = useCallback(() => {
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (pattern[i][j] !== userPattern[i][j]) {
          return false;
        }
      }
    }
    return true;
  }, [pattern, userPattern, gridSize]);

  const handleSubmit = useCallback(() => {
    setAttempts((prev) => prev + 1);
    if (checkPattern()) {
      setPhase('complete');
      setIsComplete(true);
    } else {
      setUserPattern(
        Array(gridSize)
          .fill(null)
          .map(() => Array(gridSize).fill(false))
      );
    }
  }, [checkPattern, gridSize]);

  const resetGame = useCallback(() => {
    const newPattern = generatePattern();
    setPattern(newPattern);
    setUserPattern(
      Array(gridSize)
        .fill(null)
        .map(() => Array(gridSize).fill(false))
    );
    setPhase('memorize');
    setAttempts(0);
    setIsComplete(false);

    setTimeout(() => {
      setPhase('input');
    }, 3000);
  }, [generatePattern, gridSize]);

  return {
    pattern,
    userPattern,
    phase,
    attempts,
    isComplete,
    handleCellClick,
    handleSubmit,
    resetGame,
    gridSize,
  };
}
