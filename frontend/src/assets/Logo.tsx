export default function Logo() {
  return (
    <div className="flex items-center gap-2 cursor-pointer group hover:scale-105 transition-all duration-300 p-2 rounded-xl hover:shadow-accent-glow">
      <svg
        className="w-8 h-8 stroke-border group-hover:stroke-accent transition-colors duration-300 ease-in-out"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 19a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H6z" />
        <path d="M6 12h4" />
        <path d="M8 10v4" />

        <path d="M14 13.5l2-2 3 3m1-10v8m3-3l-3 3" />
      </svg>

      <div className="flex flex-col gap-0.5">
        <span className="text-2xl font-extrabold text-text-h tracking-tighter leading-none group-hover:text-accent transition-colors duration-300">
          Game
        </span>
        <span className="text-[10px] font-semibold text-text tracking-widest leading-none uppercase">
          Tracker
        </span>
      </div>
    </div>
  );
}
