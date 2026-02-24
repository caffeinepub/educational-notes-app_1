import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface GameCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  currentLevel: number;
  onPlay: () => void;
}

export default function GameCard({ title, description, icon: Icon, color, currentLevel, onPlay }: GameCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
      <div className={`h-2 bg-gradient-to-r ${color}`} />
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className={`p-3 rounded-lg bg-gradient-to-br ${color} text-white`}>
            <Icon className="h-6 w-6" />
          </div>
          <Badge variant="secondary">Level {currentLevel}</Badge>
        </div>
        <CardTitle className="mt-4">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={onPlay} className="w-full group-hover:scale-105 transition-transform">
          Play Now
        </Button>
      </CardContent>
    </Card>
  );
}
