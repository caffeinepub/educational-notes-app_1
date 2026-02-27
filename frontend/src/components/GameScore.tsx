import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Trophy, RotateCcw, Home } from 'lucide-react';

interface GameScoreProps {
  isOpen: boolean;
  timeTaken: number;
  moves: number;
  score: number;
  onPlayAgain: () => void;
}

function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export default function GameScore({ isOpen, timeTaken, moves, score, onPlayAgain }: GameScoreProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-surface rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl border border-border text-center">
        <div className="flex justify-center mb-4">
          <img src="/assets/generated/trophy.dim_64x64.png" alt="Trophy" className="w-16 h-16" />
        </div>
        <h2 className="text-2xl font-extrabold text-primary mb-2">Level Complete! 🎉</h2>
        <p className="text-muted-foreground mb-6">Great job! Here are your results:</p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-muted rounded-xl p-3">
            <p className="text-xs text-muted-foreground mb-1">Time</p>
            <p className="font-bold text-foreground">{formatTime(timeTaken)}</p>
          </div>
          <div className="bg-muted rounded-xl p-3">
            <p className="text-xs text-muted-foreground mb-1">Moves</p>
            <p className="font-bold text-foreground">{moves}</p>
          </div>
          <div className="bg-muted rounded-xl p-3">
            <p className="text-xs text-muted-foreground mb-1">Score</p>
            <p className="font-bold text-primary">{score}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onPlayAgain}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors"
          >
            <RotateCcw size={16} />
            Play Again
          </button>
          <button
            onClick={() => navigate({ to: '/' })}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-muted text-muted-foreground font-bold hover:bg-muted/80 transition-colors"
          >
            <Home size={16} />
            Menu
          </button>
        </div>
      </div>
    </div>
  );
}
