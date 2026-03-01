import { useEffect, useRef } from 'react';
import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { useActor } from './hooks/useActor';
import HomePage from './pages/HomePage';
import CardMatchingGame from './pages/CardMatchingGame';
import SlidingPuzzleGame from './pages/SlidingPuzzleGame';
import PatternMemoryGame from './pages/PatternMemoryGame';
import SequenceMemoryGame from './pages/SequenceMemoryGame';
import ProgressPage from './pages/ProgressPage';
import StroopEffectGame from './pages/StroopEffectGame';
import MemoryTestGame from './pages/MemoryTestGame';
import MissingLetterGame from './pages/MissingLetterGame';
import WordScrambleGame from './pages/WordScrambleGame';
import FillInTheBlanksGame from './pages/FillInTheBlanksGame';
import SpeedTypingGame from './pages/SpeedTypingGame';
import AdminPage from './pages/AdminPage';
import Layout from './components/Layout';

function VisitTracker() {
  const { actor, isFetching } = useActor();
  const visitRecorded = useRef(false);

  useEffect(() => {
    if (actor && !isFetching && !visitRecorded.current) {
      if (!sessionStorage.getItem('visit_recorded')) {
        actor.recordVisit().then(() => {
          sessionStorage.setItem('visit_recorded', '1');
        }).catch(() => {});
        visitRecorded.current = true;
      }
    }
  }, [actor, isFetching]);

  return null;
}

function LayoutWrapper() {
  return (
    <>
      <VisitTracker />
      <Layout>
        <Outlet />
      </Layout>
    </>
  );
}

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'layout',
  component: LayoutWrapper,
});

const homeRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/',
  component: HomePage,
});

const progressRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/progress',
  component: ProgressPage,
});

const cardMatchingRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/card-matching',
  component: CardMatchingGame,
});

const slidingPuzzleRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/sliding-puzzle',
  component: SlidingPuzzleGame,
});

const patternMemoryRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/pattern-memory',
  component: PatternMemoryGame,
});

const sequenceMemoryRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/sequence-memory',
  component: SequenceMemoryGame,
});

const stroopEffectRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/stroop-effect',
  component: StroopEffectGame,
});

const memoryTestRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/memory-test',
  component: MemoryTestGame,
});

const missingLetterRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/missing-letter',
  component: MissingLetterGame,
});

const wordScrambleRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/word-scramble',
  component: WordScrambleGame,
});

const fillInTheBlanksRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/fill-in-the-blanks',
  component: FillInTheBlanksGame,
});

const speedTypingRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/speed-typing',
  component: SpeedTypingGame,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminPage,
});

const routeTree = rootRoute.addChildren([
  layoutRoute.addChildren([
    homeRoute,
    progressRoute,
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
  ]),
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
