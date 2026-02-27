import React from 'react';
import Card from './Card';

interface CardItem {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface CardGridProps {
  cards: CardItem[];
  flippedIndices: number[];
  gridSize: number;
  onCardClick: (index: number) => void;
}

export default function CardGrid({ cards, flippedIndices, gridSize, onCardClick }: CardGridProps) {
  const cols = gridSize <= 12 ? 3 : gridSize <= 16 ? 4 : 4;

  return (
    <div
      className="grid gap-3 w-full max-w-md mx-auto"
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
    >
      {cards.map((card, index) => (
        <div key={card.id} style={{ aspectRatio: '1' }}>
          <Card
            value={card.value}
            isFlipped={card.isFlipped || flippedIndices.includes(index)}
            isMatched={card.isMatched}
            onClick={() => onCardClick(index)}
          />
        </div>
      ))}
    </div>
  );
}
