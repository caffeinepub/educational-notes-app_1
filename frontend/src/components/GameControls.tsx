import { RotateCcw, Home } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from '@tanstack/react-router';

interface GameControlsProps {
  onRestart: () => void;
}

export default function GameControls({ onRestart }: GameControlsProps) {
  const navigate = useNavigate();

  return (
    <div className="flex gap-4">
      <Button onClick={onRestart} variant="outline" className="flex-1">
        <RotateCcw className="h-4 w-4 mr-2" />
        Restart
      </Button>
      <Button onClick={() => navigate({ to: '/' })} variant="outline" className="flex-1">
        <Home className="h-4 w-4 mr-2" />
        Menu
      </Button>
    </div>
  );
}
