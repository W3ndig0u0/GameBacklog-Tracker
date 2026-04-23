import { useAuth0 } from "@auth0/auth0-react";

export default function Profile() {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#09090b] text-accent">
        <span className="animate-pulse font-semibold text-lg">
          Loading profile...
        </span>
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;
  let highResPicture = user.picture;

  if (highResPicture?.includes("googleusercontent.com")) {
    highResPicture = highResPicture.replace(/=s\d+-c/i, "=s600-c");
  } else if (highResPicture?.includes("gravatar.com")) {
    highResPicture = highResPicture.replace(/s=\d+/, "s=600");
  }
  const avatar = highResPicture;

  return (
    <div className="min-h-screen text-white font-sans pb-20 border-radius-10">
      <div className="relative h-48 md:h-64 w-full overflow-hidden rounded-2xl">
        <img
          src={avatar}
          alt="Profile Banner"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#09090b]/40 to-[#09090b]" />
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-16 relative z-10">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="relative group">
            <img
              src={avatar}
              alt={user.name}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-[#09090b] shadow-[0_0_20px_rgba(170,59,255,0.2)] "
            />
            <div className="absolute inset-0 rounded-full bg-accent blur-xl opacity-20 transition-all duration-300 group-hover:opacity-40" />
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-white mt-4 tracking-wide">
            {user.name}
          </h1>
          <p className="text-zinc-400 font-medium text-sm mt-1">{user.email}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-[#121217] p-6 md:p-8 rounded-2xl border border-white/5 shadow-lg">
          {[
            { label: "GAMES PLAYED", value: "142", progress: "w-[75%]" },
            { label: "COMPLETED", value: "89%", progress: "w-[89%]" },
            { label: "BACKLOG SIZE", value: "53", progress: "w-[40%]" },
            { label: "WISHLIST", value: "21", progress: "w-[20%]" },
          ].map((stat, index) => (
            <div key={index} className="flex flex-col justify-end">
              <p className="text-3xl md:text-4xl font-bold text-white">
                {stat.value}
              </p>
              <p className="text-xs font-semibold text-zinc-500 mt-1 mb-3 tracking-wider">
                {stat.label}
              </p>
              <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-accent ${stat.progress} rounded-full`}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-[#121217] p-6 md:p-8 rounded-2xl border border-white/5 shadow-lg">
          <h2 className="text-lg font-bold text-white mb-6 tracking-wide uppercase">
            Achievements Grid
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#1a1a24] rounded-xl p-5 border border-white/5 flex flex-col items-center justify-center text-center transition-transform hover:scale-105 cursor-pointer">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center text-3xl shadow-[0_0_15px_rgba(170,59,255,0.15)] mb-3">
                🏅
              </div>
              <p className="text-xs font-bold text-zinc-300 tracking-wider">
                MEDALS
              </p>
            </div>

            <div className="bg-[#1a1a24] rounded-xl p-5 border border-white/5 flex flex-col items-center justify-center text-center transition-transform hover:scale-105 cursor-pointer">
              <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center text-3xl shadow-[0_0_15px_rgba(234,179,8,0.15)] mb-3">
                ⭐
              </div>
              <p className="text-xs font-bold text-zinc-300 tracking-wider">
                AWARDS
              </p>
            </div>

            <div className="bg-[#1a1a24] rounded-xl p-5 border border-white/5 flex flex-col items-center justify-center text-center transition-transform hover:scale-105 cursor-pointer">
              <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center text-3xl shadow-[0_0_15px_rgba(59,130,246,0.15)] mb-3">
                👑
              </div>
              <p className="text-xs font-bold text-zinc-300 tracking-wider">
                PLATINUM CROWN
              </p>
            </div>

            <div className="relative rounded-xl overflow-hidden group cursor-pointer border border-white/5 transition-transform hover:scale-105">
              <img
                src="https://images.igdb.com/igdb/image/upload/t_cover_big/co1r7f.jpg"
                alt="100% Complete"
                className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/50 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4 w-full">
                <p className="text-xs text-accent font-bold mb-0.5">
                  100% Complete:
                </p>
                <p className="text-sm font-bold text-white truncate">
                  The Last of us
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
