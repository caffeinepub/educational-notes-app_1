import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  RouterProvider,
  createRouter,
  createRootRoute,
  createRoute,
  Outlet,
} from '@tanstack/react-router';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CardMatchingGame from './pages/CardMatchingGame';
import MemoryTestGame from './pages/MemoryTestGame';
import PatternMemoryGame from './pages/PatternMemoryGame';
import SequenceMemoryGame from './pages/SequenceMemoryGame';
import SlidingPuzzleGame from './pages/SlidingPuzzleGame';
import StroopEffectGame from './pages/StroopEffectGame';
import SpeedTypingGame from './pages/SpeedTypingGame';
import WordScrambleGame from './pages/WordScrambleGame';
import MissingLetterGame from './pages/MissingLetterGame';
import FillInTheBlanksGame from './pages/FillInTheBlanksGame';
import ProgressPage from './pages/ProgressPage';
import InstallGuide from './pages/InstallGuide';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
    },
  },
});

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const cardMatchingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/card-matching',
  component: CardMatchingGame,
});

const memoryTestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/memory-test',
  component: MemoryTestGame,
});

const patternMemoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/pattern-memory',
  component: PatternMemoryGame,
});

const sequenceMemoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sequence-memory',
  component: SequenceMemoryGame,
});

const slidingPuzzleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sliding-puzzle',
  component: SlidingPuzzleGame,
});

const stroopEffectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/stroop-effect',
  component: StroopEffectGame,
});

const speedTypingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/speed-typing',
  component: SpeedTypingGame,
});

const wordScrambleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/word-scramble',
  component: WordScrambleGame,
});

const missingLetterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/missing-letter',
  component: MissingLetterGame,
});

const fillInTheBlanksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/fill-in-the-blanks',
  component: FillInTheBlanksGame,
});

const progressRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/progress',
  component: ProgressPage,
});

const installGuideRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/install-guide',
  component: InstallGuide,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  cardMatchingRoute,
  memoryTestRoute,
  patternMemoryRoute,
  sequenceMemoryRoute,
  slidingPuzzleRoute,
  stroopEffectRoute,
  speedTypingRoute,
  wordScrambleRoute,
  missingLetterRoute,
  fillInTheBlanksRoute,
  progressRoute,
  installGuideRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
