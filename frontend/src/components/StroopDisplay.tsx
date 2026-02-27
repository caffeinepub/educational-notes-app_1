import React from 'react';

interface StroopDisplayProps {
  word: string;
  displayColor: string;
  onAnswer: (color: string) => void;
  disabled?: boolean;
}

const COLOR_OPTIONS = ['Red', 'Blue', 'Green', 'Yellow'];

const COLOR_CLASSES: Record<string, string> = {
  Red: 'bg-red-500 hover:bg-red-600 text-white',
  Blue: 'bg-blue-500 hover:bg-blue-600 text-white',
  Green: 'bg-green-500 hover:bg-green-600 text-white',
  Yellow: 'bg-yellow-400 hover:bg-yellow-500 text-black',
};

const DISPLAY_COLOR_STYLES: Record<string, string> = {
  red: '#ef4444',
  blue: '#3b82f6',
  green: '#22c55e',
  yellow: '#eab308',
};

export default function StroopDisplay({ word, displayColor, onAnswer, disabled }: StroopDisplayProps) {
  return (
    <div className="flex flex-col items-center gap-8">
      <div
        className="text-6xl font-extrabold tracking-wide select-none"
        style={{ color: DISPLAY_COLOR_STYLES[displayColor.toLowerCase()] || '#fff' }}
      >
        {word}
      </div>
      <p className="text-muted-foreground text-sm">What color is the INK? (not the word)</p>
      <div className="grid grid-cols-2 gap-3">
        {COLOR_OPTIONS.map((color) => (
          <button
            key={color}
            onClick={() => onAnswer(color)}
            disabled={disabled}
            className={`px-8 py-3 rounded-xl font-bold text-lg transition-all duration-150 shadow-md hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${COLOR_CLASSES[color]}`}
          >
            {color}
          </button>
        ))}
      </div>
    </div>
  );
}
