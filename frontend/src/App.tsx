import { createRouter, createRoute, createRootRoute, RouterProvider } from '@tanstack/react-router';
import HomePage from './pages/HomePage';
import CardMatchingGame from './pages/CardMatchingGame';
import SlidingPuzzleGame from './pages/SlidingPuzzleGame';
import PatternMemoryGame from './pages/PatternMemoryGame';
import SequenceMemoryGame from './pages/SequenceMemoryGame';
import StroopEffectGame from './pages/StroopEffectGame';
import MemoryTestGame from './pages/MemoryTestGame';
import MissingLetterGame from './pages/MissingLetterGame';
import WordScrambleGame from './pages/WordScrambleGame';
import FillInTheBlanksGame from './pages/FillInTheBlanksGame';
import SpeedTypingGame from './pages/SpeedTypingGame';
import ProgressPage from './pages/ProgressPage';
import InstallGuide from './pages/InstallGuide';
import Layout from './components/Layout';

const rootRoute = createRootRoute({
  component: Layout,
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

const slidingPuzzleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sliding-puzzle',
  component: SlidingPuzzleGame,
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

const stroopEffectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/stroop-effect',
  component: StroopEffectGame,
});

const memoryTestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/memory-test',
  component: MemoryTestGame,
});

const missingLetterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/missing-letter',
  component: MissingLetterGame,
});

const wordScrambleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/word-scramble',
  component: WordScrambleGame,
});

const fillInTheBlanksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/fill-in-the-blanks',
  component: FillInTheBlanksGame,
});

const speedTypingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/speed-typing',
  component: SpeedTypingGame,
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
  slidingPuzzleRoute,
  patternMemoryRoute,
  sequenceMemoryRoute,
  stroopEffectRoute,
  memoryTestRoute,
  missingLetterRoute,
  wordScrambleRoute,
  fillInTheBlanksRoute,
  speedTypingRoute,
  progressRoute,
  installGuideRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return <RouterProvider router={router} />;
}

export default App;
