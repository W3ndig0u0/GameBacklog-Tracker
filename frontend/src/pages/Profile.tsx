import { useAuth0 } from "@auth0/auth0-react";

export default function Profile() {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center text-zinc-400">
        Loading profile...
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;

  const avatar =
    user.picture ||
    `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='110' height='110' viewBox='0 0 110 110'%3E%3Ccircle cx='55' cy='55' r='55' fill='%2363b3ed'/%3E%3Cpath d='M55 50c8.28 0 15-6.72 15-15s-6.72-15-15-15-15 6.72-15 15 6.72 15 15 15zm0 7.5c-10 0-30 5.02-30 15v3.75c0 2.07 1.68 3.75 3.75 3.75h52.5c2.07 0 3.75-1.68 3.75-3.75V72.5c0-9.98-20-15-30-15z' fill='%23fff'/%3E%3C/svg%3E`;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative h-64 w-full overflow-hidden">
        <img
          src="/banner.jpg"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black" />
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-24 relative z-10">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
          <div className="relative">
            <img
              src={avatar}
              className="w-36 h-36 rounded-full object-cover border-4 border-black shadow-2xl"
            />
            <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-xl" />
          </div>

          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-zinc-400 text-sm">{user.email}</p>

            <div className="flex gap-2 mt-3 flex-wrap justify-center md:justify-start">
              <span className="px-3 py-1 text-xs rounded-full bg-purple-500/20 text-purple-300">
                Gamer
              </span>
              <span className="px-3 py-1 text-xs rounded-full bg-pink-500/20 text-pink-300">
                Collector
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
          {[
            { label: "Games", value: 0 },
            { label: "Completed", value: 0 },
            { label: "Wishlist", value: 0 },
            { label: "Hours", value: 0 },
          ].map((item) => (
            <div
              key={item.label}
              className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 backdrop-blur hover:border-purple-500/40 transition"
            >
              <p className="text-2xl font-semibold">{item.value}</p>
              <p className="text-xs text-zinc-400 mt-1">{item.label}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-10">
          <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <p className="text-zinc-400 text-sm">No activity yet.</p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800">
            <h2 className="text-lg font-semibold mb-4">Achievements</h2>
            <div className="flex gap-4">
              <div className="w-14 h-14 rounded-xl bg-purple-500/20 flex items-center justify-center text-xs text-purple-300">
                Soon
              </div>
              <div className="w-14 h-14 rounded-xl bg-blue-500/20 flex items-center justify-center text-xs text-blue-300">
                Soon
              </div>
              <div className="w-14 h-14 rounded-xl bg-yellow-500/20 flex items-center justify-center text-xs text-yellow-300">
                Soon
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
