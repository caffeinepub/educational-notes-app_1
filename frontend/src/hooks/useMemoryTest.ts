import { useState, useEffect, useCallback, useRef } from 'react';
import { getDifficultyConfig } from '../utils/difficultyConfig';

export type MemoryTestPhase = 'memorize' | 'recall' | 'won' | 'lost';

export interface MemoryObject {
  id: number;
  emoji: string;
  label: string;
}

const ALL_OBJECTS: Omit<MemoryObject, 'id'>[] = [
  { emoji: '🍎', label: 'Apple' },
  { emoji: '🚗', label: 'Car' },
  { emoji: '📚', label: 'Book' },
  { emoji: '🪑', label: 'Chair' },
  { emoji: '🌙', label: 'Moon' },
  { emoji: '🎸', label: 'Guitar' },
  { emoji: '🏠', label: 'House' },
  { emoji: '✈️', label: 'Plane' },
  { emoji: '🐶', label: 'Dog' },
  { emoji: '🌸', label: 'Flower' },
  { emoji: '⌚', label: 'Watch' },
  { emoji: '🎩', label: 'Hat' },
  { emoji: '🍕', label: 'Pizza' },
  { emoji: '🔑', label: 'Key' },
  { emoji: '🎈', label: 'Balloon' },
  { emoji: '🦋', label: 'Butterfly' },
  { emoji: '🍦', label: 'Ice Cream' },
  { emoji: '🎯', label: 'Target' },
  { emoji: '🌈', label: 'Rainbow' },
  { emoji: '🐱', label: 'Cat' },
];

function pickObjects(count: number): MemoryObject[] {
  const shuffled = [...ALL_OBJECTS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((obj, idx) => ({ ...obj, id: idx }));
}

export interface UseMemoryTestReturn {
  phase: MemoryTestPhase;
  objects: MemoryObject[];
  memorizeTimeLeft: number;
  recallTimeLeft: number;
  recalledObjects: string[];
  inputValue: string;
  invalidInput: boolean;
  setInputValue: (val: string) => void;
  submitGuess: () => void;
  reset: () => void;
  level: number;
  correctCount: number;
}

export function useMemoryTest(level: number): UseMemoryTestReturn {
  const config = getDifficultyConfig('memoryTest', level);
  const objectCount = config.objectCount ?? 10;
  const memorizeTime = config.memorizeTime ?? 10;
  const recallTime = config.recallTime ?? 25;

  const [phase, setPhase] = useState<MemoryTestPhase>('memorize');
  const [objects, setObjects] = useState<MemoryObject[]>(() => pickObjects(objectCount));
  const [memorizeTimeLeft, setMemorizeTimeLeft] = useState(memorizeTime);
  const [recallTimeLeft, setRecallTimeLeft] = useState(recallTime);
  const [recalledObjects, setRecalledObjects] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [invalidInput, setInvalidInput] = useState(false);

  const memorizeIntervalRef = useRef<number | null>(null);
  const recallIntervalRef = useRef<number | null>(null);
  const invalidTimeoutRef = useRef<number | null>(null);

  // Memorize phase countdown
  useEffect(() => {
    if (phase !== 'memorize') return;

    memorizeIntervalRef.current = window.setInterval(() => {
      setMemorizeTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(memorizeIntervalRef.current!);
          memorizeIntervalRef.current = null;
          setPhase('recall');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (memorizeIntervalRef.current) {
        clearInterval(memorizeIntervalRef.current);
        memorizeIntervalRef.current = null;
      }
    };
  }, [phase]);

  // Recall phase countdown
  useEffect(() => {
    if (phase !== 'recall') return;

    recallIntervalRef.current = window.setInterval(() => {
      setRecallTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(recallIntervalRef.current!);
          recallIntervalRef.current = null;
          setPhase('lost');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (recallIntervalRef.current) {
        clearInterval(recallIntervalRef.current);
        recallIntervalRef.current = null;
      }
    };
  }, [phase]);

  const submitGuess = useCallback(() => {
    if (phase !== 'recall') return;

    const trimmed = inputValue.trim().toLowerCase();
    if (!trimmed) return;

    const match = objects.find((obj) => obj.label.toLowerCase() === trimmed);
    const alreadyRecalled = recalledObjects.some((r) => r.toLowerCase() === trimmed);

    if (!match || alreadyRecalled) {
      // Show invalid feedback briefly
      setInvalidInput(true);
      if (invalidTimeoutRef.current) clearTimeout(invalidTimeoutRef.current);
      invalidTimeoutRef.current = window.setTimeout(() => setInvalidInput(false), 800);
      setInputValue('');
      return;
    }

    const newRecalled = [...recalledObjects, match.label];
    setRecalledObjects(newRecalled);
    setInputValue('');
    setInvalidInput(false);

    if (newRecalled.length === objects.length) {
      // Stop recall timer
      if (recallIntervalRef.current) {
        clearInterval(recallIntervalRef.current);
        recallIntervalRef.current = null;
      }
      setPhase('won');
    }
  }, [phase, inputValue, objects, recalledObjects]);

  const reset = useCallback(() => {
    // Clear all timers
    if (memorizeIntervalRef.current) {
      clearInterval(memorizeIntervalRef.current);
      memorizeIntervalRef.current = null;
    }
    if (recallIntervalRef.current) {
      clearInterval(recallIntervalRef.current);
      recallIntervalRef.current = null;
    }
    if (invalidTimeoutRef.current) {
      clearTimeout(invalidTimeoutRef.current);
      invalidTimeoutRef.current = null;
    }

    setObjects(pickObjects(objectCount));
    setPhase('memorize');
    setMemorizeTimeLeft(memorizeTime);
    setRecallTimeLeft(recallTime);
    setRecalledObjects([]);
    setInputValue('');
    setInvalidInput(false);
  }, [objectCount, memorizeTime, recallTime]);

  return {
    phase,
    objects,
    memorizeTimeLeft,
    recallTimeLeft,
    recalledObjects,
    inputValue,
    invalidInput,
    setInputValue,
    submitGuess,
    reset,
    level,
    correctCount: recalledObjects.length,
  };
}
