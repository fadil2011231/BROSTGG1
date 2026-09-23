import { useState } from 'react';
import { Copy, MapPin, Compass, Sparkles, ExternalLink, ShieldAlert, Check } from 'lucide-react';
import { SeedItem } from '../types';

interface SeedVaultProps {
  onCopySeed: (seed: string, title: string) => void;
}

const SEED_DATA: SeedItem[] = [
  {
    id: 'seed-1',
    name: 'Sub-9 End Fortress Portal',
    category: 'speedrun',
    badge1: 'SPEEDRUN RECORD',
    badge2: '12-EYE PORTAL',
    description:
      'Spawns directly above a buried stronghold with 10 eyes already placed, adjacent to a Nether Fortress at -120, 64, 40.',
    seed: '3141592653589793',
    coordLabel: 'STRONGHOLD XYZ:',
    coordValue: 'X: 142 Y: -24 Z: 890',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAdoWKASCHDPhSy1xHrTfK9GNsSSFu-Alrj3h_oW8Fju41zCYr40HckA_ok3WAsE1qd0Btt66es12W-PSVP5z1b0G5FUTOWIfgLNTN6ZqF_RmHWEiAQ2tw2s6NNTX7uKPmcN4XsZNU-uZ46_dQ9yHqAbrdxP811iLUIlAiZvmE162JnOu8P0E8FoiebpZhB6PDSnG_wtw-uI5lyOxbDIEAiuJEPE3QK39flqWOpJu7GEN6gwrBhJ5xv',
    version: 'Java 1.21.4',
    biome: 'Plains / Deep Dark Stronghold',
    netherCoords: 'X: -120 Y: 64 Z: 40',
    features: ['10-Eye Portal Room', 'Nether Fortress Bridge', 'Lava Pool at Spawn'],
  },
  {
    id: 'seed-2',
    name: 'Cherry Ring Caldera & Village',
    category: 'survival',
    badge1: 'SURVIVAL OASIS',
    badge2: 'CHERRY CRATER',
    description:
      'Perfect hollow mountain ring encasing a massive emerald lake with a plains village suspended along the cliffs.',
    seed: '-8491029482019481',
    coordLabel: 'CRATER CENTER:',
    coordValue: 'X: 0 Y: 118 Z: 0',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCLWwxzUlkr7l3iJm3S2_El93Cd63uuZHDe5YcCh5HeBBaflezIx-IfOErkpVb57VQrVPtUhTaHq43Ga2m-UeoeJt5dMOSz007T5H45NxfFWZjcgxOqNuGQ59wa6u0Ma-Q5oh0ytvswSaE0EdgT2Yy8iB4sO9qnXJUJRuEWhpUYUveOqHA_qMBZ1aiyAGGlabTqrxrTT-rZAHqaa7tUSUcn-S42Ac-q0j3PDWJb_btuQGQv_GcoqDF-',
    version: 'Java & Bedrock 1.21.4',
    biome: 'Cherry Grove / Jagged Peaks',
    netherCoords: 'X: 12 Y: 72 Z: -35',
    features: ['Ring Mountain', 'Hanging Cliff Village', 'Huge Deep Lake'],
  },
  {
    id: 'seed-3',
    name: 'Surface Breach Copper Ruins',
    category: 'trial',
    badge1: '1.21 TRIAL CHAMBER',
    badge2: 'OMINOUS SPAWN',
    description:
      'Trial Chamber generated just 12 blocks below spawn point with Breeze spawners, 4 heavy cores, and accessible vault rooms.',
    seed: '9042918402941094',
    coordLabel: 'VAULT ENTRY:',
    coordValue: 'X: -48 Y: 52 Z: 18',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAW19b5Qs81kMUX9Dwyzoa2inDUOgMtKl9O5Mn0HiC600RZKbUQgpYlKhyiSmr_Zi9phsJzeGxK4U9kZTI2iHXgOJt0-mErSl7AJp9X4uv3jzIN3-mZdDY2i-04JMBsl5Ta-PoamMK_0zvi7ctSwNWcvEHmwTgO9CVxI0y8dGJQq_v-Q7kzYk4tQnX9rB-Eb-kHfQP0D47LaXm7xW1JhZVCeoOCtm2rWhtv1UqLd8_hdiNwVg3iTQqe',
    version: 'Java 1.21.4',
    biome: 'Badlands / Underground Copper Chamber',
    netherCoords: 'X: -14 Y: 60 Z: 8',
    features: ['4 Heavy Cores', 'Breeze Spawners', 'Ominous Vault Corridor'],
  },
  {
    id: 'seed-4',
    name: 'Triple Blacksmith Village',
    category: 'survival',
    badge1: 'SURVIVAL SPAWN',
    badge2: '3 BLACKSMITHS',
    description:
      'Spawn directly inside a massive plains village containing 3 blacksmiths and a fully exposed ruined portal.',
    seed: '1937393739',
    coordLabel: 'SPAWN VILLAGE:',
    coordValue: 'X: 0 Y: 70 Z: 0',
    imageUrl: '/images/seeds/triple-blacksmith.png',
    version: 'Java & Bedrock 1.21.4',
    biome: 'Plains / Meadow Border',
    netherCoords: 'X: 0 Y: 68 Z: 0',
    features: ['3 Blacksmith Chests', 'Exposed Ruined Portal', 'Direct Spawn Point', 'Lava Pool & Obsidian'],
  },
  {
    id: 'seed-5',
    name: 'Spawn Point Ancient City',
    category: 'trial',
    badge1: 'DEEP DARK',
    badge2: 'SPAWN CITY',
    description:
      'Dig straight down at the exact spawn block to drop directly onto the central portal frame of a massive Ancient City.',
    seed: '-8847293847',
    coordLabel: 'CITY PORTAL FRAME:',
    coordValue: 'X: 15 Y: -51 Z: 24',
    imageUrl: '/images/seeds/ancient-city.png',
    version: 'Java 1.21.4',
    biome: 'Deep Dark / Reinforced Deepslate Cavern',
    netherCoords: 'X: 2 Y: 64 Z: 3',
    features: ['Portal Frame Below Spawn', 'Silence Armor Trim', 'Sculk Catalysts', 'Swift Sneak Books'],
  },
  {
    id: 'seed-6',
    name: 'Instant Ocean Stronghold',
    category: 'speedrun',
    badge1: 'SPEEDRUN ISLAND',
    badge2: 'OCEAN STRONGHOLD',
    description:
      'Ocean spawn with a shipwreck, ocean monument, and an exposed underwater stronghold right next to the starting island.',
    seed: '44332211',
    coordLabel: 'OCEAN STRONGHOLD:',
    coordValue: 'X: -150 Y: 45 Z: 150',
    imageUrl: '/images/seeds/ocean-monument.png',
    version: 'Java 1.21.4',
    biome: 'Warm Ocean / Island Archipelago',
    netherCoords: 'X: -18 Y: 58 Z: 18',
    features: ['Exposed Water Stronghold', 'Starting Island Shipwreck', 'Adjacent Ocean Monument', 'Instant Nether Portal'],
  },
];

