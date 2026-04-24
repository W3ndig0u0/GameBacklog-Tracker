import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from "@tanstack/react-router";
import Header from "./components/Header";
import Search from "./components/Search";
import { CollectionPage } from "./pages/CollectionPage";
import GamePage from "./pages/GamePage/index";
import HomePage from "./pages/HomePage";
import Profile from "./pages/Profile";

const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-bg text-text font-sans">
      <Header />
      <Outlet />
    </div>
  ),
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center text-[#a855f7]">
      <span className="animate-pulse text-xl font-semibold">
        404 - Page Not Found
      </span>
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
  component: () => <Search />,
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

const libraryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/library",
  component: () => <>TODO</>,
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
  libraryRoute,
  gameRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
