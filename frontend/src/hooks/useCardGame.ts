import { useState, useCallback } from 'react';

const EMOJIS = ['🍎', '🍊', '🍋', '🍇', '🍓', '🍒', '🥝', '🍑', '🥭', '🍍', '🥥', '🍌'];

interface CardItem {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function useCardGame(level: number) {
  const pairCount = Math.min(6 + level * 2, 12);
  const gridSize = pairCount * 2;

  const generateCards = useCallback((): CardItem[] => {
    const selected = EMOJIS.slice(0, pairCount);
    const pairs = [...selected, ...selected];
    return shuffle(pairs).map((value, id) => ({ id, value, isFlipped: false, isMatched: false }));
  }, [pairCount]);

  const [cards, setCards] = useState<CardItem[]>(generateCards);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const handleCardClick = useCallback((index: number) => {
    if (isChecking || cards[index].isMatched || flippedIndices.includes(index)) return;
    if (flippedIndices.length === 2) return;

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      setIsChecking(true);
      const [a, b] = newFlipped;
      if (cards[a].value === cards[b].value) {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, i) => (i === a || i === b ? { ...c, isMatched: true } : c))
          );
          setFlippedIndices([]);
          setIsChecking(false);
          setIsComplete((prev) => {
            const matched = cards.filter((c) => c.isMatched).length + 2;
            return matched === cards.length;
          });
        }, 500);
      } else {
        setTimeout(() => {
          setFlippedIndices([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  }, [cards, flippedIndices, isChecking]);

  const reset = useCallback(() => {
    setCards(generateCards());
    setFlippedIndices([]);
    setMoves(0);
    setIsComplete(false);
    setIsChecking(false);
  }, [generateCards]);

  return { cards, flippedIndices, gridSize, moves, isComplete, handleCardClick, reset };
}
