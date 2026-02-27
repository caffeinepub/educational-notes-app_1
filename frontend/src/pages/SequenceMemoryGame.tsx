import React, { useEffect } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import useSequenceMemory from '../hooks/useSequenceMemory';
import useGameTimer from '../hooks/useGameTimer';
import useSoundEffects from '../hooks/useSoundEffects';
import useScoreCalculation from '../hooks/useScoreCalculation';
import { useCompleteLevel } from '../hooks/useQueries';
import { GameType } from '../backend';
import SequenceItem from '../components/SequenceItem';
import GameControls from '../components/GameControls';
import GameScore from '../components/GameScore';
import { Timer } from 'lucide-react';

const LEVEL = 1;

export default function SequenceMemoryGame() {
  const { identity } = useInternetIdentity();
  const { sequence, phase, activeIndex, userInput, currentIndex, attempts, isComplete, items, handleItemClick, reset } = useSequenceMemory(LEVEL);
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
          gameType: GameType.sequenceMemory,
          level: BigInt(LEVEL),
          startTime: startTimeRef.current,
          correctAnswers: BigInt(sequence.length),
          totalQuestions: BigInt(sequence.length),
        });
      }
    }
  }, [isComplete]);

  const handleClick = (item: string) => {
    playSound('click');
    handleItemClick(item);
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
          <h1 className="text-2xl font-bold text-primary">Sequence Memory</h1>
          <p className="text-muted-foreground text-sm">Watch and repeat the sequence!</p>
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
            phase === 'display' ? 'bg-yellow-500/20 text-yellow-600' :
            phase === 'input' ? 'bg-blue-500/20 text-blue-600' :
            phase === 'won' ? 'bg-green-500/20 text-green-600' :
            'bg-red-500/20 text-red-600'
          }`}>
            {phase === 'display' ? '👁 Watch' : phase === 'input' ? '👆 Repeat' : phase === 'won' ? '✅ Won!' : '❌ Wrong'}
          </span>
        </div>
      </div>

      {/* Sequence display */}
      {phase === 'display' && (
        <div className="text-center mb-6">
          <p className="text-muted-foreground mb-4">Watch the sequence carefully...</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {sequence.map((item, i) => (
              <SequenceItem
                key={i}
                item={item}
                isActive={activeIndex === i}
                isSelected={false}
                isDisabled={true}
                onClick={() => {}}
              />
            ))}
          </div>
        </div>
      )}

      {/* Input phase */}
      {phase === 'input' && (
        <div className="text-center mb-6">
          <p className="text-muted-foreground mb-4">
            Repeat the sequence! ({currentIndex}/{sequence.length})
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {items.map((item, i) => (
              <SequenceItem
                key={i}
                item={item}
                isActive={false}
                isSelected={userInput.includes(item)}
                isDisabled={false}
                onClick={() => handleClick(item)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Lost phase */}
      {phase === 'lost' && (
        <div className="text-center py-8">
          <div className="text-5xl mb-4">❌</div>
          <h2 className="text-xl font-bold text-destructive mb-2">Wrong sequence!</h2>
          <p className="text-muted-foreground mb-6">The correct sequence was:</p>
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {sequence.map((item, i) => (
              <span key={i} className="text-3xl">{item}</span>
            ))}
          </div>
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
