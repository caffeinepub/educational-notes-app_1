import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Eye, SkipForward } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import GameControls from '../components/GameControls';
import useFillInTheBlanks from '../hooks/useFillInTheBlanks';
import useSoundEffects from '../hooks/useSoundEffects';

export default function FillInTheBlanksGame() {
  const navigate = useNavigate();
  const { playSound } = useSoundEffects();
  const {
    currentSentence,
    inputValue,
    setInputValue,
    score,
    streak,
    wrongAttemptCount,
    feedback,
    showAnswer,
    handleSubmit,
    handleShowAnswer,
  } = useFillInTheBlanks();

  const handleCheckWithSound = () => {
    playSound('click');
    const correct = inputValue.trim().toLowerCase() === currentSentence.answer.toLowerCase();
    handleSubmit();
    setTimeout(() => playSound(correct ? 'success' : 'error'), 50);
  };

  const handleShowAnswerWithSound = () => {
    playSound('click');
    handleShowAnswer();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleCheckWithSound();
  };

  // Split sentence around the blank
  const parts = currentSentence.text.split('___');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => navigate({ to: '/' })}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">✏️ Fill in the Blanks</h1>
          <div className="w-20" />
        </div>

        {/* Instructions */}
        <Card className="mb-4 bg-green-500/5 border-green-500/20">
          <CardContent className="pt-3 pb-3">
            <p className="text-center text-sm text-muted-foreground">
              Type the missing word to complete the sentence!
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
              <div>
                <p className="text-xs text-muted-foreground">Attempts</p>
                <p className="text-2xl font-bold">{wrongAttemptCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Game Area */}
        <Card className="mb-6">
          <CardContent className="pt-8 pb-8">
            <div className="text-center">
              {/* Sentence Display */}
              <div className="text-xl font-medium mb-8 leading-relaxed px-4">
                <span>{parts[0]}</span>
                <span className="inline-block mx-1 px-3 py-1 rounded-md bg-primary/10 border-b-2 border-primary text-primary font-bold min-w-[80px]">
                  {showAnswer ? currentSentence.answer : feedback === 'correct' ? inputValue : '___'}
                </span>
                <span>{parts[1] ?? ''}</span>
              </div>

              {/* Show Answer Reveal */}
              {showAnswer && (
                <div className="mb-4 p-3 rounded-lg bg-accent/10 border border-accent/30">
                  <p className="text-sm text-muted-foreground">The answer is:</p>
                  <p className="text-2xl font-bold text-accent">{currentSentence.answer}</p>
                </div>
              )}

              {/* Feedback */}
              {feedback === 'correct' && (
                <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                  <p className="text-green-600 dark:text-green-400 font-semibold">✅ Correct! Loading next sentence...</p>
                </div>
              )}
              {feedback === 'wrong' && !showAnswer && (
                <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                  <p className="text-destructive font-semibold">
                    ❌ Wrong! {wrongAttemptCount >= 2 ? 'You can reveal the answer.' : 'Try again!'}
                  </p>
                </div>
              )}
              {feedback === 'revealed' && (
                <div className="mb-4 p-3 rounded-lg bg-accent/10 border border-accent/30">
                  <p className="text-accent font-semibold">💡 Answer revealed. Next sentence loading...</p>
                </div>
              )}

              {/* Input */}
              <div className="flex gap-3 max-w-sm mx-auto">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type the missing word..."
                  className="text-center text-lg"
                  disabled={feedback === 'correct' || showAnswer}
                />
                <Button
                  onClick={handleCheckWithSound}
                  disabled={feedback === 'correct' || showAnswer || !inputValue.trim()}
                >
                  Submit
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-center mt-4">
                {feedback === 'wrong' && !showAnswer && wrongAttemptCount >= 2 && (
                  <Button variant="outline" size="sm" onClick={handleShowAnswerWithSound}>
                    <Eye className="h-4 w-4 mr-2" />
                    Show Answer
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <GameControls onRestart={() => setInputValue('')} />
      </div>
    </div>
  );
}
