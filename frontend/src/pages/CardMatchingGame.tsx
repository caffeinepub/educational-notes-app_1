import { useEffect, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import useCardGame from '../hooks/useCardGame';
import useGameTimer from '../hooks/useGameTimer';
import useScoreCalculation from '../hooks/useScoreCalculation';
import useSoundEffects from '../hooks/useSoundEffects';
import { useActor } from '../hooks/useActor';
import CardGrid from '../components/CardGrid';
import GameScore from '../components/GameScore';

export default function CardMatchingGame() {
  const navigate = useNavigate();
  const { actor } = useActor();
  const gamePlayRecorded = useRef(false);

  const level = 1;
  const { cards, flippedIndices, gridSize, moves, isComplete, handleCardClick, reset } = useCardGame(level);
  const { elapsed, start, stop, reset: resetTimer } = useGameTimer();
  const { calculateScore } = useScoreCalculation();
  const { playSound } = useSoundEffects();

  useEffect(() => {
    if (actor && !gamePlayRecorded.current) {
      actor.recordGamePlay('CardMatching').catch(() => {});
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

  const handleCardClickWithSound = (index: number) => {
    if (flippedIndices.includes(index)) return;
    playSound('click');
    handleCardClick(index);
  };

  const handleReset = () => {
    reset();
    resetTimer();
    start();
  };

  const score = isComplete ? calculateScore(elapsed, moves, level) : 0;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-foreground">🃏 Card Matching</h1>
          <div className="text-sm text-muted-foreground">
            Moves: {moves} | Time: {Math.floor(elapsed / 1000)}s
          </div>
        </div>

        <CardGrid
          cards={cards}
          flippedIndices={flippedIndices}
          gridSize={gridSize}
          onCardClick={handleCardClickWithSound}
        />

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
