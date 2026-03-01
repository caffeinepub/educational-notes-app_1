import { useEffect, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import useSlidingPuzzle from '../hooks/useSlidingPuzzle';
import useGameTimer from '../hooks/useGameTimer';
import useScoreCalculation from '../hooks/useScoreCalculation';
import useSoundEffects from '../hooks/useSoundEffects';
import { useActor } from '../hooks/useActor';
import SlidingTile from '../components/SlidingTile';
import GameScore from '../components/GameScore';

export default function SlidingPuzzleGame() {
  const navigate = useNavigate();
  const { actor } = useActor();
  const gamePlayRecorded = useRef(false);

  const level = 1;
  const { tiles, emptyIndex, moves, isComplete, size, moveTile, resetPuzzle } = useSlidingPuzzle(level);
  const { elapsed, start, stop, reset: resetTimer } = useGameTimer();
  const { calculateScore } = useScoreCalculation();
  const { playSound } = useSoundEffects();

  useEffect(() => {
    if (actor && !gamePlayRecorded.current) {
      actor.recordGamePlay('SlidingPuzzle').catch(() => {});
      gamePlayRecorded.current = true;
    }
  }, [actor]);

  useEffect(() => {
    start();
    return () => stop();
  }, []);

  useEffect(() => {
    if (isComplete) {
      stop();
      playSound('success');
    }
  }, [isComplete]);

  const handleTileClickWithSound = (index: number) => {
    playSound('click');
    moveTile(index);
  };

  const handleReset = () => {
    resetPuzzle();
    resetTimer();
    start();
  };

  const score = isComplete ? calculateScore(elapsed, moves, level) : 0;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-foreground">🧩 Sliding Puzzle</h1>
          <div className="text-sm text-muted-foreground">
            Moves: {moves} | Time: {Math.floor(elapsed / 1000)}s
          </div>
        </div>

        <div
          className="grid gap-2 mx-auto"
          style={{
            gridTemplateColumns: `repeat(${size}, 1fr)`,
            maxWidth: `${size * 80}px`,
          }}
        >
          {tiles.map((tile, index) => (
            <SlidingTile
              key={index}
              value={tile}
              isEmpty={index === emptyIndex}
              onClick={() => handleTileClickWithSound(index)}
            />
          ))}
        </div>

        <div className="flex gap-3 mt-4 justify-center">
          <button
            onClick={handleReset}
            className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg font-medium"
          >
            🔄 Reset
          </button>
          <button
            onClick={() => navigate({ to: '/' })}
            className="bg-muted text-muted-foreground px-4 py-2 rounded-lg font-medium"
          >
            🏠 Home
          </button>
        </div>

        {isComplete && (
          <GameScore
            score={score}
            elapsedTime={elapsed}
            moves={moves}
            onPlayAgain={handleReset}
            onMenu={() => navigate({ to: '/' })}
          />
        )}
      </div>
    </div>
  );
}
