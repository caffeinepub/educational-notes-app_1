import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Play } from 'lucide-react';

interface GameCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  gradientClass?: string;
  onClick: () => void;
  level?: number;
}

export default function GameCard({
  title,
  description,
  icon: Icon,
  gradientClass = 'from-primary to-accent',
  onClick,
  level,
}: GameCardProps) {
  return (
    <div
      className="group relative bg-surface rounded-2xl border border-border overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
      onClick={onClick}
    >
      {/* Gradient top bar */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${gradientClass}`} />

      <div className="p-5">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradientClass} flex items-center justify-center mb-4 shadow-md`}>
          <Icon size={24} className="text-white" />
        </div>

        {/* Title & Description */}
        <h3 className="font-bold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
          {description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          {level !== undefined ? (
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
              Level {level}
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">Ready to play</span>
          )}
          <button className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r ${gradientClass} text-white text-sm font-semibold shadow hover:opacity-90 transition-opacity`}>
            <Play size={12} />
            Play
          </button>
        </div>
      </div>
    </div>
  );
}
