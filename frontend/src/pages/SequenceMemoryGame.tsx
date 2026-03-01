import { useEffect, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import useSequenceMemory from '../hooks/useSequenceMemory';
import useGameTimer from '../hooks/useGameTimer';
import useScoreCalculation from '../hooks/useScoreCalculation';
import useSoundEffects from '../hooks/useSoundEffects';
import { useActor } from '../hooks/useActor';
import GameScore from '../components/GameScore';

export default function SequenceMemoryGame() {
  const navigate = useNavigate();
  const { actor } = useActor();
  const gamePlayRecorded = useRef(false);

  const level = 1;
  const {
    sequence,
    phase,
    activeIndex,
    currentIndex,
    attempts,
    isComplete,
    items,
    handleItemClick,
    reset,
  } = useSequenceMemory(level);
  const { elapsed, start, stop, reset: resetTimer } = useGameTimer();
  const { calculateScore } = useScoreCalculation();
  const { playSound } = useSoundEffects();

  useEffect(() => {
    if (actor && !gamePlayRecorded.current) {
      actor.recordGamePlay('SequenceMemory').catch(() => {});
      gamePlayRecorded.current = true;
    }
  }, [actor]);

  useEffect(() => {
    start();
    return () => stop();
  }, []);

  const prevAttemptsRef = useRef(attempts);
  useEffect(() => {
    if (isComplete) {
      stop();
      playSound('success');
    }
  }, [isComplete]);

  useEffect(() => {
    if (attempts > prevAttemptsRef.current) {
      playSound('error');
    }
    prevAttemptsRef.current = attempts;
  }, [attempts]);

  const handleItemClickWithSound = (item: string) => {
    playSound('click');
    handleItemClick(item);
  };

  const handleReset = () => {
    reset();
    resetTimer();
    start();
  };

  const score = isComplete ? calculateScore(elapsed, sequence.length, level) : 0;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-foreground">🔢 Sequence Memory</h1>
          <div className="text-sm text-muted-foreground">
            {phase === 'display' ? '👁 Dekho...' : phase === 'input' ? `✏️ Input: ${currentIndex}/${sequence.length}` : phase === 'won' ? '✅ Won!' : '❌ Wrong'}
          </div>
        </div>

        {(phase === 'display' || phase === 'input') && (
          <div className="grid grid-cols-4 gap-3 mt-4">
            {items.map((item, i) => (
              <button
                key={i}
                onClick={() => phase === 'input' && handleItemClickWithSound(item)}
                disabled={phase !== 'input'}
                className={`
                  p-4 rounded-xl text-2xl font-bold transition-all duration-200 border-2
                  ${phase === 'display' && activeIndex === sequence.indexOf(item)
                    ? 'bg-primary border-primary text-primary-foreground scale-110 shadow-lg'
                    : phase === 'input'
                    ? 'bg-card border-border text-foreground hover:bg-primary/10 cursor-pointer'
                    : 'bg-card border-border text-foreground opacity-60'
                  }
                `}
              >
                {item}
              </button>
            ))}
          </div>
        )}

        {phase === 'lost' && (
          <div className="text-center py-8">
            <p className="text-4xl mb-4">❌</p>
            <p className="text-xl font-bold text-destructive mb-2">Galat sequence!</p>
            <p className="text-muted-foreground mb-4">Sahi sequence tha:</p>
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              {sequence.map((item, i) => (
                <span key={i} className="text-3xl">{item}</span>
              ))}
            </div>
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

        {isComplete && (
          <GameScore
            score={score}
            elapsedTime={elapsed}
            moves={sequence.length}
            onPlayAgain={handleReset}
            onMenu={() => navigate({ to: '/' })}
          />
        )}
      </div>
    </div>
  );
}
