import React, { useEffect } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import usePatternMemory from '../hooks/usePatternMemory';
import useGameTimer from '../hooks/useGameTimer';
import useSoundEffects from '../hooks/useSoundEffects';
import useScoreCalculation from '../hooks/useScoreCalculation';
import { useCompleteLevel } from '../hooks/useQueries';
import { GameType } from '../backend';
import PatternGrid from '../components/PatternGrid';
import GameControls from '../components/GameControls';
import GameScore from '../components/GameScore';
import { Timer } from 'lucide-react';

const LEVEL = 1;

export default function PatternMemoryGame() {
  const { identity } = useInternetIdentity();
  const { pattern, userPattern, phase, attempts, isComplete, size, handleCellClick, submitPattern, reset } = usePatternMemory(LEVEL);
  const { elapsed, start, stop, reset: resetTimer } = useGameTimer();
  const { playSound } = useSoundEffects();
  const { calculateScore } = useScoreCalculation();
  const { mutate: completeLevel } = useCompleteLevel();
  const [showScore, setShowScore] = React.useState(false);
  const [finalScore, setFinalScore] = React.useState(0);
  const startTimeRef = React.useRef<bigint>(BigInt(0));

  useEffect(() => {
    start();
    startTimeRef.current = BigInt(Date.now()) * BigInt(1_000_000);
  }, []);

  useEffect(() => {
    if (isComplete) {
      stop();
      const score = calculateScore(elapsed, attempts, LEVEL);
      setFinalScore(score);
      setShowScore(true);
      playSound('success');
      if (identity) {
        completeLevel({
          player: identity.getPrincipal().toString(),
          gameType: GameType.patternMemory,
          level: BigInt(LEVEL),
          startTime: startTimeRef.current,
          correctAnswers: BigInt(1),
          totalQuestions: BigInt(1),
        });
      }
    }
  }, [isComplete]);

  const handleClick = (row: number, col: number) => {
    playSound('click');
    handleCellClick(row, col);
  };

  const handleSubmit = () => {
    playSound('click');
    submitPattern();
    if (phase === 'recall') {
      setTimeout(() => playSound(isComplete ? 'success' : 'error'), 100);
    }
  };

  const handleRestart = () => {
    reset();
    resetTimer();
    setShowScore(false);
    start();
    startTimeRef.current = BigInt(Date.now()) * BigInt(1_000_000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Pattern Memory</h1>
          <p className="text-muted-foreground text-sm">Memorize and reproduce the pattern!</p>
        </div>
        <GameControls onRestart={handleRestart} />
      </div>

      <div className="flex items-center gap-4 mb-6 bg-surface rounded-xl p-4 border border-border">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Timer size={16} />
          <span className="font-mono font-bold text-foreground">
            {Math.floor(elapsed / 60000)}:{String(Math.floor((elapsed % 60000) / 1000)).padStart(2, '0')}
          </span>
        </div>
        <div className="ml-auto">
          <span className={`px-3 py-1 rounded-full text-sm font-bold ${
            phase === 'memorize' ? 'bg-yellow-500/20 text-yellow-600' :
            phase === 'recall' ? 'bg-blue-500/20 text-blue-600' :
            phase === 'won' ? 'bg-green-500/20 text-green-600' :
            'bg-red-500/20 text-red-600'
          }`}>
            {phase === 'memorize' ? '👁 Memorize' : phase === 'recall' ? '✏️ Recall' : phase === 'won' ? '✅ Won!' : '❌ Wrong'}
          </span>
        </div>
      </div>

      <div className="flex justify-center mb-6">
        <PatternGrid
          pattern={pattern}
          userPattern={userPattern}
          isDisplayMode={phase === 'memorize'}
          onCellClick={handleClick}
          size={size}
        />
      </div>

      {phase === 'recall' && (
        <div className="text-center">
          <button
            onClick={handleSubmit}
            className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors"
          >
            Submit Pattern
          </button>
        </div>
      )}

      {phase === 'lost' && (
        <div className="text-center">
          <p className="text-destructive mb-4">Wrong pattern! Try again.</p>
          <button
            onClick={handleRestart}
            className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      <GameScore
        isOpen={showScore}
        timeTaken={elapsed}
        moves={attempts}
        score={finalScore}
        onPlayAgain={handleRestart}
      />
    </div>
  );
}
