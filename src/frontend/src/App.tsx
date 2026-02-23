import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import HomePage from './pages/HomePage';
import SubjectsPage from './pages/SubjectsPage';
import NotesPage from './pages/NotesPage';
import Layout from './components/Layout';

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const classRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/class/$classLevel',
  component: SubjectsPage,
});

const notesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/class/$classLevel/subject/$subject',
  component: NotesPage,
});

const routeTree = rootRoute.addChildren([indexRoute, classRoute, notesRoute]);

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
