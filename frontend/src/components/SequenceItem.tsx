interface SequenceItemProps {
  value: string;
  isActive: boolean;
  isSelected: boolean;
  onClick: () => void;
  disabled: boolean;
}

export default function SequenceItem({ value, isActive, isSelected, onClick, disabled }: SequenceItemProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        aspect-square rounded-lg text-4xl font-bold transition-all duration-300
        ${isActive ? 'bg-gradient-to-br from-primary to-accent text-white scale-110 shadow-lg' : ''}
        ${isSelected ? 'bg-accent text-accent-foreground' : 'bg-card border-2 border-border'}
        ${!disabled && !isActive ? 'hover:scale-105 hover:shadow-md cursor-pointer' : ''}
        ${disabled ? 'cursor-not-allowed opacity-50' : ''}
      `}
    >
      {value}
    </button>
  );
}
