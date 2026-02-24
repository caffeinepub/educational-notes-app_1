import { useNavigate } from '@tanstack/react-router';
import { Brain, Grid3x3, Shuffle, Eye, Zap, Download } from 'lucide-react';
import GameCard from '../components/GameCard';
import { useGetPlayerGameState } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '../components/ui/button';

export default function HomePage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal().toString() || 'guest';
  const { data: gameState } = useGetPlayerGameState(principal);

  const games = [
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

      {/* Game Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {games.map((game) => (
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

      {/* Benefits Section */}
      <div className="mt-16 max-w-4xl mx-auto">
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
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-semibold mb-2">Sharpen Skills</h3>
            <p className="text-sm text-muted-foreground">
              Develop problem-solving abilities and cognitive flexibility.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
