import { Sparkles, Compass, Server, Copy } from 'lucide-react';

interface HeroProps {
  onCopyIp: (ip: string) => void;
  onNavigate: (sectionId: string) => void;
}

export default function Hero({ onCopyIp, onNavigate }: HeroProps) {
  const SERVER_IP = 'mc.crafttools.gg';

  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Live Badge / Channel Status */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/40 text-xs font-mono text-emerald-400 mb-6 shadow-glow-green">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="tracking-wide">YOUTUBE EPISODE #142 LIVE · 1.21.4 COMPATIBLE</span>
        </div>

        {/* Main Heading with Neon Gradient */}
        <h1 className="font-heading font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white max-w-4xl mx-auto leading-[1.1] mb-6">
          MINECRAFT TOOLS &amp; <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(0,245,212,0.4)]">
            COMMUNITY HUB
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed mb-8">
          The ultimate gamer toolbox engineered for survival builders, speedrunners, and content creators.
          Inspect skins, export custom Totems of Undying, decode seeds, and customize server MOTDs.
        </p>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('skin-viewer')}
            className="px-6 py-3.5 rounded-xl font-heading font-bold text-sm sm:text-base text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:brightness-110 shadow-glow-cyan transition duration-200 transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-slate-950" />
            <span>Open Skin &amp; Totem Lab</span>
          </button>

          <button
            onClick={() => onNavigate('seeds-vault')}
            className="px-6 py-3.5 rounded-xl font-heading font-semibold text-sm sm:text-base text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 hover:border-cyan-500/40 transition duration-200 flex items-center gap-2 cursor-pointer"
          >
            <Compass className="w-5 h-5 text-cyan-400" />
            <span>Explore God Seeds</span>
          </button>

          <button
            onClick={() => onCopyIp(SERVER_IP)}
            className="px-5 py-3.5 rounded-xl font-mono text-xs sm:text-sm font-semibold text-cyan-300 bg-slate-900/90 border border-cyan-500/30 hover:border-cyan-400 transition flex items-center gap-2 group cursor-pointer"
            title="Click to copy server IP"
          >
            <Server className="w-4 h-4 text-emerald-400 group-hover:rotate-12 transition" />
            <span>
              SMP IP: <strong className="text-white">{SERVER_IP}</strong>
            </span>
            <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 transition" />
          </button>
        </div>

        {/* Quick Stat Counters */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-slate-800/60">
          <div className="p-3">
            <div className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-wide">140,000+</div>
            <div className="text-xs text-slate-400 font-mono mt-1">Community Members</div>
          </div>
          <div className="p-3">
            <div className="text-2xl sm:text-3xl font-heading font-bold text-cyan-400 tracking-wide">1.2M+</div>
            <div className="text-xs text-slate-400 font-mono mt-1">Skins &amp; Totems Rendered</div>
          </div>
          <div className="p-3">
            <div className="text-2xl sm:text-3xl font-heading font-bold text-emerald-400 tracking-wide">45+ FPS</div>
            <div className="text-xs text-slate-400 font-mono mt-1">Avg Modpack Boost</div>
          </div>
          <div className="p-3">
            <div className="text-2xl sm:text-3xl font-heading font-bold text-teal-300 tracking-wide">100% Free</div>
            <div className="text-xs text-slate-400 font-mono mt-1">Open Creator Utilities</div>
          </div>
        </div>
      </div>
    </section>
  );
}
