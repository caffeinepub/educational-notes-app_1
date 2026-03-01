import React from 'react';

interface GameControlsProps {
  onHome: () => void;
  onRestart?: () => void;
}

export default function GameControls({ onHome, onRestart }: GameControlsProps) {
  return (
    <div className="flex gap-3 justify-center mt-4">
      {onRestart && (
        <button
          onClick={onRestart}
          className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg font-medium"
        >
          🔄 Restart
        </button>
      )}
      <button
        onClick={onHome}
        className="bg-muted text-muted-foreground px-4 py-2 rounded-lg font-medium"
      >
        🏠 Home
      </button>
    </div>
  );
}
