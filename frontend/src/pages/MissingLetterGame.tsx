import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Eye, SkipForward } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import GameControls from '../components/GameControls';
import { useMissingLetter } from '../hooks/useMissingLetter';
import { useSoundEffects } from '../hooks/useSoundEffects';
import { Difficulty } from '../utils/wordDatabase';

export default function MissingLetterGame() {
  const navigate = useNavigate();
  const { playClick, playSuccess, playError } = useSoundEffects();
  const {
    difficulty,
    currentWord,
    wordDisplay,
    userInput,
    setUserInput,
    isCorrect,
    showAnswer,
    score,
    streak,
    handleSubmit,
    handleShowAnswer,
    nextWord,
    selectDifficulty,
  } = useMissingLetter();

  const handleCheckWithSound = () => {
    playClick();
    // Determine correctness before calling handleSubmit (which updates state)
    const correct = userInput.trim().toLowerCase() === currentWord.toLowerCase();
    if (correct) {
      playSuccess();
    } else {
      playError();
    }
    handleSubmit();
  };

  const handleShowAnswerWithSound = () => {
    playClick();
    handleShowAnswer();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleCheckWithSound();
  };

  const handleReset = () => {
    selectDifficulty(difficulty);
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
          <h1 className="text-2xl font-bold">🔤 Missing Letter</h1>
          <div className="w-20" />
        </div>

        {/* Difficulty Selector */}
        <Card className="mb-4">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">Difficulty:</span>
              {(['easy', 'hard'] as Difficulty[]).map(d => (
                <Button
                  key={d}
                  size="sm"
                  variant={difficulty === d ? 'default' : 'outline'}
                  onClick={() => selectDifficulty(d)}
                  className="capitalize"
                >
                  {d === 'easy' ? '🟢 Easy' : '🔴 Hard'}
                </Button>
              ))}
            </div>
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
              <div>
                <p className="text-xs text-muted-foreground">Mode</p>
                <p className="text-sm font-semibold capitalize">{difficulty}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Game Area */}
        <Card className="mb-6">
          <CardContent className="pt-8 pb-8">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">Fill in the missing letters:</p>

              {/* Word Display */}
              <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
                {wordDisplay.split('').map((char, i) => (
                  <div
                    key={i}
                    className={`w-10 h-12 flex items-center justify-center text-2xl font-bold border-b-2 ${
                      char === '_'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-foreground'
                    }`}
                  >
                    {char === '_' ? '?' : char}
                  </div>
                ))}
              </div>

              {/* Show Answer Reveal */}
              {showAnswer && (
                <div className="mb-4 p-3 rounded-lg bg-accent/10 border border-accent/30">
                  <p className="text-sm text-muted-foreground">The answer is:</p>
                  <p className="text-2xl font-bold text-accent">{currentWord}</p>
                </div>
              )}

              {/* Feedback */}
              {isCorrect === true && (
                <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                  <p className="text-green-600 dark:text-green-400 font-semibold">✅ Correct! Loading next word...</p>
                </div>
              )}
              {isCorrect === false && !showAnswer && (
                <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                  <p className="text-destructive font-semibold">❌ Wrong answer! Try again or see the answer.</p>
                </div>
              )}

              {/* Input */}
              <div className="flex gap-3 max-w-sm mx-auto">
                <Input
                  value={userInput}
                  onChange={e => setUserInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type the full word..."
                  className="text-center text-lg"
                  disabled={isCorrect === true}
                />
                <Button onClick={handleCheckWithSound} disabled={isCorrect === true || !userInput.trim()}>
                  Submit
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-center mt-4">
                {isCorrect === false && !showAnswer && (
                  <Button variant="outline" size="sm" onClick={handleShowAnswerWithSound}>
                    <Eye className="h-4 w-4 mr-2" />
                    Show Answer
                  </Button>
                )}
                {(showAnswer || isCorrect === false) && (
                  <Button variant="outline" size="sm" onClick={nextWord}>
                    <SkipForward className="h-4 w-4 mr-2" />
                    Next Word
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <GameControls onRestart={handleReset} />
      </div>
    </div>
  );
}
