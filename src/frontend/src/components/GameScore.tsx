import { Trophy, RotateCcw, Home } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { useScoreCalculation } from '../hooks/useScoreCalculation';

interface GameScoreProps {
  timeTaken: number;
  moves: number;
  level: number;
  onPlayAgain: () => void;
  onBackToMenu: () => void;
}

export default function GameScore({ timeTaken, moves, level, onPlayAgain, onBackToMenu }: GameScoreProps) {
  const score = useScoreCalculation(timeTaken, moves, level);

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <img
              src="/assets/generated/trophy.dim_64x64.png"
              alt="Trophy"
              className="h-16 w-16"
            />
          </div>
          <DialogTitle className="text-center text-2xl">Congratulations!</DialogTitle>
          <DialogDescription className="text-center">
            You completed the puzzle!
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 rounded-lg bg-muted">
              <p className="text-sm text-muted-foreground">Time</p>
              <p className="text-2xl font-bold">{Math.floor(timeTaken / 1000)}s</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted">
              <p className="text-sm text-muted-foreground">Moves</p>
              <p className="text-2xl font-bold">{moves}</p>
            </div>
          </div>
          
          <div className="text-center p-6 rounded-lg bg-gradient-to-br from-primary to-accent text-white">
            <p className="text-sm opacity-90">Your Score</p>
            <p className="text-4xl font-bold">{score}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={onPlayAgain} className="flex-1">
            <RotateCcw className="h-4 w-4 mr-2" />
            Play Again
          </Button>
          <Button onClick={onBackToMenu} variant="outline" className="flex-1">
            <Home className="h-4 w-4 mr-2" />
            Menu
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
