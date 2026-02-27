import { useState, useCallback, useEffect, useRef } from 'react';

const ITEMS = ['🔴', '🟡', '🟢', '🔵', '🟣', '🟠', '⚫', '⚪'];

function generateSequence(length: number): string[] {
  return Array.from({ length }, () => ITEMS[Math.floor(Math.random() * ITEMS.length)]);
}

export default function useSequenceMemory(level: number) {
  const seqLength = Math.min(3 + level, 10);
  const displayInterval = Math.max(500, 1000 - level * 50);

  const [sequence, setSequence] = useState<string[]>(() => generateSequence(seqLength));
  const [phase, setPhase] = useState<'display' | 'input' | 'won' | 'lost'>('display');
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [userInput, setUserInput] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const playSequence = useCallback((seq: string[]) => {
    setPhase('display');
    setActiveIndex(-1);
    let i = 0;
    const show = () => {
      if (i < seq.length) {
        setActiveIndex(i);
        timerRef.current = setTimeout(() => {
          setActiveIndex(-1);
          timerRef.current = setTimeout(() => {
            i++;
            show();
          }, 200);
        }, displayInterval);
      } else {
        setPhase('input');
        setUserInput([]);
        setCurrentIndex(0);
      }
    };
    timerRef.current = setTimeout(show, 500);
  }, [displayInterval]);

  useEffect(() => {
    playSequence(sequence);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const handleItemClick = useCallback((item: string) => {
    if (phase !== 'input') return;
    const newInput = [...userInput, item];
    setUserInput(newInput);
    const idx = newInput.length - 1;
    if (sequence[idx] !== item) {
      setAttempts((a) => a + 1);
      setPhase('lost');
      return;
    }
    if (newInput.length === sequence.length) {
      setPhase('won');
      setIsComplete(true);
    }
    setCurrentIndex(newInput.length);
  }, [phase, userInput, sequence]);

  const reset = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const newSeq = generateSequence(seqLength);
    setSequence(newSeq);
    setUserInput([]);
    setCurrentIndex(0);
    setAttempts(0);
    setIsComplete(false);
    playSequence(newSeq);
  }, [seqLength, playSequence]);

  return { sequence, phase, activeIndex, userInput, currentIndex, attempts, isComplete, items: ITEMS, handleItemClick, reset };
}
