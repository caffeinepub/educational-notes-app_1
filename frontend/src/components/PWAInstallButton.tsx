import React from 'react';
import { Download } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export default function PWAInstallButton() {
  const { isInstallable, promptInstall } = usePWAInstall();

  if (!isInstallable) return null;

  return (
    <button
      onClick={promptInstall}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-accent-foreground hover:bg-accent/80 transition-colors text-sm font-medium animate-pulse-once"
      title="Install App"
    >
      <Download size={14} />
      <span className="hidden sm:block">Install</span>
    </button>
  );
}
