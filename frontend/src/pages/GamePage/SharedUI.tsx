import React from "react";

export const PrimaryBadge = ({ children }: { children: React.ReactNode }) => (
  <span className="text-xs px-3 py-1.5 rounded-md bg-indigo-500/15 text-indigo-100 font-bold uppercase tracking-wider shadow-sm">
    {children}
  </span>
);

export const GhostBadge = ({ children }: { children: React.ReactNode }) => (
  <span className="text-xs px-3 py-1.5 rounded-md bg-white/5 text-zinc-300 border border-white/10 font-medium tracking-wide">
    {children}
  </span>
);

export const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-2xl font-black text-zinc-100 mt-10 mb-4">{children}</h2>
);
