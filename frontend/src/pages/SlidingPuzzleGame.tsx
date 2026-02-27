import React, { useEffect } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import useSlidingPuzzle from '../hooks/useSlidingPuzzle';
import useGameTimer from '../hooks/useGameTimer';
import useSoundEffects from '../hooks/useSoundEffects';
import useScoreCalculation from '../hooks/useScoreCalculation';
import { useCompleteLevel } from '../hooks/useQueries';
import { GameType } from '../backend';
import SlidingTile from '../components/SlidingTile';
import GameControls from '../components/GameControls';
import GameScore from '../components/GameScore';
import { Timer, Move } from 'lucide-react';

const LEVEL = 1;

export default function SlidingPuzzleGame() {
  const { identity } = useInternetIdentity();
  const { tiles, moves, isComplete, emptyIndex, size, moveTile, resetPuzzle } = useSlidingPuzzle(LEVEL);
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
      const score = calculateScore(elapsed, moves, LEVEL);
      setFinalScore(score);
      setShowScore(true);
      playSound('success');
      if (identity) {
        completeLevel({
          player: identity.getPrincipal().toString(),
          gameType: GameType.slidingPuzzle,
          level: BigInt(LEVEL),
          startTime: startTimeRef.current,
          correctAnswers: BigInt(1),
          totalQuestions: BigInt(1),
        });
      }
    }
  }, [isComplete]);

  const handleTileClick = (index: number) => {
    playSound('click');
    moveTile(index);
  };

  const handleRestart = () => {
    resetPuzzle();
    resetTimer();
    setShowScore(false);
    start();
    startTimeRef.current = BigInt(Date.now()) * BigInt(1_000_000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Sliding Puzzle</h1>
          <p className="text-muted-foreground text-sm">Arrange tiles in order!</p>
        </div>
        <GameControls onRestart={handleRestart} />
      </div>

      <div className="flex items-center gap-6 mb-6 bg-surface rounded-xl p-4 border border-border">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Timer size={16} />
          <span className="font-mono font-bold text-foreground">
            {Math.floor(elapsed / 60000)}:{String(Math.floor((elapsed % 60000) / 1000)).padStart(2, '0')}
          </span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Move size={16} />
          <span className="font-bold text-foreground">{moves} moves</span>
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
          <div key={index} style={{ aspectRatio: '1' }}>
            <SlidingTile
              value={tile}
              isEmpty={tile === 0}
              onClick={() => handleTileClick(index)}
            />
          </div>
        ))}
      </div>

      <GameScore
        isOpen={showScore}
        timeTaken={elapsed}
        moves={moves}
        score={finalScore}
        onPlayAgain={handleRestart}
      />
    </div>
  );
}
