import { useState, useCallback, useEffect, useRef } from 'react';

const COLORS = ['Red', 'Blue', 'Green', 'Yellow'];
const ROUND_TIME = 30;

function randomPair() {
  const word = COLORS[Math.floor(Math.random() * COLORS.length)];
  let color = COLORS[Math.floor(Math.random() * COLORS.length)];
  while (color === word) color = COLORS[Math.floor(Math.random() * COLORS.length)];
  return { word, color };
}

export default function useStroopEffect(level: number) {
  const totalRounds = 10 + level * 5;
  const [pair, setPair] = useState(randomPair);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(ROUND_TIME);
  const [isComplete, setIsComplete] = useState(false);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeRemaining((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setIsComplete(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const handleAnswer = useCallback((color: string) => {
    if (isComplete) return;
    const correct = color.toLowerCase() === pair.color.toLowerCase();
    setLastCorrect(correct);
    if (correct) setScore((s) => s + 1);
    if (round >= totalRounds) {
      setIsComplete(true);
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      setRound((r) => r + 1);
      setPair(randomPair());
    }
  }, [isComplete, pair, round, totalRounds]);

  const reset = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPair(randomPair());
    setScore(0);
    setRound(1);
    setTimeRemaining(ROUND_TIME);
    setIsComplete(false);
    setLastCorrect(null);
    timerRef.current = setInterval(() => {
      setTimeRemaining((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setIsComplete(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, []);

  return {
    currentWord: pair.word,
    displayColor: pair.color,
    score,
    round,
    totalRounds,
    timeRemaining,
    isComplete,
    lastCorrect,
    handleAnswer,
    reset,
  };
}
