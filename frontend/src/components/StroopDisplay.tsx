import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

interface StroopDisplayProps {
  word: string;
  wordColor: string;
  displayColor: string;
  onColorSelect: (color: string) => void;
}

const colorMap: Record<string, string> = {
  Red: '#ef4444',
  Blue: '#3b82f6',
  Green: '#22c55e',
  Yellow: '#eab308',
};

export default function StroopDisplay({ word, wordColor, displayColor, onColorSelect }: StroopDisplayProps) {
  const colors = ['Red', 'Blue', 'Green', 'Yellow'];

  return (
    <div className="space-y-8">
      {/* Word Display */}
      <Card className="bg-gradient-to-br from-background to-muted">
        <CardContent className="pt-12 pb-12">
          <div className="text-center">
            <h2
              className="text-7xl font-bold tracking-wider"
              style={{ color: colorMap[displayColor] }}
            >
              {word}
            </h2>
          </div>
        </CardContent>
      </Card>

      {/* Color Selection Buttons */}
      <div className="grid grid-cols-2 gap-4">
        {colors.map((color) => (
          <Button
            key={color}
            onClick={() => onColorSelect(color)}
            size="lg"
            className="h-20 text-xl font-bold transition-transform hover:scale-105 active:scale-95"
            style={{
              backgroundColor: colorMap[color],
              color: 'white',
            }}
          >
            {color}
          </Button>
        ))}
      </div>
    </div>
  );
}
