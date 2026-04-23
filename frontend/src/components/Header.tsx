import { useAuth0 } from "@auth0/auth0-react";
import Logo from "../assets/Logo";
import LoginButton from "./Login";
import LogoutButton from "./Logout";

export default function Header() {
  const { isAuthenticated, user } = useAuth0();

  return (
    <header className="sticky top-0 z-50 w-full transition-all bg-zinc-900/90 backdrop-blur-md shadow-lg">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer">
          <a href="/">
            <Logo />
          </a>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <a
            href="/"
            className="text-white hover:text-purple-400 transition-colors"
          >
            Home
          </a>

          <span className="hover:text-purple-400 transition-colors cursor-pointer">
            Search
          </span>
          {isAuthenticated && (
            <>
              <a
                href="/collection"
                className="hover:text-purple-400 transition-colors"
              >
                Collection
              </a>
            </>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              {user?.picture && (
                <a href="/profile" className="block group">
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border-2 border-accent-border shadow-custom transition-all duration-300 ease-in-out hover:scale-110 hover:border-accent hover:shadow-accent-glow cursor-pointer"
                  />
                </a>
              )}
              <LogoutButton />
            </div>
          ) : (
            <LoginButton />
          )}
        </div>
      </div>
    </header>
  );
}
