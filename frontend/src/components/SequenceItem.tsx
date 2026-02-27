import React from 'react';

interface SequenceItemProps {
  item: string;
  isActive: boolean;
  isSelected: boolean;
  isDisabled: boolean;
  onClick: () => void;
}

export default function SequenceItem({ item, isActive, isSelected, isDisabled, onClick }: SequenceItemProps) {
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`w-16 h-16 rounded-2xl text-2xl font-bold border-2 transition-all duration-150 select-none
        ${isActive ? 'bg-primary border-primary text-primary-foreground scale-110 shadow-xl' : ''}
        ${isSelected && !isActive ? 'bg-accent border-accent text-accent-foreground scale-105' : ''}
        ${!isActive && !isSelected ? 'bg-surface border-border hover:border-primary/50 text-foreground' : ''}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
      `}
    >
      {item}
    </button>
  );
}
