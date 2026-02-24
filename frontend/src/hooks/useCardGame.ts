import { useState, useEffect, useCallback } from 'react';
import { getDifficultyConfig } from '../utils/difficultyConfig';

interface CardData {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export function useCardGame(level: number) {
  const config = getDifficultyConfig('cardMatching', level);
  const gridSize = config.gridSize;
  const totalCards = gridSize * gridSize;
  const totalPairs = totalCards / 2;

  const [cards, setCards] = useState<CardData[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const generateCards = useCallback(() => {
    const emojis = ['🎮', '🎯', '🎨', '🎭', '🎪', '🎬', '🎸', '🎹', '🎺', '🎻', '🎲', '🎰', '🏀', '⚽', '🏈', '⚾'];
    const selectedEmojis = emojis.slice(0, totalPairs);
    const cardValues = [...selectedEmojis, ...selectedEmojis];
    
    // Shuffle cards
    const shuffled = cardValues
      .map((value, index) => ({ id: index, value, isFlipped: false, isMatched: false }))
      .sort(() => Math.random() - 0.5);
    
    return shuffled;
  }, [totalPairs]);

  useEffect(() => {
    setCards(generateCards());
    setFlippedIndices([]);
    setMatchedPairs(0);
    setMoves(0);
    setIsComplete(false);
  }, [generateCards]);

  const handleCardClick = useCallback((index: number) => {
    if (flippedIndices.length === 2 || cards[index].isMatched || flippedIndices.includes(index)) {
      return;
    }

    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);

    if (newFlippedIndices.length === 2) {
      setMoves((prev) => prev + 1);
      const [firstIndex, secondIndex] = newFlippedIndices;
      
      if (cards[firstIndex].value === cards[secondIndex].value) {
        // Match found
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card, i) =>
              i === firstIndex || i === secondIndex ? { ...card, isMatched: true } : card
            )
          );
          setMatchedPairs((prev) => prev + 1);
          setFlippedIndices([]);
          
          // Check if game is complete
          if (matchedPairs + 1 === totalPairs) {
            setIsComplete(true);
          }
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setFlippedIndices([]);
        }, 1000);
      }
    }
  }, [flippedIndices, cards, matchedPairs, totalPairs]);

  const resetGame = useCallback(() => {
    setCards(generateCards());
    setFlippedIndices([]);
    setMatchedPairs(0);
    setMoves(0);
    setIsComplete(false);
  }, [generateCards]);

  return {
    cards,
    flippedIndices,
    matchedPairs,
    moves,
    isComplete,
    handleCardClick,
    resetGame,
    gridSize,
  };
}
