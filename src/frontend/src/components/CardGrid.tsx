import Card from './Card';

interface CardData {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface CardGridProps {
  cards: CardData[];
  flippedIndices: number[];
  matchedPairs: number;
  onCardClick: (index: number) => void;
  gridSize: number;
}

export default function CardGrid({ cards, flippedIndices, matchedPairs, onCardClick, gridSize }: CardGridProps) {
  return (
    <div
      className="grid gap-4 mx-auto"
      style={{
        gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
        maxWidth: `${gridSize * 120}px`,
      }}
    >
      {cards.map((card, index) => (
        <Card
          key={card.id}
          value={card.value}
          isFlipped={flippedIndices.includes(index) || card.isMatched}
          isMatched={card.isMatched}
          onClick={() => onCardClick(index)}
        />
      ))}
    </div>
  );
}
