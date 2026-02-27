import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { RotateCcw, Home } from 'lucide-react';

interface GameControlsProps {
  onRestart: () => void;
}

export default function GameControls({ onRestart }: GameControlsProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onRestart}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary font-medium transition-colors"
      >
        <RotateCcw size={16} />
        Restart
      </button>
      <button
        onClick={() => navigate({ to: '/' })}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 text-muted-foreground font-medium transition-colors"
      >
        <Home size={16} />
        Home
      </button>
    </div>
  );
}
