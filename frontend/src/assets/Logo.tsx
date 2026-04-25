export default function Logo({ className = "group" }) {
  const gradientId = "logo-amethyst-grad-combo";
  const bgId = "logo-obsidian-bg";

  return (
    <div
      className={`flex items-center gap-3 cursor-pointer p-2 rounded-xl transition-all duration-500 ease-out ${className}`}
    >
      <div className="relative w-9 h-9 transform group-hover:-translate-y-0.5 transition-transform duration-500 ease-out">
        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-60 blur-xl transition-opacity duration-500 bg-[#a855f7]" />

        <svg
          className="relative w-full h-full drop-shadow-[0_0_10px_rgba(168,85,247,0.6)] brightness-110 contrast-110"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#9333ea" />
            </linearGradient>

            <linearGradient id={bgId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#52525b" />
              <stop offset="100%" stopColor="#09090b" />
            </linearGradient>
          </defs>

          <path
            d="M6 24C4.89543 24 4 23.1046 4 22V10C4 8.89543 4.89543 8 6 8H26C27.1046 8 28 8.89543 28 10V22C28 23.1046 27.1046 24 26 24H6Z"
            fill={`url(#${bgId})`}
            stroke="#a855f7"
            strokeOpacity="0.4"
            strokeWidth="1"
          />

          <rect
            x="7.5"
            y="14.5"
            width="5"
            height="3"
            rx="1"
            fill={`url(#${gradientId})`}
          />
          <rect
            x="8.5"
            y="13.5"
            width="3"
            height="5"
            rx="1"
            fill={`url(#${gradientId})`}
          />

          <circle cx="21" cy="13.5" r="1.5" fill={`url(#${gradientId})`} />
          <circle cx="19.5" cy="15.5" r="1.5" fill={`url(#${gradientId})`} />
          <circle cx="22.5" cy="15.5" r="1.5" fill={`url(#${gradientId})`} />
          <circle cx="21" cy="17.5" r="1.5" fill={`url(#${gradientId})`} />
        </svg>
      </div>

      <div className="flex flex-col gap-0">
        <span className="text-2xl font-black text-white tracking-tighter leading-tight transition-colors duration-500">
          Game
        </span>
        <span className="text-[10px] font-black text-[#c084fc] tracking-[0.2em] leading-tight uppercase group-hover:drop-shadow-[0_0_10px_rgba(192,132,252,0.7)] transition-all duration-500">
          Tracker
        </span>
      </div>
    </div>
  );
}
