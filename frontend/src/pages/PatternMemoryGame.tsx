import { useEffect, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import usePatternMemory from '../hooks/usePatternMemory';
import useGameTimer from '../hooks/useGameTimer';
import useScoreCalculation from '../hooks/useScoreCalculation';
import useSoundEffects from '../hooks/useSoundEffects';
import { useActor } from '../hooks/useActor';
import PatternGrid from '../components/PatternGrid';
import GameScore from '../components/GameScore';

export default function PatternMemoryGame() {
  const navigate = useNavigate();
  const { actor } = useActor();
  const gamePlayRecorded = useRef(false);

  const level = 1;
  const {
    pattern,
    userPattern,
    phase,
    size,
    handleCellClick,
    submitPattern,
    reset,
    isComplete,
    attempts,
  } = usePatternMemory(level);
  const { elapsed, start, stop, reset: resetTimer } = useGameTimer();
  const { calculateScore } = useScoreCalculation();
  const { playSound } = useSoundEffects();

  useEffect(() => {
    if (actor && !gamePlayRecorded.current) {
      actor.recordGamePlay('PatternMemory').catch(() => {});
      gamePlayRecorded.current = true;
    }
  }, [actor]);

  useEffect(() => {
    start();
    return () => stop();
  }, []);

  useEffect(() => {
    if (phase === 'won') {
      stop();
      playSound('success');
    } else if (phase === 'lost') {
      playSound('error');
    }
  }, [phase]);

  const handleCellClickWithSound = (row: number, col: number) => {
    playSound('click');
    handleCellClick(row, col);
  };

  const handleReset = () => {
    reset();
    resetTimer();
    start();
  };

  const score = phase === 'won' ? calculateScore(elapsed, attempts, level) : 0;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-foreground">🔲 Pattern Memory</h1>
          <div className="text-sm text-muted-foreground capitalize">
            {phase === 'memorize' ? '👁 Memorize' : phase === 'recall' ? '✏️ Recall' : phase === 'won' ? '✅ Won!' : '❌ Wrong'}
          </div>
        </div>

        <PatternGrid
          pattern={pattern}
          userPattern={userPattern}
          isDisplayMode={phase === 'memorize'}
          onCellClick={handleCellClickWithSound}
          size={size}
        />

        {phase === 'recall' && (
          <div className="mt-4 text-center">
            <button
              onClick={submitPattern}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium"
            >
              Submit Pattern
            </button>
          </div>
        )}

        {phase === 'lost' && (
          <div className="mt-4 text-center">
            <p className="text-destructive mb-3">❌ Galat pattern! Dobara try karo.</p>
            <button
              onClick={handleReset}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium"
            >
              Try Again
            </button>
          </div>
        )}

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

        {phase === 'won' && (
          <GameScore
            score={score}
            elapsedTime={elapsed}
            moves={attempts}
            onPlayAgain={handleReset}
            onMenu={() => navigate({ to: '/' })}
          />
        )}
      </div>
    </div>
  );
}
