import { useState, useCallback, useEffect, useRef } from 'react';

const TEXTS = [
  'The quick brown fox jumps over the lazy dog.',
  'Practice makes perfect when you type every day.',
  'Speed and accuracy are both important in typing.',
  'A good typist can type more than sixty words per minute.',
  'Learning to type fast will help you in many ways.',
  'The sun rises in the east and sets in the west.',
  'Reading books is a great way to improve your vocabulary.',
  'Technology has changed the way we communicate with each other.',
];

export type CharStatus = 'pending' | 'correct' | 'incorrect';

export default function useSpeedTyping() {
  const [targetText, setTargetText] = useState(() => TEXTS[Math.floor(Math.random() * TEXTS.length)]);
  const [typedText, setTypedText] = useState('');
  const [isGameActive, setIsGameActive] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  const charStatuses: CharStatus[] = targetText.split('').map((ch, i) => {
    if (i >= typedText.length) return 'pending';
    return typedText[i] === ch ? 'correct' : 'incorrect';
  });

  const calculateStats = useCallback((typed: string) => {
    const elapsed = (Date.now() - startTimeRef.current) / 1000 / 60;
    const words = typed.trim().split(/\s+/).filter(Boolean).length;
    const calculatedWpm = elapsed > 0 ? Math.round(words / elapsed) : 0;
    const correct = typed.split('').filter((ch, i) => ch === targetText[i]).length;
    const calculatedAccuracy = typed.length > 0 ? Math.round((correct / typed.length) * 100) : 100;
    setWpm(calculatedWpm);
    setAccuracy(calculatedAccuracy);
  }, [targetText]);

  const handleInput = useCallback((value: string) => {
    if (!isGameActive) {
      setIsGameActive(true);
      startTimeRef.current = Date.now();
      timerRef.current = setInterval(() => {
        setTimeRemaining((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current!);
            setIsGameOver(true);
            setIsGameActive(false);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    if (value.length <= targetText.length) {
      setTypedText(value);
      calculateStats(value);
      if (value === targetText) {
        clearInterval(timerRef.current!);
        setIsGameOver(true);
        setIsGameActive(false);
      }
    }
  }, [isGameActive, targetText, calculateStats]);

  const reset = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTargetText(TEXTS[Math.floor(Math.random() * TEXTS.length)]);
    setTypedText('');
    setIsGameActive(false);
    setIsGameOver(false);
    setTimeRemaining(60);
    setWpm(0);
    setAccuracy(100);
  }, []);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  return {
    targetText,
    typedText,
    charStatuses,
    isGameActive,
    isGameOver,
    timeRemaining,
    wpm,
    accuracy,
    handleInput,
    reset,
  };
}
