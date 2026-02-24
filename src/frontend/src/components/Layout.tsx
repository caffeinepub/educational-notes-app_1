import { Outlet, useNavigate } from '@tanstack/react-router';
import { Brain, Heart, LogIn, LogOut, Trophy } from 'lucide-react';
import { Button } from './ui/button';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function Layout() {
  const navigate = useNavigate();
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const isLoggedIn = loginStatus === 'success' && identity;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate({ to: '/' })}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="p-2 rounded-lg bg-primary/10">
                <img
                  src="/assets/generated/brain-logo.dim_128x128.png"
                  alt="Brain Puzzle"
                  className="h-8 w-8"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Brain Puzzle</h1>
                <p className="text-xs text-muted-foreground">Train Your Mind</p>
              </div>
            </button>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate({ to: '/progress' })}
              >
                <Trophy className="h-4 w-4 mr-2" />
                Progress
              </Button>
              {isLoggedIn ? (
                <Button variant="outline" size="sm" onClick={clear}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              ) : (
                <Button variant="default" size="sm" onClick={login}>
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border bg-card mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Brain Puzzle. All rights reserved</p>
            <p className="mt-2 flex items-center justify-center gap-1">
              Built with <Heart className="h-4 w-4 text-red-500 fill-red-500" /> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== 'undefined' ? window.location.hostname : 'brain-puzzle'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
