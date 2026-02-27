import React from 'react';

interface PatternGridProps {
  pattern: boolean[][];
  userPattern?: boolean[][];
  isDisplayMode: boolean;
  onCellClick?: (row: number, col: number) => void;
  size: number;
}

export default function PatternGrid({
  pattern,
  userPattern,
  isDisplayMode,
  onCellClick,
  size,
}: PatternGridProps) {
  const displayGrid = isDisplayMode ? pattern : (userPattern || Array.from({ length: size }, () => Array(size).fill(false)));

  return (
    <div
      className="grid gap-2 mx-auto"
      style={{
        gridTemplateColumns: `repeat(${size}, 1fr)`,
        maxWidth: `${size * 56}px`,
      }}
    >
      {displayGrid.map((row, rowIdx) =>
        row.map((cell, colIdx) => (
          <button
            key={`${rowIdx}-${colIdx}`}
            onClick={() => !isDisplayMode && onCellClick?.(rowIdx, colIdx)}
            disabled={isDisplayMode}
            className={`w-12 h-12 rounded-lg border-2 transition-all duration-150 ${
              cell
                ? 'bg-primary border-primary shadow-lg scale-95'
                : 'bg-surface border-border hover:border-primary/50'
            } ${!isDisplayMode ? 'cursor-pointer' : 'cursor-default'}`}
          />
        ))
      )}
    </div>
  );
}
