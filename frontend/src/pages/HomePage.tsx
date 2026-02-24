import { useNavigate } from '@tanstack/react-router';
import { Brain, Grid3x3, Shuffle, Eye, Zap, Download, Type, AlignLeft, LucideIcon } from 'lucide-react';
import GameCard from '../components/GameCard';
import { useGetPlayerGameState } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';

interface GameEntry {
  id: string;
  title: string;
  description: string;
  icon?: LucideIcon;
  iconImage?: string;
  color: string;
  path: string;
  currentLevel: number;
}

export default function HomePage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal().toString() || 'guest';
  const { data: gameState } = useGetPlayerGameState(principal);

  const sectionAGames: GameEntry[] = [
    {
      id: 'card-matching',
      title: 'Card Matching',
      description: 'Flip cards and find matching pairs. Improve your visual memory and concentration.',
      icon: Grid3x3,
      color: 'from-purple-500 to-pink-500',
      path: '/card-matching',
      currentLevel: 1,
    },
    {
      id: 'sliding-puzzle',
      title: 'Sliding Puzzle',
      description: 'Arrange numbered tiles in order. Enhance spatial reasoning and problem-solving skills.',
      icon: Shuffle,
      color: 'from-blue-500 to-cyan-500',
      path: '/sliding-puzzle',
      currentLevel: 1,
    },
    {
      id: 'pattern-memory',
      title: 'Pattern Memory',
      description: 'Memorize and recreate patterns. Boost pattern recognition and visual memory.',
      icon: Eye,
      color: 'from-green-500 to-emerald-500',
      path: '/pattern-memory',
      currentLevel: 1,
    },
    {
      id: 'sequence-memory',
      title: 'Sequence Memory',
      description: 'Remember and repeat sequences. Strengthen sequential memory and attention.',
      icon: Zap,
      color: 'from-orange-500 to-red-500',
      path: '/sequence-memory',
      currentLevel: 1,
    },
    {
      id: 'stroop-effect',
      title: 'Stroop Effect',
      description: 'Identify the color of the text, not what it says. Test your focus and reaction time.',
      iconImage: '/assets/generated/stroop-icon.dim_128x128.png',
      color: 'from-yellow-500 to-amber-500',
      path: '/stroop-effect',
      currentLevel: 1,
    },
    {
      id: 'memory-test',
      title: 'Memory Test',
      description: 'Remember objects and recall them from memory. Train your observation and recall skills.',
      iconImage: '/assets/generated/memory-test-icon.dim_128x128.png',
      color: 'from-teal-500 to-cyan-600',
      path: '/memory-test',
      currentLevel: 1,
    },
  ];

  const sectionBGames: GameEntry[] = [
    {
      id: 'missing-letter',
      title: 'Missing Letter',
      description: 'Fill in the missing letters to complete words. Easy & Hard difficulty with Animals, Fruits, and Daily Use words.',
      icon: Type,
      color: 'from-violet-500 to-purple-600',
      path: '/missing-letter',
      currentLevel: 1,
    },
    {
      id: 'word-scramble',
      title: 'Word Scramble',
      description: 'Unscramble the shuffled letters to form the correct word. Test your vocabulary and spelling!',
      icon: Shuffle,
      color: 'from-rose-500 to-pink-600',
      path: '/word-scramble',
      currentLevel: 1,
    },
    {
      id: 'fill-in-the-blanks',
      title: 'Fill in the Blanks',
      description: 'Complete sentences by filling in the missing word. Improve your English comprehension.',
      icon: AlignLeft,
      color: 'from-emerald-500 to-teal-600',
      path: '/fill-in-the-blanks',
      currentLevel: 1,
    },
    {
      id: 'speed-typing',
      title: 'Speed Typing',
      description: 'Type words as fast as you can in 60 seconds. Track your WPM and accuracy in real time!',
      icon: Zap,
      color: 'from-amber-500 to-orange-600',
      path: '/speed-typing',
      currentLevel: 1,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4">
          <Brain className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Memory Increase Challenge
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
          Train your brain with Memory Increase! Play multiple puzzle types that automatically increase in difficulty as you progress,
          helping you improve memory, focus, and cognitive skills.
        </p>

        {/* Install PWA Button */}
        <Button
          onClick={() => navigate({ to: '/install-guide' })}
          variant="outline"
          size="lg"
          className="gap-2 border-primary/50 hover:bg-primary/10"
        >
          <Download className="h-5 w-5" />
          How to Install App
        </Button>
      </div>

      {/* ── Section A ── */}
      <div className="max-w-5xl mx-auto mb-12">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 rounded-full bg-primary" />
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">Section A</span>
              <h2 className="text-2xl font-bold leading-tight">🧠 Brain Training Games</h2>
            </div>
          </div>
          <Separator className="flex-1" />
        </div>
        <p className="text-sm text-muted-foreground mb-6 ml-4">
          Classic cognitive games to sharpen memory, focus, and problem-solving skills.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sectionAGames.map((game) => (
            <GameCard
              key={game.id}
              title={game.title}
              description={game.description}
              icon={game.icon}
              iconImage={game.iconImage}
              color={game.color}
              currentLevel={game.currentLevel}
              onPlay={() => navigate({ to: game.path })}
            />
          ))}
        </div>
      </div>

      {/* ── Section B ── */}
      <div className="max-w-5xl mx-auto mb-12">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 rounded-full bg-accent" />
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-accent">Section B</span>
              <h2 className="text-2xl font-bold leading-tight">📚 English Fast Games</h2>
            </div>
          </div>
          <Separator className="flex-1" />
        </div>
        <p className="text-sm text-muted-foreground mb-6 ml-4">
          Boost your English vocabulary, spelling, and typing speed with these fun word games.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sectionBGames.map((game) => (
            <GameCard
              key={game.id}
              title={game.title}
              description={game.description}
              icon={game.icon}
              iconImage={game.iconImage}
              color={game.color}
              currentLevel={game.currentLevel}
              onPlay={() => navigate({ to: game.path })}
            />
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="mt-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Why Play Memory Increase?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 rounded-lg bg-card border border-border">
            <div className="text-3xl mb-3">🧠</div>
            <h3 className="font-semibold mb-2">Improve Memory</h3>
            <p className="text-sm text-muted-foreground">
              Regular practice enhances both short-term and long-term memory retention.
            </p>
          </div>
          <div className="text-center p-6 rounded-lg bg-card border border-border">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-semibold mb-2">Boost Focus</h3>
            <p className="text-sm text-muted-foreground">
              Train your attention span and concentration through engaging challenges.
            </p>
          </div>
          <div className="text-center p-6 rounded-lg bg-card border border-border">
            <div className="text-3xl mb-3">📖</div>
            <h3 className="font-semibold mb-2">Build Vocabulary</h3>
            <p className="text-sm text-muted-foreground">
              Expand your English vocabulary with word games covering animals, fruits, and daily use words.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
