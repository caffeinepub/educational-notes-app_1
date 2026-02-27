import React from 'react';

interface CardProps {
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: () => void;
}

export default function Card({ value, isFlipped, isMatched, onClick }: CardProps) {
  return (
    <div
      className={`card-container cursor-pointer select-none ${isMatched ? 'opacity-60 pointer-events-none' : ''}`}
      onClick={onClick}
      style={{ perspective: '600px' }}
    >
      <div
        className="card-inner relative w-full h-full transition-transform duration-500"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped || isMatched ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Back face */}
        <div
          className="card-face absolute inset-0 rounded-xl flex items-center justify-center bg-gradient-to-br from-primary to-accent shadow-md"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <img
            src="/assets/generated/card-back.dim_200x200.png"
            alt="card back"
            className="w-10 h-10 opacity-80"
          />
        </div>
        {/* Front face */}
        <div
          className="card-face absolute inset-0 rounded-xl flex items-center justify-center bg-surface border-2 border-primary shadow-md text-3xl"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          {value}
        </div>
      </div>
    </div>
  );
}
