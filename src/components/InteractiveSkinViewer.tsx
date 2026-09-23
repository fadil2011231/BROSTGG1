import { useEffect, useRef, useState, useCallback } from 'react';
import {
  SkinViewer,
  IdleAnimation,
  WalkingAnimation,
  RunningAnimation,
  PlayerAnimation,
} from 'skinview3d';
import {
  Activity,
  Footprints,
  Flame,
  Layers,
  RotateCw,
  RefreshCw,
  Shield,
  ShieldAlert,
  Sparkles,
  Sliders,
  Eye,
  Pause,
} from 'lucide-react';

export interface InteractiveSkinViewerProps {
  username: string;
  skinUrl?: string | null;
  className?: string;
  height?: number | string;
  showControls?: boolean;
}

type AnimationType = 'idle' | 'walk' | 'run' | 'pause';

export default function InteractiveSkinViewer({
  username,
  skinUrl,
  className = '',
  height = 460,
  showControls = true,
}: InteractiveSkinViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewerRef = useRef<SkinViewer | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [hasCape, setHasCape] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [activeAnimation, setActiveAnimation] = useState<AnimationType>('idle');
  const [outerLayersVisible, setOuterLayersVisible] = useState(true);

  // Determine skin source URL
  const resolvedSkinUrl =
    skinUrl ||
    (username.toLowerCase() === 'brostgg'
      ? '/skins/brostgg.png'
      : `https://minotar.net/skin/${encodeURIComponent(username)}`);

  // Initialize SkinViewer instance on mount
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const initialWidth = container.clientWidth || 340;
    const canvasHeight =
      typeof height === 'number' ? Math.max(height - 130, 260) : 320;

    const viewer = new SkinViewer({
      canvas: canvasRef.current,
      width: initialWidth,
      height: canvasHeight,
      skin: resolvedSkinUrl,
      preserveDrawingBuffer: true,
    });

    viewerRef.current = viewer;

    // Configure OrbitControls (Smooth mouse/touch orbit & zoom)
    if (viewer.controls) {
      viewer.controls.enableRotate = true;
      viewer.controls.enableZoom = true;
      viewer.controls.enablePan = false;
      viewer.controls.maxDistance = 120;
      viewer.controls.minDistance = 22;
      viewer.controls.rotateSpeed = 0.85;
      viewer.controls.zoomSpeed = 0.9;
    }

    // Default gentle auto-rotate
    viewer.autoRotate = true;
    viewer.autoRotateSpeed = 0.85;

    // Start with Idle Animation
    const idleAnim = new IdleAnimation();
    idleAnim.speed = 0.75;
    viewer.animation = idleAnim;

    // Responsive container resize observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        if (width > 0) {
          const currentCanvasHeight =
            typeof height === 'number' ? Math.max(height - 130, 260) : 320;
          viewer.setSize(width, currentCanvasHeight);
        }
      }
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      viewer.dispose();
      viewerRef.current = null;
    };
  }, []); // Run once on mount

  // Sync skin and cape whenever username or resolvedSkinUrl updates
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    let isCancelled = false;
    setIsLoading(true);
    setHasError(false);

    // 1. Fetch & Apply Skin Texture
    viewer
      .loadSkin(resolvedSkinUrl)
      .then(() => {
        if (!isCancelled) {
          setIsLoading(false);
          setHasError(false);
          // Re-apply outer layer preference on the freshly loaded skin model
          if (viewer.playerObject && viewer.playerObject.skin) {
            viewer.playerObject.skin.setOuterLayerVisible(outerLayersVisible);
          }
        }
      })
      .catch((err) => {
        console.warn('Skin loading failed, applying local fallback:', err);
        if (!isCancelled) {
          viewer
            .loadSkin('/skins/brostgg.png')
            .then(() => {
              if (!isCancelled) setIsLoading(false);
            })
            .catch(() => {
              if (!isCancelled) {
                setIsLoading(false);
                setHasError(true);
              }
            });
        }
      });

    // 2. Automatically Fetch & Apply Player Cape
    // Minotar returns 404 image if the player has no cape
    if (username.toLowerCase() === 'brostgg') {
      viewer.resetCape();
      setHasCape(false);
    } else {
      const capeUrl = `https://minotar.net/cape/${encodeURIComponent(username)}`;
      viewer
        .loadCape(capeUrl)
        .then(() => {
          if (!isCancelled) {
            setHasCape(true);
          }
        })
        .catch(() => {
          if (!isCancelled) {
            viewer.resetCape();
            setHasCape(false);
          }
        });
    }

    return () => {
      isCancelled = true;
    };
  }, [resolvedSkinUrl, username]);

  // Set animation pose: Idle, Walk, Run, or Pause
  const handleApplyAnimation = useCallback((type: AnimationType) => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    setActiveAnimation(type);

    if (type === 'pause') {
      viewer.animation = null;
      return;
    }

    let anim: PlayerAnimation;
    if (type === 'idle') {
      anim = new IdleAnimation();
      anim.speed = 0.75;
    } else if (type === 'walk') {
      anim = new WalkingAnimation();
      anim.speed = 0.85;
    } else {
      // 'run'
      anim = new RunningAnimation();
      anim.speed = 1.0;
    }

    viewer.animation = anim;
  }, []);

  // Toggle Auto-rotate
  const handleToggleAutoRotate = useCallback(() => {
    if (!viewerRef.current) return;
    const nextState = !autoRotate;
    viewerRef.current.autoRotate = nextState;
    setAutoRotate(nextState);
  }, [autoRotate]);

  // Toggle Outer Armor / 2nd Layer
  const handleToggleOuterLayers = useCallback(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    const nextState = !outerLayersVisible;
    setOuterLayersVisible(nextState);

    const player = viewer.playerObject;
    if (player && player.skin) {
      player.skin.setOuterLayerVisible(nextState);
    }
  }, [outerLayersVisible]);

  // Reset Camera & Joint Poses
  const handleResetCamera = useCallback(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    viewer.resetCameraPose();
    if (viewer.playerObject) {
      viewer.playerObject.resetJoints();
    }
    if (viewer.controls) {
      viewer.controls.reset();
    }
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ minHeight: typeof height === 'number' ? `${height}px` : height }}
      className={`relative w-full rounded-2xl overflow-hidden bg-slate-950/80 backdrop-blur-xl border border-cyan-500/30 shadow-[0_0_50px_-10px_rgba(0,245,212,0.22)] flex flex-col justify-between group transition-all duration-300 ${className}`}
    >
      {/* ======================================================== */}
      {/* GLOWING EFFECT: Cyan / Emerald Ambient Drop-Shadow Lights */}
      {/* ======================================================== */}
      {/* Large radial ambient backlight */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full pointer-events-none opacity-40 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(0, 245, 212, 0.35) 0%, rgba(16, 185, 129, 0.2) 40%, transparent 70%)',
        }}
      />

      {/* Cyber floor reflection ring under avatar's feet */}
      <div className="absolute bottom-36 left-1/2 -translate-x-1/2 w-44 h-8 bg-cyan-500/10 rounded-full blur-md pointer-events-none" />
      <div className="absolute bottom-36 left-1/2 -translate-x-1/2 w-32 h-4 rounded-full border border-cyan-400/25 shadow-[0_0_15px_rgba(0,245,212,0.3)] pointer-events-none" />

      {/* Corner cyber tech markers */}
      <div className="absolute top-2 left-2 w-2 h-2 border-t-2 border-l-2 border-cyan-400/60 pointer-events-none z-10" />
      <div className="absolute top-2 right-2 w-2 h-2 border-t-2 border-r-2 border-cyan-400/60 pointer-events-none z-10" />
      <div className="absolute bottom-2 left-2 w-2 h-2 border-b-2 border-l-2 border-cyan-400/60 pointer-events-none z-10" />
      <div className="absolute bottom-2 right-2 w-2 h-2 border-b-2 border-r-2 border-cyan-400/60 pointer-events-none z-10" />

      {/* ======================================================== */}
      {/* TOP HUD: Telemetry & Status Bar                          */}
      {/* ======================================================== */}
      <div className="relative z-10 w-full px-4 py-3 flex items-center justify-between border-b border-cyan-500/20 bg-slate-900/60 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00f5d4] shadow-[0_0_8px_#00f5d4]"></span>
          </span>
          <span className="text-xs font-mono font-bold tracking-wider text-white uppercase flex items-center gap-1.5">
            <span>360° RIG VIEW</span>
            <span className="text-cyan-400/60">//</span>
          </span>
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 shadow-sm">
            {username}
          </span>
        </div>

        {/* Cape Status & Quick Camera Reset */}
        <div className="flex items-center gap-2 text-xs font-mono">
          {hasCape ? (
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950/90 text-emerald-400 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.3)] flex items-center gap-1">
              <Shield className="w-3 h-3 text-emerald-400" />
              <span>CAPE MOUNTED</span>
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-slate-900/70 border border-slate-800 hidden sm:inline-flex items-center gap-1">
              <span>NO CAPE</span>
            </span>
          )}

          {/* Quick Reset Camera */}
          <button
            onClick={handleResetCamera}
            title="Reset Camera Pose"
            className="p-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 border border-slate-700 hover:border-cyan-500/40 transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/70 backdrop-blur-sm text-cyan-400 font-mono text-xs gap-2">
          <RefreshCw className="w-6 h-6 animate-spin text-cyan-400" />
          <span className="tracking-wider uppercase">Loading 3D Mesh &amp; Cape...</span>
        </div>
      )}

      {/* Fallback notification */}
      {hasError && (
        <div className="absolute top-14 left-4 right-4 z-20 p-2.5 bg-amber-950/90 border border-amber-500/40 text-amber-200 text-xs font-mono text-center rounded-lg shadow-lg">
          Custom skin unreachable via Minotar CDN. Displaying local offline preview.
        </div>
      )}

      {/* ======================================================== */}
      {/* 3D CANVAS VIEWPORT (with Glowing Drop-Shadow)            */}
      {/* ======================================================== */}
      <div className="relative flex-1 w-full flex items-center justify-center cursor-grab active:cursor-grabbing overflow-hidden">
        {/* Subtle drop shadow and filter applied directly to 3D rendering canvas */}
        <canvas
          ref={canvasRef}
          className="w-full h-full block touch-none drop-shadow-[0_15px_30px_rgba(0,0,0,0.85)] filter"
        />

        {/* Orbit Hint Watermark */}
        <div className="absolute bottom-2 right-3 pointer-events-none text-[10px] font-mono text-slate-400/80 bg-slate-950/60 px-2 py-0.5 rounded border border-slate-800/60 backdrop-blur-xs">
          Drag to Orbit · Scroll to Zoom
        </div>
      </div>

      {/* ======================================================== */}
      {/* ENHANCED CONTROL PANEL (Animation Buttons & Switches)   */}
      {/* ======================================================== */}
      {showControls && (
        <div className="relative z-10 w-full p-3.5 bg-slate-950/80 backdrop-blur-md border-t border-cyan-500/25 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* THREE STYLISH ANIMATION BUTTONS: Idle, Walk, Run */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider hidden md:inline">
              Pose:
            </span>

            <div className="grid grid-cols-3 gap-1.5 flex-1 sm:flex-none">
              {/* Button 1: Idle */}
              <button
                type="button"
                onClick={() => handleApplyAnimation('idle')}
                className={`group relative px-3 py-2 rounded-lg font-heading font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 border ${
                  activeAnimation === 'idle'
                    ? 'bg-gradient-to-r from-cyan-950 to-cyan-900/90 text-cyan-300 border-cyan-400 shadow-[0_0_18px_rgba(0,245,212,0.45)]'
                    : 'bg-slate-900/90 text-slate-400 border-slate-700/80 hover:text-white hover:border-cyan-500/40 hover:bg-slate-850'
                }`}
              >
                <Activity
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeAnimation === 'idle'
                      ? 'text-cyan-300 scale-110'
                      : 'text-slate-500 group-hover:text-cyan-400'
                  }`}
                />
                <span>Idle</span>
                {activeAnimation === 'idle' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                )}
              </button>

              {/* Button 2: Walk */}
              <button
                type="button"
                onClick={() => handleApplyAnimation('walk')}
                className={`group relative px-3 py-2 rounded-lg font-heading font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 border ${
                  activeAnimation === 'walk'
                    ? 'bg-gradient-to-r from-emerald-950 to-emerald-900/90 text-emerald-300 border-emerald-400 shadow-[0_0_18px_rgba(16,185,129,0.45)]'
                    : 'bg-slate-900/90 text-slate-400 border-slate-700/80 hover:text-white hover:border-emerald-500/40 hover:bg-slate-850'
                }`}
              >
                <Footprints
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeAnimation === 'walk'
                      ? 'text-emerald-300 scale-110'
                      : 'text-slate-500 group-hover:text-emerald-400'
                  }`}
                />
                <span>Walk</span>
                {activeAnimation === 'walk' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                )}
              </button>

              {/* Button 3: Run */}
              <button
                type="button"
                onClick={() => handleApplyAnimation('run')}
                className={`group relative px-3 py-2 rounded-lg font-heading font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 border ${
                  activeAnimation === 'run'
                    ? 'bg-gradient-to-r from-amber-950/90 to-amber-900 text-amber-300 border-amber-400 shadow-[0_0_18px_rgba(251,191,36,0.45)]'
                    : 'bg-slate-900/90 text-slate-400 border-slate-700/80 hover:text-white hover:border-amber-500/40 hover:bg-slate-850'
                }`}
              >
                <Flame
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeAnimation === 'run'
                      ? 'text-amber-300 scale-110'
                      : 'text-slate-500 group-hover:text-amber-400'
                  }`}
                />
                <span>Run</span>
                {activeAnimation === 'run' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                )}
              </button>
            </div>
          </div>

          {/* TOGGLE SWITCHES: Outer Armor Layer & Auto-Rotate */}
          <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
            {/* Outer Armor Layer Toggle Switch */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-slate-300 flex items-center gap-1 select-none">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden xs:inline">Armor Layer:</span>
                <span className="xs:hidden">Armor:</span>
              </span>

              <button
                type="button"
                role="switch"
                aria-checked={outerLayersVisible}
                onClick={handleToggleOuterLayers}
                className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  outerLayersVisible
                    ? 'bg-cyan-500 shadow-[0_0_12px_rgba(0,245,212,0.6)]'
                    : 'bg-slate-800 border-slate-700'
                }`}
                title={
                  outerLayersVisible
                    ? 'Outer Armor/Hat Layer is ON. Click to hide.'
                    : 'Outer Armor/Hat Layer is OFF. Click to show.'
                }
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-slate-950 shadow-md ring-0 transition duration-200 ease-in-out mt-0.5 ${
                    outerLayersVisible ? 'translate-x-5 bg-white' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Auto-Rotate Toggle Button */}
            <button
              type="button"
              onClick={handleToggleAutoRotate}
              title={autoRotate ? 'Pause 360° Auto-Rotate' : 'Enable 360° Auto-Rotate'}
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                autoRotate
                  ? 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40 shadow-sm'
                  : 'bg-slate-900/80 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              <RotateCw
                className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`}
                style={{ animationDuration: '6s' }}
              />
              <span className="text-[10px] tracking-wide uppercase font-semibold hidden sm:inline">
                {autoRotate ? 'Rotating' : 'Static'}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
