import React from 'react';

interface GameScoreProps {
  score: number;
  elapsedTime: number;
  moves: number;
  onPlayAgain: () => void;
  onMenu: () => void;
}

export default function GameScore({ score, elapsedTime, moves, onPlayAgain, onMenu }: GameScoreProps) {
  const seconds = Math.floor(elapsedTime / 1000);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
        <div className="mb-4">
          <img src="/assets/generated/trophy.dim_64x64.png" alt="Trophy" className="w-16 h-16 mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-foreground">🎉 Shabash!</h2>
          <p className="text-muted-foreground text-sm mt-1">Level complete!</p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-background rounded-lg p-3">
            <p className="text-xs text-muted-foreground">Score</p>
            <p className="text-xl font-bold text-primary">{score}</p>
          </div>
          {elapsedTime > 0 && (
            <div className="bg-background rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Time</p>
              <p className="text-xl font-bold text-foreground">{seconds}s</p>
            </div>
          )}
          <div className="bg-background rounded-lg p-3">
            <p className="text-xs text-muted-foreground">Moves</p>
            <p className="text-xl font-bold text-foreground">{moves}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onPlayAgain}
            className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-lg font-medium"
          >
            🔄 Dobara
          </button>
          <button
            onClick={onMenu}
            className="flex-1 bg-secondary text-secondary-foreground py-2.5 rounded-lg font-medium"
          >
            🏠 Menu
          </button>
        </div>
      </div>
    </div>
  );
}
