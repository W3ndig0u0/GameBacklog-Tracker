import { useAuth0 } from "@auth0/auth0-react";

export default function CallToActionSection() {
  const { loginWithRedirect } = useAuth0();
  const features = [
    {
      icon: "📚",
      title: "Discover",
      description:
        "Browse trending, popular, and top-rated games all in one place",
      hover:
        "hover:border-emerald-400/60 hover:bg-emerald-400/10 hover:shadow-[0_0_20px_rgba(52,211,153,0.15)]",
    },
    {
      icon: "💾",
      title: "Save",
      description:
        "Star your favorites and track your status: playing, backlog, or done",
      hover:
        "hover:border-blue-400/60 hover:bg-blue-400/10 hover:shadow-[0_0_20px_rgba(96,165,250,0.15)]",
    },
    {
      icon: "🎯",
      title: "Organize",
      description: "Create custom collections to group games however you want",
      hover:
        "hover:border-purple-400/60 hover:bg-purple-400/10 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]",
    },
    {
      icon: "📊",
      title: "Track",
      description:
        "Rate games, add personal notes, and visualize your progress",
      hover:
        "hover:border-yellow-400/60 hover:bg-yellow-400/10 hover:shadow-[0_0_20px_rgba(250,204,21,0.15)]",
    },
  ];

  const stats = [
    { value: "360K+", label: "Games Database", color: "text-purple-400" }, // if using IGDB scale
    {
      value: "Personalized",
      label: "Track Your Collection",
      color: "text-emerald-400",
    },
    { value: "100%", label: "Free Forever", color: "text-blue-400" },
  ];

  return (
    <section className="relative overflow-hidden rounded-4xl border border-white/10 bg-linear-to-br from-purple-600/15 via-zinc-900/50 to-emerald-600/15 p-8 md:p-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(168,85,247,0.15),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(34,197,94,0.1),transparent_50%)]" />

      <div className="relative space-y-12">
        <div className="mx-auto flex max-w-3xl flex-col items-center space-y-6 text-center">
          <div className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-zinc-300 backdrop-blur-sm">
            ✨ For Every Gamer
          </div>

          <h2 className="text-4xl font-black italic leading-tight tracking-tighter text-white uppercase md:text-5xl">
            Organize Your <br />
            <span className="bg-linear-to-r from-purple-400 via-emerald-400 to-purple-400 bg-clip-text text-transparent">
              Gaming Life
            </span>
          </h2>

          <p className="max-w-2xl text-base font-medium leading-relaxed text-zinc-300 md:text-lg">
            Track what you're playing, what's waiting on the backlog, and what
            you've conquered. Build a personalized library that actually means
            something.
          </p>

          <button
            onClick={() => loginWithRedirect()}
            className="text-white! mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-purple-600 to-purple-500 px-8 py-3.5 text-base font-bold shadow-lg transition duration-200 hover:from-purple-500 hover:to-purple-400 hover:shadow-purple-500/50"
          >
            🚀 Start for Free
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon, title, description, hover }) => (
            <div
              key={title}
              className={`group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 ${hover}`}
            >
              <div className="mb-3 text-3xl">{icon}</div>
              <h3 className="mb-2 text-sm font-bold tracking-widest text-white uppercase">
                {title}
              </h3>
              <p className="text-xs leading-relaxed text-zinc-400">
                {description}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-center gap-8 border-t border-white/10 pt-8 sm:flex-row sm:gap-0 sm:divide-x sm:divide-white/10">
          {stats.map(({ value, label, color }) => (
            <div key={label} className="text-center sm:px-8">
              <p className={`text-3xl font-black ${color}`}>{value}</p>
              <p className="mt-1 text-xs tracking-widest text-zinc-500 uppercase">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
