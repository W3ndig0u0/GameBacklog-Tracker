import { SectionTitle } from "./SharedUI";

export const CommunityActivity = () => (
  <section className="mt-10">
    <SectionTitle>Community Activity</SectionTitle>
    <div className="space-y-4">
      <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center font-bold text-white">
            A
          </div>
          <span className="font-bold text-zinc-200">Alek</span>
          <span className="text-yellow-400 text-sm tracking-widest">★★★★☆</span>
          <span className="text-zinc-500 text-xs ml-auto">10 hours ago</span>
        </div>
        <p className="text-zinc-400">
          Incredible combat loop, but the story falls off a bit in the third
          act. Still highly recommend to anyone who likes fast-paced action.
        </p>
      </div>
      <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center font-bold text-white">
            A
          </div>
          <span className="font-bold text-zinc-200">Alek</span>
          <span className="text-yellow-400 text-sm tracking-widest">★★★★☆</span>
          <span className="text-zinc-500 text-xs ml-auto">10 hours ago</span>
        </div>
        <p className="text-zinc-400">
          Incredible combat loop, but the story falls off a bit in the third
          act. Still highly recommend to anyone who likes fast-paced action.
        </p>
      </div>
      <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center font-bold text-white">
            A
          </div>
          <span className="font-bold text-zinc-200">Alek</span>
          <span className="text-yellow-400 text-sm tracking-widest">★★★★☆</span>
          <span className="text-zinc-500 text-xs ml-auto">10 hours ago</span>
        </div>
        <p className="text-zinc-400">
          Incredible combat loop, but the story falls off a bit in the third
          act. Still highly recommend to anyone who likes fast-paced action.
        </p>
      </div>
    </div>
  </section>
);
