interface PatternGridProps {
  pattern: boolean[][];
  userPattern: boolean[][];
  phase: 'memorize' | 'input' | 'complete';
  onCellClick: (row: number, col: number) => void;
  gridSize: number;
}

export default function PatternGrid({ pattern, userPattern, phase, onCellClick, gridSize }: PatternGridProps) {
  const displayPattern = phase === 'memorize' ? pattern : userPattern;

  return (
    <div
      className="grid gap-2 mx-auto bg-card/80 backdrop-blur-sm p-4 rounded-lg border border-border"
      style={{
        gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
        maxWidth: `${gridSize * 80}px`,
      }}
    >
      {displayPattern.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <button
            key={`${rowIndex}-${colIndex}`}
            onClick={() => phase === 'input' && onCellClick(rowIndex, colIndex)}
            disabled={phase !== 'input'}
            className={`
              aspect-square rounded-lg transition-all duration-300
              ${cell ? 'bg-gradient-to-br from-primary to-accent shadow-lg' : 'bg-muted/50'}
              ${phase === 'input' ? 'hover:scale-105 cursor-pointer' : 'cursor-default'}
            `}
          />
        ))
      )}
    </div>
  );
}
