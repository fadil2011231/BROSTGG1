import { MessageSquare, Youtube, Users, Sparkles, Check, ExternalLink, X } from 'lucide-react';

interface CommunityModalProps {
  type: 'discord' | 'youtube' | null;
  onClose: () => void;
  onNotify: (msg: string) => void;
}

export default function CommunityModal({ type, onClose, onNotify }: CommunityModalProps) {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#111416] border border-cyan-500/40 max-w-md w-full p-6 shadow-2xl relative text-left">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {type === 'discord' ? (
          <div>
            <div className="w-12 h-12 rounded-xl bg-[#16233b] border border-cyan-500/40 flex items-center justify-center mb-4 text-[#00f5d4] shadow-glow-cyan">
              <MessageSquare className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-heading font-bold text-white mb-1">
              Join the Minecraft Hub Discord
            </h3>
            <p className="text-xs text-slate-300 font-mono mb-4">
              Connect with 140,000+ builders, speedrunners, and datapad coders.
            </p>

            <div className="space-y-2 font-mono text-xs mb-5">
              <div className="bg-[#0c0f11] p-2.5 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Online Crafters:
                </span>
                <span className="text-emerald-400 font-bold">14,892 Online</span>
              </div>
              <div className="bg-[#0c0f11] p-2.5 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Weekly Events:</span>
                <span className="text-[#00f5d4]">Speedrun Showcases &amp; Seed Hunts</span>
              </div>
            </div>

            <div className="flex gap-2.5">
              <button
                onClick={() => {
                  navigator.clipboard.writeText('https://discord.gg/minecraft-tools-hub');
                  onNotify('Discord invite link copied!');
                }}
                className="flex-1 bg-[#272a2c] hover:bg-[#323537] text-white py-2.5 px-3 text-xs font-mono uppercase border border-slate-700 cursor-pointer"
              >
                Copy Invite Link
              </button>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="flex-1 bg-[#00f5d4] hover:bg-[#39f7df] text-slate-950 font-heading font-bold text-xs uppercase py-2.5 px-3 flex items-center justify-center gap-1 shadow-glow-cyan"
              >
                <span>Launch Discord</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ) : (
          <div>
            <div className="w-12 h-12 rounded-xl bg-red-950/80 border border-red-500/40 flex items-center justify-center mb-4 text-red-400 shadow-md">
              <Youtube className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-heading font-bold text-white mb-1">
              Subscribe to YouTube Series
            </h3>
            <p className="text-xs text-slate-300 font-mono mb-4">
              Episode #142 is live! Weekly guides for 1.21.4 optimizations, God Seeds, and redstone farms.
            </p>

            <div className="space-y-2 font-mono text-xs mb-5">
              <div className="bg-[#0c0f11] p-2.5 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Subscribers:</span>
                <span className="text-red-400 font-bold">128,400+ Crafters</span>
              </div>
              <div className="bg-[#0c0f11] p-2.5 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Next Upload:</span>
                <span className="text-white">Friday 4:00 PM EST</span>
              </div>
            </div>

            <div className="flex gap-2.5">
              <a
                href="https://www.youtube.com/channel/UC-APEPouMRcuPvV_B-4W7fA?sub_confirmation=1"
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="w-full bg-red-600 hover:bg-red-500 text-white font-heading font-bold text-xs uppercase py-2.5 px-3 flex items-center justify-center gap-1.5 shadow-md"
              >
                <Youtube className="w-4 h-4" />
                <span>Subscribe on YouTube</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
