import { useState, useRef } from 'react';
import { Download, Shield, RefreshCw, SlidersHorizontal, Eye, Sparkles, Upload, Check, Box } from 'lucide-react';
import InteractiveSkinViewer from './InteractiveSkinViewer';

interface SkinStudioProps {
  onNotify: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

const PRESET_USERS = [
  { label: '★ BrostGG', ign: 'BrostGG' },
  { label: 'Mumbo', ign: 'MumboJumbo' },
  { label: 'Grian', ign: 'Grian' },
  { label: 'Techno', ign: 'Technoblade' },
  { label: 'Dream', ign: 'Dream' },
  { label: 'Illumina', ign: 'IlluminaHD' },
];

export default function SkinStudio({ onNotify }: SkinStudioProps) {
  const [username, setUsername] = useState('BrostGG');
  const [currentIgn, setCurrentIgn] = useState('BrostGG');
  const [isLoading, setIsLoading] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [tiltAngle, setTiltAngle] = useState({ x: 0, y: 0 });
  const [uuid, setUuid] = useState('brost-0001-creator');
  const [customSkinDataUrl, setCustomSkinDataUrl] = useState<string | null>('/skins/brostgg.png');
  const [isDragOver, setIsDragOver] = useState(false);
  const [viewerMode, setViewerMode] = useState<'3d' | 'isometric'>('3d');

  // Pre-rendered creator assets for BrostGG
  const brostBody = '/skins/brostgg_body.png';
  const brostBust = '/skins/brostgg_bust.png';
  const brostHelm = '/skins/brostgg_helm.png';
  const brostTotem = '/skins/brostgg_totem.png';

  // Fallback images provided in mockup for general offline support
  const fallbackBody =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD1JyDwFyEDx55un6V4n7-aMZJjWXy5UuXLk0LjZqG7-N9goJ9TD88n9cB1PQu_SM3dbSzymODJ-CfzFjcKjDiJraEVKzE4yqrcCiD8pmOMUeGIEXENiRMGMEUBoBxik19fjaU4fANG9caF5_Du84ktiGIad7iX4DephGRdape47tcqrj5RcGn9jaQg1_AMi0sWbapsVAz345ktgop1uIhRYWCSPuTboLNV-P52e1rNCZZE0rsJWZde';
  const fallbackHelm =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAD0OT8QXYCJHLN_iaetjYx2eNWmTT-NgifrHp7-kg3SlKFmq772yEoc_cI6JqXyXcZ4oQhsy7TMq-xg6hymgXliZDCijj0dODEdx2Mqt47SYSXvswQS2MHBz7VNd8smJCeNDTj2NGFfJc-v8hojc9aValgcZzdQTB4q8-HwKJMpvTsMsLVwD9kOpvm4qbgMkEcUkjYfd5viuWbZ9AT_Iol2aFiOU2pqLh9rDshXNyBkGrKuiyodGaX';
  const fallbackBust =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDe9CG6cKm0pXYXeL3SepQAvQKLL_xKzQ6p9KCPIF4r_KFIEo3NoIWYDcOZv5PRbEjDb06duiBHcHm3FFiL6QGpa6DQwS_x6KvDyGjvdL4SAOFmO_lZXePT3_t7MZ13i7HSazSRZ1n62IDzlYx53Vv4nybuFuR0Dsf0B-zc4sd9pkBbml0itZ48srX81GcHK1LWR-pYjFKFcbkP8UbaybGgLpeRhv8985JrDa8PSD6ukfhAp7HRQi-n';
  const fallbackTotemFace =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAyvkzuA4w_j_w5qRk_1shYino8FSzvYHBkRSpJbK6ae1AQDA2hOaFrv2bh_h1DRCRZpobhk8ptNxZXVldvrr5gdOK4bSx8wy_juJvrdGqAC3xjcx_4ZaJbosUCSgNndRAMCnTLiRezBUZSFdgBBqP9ikHTm73XrGqzd--n3U_PzfdK2YzFx0_dnHf_ShEsKa5vrE7NMybjLCjI7ocl001E8PXOw8yYHH23AGOWq94tmjZs9fImxQqI';

  const [bodySrc, setBodySrc] = useState(brostBody);
  const [bustSrc, setBustSrc] = useState(brostBust);
  const [helmSrc, setHelmSrc] = useState(brostHelm);
  const [totemFaceSrc, setTotemFaceSrc] = useState(brostHelm);

  const stageRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compute UUID pseudo-hash from IGN
  const generateUuid = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = (hash << 5) - hash + name.charCodeAt(i);
      hash |= 0;
    }
    const hex1 = Math.abs(hash).toString(16).padStart(8, '0').slice(0, 8);
    const hex2 = Math.abs(hash * 31)
      .toString(16)
      .padStart(4, '0')
      .slice(0, 4);
    return `${hex1}-${hex2}`;
  };

  const fetchSkin = (nameToFetch: string) => {
    const cleanName = nameToFetch.trim();
    if (!cleanName) return;

    setIsLoading(true);
    setCurrentIgn(cleanName);

    // If searching for the user's custom skin BrostGG
    if (cleanName.toLowerCase() === 'brostgg') {
      setUuid('brost-0001-creator');
      setBodySrc(brostBody);
      setBustSrc(brostBust);
      setHelmSrc(brostHelm);
      setTotemFaceSrc(brostHelm);
      setCustomSkinDataUrl('/skins/brostgg.png');

      setTimeout(() => {
        setIsLoading(false);
        onNotify('Loaded creator skin for "BrostGG"!');
      }, 250);
      return;
    }

    setCustomSkinDataUrl(null);
    setUuid(generateUuid(cleanName));

    const ts = Date.now();
    const newBody = `https://minotar.net/armor/body/${encodeURIComponent(cleanName)}/240.png?t=${ts}`;
    const newBust = `https://minotar.net/bust/${encodeURIComponent(cleanName)}/180.png?t=${ts}`;
    const newHelm = `https://minotar.net/helm/${encodeURIComponent(cleanName)}/64.png?t=${ts}`;

    setBodySrc(newBody);
    setBustSrc(newBust);
    setHelmSrc(newHelm);
    setTotemFaceSrc(newHelm);

    setTimeout(() => {
      setIsLoading(false);
      onNotify(`Fetched 3D skin model for "${cleanName}"!`);
    }, 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSkin(username);
  };

  const handleSelectPreset = (ign: string) => {
    setUsername(ign);
    fetchSkin(ign);
  };

  // Handle uploaded skin PNG
  const handleFileUpload = (file: File) => {
    if (!file.type.includes('png') && !file.name.endsWith('.png')) {
      onNotify('Please upload a standard Minecraft .PNG skin file!', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        // Crop head from 64x64 skin (head front is 8,8 to 16,16)
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = false;
          // Draw base head front
          ctx.drawImage(img, 8, 8, 8, 8, 0, 0, 64, 64);
          // Draw overlay head front
          ctx.drawImage(img, 40, 8, 8, 8, 0, 0, 64, 64);
          const croppedHead = canvas.toDataURL('image/png');

          const safeName = file.name.replace(/\.[^/.]+$/, '').slice(0, 16);
          setCurrentIgn(safeName || 'Custom');
          setUsername(safeName || 'Custom');
          setUuid(generateUuid(file.name));
          setCustomSkinDataUrl(dataUrl);

          setHelmSrc(croppedHead);
          setTotemFaceSrc(croppedHead);
          setBustSrc(croppedHead);
          setBodySrc(dataUrl);

          onNotify(`Custom skin "${file.name}" loaded successfully!`);
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  // 3D tilt tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTiltAngle({
      x: -(y / rect.height) * 20,
      y: (x / rect.width) * 25,
    });
  };

  const handleMouseLeave = () => {
    setTiltAngle({ x: 0, y: 0 });
  };

  // Download raw skin PNG
  const handleDownloadSkin = () => {
    if (currentIgn.toLowerCase() === 'brostgg') {
      const link = document.createElement('a');
      link.href = '/skins/brostgg.png';
      link.download = 'BrostGG_skin.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      onNotify('Downloaded official BrostGG 64x64 skin PNG!');
      return;
    }

    if (customSkinDataUrl) {
      const link = document.createElement('a');
      link.href = customSkinDataUrl;
      link.download = `${currentIgn}_skin.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      onNotify(`Exported raw skin for ${currentIgn}!`);
      return;
    }

    const skinUrl = `https://minotar.net/skin/${encodeURIComponent(currentIgn)}`;
    const link = document.createElement('a');
    link.href = skinUrl;
    link.target = '_blank';
    link.download = `${currentIgn}_skin.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onNotify(`Opening raw 64x64 PNG for ${currentIgn}!`);
  };

  // Forge custom Totem of Undying
  const handleForgeTotem = () => {
    if (currentIgn.toLowerCase() === 'brostgg') {
      const link = document.createElement('a');
      link.href = brostTotem;
      link.download = 'totem_BrostGG.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      onNotify('Forged & exported custom Totem for BrostGG!');
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background Totem golden wings and emerald pendant
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(20, 28, 88, 72); // outer gold wings
    ctx.fillStyle = '#b45309';
    ctx.fillRect(36, 18, 56, 92); // inner amber torso
    ctx.fillStyle = '#10b981';
    ctx.fillRect(56, 92, 16, 16); // emerald core jewel
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(24, 32, 16, 20); // wing highlight L
    ctx.fillRect(88, 32, 16, 20); // wing highlight R

    // Stamp the player's head avatar in the center
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.drawImage(img, 32, 28, 64, 64);
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `totem_${currentIgn}.png`;
      a.click();
      onNotify(`Forged & exported custom Totem for ${currentIgn}!`);
    };
    img.onerror = () => {
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `totem_${currentIgn}.png`;
      a.click();
      onNotify(`Exported Totem template for ${currentIgn}!`);
    };
    img.src = helmSrc;
  };

  return (
    <section className="relative" id="skin-viewer">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 bg-[#1d2022] text-[#00f5d4] text-[11px] font-mono tracking-widest uppercase border border-cyan-500/20">
              MODULE // 01
            </span>
            <span className="text-slate-400 text-[11px] font-mono uppercase tracking-wider">
              // RENDERING PIPELINE
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white tracking-tight">
            SKIN &amp; TOTEM COMPILER
          </h2>
        </div>
        <p className="text-sm text-slate-300 max-w-md">
          Extract skin geometry, preview 3D layers, and stamp player avatars directly into custom totem textures.
          Supports official Java profiles and custom skin uploads.
        </p>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileUpload(e.target.files[0]);
          }
        }}
      />

      {/* Interactive Skin Workbench Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input & Configuration Dock */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFileUpload(e.dataTransfer.files[0]);
              }
            }}
            className={`bg-[#1d2022] border p-5 shadow-xl relative overflow-hidden transition-colors ${
              isDragOver ? 'border-cyan-400 bg-cyan-950/20' : 'border-cyan-500/20'
            }`}
          >
            <div className="absolute top-0 right-0 p-3">
              <SlidersHorizontal className="w-4 h-4 text-slate-500" />
            </div>
            <span className="text-[11px] font-mono font-semibold text-[#00f5d4] tracking-widest uppercase block mb-2">
              JAVA IGN SELECTOR
            </span>

            <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter player IGN (e.g. BrostGG)..."
                  className="w-full bg-[#0c0f11] text-white font-mono text-sm px-3.5 py-2.5 border border-slate-700 focus:border-cyan-400 focus:outline-none placeholder:text-slate-500 shadow-inner"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#3cb043] hover:bg-[#48c94f] active:translate-y-0.5 text-black font-heading font-bold text-xs uppercase tracking-wider py-2.5 px-3 shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Fetch Profile</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-[#272a2c] hover:bg-[#323537] text-cyan-300 font-heading font-bold text-xs uppercase tracking-wider py-2.5 px-3 border border-slate-700 hover:border-cyan-500/40 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Upload .PNG</span>
                </button>
              </div>
            </form>

            {/* Hot Presets */}
            <div className="mt-4 pt-3 border-t border-slate-800">
              <span className="text-[11px] font-mono text-slate-400 uppercase block mb-2">
                COMMUNITY PRESETS
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_USERS.map((preset) => (
                  <button
                    key={preset.ign}
                    onClick={() => handleSelectPreset(preset.ign)}
                    className={`px-2.5 py-1 text-xs font-mono transition-colors border cursor-pointer ${
                      currentIgn.toLowerCase() === preset.ign.toLowerCase()
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-500/50 font-bold'
                        : 'bg-[#15191d] text-slate-300 border-slate-700 hover:border-cyan-500/30 hover:text-cyan-400'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Metadata Telemetry */}
            <div className="mt-4 flex flex-col gap-1.5 text-xs font-mono text-slate-400">
              <div className="flex justify-between py-1 bg-[#0c0f11] px-2.5 border border-slate-800">
                <span>SYNC STATUS</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> OK (200)
                </span>
              </div>
              <div className="flex justify-between py-1 bg-[#0c0f11] px-2.5 border border-slate-800">
                <span>UUID DISPATCH</span>
                <span className="text-slate-200 font-mono truncate max-w-[150px]">{uuid}</span>
              </div>
              <div className="flex justify-between py-1 bg-[#0c0f11] px-2.5 border border-slate-800">
                <span>SKIN RESOLUTION</span>
                <span className="text-[#00f5d4]">64x64 CANVAS</span>
              </div>
            </div>
          </div>

          {/* Export Action Card */}
          <div className="bg-[#1d2022] border border-cyan-500/20 p-4 flex flex-col gap-2 shadow-xl">
            <button
              onClick={handleDownloadSkin}
              className="w-full bg-[#272a2c] hover:bg-[#323537] text-white font-mono text-xs py-2.5 px-3 flex items-center justify-between transition-colors border border-slate-700 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Download className="w-4 h-4 text-cyan-400" />
                <span>EXTRACT .PNG SKIN</span>
              </span>
              <span className="text-[10px] text-slate-400">RAW 64x64</span>
            </button>

            <button
              onClick={handleForgeTotem}
              className="w-full bg-[#00f5d4] hover:bg-[#38f8df] text-slate-950 font-heading font-bold text-xs uppercase py-2.5 px-3 flex items-center justify-between transition-colors shadow-glow-cyan active:translate-y-0.5 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-slate-950" />
                <span>FORGE CUSTOM TOTEM</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.5 bg-slate-950 text-cyan-300 font-mono font-bold">
                AUTO PNG
              </span>
            </button>
          </div>
        </div>

        {/* Live Renders Stage */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Main 3D Rig / Isometric Stage */}
          <div className="sm:col-span-2 flex flex-col gap-2">
            {/* View Mode Switcher Header */}
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-1.5 bg-[#14181b] p-1 border border-cyan-500/20 rounded">
                <button
                  type="button"
                  onClick={() => setViewerMode('3d')}
                  className={`px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider rounded transition cursor-pointer flex items-center gap-1.5 ${
                    viewerMode === '3d'
                      ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/40 shadow-glow-cyan'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Box className="w-3.5 h-3.5 text-cyan-400" />
                  <span>360° 3D Interactive</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewerMode('isometric')}
                  className={`px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider rounded transition cursor-pointer ${
                    viewerMode === 'isometric'
                      ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>Isometric 2.5D</span>
                </button>
              </div>

              <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                {viewerMode === '3d' ? 'Three.js · skinview3d' : 'Canvas Render'}
              </span>
            </div>

            {viewerMode === '3d' ? (
              <InteractiveSkinViewer
                username={currentIgn}
                skinUrl={customSkinDataUrl || (currentIgn.toLowerCase() === 'brostgg' ? '/skins/brostgg.png' : null)}
                height={450}
              />
            ) : (
              <div
                ref={stageRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="bg-[#1d2022] border border-cyan-500/20 p-5 flex flex-col items-center justify-between relative shadow-xl min-h-[380px] overflow-hidden rounded-xl"
              >
                <div className="w-full flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-slate-800/80">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-sm bg-[#00f5d4]"></span> 3D MODEL ISOMETRIC
                  </span>
                  <span className="px-2 py-0.5 bg-[#0c0f11] text-[#00f5d4] uppercase font-mono font-semibold border border-cyan-500/30">
                    {currentIgn}
                  </span>
                </div>

                {/* Avatar display with interactive tilt */}
                <div className="relative my-auto flex items-center justify-center p-4">
                  <div className="absolute -inset-10 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
                  <img
                    src={bodySrc}
                    alt={`Minecraft 3D avatar skin for ${currentIgn}`}
                    className="relative z-10 max-h-64 sm:max-h-72 w-auto drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] image-rendering-pixelated transition-transform duration-150"
                    style={{
                      transform: `perspective(800px) rotateX(${tiltAngle.x}deg) rotateY(${tiltAngle.y}deg)`,
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = fallbackBody;
                    }}
                  />
                </div>

                {/* Overlay & Layer toggle */}
                <div className="w-full bg-[#0c0f11] p-2.5 flex items-center justify-between text-xs font-mono border border-slate-800">
                  <button
                    onClick={() => setShowOverlay(!showOverlay)}
                    className="flex items-center gap-1.5 text-slate-300 hover:text-white transition cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    <span>ARMOR &amp; OVERLAY LAYER</span>
                  </button>
                  <span className="text-emerald-400 font-bold uppercase text-[11px] flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    RENDER ACTIVE
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Head Bust & Totem Output preview */}
          <div className="flex flex-col gap-4">
            {/* Bust Slot */}
            <div className="bg-[#1d2022] border border-cyan-500/20 p-4 flex flex-col items-center justify-between shadow-xl flex-1">
              <div className="w-full flex items-center justify-between text-xs font-mono text-slate-400">
                <span>HEAD BUST</span>
                <img
                  src={helmSrc}
                  alt={`${currentIgn} head`}
                  className="w-5 h-5 image-rendering-pixelated border border-slate-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = fallbackHelm;
                  }}
                />
              </div>

              <div className="my-3 relative">
                <img
                  src={bustSrc}
                  alt={`${currentIgn} isometric bust`}
                  className="w-24 sm:w-28 h-auto drop-shadow-lg image-rendering-pixelated transform hover:scale-110 transition-transform duration-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = fallbackBust;
                  }}
                />
              </div>

              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                3D Extruded Helm
              </span>
            </div>

            {/* Totem Slot */}
            <div className="bg-[#1d2022] border border-cyan-500/20 p-4 flex flex-col items-center justify-between shadow-xl flex-1 bg-gradient-to-t from-[#1d2022] to-[#272a2c]">
              <div className="w-full flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="text-amber-400 font-semibold">STAMPED TOTEM</span>
                <span className="text-[10px] text-amber-300 px-1.5 py-0.5 bg-[#0c0f11] border border-amber-500/30">
                  ITEM ID #450
                </span>
              </div>

              <div className="relative my-3 flex items-center justify-center">
                {/* Totem wings graphic with embedded head */}
                <div className="w-22 h-26 bg-[#0c0f11] relative flex items-center justify-center shadow-inner overflow-hidden border border-amber-500/30">
                  <div className="absolute inset-0 bg-amber-500/10"></div>
                  <div className="absolute w-18 h-14 bg-amber-600/30 top-2.5"></div>
                  <img
                    src={totemFaceSrc}
                    alt="Custom Totem face preview"
                    className="relative z-10 w-11 h-11 image-rendering-pixelated shadow-md drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = fallbackTotemFace;
                    }}
                  />
                </div>
              </div>

              <button
                onClick={handleForgeTotem}
                className="text-xs font-mono text-[#00f5d4] hover:underline uppercase tracking-wider flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3 h-3" />
                <span>Export .PNG</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
