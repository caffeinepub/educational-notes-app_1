interface SlidingTileProps {
  value: number;
  isEmpty: boolean;
  onClick: () => void;
}

export default function SlidingTile({ value, isEmpty, onClick }: SlidingTileProps) {
  if (isEmpty) {
    return <div className="aspect-square rounded-lg bg-muted/30" />;
  }

  return (
    <button
      onClick={onClick}
      className="aspect-square rounded-lg bg-gradient-to-br from-primary to-accent text-white font-bold text-2xl hover:scale-105 transition-transform shadow-md hover:shadow-lg"
    >
      {value}
    </button>
  );
}