export default function SeedVault({ onCopySeed }: SeedVaultProps) {
  const [filter, setFilter] = useState<'all' | 'speedrun' | 'survival' | 'trial'>('all');
  const [selectedSeed, setSelectedSeed] = useState<SeedItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredSeeds =
    filter === 'all' ? SEED_DATA : SEED_DATA.filter((item) => item.category === filter);

  const handleCopy = (seedObj: SeedItem) => {
    onCopySeed(seedObj.seed, `Copied seed: ${seedObj.seed} (${seedObj.name})`);
    setCopiedId(seedObj.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyTpCommand = (coords: string) => {
    // Format: "X: 142 Y: -24 Z: 890" -> "/tp @p 142 -24 890"
    const parts = coords.match(/-?\d+/g);
    if (parts && parts.length >= 3) {
      const tpCmd = `/tp @p ${parts[0]} ${parts[1]} ${parts[2]}`;
      onCopySeed(tpCmd, `Copied teleport command: ${tpCmd}`);
    } else {
      onCopySeed(coords, `Copied coordinates: ${coords}`);
    }
  };

  return (
    <section className="relative mt-20" id="seeds-vault">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 bg-[#1d2022] text-emerald-400 text-[11px] font-mono tracking-widest uppercase border border-emerald-500/20">
              MODULE // 02
            </span>
            <span className="text-slate-400 text-[11px] font-mono uppercase tracking-wider">
              // WORLD GENERATION VAULT
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white tracking-tight">
            CURATED GOD SEEDS // 1.21.4
          </h2>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1 bg-[#1d2022] border border-cyan-500/20 p-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-xs font-mono uppercase transition-colors cursor-pointer ${
              filter === 'all'
                ? 'bg-[#323537] text-[#00f5d4] font-semibold border-b border-cyan-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Types
          </button>
          <button
            onClick={() => setFilter('speedrun')}
            className={`px-3 py-1 text-xs font-mono uppercase transition-colors cursor-pointer ${
              filter === 'speedrun'
                ? 'bg-[#323537] text-[#00f5d4] font-semibold border-b border-cyan-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Speedrun
          </button>
          <button
            onClick={() => setFilter('survival')}
            className={`px-3 py-1 text-xs font-mono uppercase transition-colors cursor-pointer ${
              filter === 'survival'
                ? 'bg-[#323537] text-[#00f5d4] font-semibold border-b border-cyan-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Survival Island
          </button>
          <button
            onClick={() => setFilter('trial')}
            className={`px-3 py-1 text-xs font-mono uppercase transition-colors cursor-pointer ${
              filter === 'trial'
                ? 'bg-[#323537] text-[#00f5d4] font-semibold border-b border-cyan-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Trial Chambers
          </button>
        </div>
      </div>

      {/* Seed Cards Mosaic Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSeeds.map((seed) => (
          <div
            key={seed.id}
            className="flex flex-col bg-[#1d2022] border border-cyan-500/20 shadow-xl overflow-hidden group hover:border-cyan-400/50 transition duration-300"
          >
            {/* Banner image with overlays */}
            <div className="relative h-44 bg-[#0c0f11] overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url('${seed.imageUrl}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1d2022] via-[#1d2022]/20 to-transparent" />

              <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-[#0c0f11]/90 text-emerald-400 text-[10px] font-mono uppercase border border-emerald-500/30">
                {seed.badge1}
              </span>
              <span className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-[#0c0f11]/90 text-[#00f5d4] text-[10px] font-mono uppercase border border-cyan-500/30">
                {seed.badge2}
              </span>
            </div>

            {/* Content section */}
            <div className="p-4 flex-1 flex flex-col justify-between gap-4">
              <div>
                <h3 className="text-lg font-heading font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {seed.name}
                </h3>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{seed.description}</p>
              </div>

              <div className="bg-[#191c1e] p-3 flex flex-col gap-1.5 font-mono text-xs border border-slate-800">
                <div className="flex items-center justify-between text-white">
                  <span className="text-slate-400">SEED NUMBER:</span>
                  <span className="text-[#00f5d4] font-bold select-all">{seed.seed}</span>
                </div>

                <div className="flex items-center justify-between text-white">
                  <span className="text-slate-400">{seed.coordLabel}</span>
                  <button
                    onClick={() => copyTpCommand(seed.coordValue)}
                    className="text-slate-200 hover:text-cyan-300 transition flex items-center gap-1 cursor-pointer"
                    title="Click to copy /tp command"
                  >
                    <MapPin className="w-3 h-3 text-cyan-400" />
                    <span>{seed.coordValue}</span>
                  </button>
                </div>

                <div className="pt-2 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleCopy(seed)}
                    className="w-full bg-[#272a2c] hover:bg-[#323537] text-cyan-300 py-1.5 px-2 text-xs font-mono uppercase transition-colors flex items-center justify-center gap-1 border border-slate-700 cursor-pointer"
                  >
                    {copiedId === seed.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Seed</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setSelectedSeed(seed)}
                    className="w-full bg-[#15191d] hover:bg-[#1f242a] text-slate-200 py-1.5 px-2 text-xs font-mono uppercase transition-colors flex items-center justify-center gap-1 border border-slate-700 cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Inspect</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Seed Details Inspector Modal */}
      {selectedSeed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#15191d] border border-cyan-500/40 max-w-lg w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-cyan-400" />
                <h4 className="text-lg font-heading font-bold text-white">{selectedSeed.name}</h4>
              </div>
              <button
                onClick={() => setSelectedSeed(null)}
                className="text-slate-400 hover:text-white text-lg font-mono px-2"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs text-slate-300">
              <div className="bg-[#0c0f11] p-3 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Seed:</span>
                <span className="text-cyan-300 font-bold select-all">{selectedSeed.seed}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#0c0f11] p-2.5 border border-slate-800">
                  <div className="text-[10px] text-slate-400">VERSION COMPATIBILITY</div>
                  <div className="text-emerald-400 font-semibold mt-0.5">{selectedSeed.version}</div>
                </div>
                <div className="bg-[#0c0f11] p-2.5 border border-slate-800">
                  <div className="text-[10px] text-slate-400">PRIMARY BIOME</div>
                  <div className="text-amber-400 font-semibold mt-0.5">{selectedSeed.biome}</div>
                </div>
              </div>

              <div className="bg-[#0c0f11] p-3 border border-slate-800">
                <div className="text-[10px] text-slate-400 mb-1">KEY COORDINATES:</div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Overworld Landmark:</span>
                    <span className="text-white">{selectedSeed.coordValue}</span>
                  </div>
                  {selectedSeed.netherCoords && (
                    <div className="flex justify-between">
                      <span>Nether Fortress:</span>
                      <span className="text-red-400">{selectedSeed.netherCoords}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-slate-400 mb-1.5">HIGHLIGHTED STRUCTURES:</div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSeed.features.map((feat, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-[#1d2022] text-cyan-300 border border-cyan-500/30 text-[11px]"
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-800 flex justify-end gap-3">
              <button
                onClick={() => copyTpCommand(selectedSeed.coordValue)}
                className="px-4 py-2 bg-[#272a2c] hover:bg-[#323537] text-white text-xs font-mono uppercase border border-slate-700 cursor-pointer"
              >
                Copy /tp Command
              </button>
              <button
                onClick={() => {
                  handleCopy(selectedSeed);
                  setSelectedSeed(null);
                }}
                className="px-4 py-2 bg-[#00f5d4] hover:bg-[#39f7df] text-slate-950 text-xs font-heading font-bold uppercase cursor-pointer"
              >
                Copy Seed &amp; Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
