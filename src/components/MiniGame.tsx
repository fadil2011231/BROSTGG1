import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Pickaxe, Gem, Sparkles, Zap, Award, Flame, RefreshCw, Trophy, ChevronRight } from 'lucide-react';

interface MiniGameProps {
  onNotify?: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

interface PickaxeTier {
  name: string;
  material: string;
  damage: number;
  cost: number | null; // null indicates maximum level
  color: string;
  borderCol: string;
  textColor: string;
  glowColor: string;
  accentBg: string;
  description: string;
}

const PICKAXE_TIERS: PickaxeTier[] = [
  {
    name: 'Wooden Pickaxe',
    material: 'Oak Wood',
    damage: 1,
    cost: 12,
    color: 'from-amber-800 to-amber-950',
    borderCol: 'border-amber-700/50',
    textColor: 'text-amber-300',
    glowColor: 'rgba(217,119,6,0.2)',
    accentBg: 'bg-amber-950/40',
    description: 'Basic splintered tool. Modest impact force.',
  },
  {
    name: 'Stone Pickaxe',
    material: 'Cobblestone',
    damage: 3,
    cost: 40,
    color: 'from-stone-600 to-stone-900',
    borderCol: 'border-stone-500/50',
    textColor: 'text-stone-300',
    glowColor: 'rgba(168,162,158,0.2)',
    accentBg: 'bg-stone-900/60',
    description: 'Chiseled surface stone. +200% shatter efficiency.',
  },
  {
    name: 'Iron Pickaxe',
    material: 'Refined Iron',
    damage: 8,
    cost: 120,
    color: 'from-slate-300 to-slate-600',
    borderCol: 'border-slate-400/50',
    textColor: 'text-slate-200',
    glowColor: 'rgba(226,232,240,0.25)',
    accentBg: 'bg-slate-800/60',
    description: 'Hardened iron tip. Cuts cleanly through deep rock.',
  },
  {
    name: 'Diamond Pickaxe',
    material: 'Raw Diamond',
    damage: 22,
    cost: 350,
    color: 'from-cyan-400 to-blue-600',
    borderCol: 'border-cyan-400/60',
    textColor: 'text-[#00f5d4]',
    glowColor: 'rgba(0,245,212,0.35)',
    accentBg: 'bg-cyan-950/60',
    description: 'Crystalline carbon edge. Slices deepslate like glass.',
  },
  {
    name: 'Netherite Pickaxe',
    material: 'Ancient Debris Alloy',
    damage: 60,
    cost: null,
    color: 'from-zinc-700 via-purple-900 to-slate-950',
    borderCol: 'border-purple-500/60',
    textColor: 'text-purple-300',
    glowColor: 'rgba(192,132,252,0.4)',
    accentBg: 'bg-purple-950/60',
    description: 'Nether forged god-tier tool. Obliterates bedrock seams.',
  },
];

interface DamageFloater {
  id: number;
  text: string;
  x: number;
  y: number;
  isReward?: boolean;
}

export default function MiniGame({ onNotify }: MiniGameProps) {
  // 1. Persistent State Management
  const [diamonds, setDiamonds] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('mc_miner_diamonds');
      return saved !== null ? Math.max(0, parseInt(saved, 10)) : 0;
    } catch {
      return 0;
    }
  });

  const [pickaxeLevel, setPickaxeLevel] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('mc_miner_pick_level');
      return saved !== null ? Math.min(PICKAXE_TIERS.length - 1, Math.max(0, parseInt(saved, 10))) : 0;
    } catch {
      return 0;
    }
  });

  const [maxHp, setMaxHp] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('mc_miner_max_hp');
      return saved !== null ? Math.max(15, parseInt(saved, 10)) : 15;
    } catch {
      return 15;
    }
  });

  const [blockHp, setBlockHp] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('mc_miner_block_hp');
      return saved !== null ? Math.max(1, parseInt(saved, 10)) : 15;
    } catch {
      return 15;
    }
  });

  const [blocksBroken, setBlocksBroken] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('mc_miner_broken_count');
      return saved !== null ? Math.max(0, parseInt(saved, 10)) : 0;
    } catch {
      return 0;
    }
  });

  // Visual interaction state
  const [isPressed, setIsPressed] = useState(false);
  const [floaters, setFloaters] = useState<DamageFloater[]>([]);
  const [shatterEffect, setShatterEffect] = useState(false);
  const blockRef = useRef<HTMLDivElement>(null);

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('mc_miner_diamonds', diamonds.toString());
      localStorage.setItem('mc_miner_pick_level', pickaxeLevel.toString());
      localStorage.setItem('mc_miner_max_hp', maxHp.toString());
      localStorage.setItem('mc_miner_block_hp', blockHp.toString());
      localStorage.setItem('mc_miner_broken_count', blocksBroken.toString());
    } catch {
      // LocalStorage unavailable
    }
  }, [diamonds, pickaxeLevel, maxHp, blockHp, blocksBroken]);

  const currentPickaxe = PICKAXE_TIERS[pickaxeLevel];
  const nextPickaxe = pickaxeLevel < PICKAXE_TIERS.length - 1 ? PICKAXE_TIERS[pickaxeLevel + 1] : null;
  const canAffordUpgrade = nextPickaxe !== null && nextPickaxe.cost !== null && diamonds >= nextPickaxe.cost;

  // Calculate HP percentage and crack stage (0 to 9)
  const hpPercentage = Math.max(0, Math.min(100, Math.round((blockHp / maxHp) * 100)));
  const crackStage = Math.min(9, Math.floor((1 - blockHp / maxHp) * 10));

  // Spawn floating damage text on click
  const spawnFloater = useCallback((text: string, x: number, y: number, isReward = false) => {
    const id = Date.now() + Math.random();
    setFloaters((prev) => [...prev.slice(-12), { id, text, x, y, isReward }]);
    setTimeout(() => {
      setFloaters((prev) => prev.filter((f) => f.id !== id));
    }, 750);
  }, []);

  // 2. Central Block Click Handler
  const handleMineBlock = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 90);

    // Calculate click coordinates relative to block
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const damageDealt = currentPickaxe.damage;
    const remainingHp = blockHp - damageDealt;

    spawnFloater(`-${damageDealt}`, clickX, clickY, false);

    // 3. Block Break Condition
    if (remainingHp <= 0) {
      // Reward random diamonds scaled by pickaxe tier
      const minReward = 2 + pickaxeLevel * 2;
      const maxReward = 5 + pickaxeLevel * 4;
      const reward = Math.floor(Math.random() * (maxReward - minReward + 1)) + minReward;

      const newDiamonds = diamonds + reward;
      setDiamonds(newDiamonds);

      const newBrokenCount = blocksBroken + 1;
      setBlocksBroken(newBrokenCount);

      // Trigger shatter visual
      setShatterEffect(true);
      setTimeout(() => setShatterEffect(false), 300);

      spawnFloater(`+${reward} 💎`, rect.width / 2, rect.height / 2 - 20, true);

      // Respawn block with 20% more max HP
      const newMaxHp = Math.max(20, Math.round(maxHp * 1.2));
      setMaxHp(newMaxHp);
      setBlockHp(newMaxHp);

      if (onNotify && (newBrokenCount % 5 === 0 || reward >= 15)) {
        onNotify(`Ore Fractured! Earned +${reward} Diamonds!`, 'success');
      }
    } else {
      setBlockHp(remainingHp);
    }
  };

  // 4. Upgrade Pickaxe Handler
  const handleUpgradePickaxe = () => {
    if (!nextPickaxe || nextPickaxe.cost === null) return;

    if (diamonds < nextPickaxe.cost) {
      if (onNotify) {
        onNotify(`Need ${nextPickaxe.cost - diamonds} more diamonds to forge ${nextPickaxe.name}!`, 'info');
      }
      return;
    }

    setDiamonds((prev) => prev - (nextPickaxe.cost as number));
    setPickaxeLevel((prev) => prev + 1);

    if (onNotify) {
      onNotify(`Forged ${nextPickaxe.name}! Mining power upgraded to ${nextPickaxe.damage} DMG!`, 'success');
    }
  };

  // Reset progress option
  const handleResetGame = () => {
    if (window.confirm('Reset Diamond Miner progress back to Wooden Pickaxe and 0 Diamonds?')) {
      setDiamonds(0);
      setPickaxeLevel(0);
      setMaxHp(15);
      setBlockHp(15);
      setBlocksBroken(0);
      if (onNotify) onNotify('Miner progress reset to default.', 'info');
    }
  };

  return (
    <section className="relative mt-20" id="diamond-miner">
      {/* ======================================================== */}
      {/* SECTION HEADER: MODULE // 05 & ARCADE CLICKER            */}
      {/* ======================================================== */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 bg-[#1d2022] text-[#00f5d4] text-[11px] font-mono tracking-widest uppercase border border-cyan-500/30">
              MODULE // 05
            </span>
            <span className="text-slate-400 text-[11px] font-mono uppercase tracking-wider flex items-center gap-1.5">
              <span>// ARCADE CLICKER</span>
              <Sparkles className="w-3 h-3 text-[#00f5d4]" />
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-black text-white tracking-tight flex items-center gap-3">
            <span>DIAMOND MINER IDLE</span>
            <span className="hidden sm:inline-block text-xs font-mono font-bold text-cyan-300 bg-cyan-950/80 px-2.5 py-1 rounded border border-cyan-500/30">
              v1.21 PROTOCOL
            </span>
          </h2>
        </div>
        <p className="text-sm text-slate-300 max-w-md font-sans">
          Click the core deepslate diamond vein to harvest precious gems. Upgrade your forge pickaxes to scale mining yield and shatter harder blocks.
        </p>
      </div>

      {/* ======================================================== */}
      {/* 2-COLUMN GRID LAYOUT                                     */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ======================================================== */}
        {/* LEFT COLUMN: MINING ARENA (Large Central Block & HP Bar) */}
        {/* ======================================================== */}
        <div className="lg:col-span-7 bg-[#1d2022] border border-cyan-500/20 p-6 shadow-xl flex flex-col justify-between relative overflow-hidden rounded-xl">
          {/* Background Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

          {/* Arena Top Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 relative z-10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00f5d4] animate-ping" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00f5d4]">
                ACTIVE VEIN: DEEPSLATE ORE
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span>CRACK STAGE:</span>
              <span className="px-1.5 py-0.5 rounded bg-[#0c0f11] text-cyan-300 border border-slate-800 font-bold">
                {crackStage}/9
              </span>
            </div>
          </div>

          {/* Center Stage: Interactive Mining Block */}
          <div className="relative my-8 flex flex-col items-center justify-center min-h-[300px] select-none">
            {/* Floating Damage & Reward Indicators */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
              {floaters.map((f) => (
                <div
                  key={f.id}
                  style={{ left: `${f.x}px`, top: `${f.y}px` }}
                  className={`absolute font-mono font-black text-sm pointer-events-none transition-all duration-700 ease-out transform -translate-x-1/2 -translate-y-6 ${
                    f.isReward
                      ? 'text-yellow-300 text-lg drop-shadow-[0_0_8px_rgba(253,224,71,0.8)] scale-125'
                      : 'text-cyan-300 drop-shadow-[0_0_6px_rgba(0,245,212,0.8)]'
                  }`}
                >
                  {f.text}
                </div>
              ))}
            </div>

            {/* Clickable Minecraft Diamond Ore Cube */}
            <div
              ref={blockRef}
              onClick={handleMineBlock}
              className={`relative cursor-pointer transition-transform duration-75 ease-out ${
                isPressed ? 'scale-90' : 'hover:scale-105 active:scale-95'
              } ${shatterEffect ? 'animate-pulse' : ''}`}
              title="Click rapidly to mine the Diamond Ore!"
            >
              {/* Outer Cyan Energy Ring */}
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 via-teal-400/20 to-blue-500/20 rounded-2xl blur-xl pointer-events-none" />

              {/* Voxel Ore Block Outer Shell */}
              <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-xl bg-gradient-to-b from-[#2d3238] via-[#1e2226] to-[#121517] border-4 border-[#3c444c] shadow-[0_20px_40px_rgba(0,0,0,0.8)] p-3 overflow-hidden flex flex-col justify-between">
                {/* Pixelated Deepslate Texture Grid Accent */}
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#00f5d4_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

                {/* Raw Diamond Crystals (Glowing Cyan Voxel Flecks) */}
                <div className="absolute top-4 left-6 w-7 h-7 bg-[#00f5d4] rounded-sm shadow-[0_0_12px_#00f5d4] border border-cyan-200 transform rotate-12" />
                <div className="absolute top-8 right-8 w-8 h-8 bg-[#00f5d4] rounded-sm shadow-[0_0_15px_#00f5d4] border border-cyan-200 transform -rotate-6" />
                <div className="absolute bottom-8 left-9 w-9 h-6 bg-[#38bdf8] rounded-sm shadow-[0_0_12px_#38bdf8] border border-cyan-100 transform rotate-45" />
                <div className="absolute bottom-6 right-7 w-7 h-7 bg-[#00f5d4] rounded-sm shadow-[0_0_14px_#00f5d4] border border-cyan-200 transform -rotate-12" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-cyan-300 rounded-sm shadow-[0_0_20px_#00f5d4] border border-white transform rotate-45 flex items-center justify-center">
                  <Gem className="w-5 h-5 text-slate-950 animate-pulse" />
                </div>

                {/* Sub-vein specks */}
                <div className="absolute top-16 left-16 w-3 h-3 bg-cyan-200 rounded-xs shadow-[0_0_6px_#00f5d4]" />
                <div className="absolute bottom-16 right-16 w-4 h-3 bg-cyan-300 rounded-xs shadow-[0_0_6px_#00f5d4]" />

                {/* Fracture Crack Overlay (Draws progressive cracks as HP lowers) */}
                {crackStage > 0 && (
                  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-85" viewBox="0 0 100 100">
                    {/* Stage 1-3 minor cracks */}
                    <path
                      d="M 50 15 L 48 35 L 35 48 L 20 52 M 52 35 L 65 42"
                      stroke="#000"
                      strokeWidth={crackStage >= 4 ? '2.5' : '1.5'}
                      fill="none"
                      strokeLinecap="round"
                    />
                    {/* Stage 4-6 deeper fractures */}
                    {crackStage >= 4 && (
                      <path
                        d="M 50 50 L 68 62 L 78 80 M 68 62 L 60 75"
                        stroke="#000"
                        strokeWidth="2.5"
                        fill="none"
                        strokeLinecap="round"
                      />
                    )}
                    {/* Stage 7-9 near-shattering fractures */}
                    {crackStage >= 7 && (
                      <path
                        d="M 15 25 L 35 35 L 50 50 L 52 75 L 45 92 M 35 35 L 20 80 M 50 50 L 85 45"
                        stroke="#000"
                        strokeWidth="3.5"
                        fill="none"
                        strokeLinecap="round"
                      />
                    )}
                  </svg>
                )}

                {/* Hover Click Prompt */}
                <div className="relative z-10 text-center mt-auto w-full">
                  <span className="inline-block px-2 py-0.5 bg-slate-950/80 text-[10px] font-mono tracking-widest text-cyan-300 rounded border border-cyan-500/30">
                    CLICK TO MINE
                  </span>
                </div>
              </div>
            </div>

            {/* Click Telemetry Tag */}
            <div className="mt-4 flex items-center gap-2 text-xs font-mono text-slate-400">
              <Pickaxe className="w-3.5 h-3.5 text-[#00f5d4]" />
              <span>STRIKE FORCE:</span>
              <span className="text-white font-bold">{currentPickaxe.damage} DMG / CLICK</span>
            </div>
          </div>

          {/* Arena Bottom: Block HP Gauge Progress Bar */}
          <div className="bg-[#0c0f11] p-4 border border-slate-800 rounded-lg relative z-10">
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>DURABILITY INTEGRITY</span>
              </span>
              <span className="font-bold text-white">
                <span className={hpPercentage < 25 ? 'text-red-400 animate-pulse' : 'text-[#00f5d4]'}>
                  {blockHp}
                </span>{' '}
                / {maxHp} HP ({hpPercentage}%)
              </span>
            </div>

            {/* Visual Health Bar */}
            <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-150 ease-out ${
                  hpPercentage > 50
                    ? 'bg-gradient-to-r from-teal-400 to-[#00f5d4] shadow-[0_0_10px_rgba(0,245,212,0.6)]'
                    : hpPercentage > 25
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-300 shadow-[0_0_10px_rgba(251,191,36,0.6)]'
                    : 'bg-gradient-to-r from-red-500 to-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.7)]'
                }`}
                style={{ width: `${hpPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: STATS & UPGRADES (Pickaxe Forge System)   */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Currency Vault & Statistics Well */}
          <div className="bg-[#1d2022] border border-cyan-500/20 p-5 shadow-xl rounded-xl">
            {/* Diamonds Currency Counter */}
            <div className="bg-[#0c0f11] border border-cyan-500/30 p-4 rounded-lg flex items-center justify-between relative overflow-hidden mb-4">
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-cyan-500/10 blur-2xl pointer-events-none" />

              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_15px_rgba(0,245,212,0.3)]">
                  <Gem className="w-6 h-6 text-[#00f5d4] animate-pulse" />
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                    DIAMOND VAULT
                  </div>
                  <div className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight flex items-center gap-1.5">
                    <span>{diamonds.toLocaleString()}</span>
                    <span className="text-sm font-mono text-cyan-400 font-normal">💎</span>
                  </div>
                </div>
              </div>

              {/* Reset Game button */}
              <button
                type="button"
                onClick={handleResetGame}
                title="Reset Game"
                className="text-slate-500 hover:text-slate-300 p-1.5 rounded hover:bg-slate-800 transition cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Stats Bento Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-[#0c0f11] p-3 border border-slate-800 rounded">
                <div className="text-slate-500 text-[10px] uppercase mb-1 flex items-center gap-1">
                  <Trophy className="w-3 h-3 text-amber-400" />
                  <span>BLOCKS SHATTERED</span>
                </div>
                <div className="text-lg font-bold text-white">{blocksBroken.toLocaleString()}</div>
              </div>

              <div className="bg-[#0c0f11] p-3 border border-slate-800 rounded">
                <div className="text-slate-500 text-[10px] uppercase mb-1 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-[#00f5d4]" />
                  <span>CLICK DAMAGE</span>
                </div>
                <div className="text-lg font-bold text-[#00f5d4]">+{currentPickaxe.damage} DMG</div>
              </div>
            </div>
          </div>

          {/* Pickaxe Forge Upgrade System */}
          <div className="bg-[#1d2022] border border-cyan-500/20 p-5 shadow-xl rounded-xl flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <Pickaxe className="w-4 h-4 text-[#00f5d4]" />
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    BLACKSMITH FORGE
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  TIER {pickaxeLevel + 1} OF {PICKAXE_TIERS.length}
                </span>
              </div>

              {/* Current Active Tool Status */}
              <div className={`p-4 rounded-lg border ${currentPickaxe.borderCol} ${currentPickaxe.accentBg} mb-4 relative overflow-hidden`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center border shadow-md"
                      style={{
                        backgroundColor: '#0c0f11',
                        borderColor: currentPickaxe.textColor,
                        boxShadow: `0 0 12px ${currentPickaxe.glowColor}`,
                      }}
                    >
                      <Pickaxe className="w-5 h-5" style={{ color: currentPickaxe.textColor }} />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono uppercase text-slate-400">EQUIPPED WEAPON</div>
                      <div className={`text-base font-heading font-bold ${currentPickaxe.textColor}`}>
                        {currentPickaxe.name}
                      </div>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 bg-[#0c0f11] text-[10px] font-mono font-bold rounded text-white border border-slate-700">
                    {currentPickaxe.damage} DMG
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-sans mt-2.5">{currentPickaxe.description}</p>
              </div>

              {/* Upgrade Next Tier Preview */}
              {nextPickaxe ? (
                <div className="bg-[#0c0f11] p-3.5 border border-slate-800 rounded-lg mb-4">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1.5">
                    <span className="flex items-center gap-1">
                      <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
                      <span>NEXT TIER UPGRADE:</span>
                    </span>
                    <span className="text-[#00f5d4] font-bold">+{nextPickaxe.damage} DMG</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="font-heading font-bold text-white text-sm">
                      {nextPickaxe.name}
                    </div>
                    <div className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1">
                      <span>COST:</span>
                      <span className="text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                        {nextPickaxe.cost} 💎
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-[#0c0f11] p-3.5 border border-purple-500/40 rounded-lg mb-4 text-center">
                  <span className="text-xs font-mono font-bold text-purple-300 flex items-center justify-center gap-1.5">
                    <Award className="w-4 h-4 text-purple-400" />
                    <span>GOD TIER FORGE REACHED: MAX POWER</span>
                  </span>
                </div>
              )}
            </div>

            {/* UPGRADE ACTION BUTTON */}
            <div>
              {nextPickaxe ? (
                <button
                  type="button"
                  onClick={handleUpgradePickaxe}
                  disabled={!canAffordUpgrade}
                  className={`w-full py-3.5 px-4 rounded-xl font-heading font-bold text-sm tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 border ${
                    canAffordUpgrade
                      ? 'bg-[#00f5d4] text-slate-950 border-cyan-300 shadow-glow-cyan hover:brightness-105 active:scale-98 cursor-pointer'
                      : 'bg-slate-800/80 text-slate-500 border-slate-700/60 cursor-not-allowed'
                  }`}
                >
                  <Pickaxe className={`w-4 h-4 ${canAffordUpgrade ? 'text-slate-950' : 'text-slate-500'}`} />
                  {canAffordUpgrade ? (
                    <span>FORGE {nextPickaxe.name.toUpperCase()} ({nextPickaxe.cost} 💎)</span>
                  ) : (
                    <span>NEED {(nextPickaxe.cost as number) - diamonds} MORE DIAMONDS</span>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="w-full py-3.5 px-4 rounded-xl font-heading font-bold text-sm text-purple-300 bg-purple-950/40 border border-purple-500/40 cursor-default flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>NETHERITE POWER MAXIMIZED</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
