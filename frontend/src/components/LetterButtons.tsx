import React from 'react';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

interface LetterButtonsProps {
  onLetterClick: (letter: string) => void;
  disabled?: boolean;
}

export default function LetterButtons({ onLetterClick, disabled = false }: LetterButtonsProps) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-7 sm:grid-cols-9 gap-1.5 sm:gap-2">
        {LETTERS.map((letter) => (
          <button
            key={letter}
            onClick={() => onLetterClick(letter)}
            disabled={disabled}
            className={`
              flex items-center justify-center
              w-full aspect-square min-h-[44px]
              rounded-lg text-sm sm:text-base font-bold
              border-2 transition-all duration-100
              select-none
              ${
                disabled
                  ? 'border-border/30 bg-muted/30 text-muted-foreground/40 cursor-not-allowed'
                  : 'border-primary/30 bg-card text-foreground cursor-pointer hover:bg-primary hover:text-primary-foreground hover:border-primary hover:scale-105 active:scale-95 active:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1'
              }
            `}
          >
            {letter}
          </button>
        ))}
      </div>
    </div>
  );
}
