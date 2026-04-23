import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from "@tanstack/react-router";
import Header from "./components/Header";
import { CollectionPage } from "./pages/CollectionPage";
import GamePage from "./pages/GamePage";
import HomePage from "./pages/HomePage";
import Profile from "./pages/Profile";

const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-bg text-text font-sans">
      <Header />
      <Outlet />
    </div>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const searchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/search",
  component: () => (
    <div className="p-10 text-text-h text-2xl font-bold">Search Page</div>
  ),
});

const collectionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/collection",
  component: () => <CollectionPage />,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: () => <Profile />,
});

const gameRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/game/$gameId",
  component: () => <GamePage />,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  searchRoute,
  collectionRoute,
  profileRoute,
  gameRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
