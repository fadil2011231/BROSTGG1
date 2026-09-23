import { Github } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="border-t border-slate-800/80 bg-[#05080f] py-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-[#00f5d4] font-bold font-heading">
              MC
            </div>
            <div>
              <div className="text-white font-heading font-bold text-sm">
                Minecraft Tools &amp; Community Hub
              </div>
              <div className="text-slate-500 text-[11px]">
                Independent Gaming Creator Resource Hub · Not affiliated with Mojang Studios / Microsoft
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-mono text-slate-400">
            <button
              onClick={() => onNavigate('skin-viewer')}
              className="hover:text-[#00f5d4] transition cursor-pointer"
            >
              Skin Studio
            </button>
            <button
              onClick={() => onNavigate('seeds-vault')}
              className="hover:text-emerald-400 transition cursor-pointer"
            >
              Seed Vault
            </button>
            <button
              onClick={() => onNavigate('motd-color')}
              className="hover:text-[#00f5d4] transition cursor-pointer"
            >
              MOTD Styler
            </button>
            <button
              onClick={() => onNavigate('fps-boosters')}
              className="hover:text-amber-400 transition cursor-pointer"
            >
              FPS Configs
            </button>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition flex items-center gap-1"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub Pages</span>
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px] gap-4">
          <p>© 2025 Minecraft Tools &amp; Community Hub. Built with pure HTML5, Tailwind CSS, &amp; Vanilla JS.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Minotar API Fast Sync
            </span>
            <span className="font-mono">Zero Build Step Deployment</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
