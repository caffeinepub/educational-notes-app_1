import React from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Brain, Music, VolumeX, Volume2, BarChart2, Home, Download, LogIn, LogOut, User } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import useBackgroundMusic from '../hooks/useBackgroundMusic';
import { Slider } from '@/components/ui/slider';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { isPlaying, volume, togglePlay, setVolume } = useBackgroundMusic();
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      navigate({ to: '/' });
    } else {
      try {
        await login();
      } catch (error: any) {
        if (error?.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="sticky top-0 z-50 bg-surface border-b border-border shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src="/assets/generated/brain-logo.dim_128x128.png" alt="Brain" className="w-8 h-8" />
            <span className="font-bold text-lg text-primary hidden sm:block">Memory Increase</span>
          </Link>

          {/* Music Controls */}
          <div className="flex items-center gap-2 flex-1 max-w-xs">
            <button
              onClick={togglePlay}
              className="p-1.5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
              title={isPlaying ? 'Pause Music' : 'Play Music'}
            >
              {isPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
            <Music size={14} className="text-muted-foreground shrink-0" />
            <Slider
              value={[volume * 100]}
              onValueChange={([val]) => setVolume(val / 100)}
              min={0}
              max={100}
              step={1}
              className="w-20 sm:w-28"
            />
          </div>

          {/* Nav Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              to="/"
              className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
              title="Home"
            >
              <Home size={18} />
            </Link>
            <Link
              to="/progress"
              className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
              title="Progress"
            >
              <BarChart2 size={18} />
            </Link>
            <Link
              to="/install-guide"
              className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
              title="Install App"
            >
              <Download size={18} />
            </Link>
            <button
              onClick={handleAuth}
              disabled={isLoggingIn}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium disabled:opacity-50"
              title={isAuthenticated ? 'Logout' : 'Login'}
            >
              {isLoggingIn ? (
                <span className="animate-spin w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
              ) : isAuthenticated ? (
                <>
                  <LogOut size={14} />
                  <span className="hidden sm:block">Logout</span>
                </>
              ) : (
                <>
                  <LogIn size={14} />
                  <span className="hidden sm:block">Login</span>
                </>
              )}
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-surface border-t border-border py-6 mt-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Memory Increase — Brain Training Game
          </p>
          <p className="text-muted-foreground text-xs mt-1">
            Built with{' '}
            <span className="text-red-500">♥</span>{' '}
            using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
