import { useNavigate } from '@tanstack/react-router';
import { Brain, Grid3x3, Shuffle, Eye, Zap } from 'lucide-react';
import GameCard from '../components/GameCard';
import { useGetPlayerGameState } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

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
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4">
          <Brain className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Brain Puzzle Challenge
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Train your brain with multiple puzzle types. Each game automatically increases in difficulty as you progress,
          helping you improve memory, focus, and cognitive skills.
        </p>
      </div>

      {/* Game Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {games.map((game) => (
          <GameCard
            key={game.id}
            title={game.title}
            description={game.description}
            icon={game.icon}
            color={game.color}
            currentLevel={game.currentLevel}
            onPlay={() => navigate({ to: game.path })}
          />
        ))}
      </div>

      {/* Benefits Section */}
      <div className="mt-16 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Why Play Brain Puzzles?</h2>
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
