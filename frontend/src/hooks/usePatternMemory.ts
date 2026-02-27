import { useState, useCallback, useEffect, useRef } from 'react';

function generatePattern(size: number, count: number): boolean[][] {
  const grid = Array.from({ length: size }, () => Array(size).fill(false) as boolean[]);
  let placed = 0;
  while (placed < count) {
    const r = Math.floor(Math.random() * size);
    const c = Math.floor(Math.random() * size);
    if (!grid[r][c]) {
      grid[r][c] = true;
      placed++;
    }
  }
  return grid;
}

export default function usePatternMemory(level: number) {
  const size = Math.min(3 + Math.floor(level / 2), 6);
  const cellCount = Math.min(3 + level, size * size - 1);
  const memorizeTime = Math.max(2000, 5000 - level * 300);

  const [pattern, setPattern] = useState<boolean[][]>(() => generatePattern(size, cellCount));
  const [userPattern, setUserPattern] = useState<boolean[][]>(() =>
    Array.from({ length: size }, () => Array(size).fill(false))
  );
  const [phase, setPhase] = useState<'memorize' | 'recall' | 'won' | 'lost'>('memorize');
  const [attempts, setAttempts] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startMemorize = useCallback(() => {
    setPhase('memorize');
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setPhase('recall'), memorizeTime);
  }, [memorizeTime]);

  useEffect(() => {
    startMemorize();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [startMemorize]);

  const handleCellClick = useCallback((row: number, col: number) => {
    if (phase !== 'recall') return;
    setUserPattern((prev) => {
      const next = prev.map((r) => [...r]);
      next[row][col] = !next[row][col];
      return next;
    });
  }, [phase]);

  const submitPattern = useCallback(() => {
    let correct = true;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (pattern[r][c] !== userPattern[r][c]) { correct = false; break; }
      }
      if (!correct) break;
    }
    if (correct) {
      setPhase('won');
      setIsComplete(true);
    } else {
      setAttempts((a) => a + 1);
      setPhase('lost');
    }
  }, [pattern, userPattern, size]);

  const reset = useCallback(() => {
    const newPattern = generatePattern(size, cellCount);
    setPattern(newPattern);
    setUserPattern(Array.from({ length: size }, () => Array(size).fill(false)));
    setAttempts(0);
    setIsComplete(false);
    setPhase('memorize');
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setPhase('recall'), memorizeTime);
  }, [size, cellCount, memorizeTime]);

  return { pattern, userPattern, phase, attempts, isComplete, size, handleCellClick, submitPattern, reset };
}
