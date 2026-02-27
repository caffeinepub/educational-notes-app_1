import React from 'react';

interface SlidingTileProps {
  value: number;
  isEmpty: boolean;
  onClick: () => void;
}

export default function SlidingTile({ value, isEmpty, onClick }: SlidingTileProps) {
  if (isEmpty) {
    return <div className="w-full h-full rounded-xl bg-muted/30 border-2 border-dashed border-border" />;
  }

  return (
    <button
      onClick={onClick}
      className="w-full h-full rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold text-xl shadow-md hover:shadow-lg hover:scale-95 transition-all duration-150 border-2 border-primary/30"
    >
      {value}
    </button>
  );
}
