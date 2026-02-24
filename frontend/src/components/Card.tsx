interface CardProps {
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: () => void;
}

export default function Card({ value, isFlipped, isMatched, onClick }: CardProps) {
  return (
    <button
      onClick={onClick}
      disabled={isFlipped || isMatched}
      className={`
        aspect-square rounded-lg transition-all duration-300 transform
        ${isFlipped || isMatched ? 'rotate-y-180' : ''}
        ${isMatched ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 cursor-pointer'}
        ${!isFlipped && !isMatched ? 'hover:shadow-lg' : ''}
      `}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
    >
      <div
        className="relative w-full h-full"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped || isMatched ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 0.6s',
        }}
      >
        {/* Card Back */}
        <div
          className="absolute inset-0 rounded-lg flex items-center justify-center"
          style={{
            backfaceVisibility: 'hidden',
          }}
        >
          <img
            src="/assets/generated/card-back.dim_200x200.png"
            alt="Card back"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        {/* Card Front */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-4xl font-bold text-white shadow-lg"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {value}
        </div>
      </div>
    </button>
  );
}
