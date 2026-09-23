import { useState } from 'react';
import { User, Compass, Palette, Zap, Youtube, MessageSquare, Menu, X } from 'lucide-react';

interface HeaderProps {
  onOpenDiscord: () => void;
  onOpenSubscribe: () => void;
}

export default function Header({ onOpenDiscord, onOpenSubscribe }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#070b14]/85 border-b border-cyan-500/20 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo / Channel Name */}
        <a href="#" className="flex items-center gap-3.5 group">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 p-0.5 shadow-glow-cyan flex items-center justify-center transform group-hover:scale-105 transition duration-300">
            <div className="w-full h-full bg-[#070b14] rounded-[10px] flex items-center justify-center">
              {/* Creeper Pixel Face / Sculk Core Icon */}
              <svg
                className="w-6 h-6 text-cyan-400 group-hover:text-emerald-400 transition"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <rect fill="#031926" height="20" rx="3" stroke="currentColor" strokeWidth="1.5" width="20" x="2" y="2" />
                <rect fill="currentColor" height="4" width="3" x="6" y="7" />
                <rect fill="currentColor" height="4" width="3" x="15" y="7" />
                <rect fill="currentColor" height="5" width="6" x="9" y="11" />
                <rect fill="currentColor" height="5" width="2" x="7" y="14" />
                <rect fill="currentColor" height="5" width="2" x="15" y="14" />
              </svg>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-lg tracking-wider text-white">MINECRAFT</span>
              <span className="text-[11px] px-2 py-0.5 rounded font-mono font-semibold bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                HUB
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono tracking-tight">Creator Toolkit &amp; YouTube Hub</p>
          </div>
        </a>

        {/* Desktop Nav Navigation */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          <button
            onClick={() => scrollToSection('skin-viewer')}
            className="px-3.5 py-2 rounded-lg text-slate-300 hover:text-cyan-400 hover:bg-cyan-950/30 transition flex items-center gap-1.5 cursor-pointer"
          >
            <User className="w-4 h-4" />
            <span>Skin &amp; Totem</span>
          </button>
          <button
            onClick={() => scrollToSection('seeds-vault')}
            className="px-3.5 py-2 rounded-lg text-slate-300 hover:text-emerald-400 hover:bg-emerald-950/30 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>Seed Vault</span>
          </button>
          <button
            onClick={() => scrollToSection('motd-color')}
            className="px-3.5 py-2 rounded-lg text-slate-300 hover:text-cyan-400 hover:bg-cyan-950/30 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Palette className="w-4 h-4" />
            <span>Chat &amp; MOTD</span>
          </button>
          <button
            onClick={() => scrollToSection('fps-boosters')}
            className="px-3.5 py-2 rounded-lg text-slate-300 hover:text-amber-400 hover:bg-amber-950/30 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Zap className="w-4 h-4" />
            <span>FPS Boost</span>
          </button>
        </nav>

        {/* CTA Buttons: YouTube & Discord */}
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="https://www.youtube.com/channel/UC-APEPouMRcuPvV_B-4W7fA?sub_confirmation=1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-red-600 hover:bg-red-500 shadow-md hover:shadow-red-600/30 transition transform hover:-translate-y-0.5 cursor-pointer"
            title="Subscribe on YouTube"
          >
            <Youtube className="w-4 h-4" />
            <span className="hidden sm:inline">Subscribe</span>
            <span className="bg-red-800/80 text-[10px] px-1.5 py-0.5 rounded font-mono">SUB</span>
          </a>

          <button
            onClick={onOpenDiscord}
            className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-cyan-200 bg-[#16233b] hover:bg-[#1f3152] border border-cyan-500/30 hover:border-cyan-400 transition shadow-glow-cyan transform hover:-translate-y-0.5 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            <span>Discord</span>
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drop */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 bg-[#070b14]/95 border-b border-cyan-500/20 space-y-1 text-sm font-medium">
          <button
            onClick={() => scrollToSection('skin-viewer')}
            className="w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:text-cyan-400 hover:bg-cyan-950/30 transition flex items-center gap-2"
          >
            <User className="w-4 h-4" /> Skin &amp; Totem
          </button>
          <button
            onClick={() => scrollToSection('seeds-vault')}
            className="w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:text-emerald-400 hover:bg-emerald-950/30 transition flex items-center gap-2"
          >
            <Compass className="w-4 h-4" /> Seed Vault
          </button>
          <button
            onClick={() => scrollToSection('motd-color')}
            className="w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:text-cyan-400 hover:bg-cyan-950/30 transition flex items-center gap-2"
          >
            <Palette className="w-4 h-4" /> Chat &amp; MOTD
          </button>
          <button
            onClick={() => scrollToSection('fps-boosters')}
            className="w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:text-amber-400 hover:bg-amber-950/30 transition flex items-center gap-2"
          >
            <Zap className="w-4 h-4" /> FPS Boost
          </button>
          <div className="pt-2">
            <a
              href="https://www.youtube.com/channel/UC-APEPouMRcuPvV_B-4W7fA?sub_confirmation=1"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 rounded-lg text-white bg-red-600 hover:bg-red-500 transition flex items-center justify-center gap-2 font-semibold text-xs"
            >
              <Youtube className="w-4 h-4" />
              <span>Subscribe to YouTube Channel</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}