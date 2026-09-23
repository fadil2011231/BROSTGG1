import { useState } from 'react';
import { Terminal, Copy, Check, Gauge, Cpu, CheckCircle } from 'lucide-react';

interface FpsBoosterProps {
  onNotify: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export default function FpsBooster({ onNotify }: FpsBoosterProps) {
  const [ramSize, setRamSize] = useState<'4G' | '6G' | '8G' | '12G'>('6G');
  const [copied, setCopied] = useState(false);

  const baseAikarFlags =
    '-XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 -XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC -XX:+AlwaysPreTouch -XX:G1NewSizePercent=30 -XX:G1MaxNewSizePercent=40 -XX:G1ReservePercent=20 -XX:G1HeapWastePercent=5 -XX:G1MixedGCCountTarget=4 -XX:InitiatingHeapOccupancyPercent=15 -XX:G1MixedGCLiveThresholdPercent=90 -XX:G1RSetUpdatingPauseTimePercent=5 -XX:SurvivorRatio=32 -XX:+PerfDisableSharedMem -XX:MaxTenuringThreshold=1';

  const fullLauncherFlags = `-Xms${ramSize} -Xmx${ramSize} ${baseAikarFlags}`;

  const handleCopyFlags = () => {
    navigator.clipboard.writeText(fullLauncherFlags);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onNotify(`Copied Aikar's JVM flags optimized for ${ramSize} RAM!`);
  };

  return (
    <section className="relative mt-20" id="fps-boosters">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 bg-[#1d2022] text-[#ffb870] text-[11px] font-mono tracking-widest uppercase border border-amber-500/20">
              MODULE // 04
            </span>
            <span className="text-slate-400 text-[11px] font-mono uppercase tracking-wider">
              // PERFORMANCE BENCHMARK
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white tracking-tight">
            FPS SUITE &amp; JVM FLAGGING
          </h2>
        </div>
        <p className="text-sm text-slate-300 max-w-md">
          Stutter elimination protocols. Optimal garbage collector flags designed to stabilize tick rates on high-render client modpacks.
        </p>
      </div>

      {/* Optimization Stack Comparison Bento */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart Comparison Module */}
        <div className="lg:col-span-7 bg-[#1d2022] border border-cyan-500/20 p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono font-semibold text-[#00f5d4] uppercase tracking-widest">
                BENCHMARK: 32 CHUNKS (JAVA 21)
              </span>
              <span className="text-[11px] font-mono font-bold text-[#6cde6b] uppercase">
                AVG +145% FRAME TIME
              </span>
            </div>

            {/* Visual Bar Comparison */}
            <div className="space-y-4 my-3">
              {/* Vanilla 1.21.4 */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-300">VANILLA 1.21.4 ENGINE</span>
                  <span className="text-red-400 font-bold">68 FPS (Stutters)</span>
                </div>
                <div className="w-full h-3.5 bg-[#0c0f11] border border-slate-800">
                  <div className="h-full bg-red-500 transition-all duration-700" style={{ width: '28%' }}></div>
                </div>
              </div>

              {/* OptiFine Legacy */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-300">OPTIFINE HD (LEGACY)</span>
                  <span className="text-amber-400 font-bold">112 FPS</span>
                </div>
                <div className="w-full h-3.5 bg-[#0c0f11] border border-slate-800">
                  <div className="h-full bg-amber-500 transition-all duration-700" style={{ width: '48%' }}></div>
                </div>
              </div>

              {/* Sodium + Lithium */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-white font-heading font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#6cde6b] animate-ping"></span>
                    SODIUM + LITHIUM + FERRITE (RECOMMENDED)
                  </span>
                  <span className="text-[#6cde6b] font-bold text-sm">285 FPS</span>
                </div>
                <div className="w-full h-4.5 bg-[#0c0f11] border border-emerald-500/40">
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 to-[#6cde6b] relative shadow-glow-emerald"
                    style={{ width: '95%' }}
                  >
                    <span className="absolute inset-0 bg-white/20 animate-pulse"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2 text-center">
            <div className="bg-[#0c0f11] p-3 border border-slate-800">
              <div className="text-xl sm:text-2xl font-heading font-bold text-[#6cde6b]">0.1%</div>
              <div className="text-[10px] font-mono text-slate-400 mt-0.5">LOW DROPS FIXED</div>
            </div>
            <div className="bg-[#0c0f11] p-3 border border-slate-800">
              <div className="text-xl sm:text-2xl font-heading font-bold text-[#00f5d4]">3.8 GB</div>
              <div className="text-[10px] font-mono text-slate-400 mt-0.5">RAM CONSUMPTION</div>
            </div>
            <div className="bg-[#0c0f11] p-3 border border-slate-800">
              <div className="text-xl sm:text-2xl font-heading font-bold text-[#ffb870]">20.0</div>
              <div className="text-[10px] font-mono text-slate-400 mt-0.5">SOLID SERVER TPS</div>
            </div>
          </div>
        </div>

        {/* Copyable Aikar's JVM Terminal Flag Card */}
        <div className="lg:col-span-5 bg-[#1d2022] border border-cyan-500/20 p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono font-semibold text-[#00f5d4] uppercase tracking-widest">
                AIKAR'S CLIENT FLAGS
              </span>
              <span className="text-[11px] text-slate-400 font-mono">JAVA 17 / 21 G1GC</span>
            </div>

            <p className="text-xs text-slate-300 mb-3">
              Paste these launch arguments directly into CurseForge, Prism, Modrinth, or Minecraft Official Launcher settings.
            </p>

            {/* RAM selector */}
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-[11px] font-mono text-slate-400">RAM Target:</span>
              <div className="flex gap-1">
                {(['4G', '6G', '8G', '12G'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => setRamSize(size)}
                    className={`px-2 py-0.5 text-[11px] font-mono border transition cursor-pointer ${
                      ramSize === size
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-400 font-bold'
                        : 'bg-[#0c0f11] text-slate-400 border-slate-700 hover:text-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Terminal code display */}
            <div className="relative bg-[#0c0f11] p-3 font-mono text-[11px] text-[#00f5d4] border border-slate-800 shadow-inner leading-relaxed overflow-x-auto max-h-36 select-all">
              <code className="block whitespace-pre-wrap">{fullLauncherFlags}</code>
            </div>
          </div>

          <div className="pt-4 flex flex-col gap-2">
            <button
              onClick={handleCopyFlags}
              className="w-full bg-[#00f5d4] hover:bg-[#39f7df] text-slate-950 font-heading font-bold text-xs uppercase tracking-wider py-2.5 px-4 shadow-glow-cyan active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-slate-950" />
                  <span>Flags Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Terminal className="w-4 h-4 text-slate-950" />
                  <span>Copy Aikar's Launcher Flags</span>
                </>
              )}
            </button>

            <div className="text-center text-[11px] font-mono text-slate-400 pt-0.5">
              ALLOCATE 4GB - 6GB FOR CLIENT INSTANCES
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
