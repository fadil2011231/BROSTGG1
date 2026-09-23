import { useEffect, useRef } from 'react';

export default function BackgroundParticles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const mouse = {
      x: -9999,
      y: -9999,
      isHovered: false,
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.isHovered = true;
    };

    const handleMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
      mouse.isHovered = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    const PARTICLE_COUNT = Math.min(220, Math.floor((window.innerWidth * window.innerHeight) / 9000));
    const CONNECT_DIST = 55;
    const VORTEX_DIST = 30;
    const DISPERSION_DIST = 110;

    const colors = ['#10b981', '#06b6d4', '#00f5d4', '#39ff14'];

    class DenseParticle {
      x = 0;
      y = 0;
      vx = 0;
      vy = 0;
      radius = 1;
      color = '#00f5d4';
      alpha = 0.5;

      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : height + 10;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = -Math.random() * 0.6 - 0.2; // upward spore drift
        this.radius = Math.random() * 1.6 + 0.6;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.alpha = Math.random() * 0.5 + 0.25;
      }

      update() {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < DISPERSION_DIST && mouse.isHovered) {
          if (dist < VORTEX_DIST) {
            // Inner vortex orbit
            const angle = Math.atan2(dy, dx);
            this.vx += Math.cos(angle + Math.PI / 2) * 0.35 + (dx / dist) * 0.12;
            this.vy += Math.sin(angle + Math.PI / 2) * 0.35 + (dy / dist) * 0.12;
            this.vx *= 0.88;
            this.vy *= 0.88;
          } else {
            // Outer repulsion force field
            const force = (DISPERSION_DIST - dist) / DISPERSION_DIST;
            const pushX = (dx / dist) * force * 1.6;
            const pushY = (dy / dist) * force * 1.6;
            this.vx -= pushX;
            this.vy -= pushY;
          }
        }

        this.x += this.vx;
        this.y += this.vy;

        this.vx *= 0.98;
        if (this.vy > -0.2) this.vy -= 0.015;

        if (this.y < -10) this.reset();
        if (this.x < -10) this.x = width + 10;
        if (this.x > width + 10) this.x = -10;
      }

      draw(context: CanvasRenderingContext2D) {
        context.save();
        context.globalAlpha = this.alpha;
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fill();
        context.restore();
      }
    }

    const particles: DenseParticle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new DenseParticle());
    }

    function renderField() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.update();
        p1.draw(ctx);

        for (let j = i + 1; j < Math.min(i + 10, particles.length); j++) {
          const p2 = particles[j];
          const distSq = (p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y);
          if (distSq < CONNECT_DIST * CONNECT_DIST) {
            const distance = Math.sqrt(distSq);
            ctx.save();
            ctx.globalAlpha = (1 - distance / CONNECT_DIST) * 0.16;
            ctx.strokeStyle = '#06b6d4';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      animId = requestAnimationFrame(renderField);
    }

    renderField();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Background art image with sculk bedrock cave aura */}
        <div
          className="absolute inset-0 bg-cover bg-no-repeat bg-top opacity-30"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA7NHVuBR4f13Fy_mkPBNtzMXDdg9MxyjCr4NZBvyxjTQ1BLZ4jCdkCYKitoFINxHIwFftepw221_sO78F5cAfD3DgmV7Mz8HINIKGZIZJ78cHVrVBnwaeQXc86nsV21-fR0GBUiad7-mrbKakM995XYDxy3t5ZhHepIg69N3_nQQTvtFAScx0ovE1kkM53_34C_5v6aSvx3HyD5O83XoH9v0aOyLoK1QnCgJvHFPiSAuGh3XF8573i')",
            backgroundAttachment: 'fixed',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#070b14]/70 via-[#070b14]/90 to-[#070b14]" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#070b14]/40 to-[#070b14]/95" />
      </div>

      {/* Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0 opacity-40"
      />

      {/* Ambient Glow Orbs */}
      <div className="fixed top-[-100px] left-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse-glow" />
      <div className="fixed top-1/2 right-[-80px] w-96 h-96 bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-[-100px] w-96 h-96 bg-teal-600/15 rounded-full blur-[160px] pointer-events-none -z-10" />
    </>
  );
}
