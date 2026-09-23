import { MessageSquare, Youtube } from 'lucide-react';

interface CommunityCalloutProps {
  onOpenDiscord: () => void;
  onOpenYoutube: () => void;
}

export default function CommunityCallout({ onOpenDiscord, onOpenYoutube }: CommunityCalloutProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 mb-16">
      <div className="glass-card rounded-2xl p-6 sm:p-10 relative overflow-hidden border border-cyan-500/30">
        <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div>
            <span className="px-3 py-1 text-xs font-mono text-[#00f5d4] bg-cyan-950/80 border border-cyan-500/40 uppercase tracking-wider">
              JOIN 140,000+ CREATORS &amp; CRAFTERS
            </span>
            <h2 className="text-2xl sm:text-4xl font-heading font-black text-white mt-3 mb-2">
              Have a God Seed or Custom Mod to Share?
            </h2>
            <p className="text-slate-300 text-sm max-w-xl">
              Drop into our active Discord community to showcase your mega survival bases, test upcoming beta tools, and vote on next week&apos;s YouTube video showcase!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3.5 justify-center">
            <button
              onClick={onOpenDiscord}
              className="px-6 py-3.5 rounded-xl font-heading font-bold text-sm text-slate-950 bg-[#00f5d4] hover:bg-[#39f7df] shadow-glow-cyan transition duration-200 flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
            >
              <MessageSquare className="w-4 h-4 text-slate-950" />
              <span>Join Creator Discord</span>
            </button>

            <a
              href="https://www.youtube.com/channel/UC-APEPouMRcuPvV_B-4W7fA?sub_confirmation=1"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl font-heading font-bold text-sm text-white bg-red-600 hover:bg-red-500 transition duration-200 flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5 shadow-md hover:shadow-red-600/30"
            >
              <Youtube className="w-4 h-4" />
              <span>Subscribe on YouTube</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
