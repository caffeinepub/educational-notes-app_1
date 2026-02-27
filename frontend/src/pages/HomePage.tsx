import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Brain, Grid3X3, Layers, Shuffle, Zap, Type, AlignLeft, HelpCircle, LayoutGrid } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import GameCard from '../components/GameCard';

interface GameEntry {
  title: string;
  description: string;
  route: string;
  icon: LucideIcon;
  color: string;
}

const brainGames: GameEntry[] = [
  {
    title: 'Card Matching',
    description: 'Flip cards and find matching pairs. Train your visual memory!',
    route: '/card-matching',
    icon: Grid3X3,
    color: 'from-purple-500 to-indigo-600',
  },
  {
    title: 'Memory Test',
    description: 'Memorize objects and recall them. Boost your short-term memory!',
    route: '/memory-test',
    icon: Brain,
    color: 'from-pink-500 to-rose-600',
  },
  {
    title: 'Pattern Memory',
    description: 'Remember grid patterns and reproduce them. Sharpen spatial memory!',
    route: '/pattern-memory',
    icon: LayoutGrid,
    color: 'from-blue-500 to-cyan-600',
  },
  {
    title: 'Sequence Memory',
    description: 'Watch the sequence and repeat it. Improve working memory!',
    route: '/sequence-memory',
    icon: Layers,
    color: 'from-teal-500 to-green-600',
  },
  {
    title: 'Sliding Puzzle',
    description: 'Slide tiles to solve the puzzle. Enhance problem-solving skills!',
    route: '/sliding-puzzle',
    icon: Shuffle,
    color: 'from-orange-500 to-amber-600',
  },
  {
    title: 'Stroop Effect',
    description: 'Name the ink color, not the word. Train cognitive flexibility!',
    route: '/stroop-effect',
    icon: Zap,
    color: 'from-yellow-500 to-orange-600',
  },
];

const languageGames: GameEntry[] = [
  {
    title: 'Speed Typing',
    description: 'Type as fast as you can! Improve your typing speed and accuracy.',
    route: '/speed-typing',
    icon: Type,
    color: 'from-violet-500 to-purple-600',
  },
  {
    title: 'Word Scramble',
    description: 'Unscramble the letters to find the hidden word. Build vocabulary!',
    route: '/word-scramble',
    icon: Shuffle,
    color: 'from-emerald-500 to-teal-600',
  },
  {
    title: 'Missing Letter',
    description: 'Fill in the missing letters to complete the word. Spell correctly!',
    route: '/missing-letter',
    icon: HelpCircle,
    color: 'from-sky-500 to-blue-600',
  },
  {
    title: 'Fill in the Blanks',
    description: 'Complete the sentence with the right word. Improve comprehension!',
    route: '/fill-in-the-blanks',
    icon: AlignLeft,
    color: 'from-rose-500 to-pink-600',
  },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <img
            src="/assets/generated/brain-logo.dim_128x128.png"
            alt="Memory Increase"
            className="w-20 h-20 drop-shadow-lg"
          />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-primary mb-3">
          Memory Increase
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Train your brain with fun games. Improve memory, focus, and cognitive skills every day!
        </p>
      </div>

      {/* Section A: Brain Training Games */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 rounded-full bg-primary" />
          <h2 className="text-2xl font-bold text-foreground">🧠 Brain Training Games</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {brainGames.map((game) => (
            <GameCard
              key={game.route}
              title={game.title}
              description={game.description}
              icon={game.icon}
              gradientClass={game.color}
              onClick={() => navigate({ to: game.route })}
            />
          ))}
        </div>
      </section>

      <div className="border-t border-border my-8" />

      {/* Section B: English Fast Games */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 rounded-full bg-accent" />
          <h2 className="text-2xl font-bold text-foreground">⚡ English Fast Games</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">
          {languageGames.map((game) => (
            <GameCard
              key={game.route}
              title={game.title}
              description={game.description}
              icon={game.icon}
              gradientClass={game.color}
              onClick={() => navigate({ to: game.route })}
            />
          ))}
        </div>
      </section>

      {/* Install Guide Banner */}
      <div
        className="rounded-2xl bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 p-6 text-center cursor-pointer hover:from-primary/30 hover:to-accent/30 transition-all"
        onClick={() => navigate({ to: '/install-guide' })}
      >
        <p className="text-lg font-semibold text-primary mb-1">📱 Install as App</p>
        <p className="text-muted-foreground text-sm">
          Add Memory Increase to your home screen for the best experience — works like a real app!
        </p>
      </div>
    </div>
  );
}
