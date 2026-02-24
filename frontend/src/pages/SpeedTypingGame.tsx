import { useRef, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Play, RotateCcw } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import GameControls from '../components/GameControls';
import { useSpeedTyping, CharStatus } from '../hooks/useSpeedTyping';
import { useSoundEffects } from '../hooks/useSoundEffects';

function CharDisplay({ char, status }: { char: string; status: CharStatus }) {
  const colorClass =
    status === 'correct'
      ? 'text-green-500'
      : status === 'incorrect'
      ? 'text-red-500 bg-red-500/10'
      : 'text-foreground';
  return <span className={`${colorClass} transition-colors`}>{char}</span>;
}

export default function SpeedTypingGame() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { playSuccess, playError } = useSoundEffects();
  const {
    targetText,
    userInput,
    timeRemaining,
    isGameActive,
    isGameOver,
    wpm,
    accuracy,
    correctChars,
    incorrectChars,
    charStatuses,
    startGame,
    handleInput,
    resetGame,
  } = useSpeedTyping();

  const soundPlayedRef = useRef(false);

  useEffect(() => {
    if (isGameActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isGameActive]);

  // Play sound when game ends
  useEffect(() => {
    if (isGameOver && !soundPlayedRef.current) {
      soundPlayedRef.current = true;
      if (accuracy >= 80) {
        playSuccess();
      } else {
        playError();
      }
    }
    if (!isGameOver && !isGameActive) {
      soundPlayedRef.current = false;
    }
  }, [isGameOver, accuracy]);

  const handleReset = () => {
    soundPlayedRef.current = false;
    resetGame();
  };

  const timerColor =
    timeRemaining <= 10
      ? 'text-destructive'
      : timeRemaining <= 20
      ? 'text-yellow-500'
      : 'text-primary';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => navigate({ to: '/' })}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">⚡ Speed Typing</h1>
          <div className="w-20" />
        </div>

        {/* Timer & Stats Bar */}
        <Card className="mb-6">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-around text-center">
              <div>
                <p className="text-xs text-muted-foreground">Time Left</p>
                <p className={`text-3xl font-bold ${timerColor}`}>{timeRemaining}s</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">WPM</p>
                <p className="text-3xl font-bold text-primary">{wpm}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Accuracy</p>
                <p className="text-3xl font-bold text-accent">{accuracy}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Game Over Results */}
        {isGameOver && (
          <Card className="mb-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30">
            <CardContent className="pt-8 pb-8">
              <div className="text-center">
                <div className="text-5xl mb-4">{accuracy >= 80 ? '🏆' : '💪'}</div>
                <h2 className="text-2xl font-bold mb-6">Time's Up!</h2>
                <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto mb-6">
                  <div className="p-4 rounded-lg bg-card border border-border">
                    <p className="text-xs text-muted-foreground">WPM</p>
                    <p className="text-3xl font-bold text-primary">{wpm}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-card border border-border">
                    <p className="text-xs text-muted-foreground">Accuracy</p>
                    <p className="text-3xl font-bold text-accent">{accuracy}%</p>
                  </div>
                  <div className="p-4 rounded-lg bg-card border border-border">
                    <p className="text-xs text-muted-foreground">Correct</p>
                    <p className="text-3xl font-bold text-green-500">{correctChars}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-card border border-border">
                    <p className="text-xs text-muted-foreground">Errors</p>
                    <p className="text-3xl font-bold text-destructive">{incorrectChars}</p>
                  </div>
                </div>
                <Button onClick={startGame} size="lg" className="gap-2">
                  <RotateCcw className="h-5 w-5" />
                  Play Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Start Screen */}
        {!isGameActive && !isGameOver && (
          <Card className="mb-6">
            <CardContent className="pt-8 pb-8">
              <div className="text-center">
                <div className="text-5xl mb-4">⚡</div>
                <h2 className="text-xl font-bold mb-2">Ready to Type?</h2>
                <p className="text-muted-foreground mb-6">
                  Type as many words as you can in 60 seconds. Green = correct, Red = incorrect.
                </p>
                <Button onClick={startGame} size="lg" className="gap-2">
                  <Play className="h-5 w-5" />
                  Start Game
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Active Game */}
        {(isGameActive || isGameOver) && !isGameOver && (
          <>
            {/* Target Text Display */}
            <Card className="mb-4">
              <CardContent className="pt-6 pb-6">
                <div className="font-mono text-lg leading-relaxed tracking-wide break-all select-none">
                  {targetText.split('').map((char, i) => (
                    <CharDisplay key={i} char={char} status={charStatuses[i]} />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Typing Input */}
            <Card className="mb-6">
              <CardContent className="pt-4 pb-4">
                <textarea
                  ref={inputRef}
                  value={userInput}
                  onChange={e => handleInput(e.target.value)}
                  placeholder="Start typing here..."
                  className="w-full h-24 p-3 font-mono text-lg bg-background border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                  disabled={!isGameActive}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                />
              </CardContent>
            </Card>
          </>
        )}

        {/* Controls */}
        <GameControls onRestart={handleReset} />
      </div>
    </div>
  );
}
