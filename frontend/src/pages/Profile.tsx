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
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-[#09090b]/40 to-[#09090b]" />
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
      </div>
    </div>
  );
}
