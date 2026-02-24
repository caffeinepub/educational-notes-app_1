import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, SkipForward } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import GameControls from '../components/GameControls';
import { useWordScramble } from '../hooks/useWordScramble';
import { useSoundEffects } from '../hooks/useSoundEffects';

export default function WordScrambleGame() {
  const navigate = useNavigate();
  const { playClick, playSuccess, playError } = useSoundEffects();
  const {
    originalWord,
    scrambledWord,
    userInput,
    setUserInput,
    isCorrect,
    wrongAttempt,
    score,
    streak,
    handleSubmit,
    nextWord,
  } = useWordScramble();

  const handleSubmitWithSound = () => {
    playClick();
    const correct = userInput.trim().toLowerCase() === originalWord.toLowerCase();
    if (correct) {
      playSuccess();
    } else {
      playError();
    }
    handleSubmit();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmitWithSound();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => navigate({ to: '/' })}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">🔀 Word Scramble</h1>
          <div className="w-20" />
        </div>

        {/* Instructions */}
        <Card className="mb-4 bg-blue-500/5 border-blue-500/20">
          <CardContent className="pt-3 pb-3">
            <p className="text-center text-sm text-muted-foreground">
              Unscramble the letters to form the correct word!
            </p>
          </CardContent>
        </Card>

        {/* Stats */}
        <Card className="mb-6">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-around text-center">
              <div>
                <p className="text-xs text-muted-foreground">Score</p>
                <p className="text-2xl font-bold text-primary">{score}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Streak</p>
                <p className="text-2xl font-bold text-accent">🔥 {streak}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Game Area */}
        <Card className="mb-6">
          <CardContent className="pt-8 pb-8">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">Unscramble this word:</p>

              {/* Scrambled Word Display */}
              <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
                {scrambledWord.split('').map((char, i) => (
                  <div
                    key={i}
                    className="w-12 h-14 flex items-center justify-center text-2xl font-bold rounded-lg bg-primary/10 border-2 border-primary/30 text-primary"
                  >
                    {char.toUpperCase()}
                  </div>
                ))}
              </div>

              {/* Feedback */}
              {isCorrect === true && (
                <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                  <p className="text-green-600 dark:text-green-400 font-semibold">✅ Correct! Loading next word...</p>
                </div>
              )}
              {wrongAttempt && isCorrect !== true && (
                <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                  <p className="text-destructive font-semibold">❌ Try Again! Rearrange the letters.</p>
                </div>
              )}

              {/* Input */}
              <div className="flex gap-3 max-w-sm mx-auto">
                <Input
                  value={userInput}
                  onChange={e => setUserInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type the word..."
                  className="text-center text-lg"
                  disabled={isCorrect === true}
                />
                <Button onClick={handleSubmitWithSound} disabled={isCorrect === true || !userInput.trim()}>
                  Submit
                </Button>
              </div>

              {/* Skip Button */}
              {wrongAttempt && isCorrect !== true && (
                <div className="mt-4">
                  <Button variant="outline" size="sm" onClick={nextWord}>
                    <SkipForward className="h-4 w-4 mr-2" />
                    Skip Word
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <GameControls onRestart={nextWord} />
      </div>
    </div>
  );
}
