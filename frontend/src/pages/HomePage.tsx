import { useNavigate } from '@tanstack/react-router';
import { Brain, Zap, BookOpen, Layers, Grid, Shuffle, AlignLeft, Type, Palette, Eye } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface GameEntry {
  title: string;
  description: string;
  icon: LucideIcon;
  path: '/' | '/card-matching' | '/memory-test' | '/pattern-memory' | '/sequence-memory' | '/sliding-puzzle' | '/stroop-effect' | '/speed-typing' | '/word-scramble' | '/missing-letter' | '/fill-in-the-blanks' | '/progress';
  color: string;
}

const sectionAGames: GameEntry[] = [
  {
    title: 'Card Matching',
    description: 'Cards ko flip karke matching pairs dhundho!',
    icon: Layers,
    path: '/card-matching',
    color: 'from-purple-500 to-indigo-500',
  },
  {
    title: 'Memory Test',
    description: 'Objects yaad karo aur recall karo!',
    icon: Brain,
    path: '/memory-test',
    color: 'from-pink-500 to-rose-500',
  },
  {
    title: 'Pattern Memory',
    description: 'Pattern yaad karo aur reproduce karo!',
    icon: Grid,
    path: '/pattern-memory',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Sequence Memory',
    description: 'Sequence dekho aur repeat karo!',
    icon: Zap,
    path: '/sequence-memory',
    color: 'from-amber-500 to-orange-500',
  },
  {
    title: 'Sliding Puzzle',
    description: 'Tiles ko slide karke sahi order mein lagao!',
    icon: Shuffle,
    path: '/sliding-puzzle',
    color: 'from-green-500 to-teal-500',
  },
  {
    title: 'Stroop Effect',
    description: 'Word ka rang batao, word nahi!',
    icon: Palette,
    path: '/stroop-effect',
    color: 'from-violet-500 to-purple-500',
  },
];

const sectionBGames: GameEntry[] = [
  {
    title: 'Missing Letter',
    description: 'Missing letters fill karo!',
    icon: Eye,
    path: '/missing-letter',
    color: 'from-sky-500 to-blue-500',
  },
  {
    title: 'Word Scramble',
    description: 'Scrambled word ko unscramble karo!',
    icon: Shuffle,
    path: '/word-scramble',
    color: 'from-emerald-500 to-green-500',
  },
  {
    title: 'Fill in the Blanks',
    description: 'Sentence mein blank fill karo!',
    icon: AlignLeft,
    path: '/fill-in-the-blanks',
    color: 'from-orange-500 to-amber-500',
  },
  {
    title: 'Speed Typing',
    description: 'Jaldi aur sahi type karo!',
    icon: Type,
    path: '/speed-typing',
    color: 'from-red-500 to-pink-500',
  },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <img src="/assets/generated/brain-logo.dim_128x128.png" alt="Brain" className="w-20 h-20" />
        </div>
        <h1 className="text-4xl font-extrabold text-foreground mb-3">NeuroBoost</h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Brain training games se apni memory aur speed improve karo!
        </p>
      </div>

      {/* Section A */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-primary rounded-full" />
          <h2 className="text-xl font-bold text-foreground">🧠 Brain Training Games</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sectionAGames.map((game) => {
            const Icon = game.icon;
            return (
              <button
                key={game.path}
                onClick={() => navigate({ to: game.path })}
                className="group bg-card border border-border rounded-2xl p-6 text-left hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${game.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-foreground mb-1">{game.title}</h3>
                <p className="text-sm text-muted-foreground">{game.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section B */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-accent rounded-full" />
          <h2 className="text-xl font-bold text-foreground">⚡ English Fast Games</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sectionBGames.map((game) => {
            const Icon = game.icon;
            return (
              <button
                key={game.path}
                onClick={() => navigate({ to: game.path })}
                className="group bg-card border border-border rounded-2xl p-6 text-left hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${game.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-foreground mb-1">{game.title}</h3>
                <p className="text-sm text-muted-foreground">{game.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Progress CTA */}
      <div className="text-center">
        <button
          onClick={() => navigate({ to: '/progress' })}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors"
        >
          <BookOpen className="w-5 h-5" />
          Apna Progress Dekho
        </button>
      </div>
    </div>
  );
}
