import { useState, useCallback, useEffect, useRef } from 'react';

const OBJECTS = [
  '🍎', '🍊', '🍋', '🍇', '🍓', '🍒', '🥝', '🍑', '🥭', '🍍',
  '🥥', '🍌', '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
];

function getObjects(count: number): string[] {
  const shuffled = [...OBJECTS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export default function useMemoryTest(level: number) {
  const objectCount = Math.min(5 + level * 2, 15);
  const memorizeTime = Math.max(5, 12 - level);
  const recallTime = Math.max(15, 30 - level * 2);

  const [objects, setObjects] = useState<string[]>(() => getObjects(objectCount));
  const [phase, setPhase] = useState<'memorize' | 'recall' | 'won' | 'lost'>('memorize');
  const [countdown, setCountdown] = useState(memorizeTime);
  const [guessed, setGuessed] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setCountdown(memorizeTime);
    timerRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timerRef.current!);
          setPhase('recall');
          setCountdown(recallTime);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  useEffect(() => {
    if (phase === 'recall') {
      timerRef.current = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            clearInterval(timerRef.current!);
            setPhase('lost');
            setIsComplete(true);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  const submitGuess = useCallback(() => {
    if (!inputValue.trim() || phase !== 'recall') return;
    const guess = inputValue.trim();
    setInputValue('');
    if (objects.includes(guess) && !guessed.includes(guess)) {
      const newGuessed = [...guessed, guess];
      setGuessed(newGuessed);
      setCorrectAnswers(newGuessed.length);
      if (newGuessed.length === objects.length) {
        clearInterval(timerRef.current!);
        setPhase('won');
        setIsComplete(true);
      }
    }
  }, [inputValue, phase, objects, guessed]);

  const reset = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    const newObjects = getObjects(objectCount);
    setObjects(newObjects);
    setPhase('memorize');
    setCountdown(memorizeTime);
    setGuessed([]);
    setInputValue('');
    setCorrectAnswers(0);
    setIsComplete(false);
    timerRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timerRef.current!);
          setPhase('recall');
          setCountdown(recallTime);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  }, [objectCount, memorizeTime, recallTime]);

  return {
    objects,
    phase,
    countdown,
    guessed,
    inputValue,
    setInputValue,
    correctAnswers,
    isComplete,
    submitGuess,
    reset,
  };
}
