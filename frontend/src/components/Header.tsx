import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "@tanstack/react-router";
import Logo from "../assets/Logo";
import SearchIcon from "../assets/search.svg";
import LoginButton from "./Login";
import LogoutButton from "./Logout";

export default function Header() {
  const { isAuthenticated, user } = useAuth0();

  const linkBase =
    "transition-all duration-200 cubic-bezier(0.4, 0, 0.2, 1) text-sm font-semibold py-2 px-4 rounded-[10px] border border-transparent";

  const activeStyles = {
    className: `${linkBase} text-[#a855f7] bg-[#a855f7]/[0.08] border-[#a855f7]/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]`,
  };

  const inactiveStyles = {
    className: `${linkBase} text-zinc-400 hover:text-[#9333ea] hover:bg-[#a855f7]/[0.15] hover:border-[#a855f7]/40`,
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-800/50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <Logo />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              activeProps={activeStyles}
              inactiveProps={inactiveStyles}
            >
              Home
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/library"
                  activeProps={activeStyles}
                  inactiveProps={inactiveStyles}
                >
                  Library
                </Link>
                <Link
                  to="/collection"
                  activeProps={activeStyles}
                  inactiveProps={inactiveStyles}
                >
                  Collections
                </Link>
              </>
            )}

            <Link
              to="/search"
              activeProps={activeStyles}
              inactiveProps={inactiveStyles}
            >
              Search
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/search"
            className="p-2.5 rounded-[10px] transition-all duration-200 hover:bg-[#a855f7]/10 group"
            activeProps={{ className: "bg-[#a855f7]/20 p-2.5 rounded-[10px]" }}
          >
            <img
              src={SearchIcon}
              alt="Search"
              className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity invert"
            />
          </Link>

          <div className="h-4 w-[1px] bg-zinc-800 mx-2" />

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link
                to="/profile"
                activeProps={{
                  className:
                    "ring-2 ring-[#a855f7] ring-offset-2 ring-offset-zinc-900 rounded-full transition-all scale-105",
                }}
                inactiveProps={{
                  className: "p-[2px] hover:scale-105 transition-transform",
                }}
              >
                <img
                  src={user?.picture}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full border border-zinc-700 object-cover"
                />
              </Link>
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
