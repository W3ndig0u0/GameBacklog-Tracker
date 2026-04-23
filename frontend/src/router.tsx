import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from "@tanstack/react-router";
import Header from "./components/Header";
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
    <div className="p-10 text-text-h text-2xl font-bold">Search Page (WIP)</div>
  ),
});

const libraryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/library",
  component: () => (
    <div className="p-10 text-text-h text-2xl font-bold">My Library (WIP)</div>
  ),
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: () => <Profile />,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  searchRoute,
  libraryRoute,
  profileRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
