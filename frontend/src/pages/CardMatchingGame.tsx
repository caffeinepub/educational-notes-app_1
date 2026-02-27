import React, { useEffect, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import useCardGame from '../hooks/useCardGame';
import useGameTimer from '../hooks/useGameTimer';
import useSoundEffects from '../hooks/useSoundEffects';
import useScoreCalculation from '../hooks/useScoreCalculation';
import { useCompleteLevel } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { GameType } from '../backend';
import CardGrid from '../components/CardGrid';
import GameControls from '../components/GameControls';
import GameScore from '../components/GameScore';
import { Timer, Layers } from 'lucide-react';

const LEVEL = 1;

export default function CardMatchingGame() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { cards, flippedIndices, gridSize, moves, isComplete, handleCardClick, reset } = useCardGame(LEVEL);
  const { elapsed, start, stop, reset: resetTimer } = useGameTimer();
  const { playSound } = useSoundEffects();
  const { calculateScore } = useScoreCalculation();
  const { mutate: completeLevel } = useCompleteLevel();
  const startTimeRef = useRef<bigint>(BigInt(0));
  const [showScore, setShowScore] = React.useState(false);
  const [finalScore, setFinalScore] = React.useState(0);

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
        const player = identity.getPrincipal().toString();
        completeLevel({
          player,
          gameType: GameType.cardMatching,
          level: BigInt(LEVEL),
          startTime: startTimeRef.current,
          correctAnswers: BigInt(gridSize / 2),
          totalQuestions: BigInt(gridSize / 2),
        });
      }
    }
  }, [isComplete]);

  const handleClick = (index: number) => {
    playSound('click');
    handleCardClick(index);
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
          <h1 className="text-2xl font-bold text-primary">Card Matching</h1>
          <p className="text-muted-foreground text-sm">Find all matching pairs!</p>
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
          <Layers size={16} />
          <span className="font-bold text-foreground">{moves} moves</span>
        </div>
        <div className="ml-auto text-sm text-muted-foreground">
          {cards.filter((c) => c.isMatched).length / 2} / {gridSize / 2} pairs
        </div>
      </div>

      <CardGrid
        cards={cards}
        flippedIndices={flippedIndices}
        gridSize={gridSize}
        onCardClick={handleClick}
      />

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
