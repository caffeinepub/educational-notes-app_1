import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

interface GameCardProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  iconImage?: string;
  color: string;
  currentLevel: number;
  onPlay: () => void;
}

export default function GameCard({ title, description, icon: Icon, iconImage, color, currentLevel, onPlay }: GameCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-lg bg-gradient-to-br ${color} flex-shrink-0`}>
            {Icon ? (
              <Icon className="h-8 w-8 text-white" />
            ) : iconImage ? (
              <img src={iconImage} alt={title} className="h-8 w-8" />
            ) : null}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{description}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Level {currentLevel}</span>
              <Button onClick={onPlay} size="sm">
                Play
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
