import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface IntroScreenProps {
  onEnterExperience: () => void;
  isExiting: boolean;
}

interface HeroDustParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  isGold: boolean;
}

interface HeroSmokeCloud {
  x: number;
  y: number;
  vx: number;
  radius: number;
  alpha: number;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({
  onEnterExperience,
  isExiting,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isHoveredRef = useRef(false);

  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  // Subtle atmospheric smoke and floating ash/gold dust canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const dust: HeroDustParticle[] = Array.from({ length: 48 }, (_, i) => ({
      x: ((i * 67) % 100) * 0.01 * width,
      y: ((i * 43) % 100) * 0.01 * height,
      vx: (i % 2 === 0 ? 1 : -1) * (0.08 + (i % 4) * 0.04),
      vy: -(0.14 + (i % 5) * 0.07),
      size: 0.9 + (i % 3) * 0.7,
      alpha: 0.14 + (i % 5) * 0.07,
      isGold: i % 3 === 0,
    }));

    const smoke: HeroSmokeCloud[] = Array.from({ length: 10 }, (_, i) => ({
      x: (i / 10) * width,
      y: height * (0.62 + (i % 3) * 0.12),
      vx: 0.15 + (i % 3) * 0.08,
      radius: 180 + (i % 4) * 60,
      alpha: 0.06 + (i % 3) * 0.03,
    }));

    let rafId: number;
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const hoverBoost = isHoveredRef.current ? 1.65 : 1.0;

      // Slow drifting charcoal/crimson-tinted smoke along the lower wall silhouette
      for (const s of smoke) {
        s.x += s.vx * hoverBoost;
        if (s.x - s.radius > width) s.x = -s.radius;

        const grad = ctx.createRadialGradient(s.x, s.y, s.radius * 0.1, s.x, s.y, s.radius);
        grad.addColorStop(0, 'rgba(32, 22, 20, 0.42)');
        grad.addColorStop(0.6, 'rgba(18, 14, 15, 0.2)');
        grad.addColorStop(1, 'rgba(5, 5, 7, 0)');
        ctx.save();
        ctx.globalAlpha = s.alpha * (isHoveredRef.current ? 1.25 : 1);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Very subtle floating ash & muted gold dust particles
      for (const p of dust) {
        p.x += p.vx * hoverBoost;
        p.y += p.vy * hoverBoost;
        if (p.y < -10) p.y = height + 10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.save();
        ctx.globalAlpha = Math.min(0.85, p.alpha * hoverBoost);
        ctx.fillStyle = p.isGold ? '#D4AF37' : '#A39E93';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      aria-label="SHŌT Cinematic Opening"
      className={`fixed inset-0 z-50 flex h-screen w-screen flex-col items-center justify-center overflow-hidden bg-[#050507] px-6 text-[#F4F1EA] select-none transition-all duration-1000 ease-out ${
        isExiting ? 'pointer-events-none scale-105 opacity-0' : 'scale-100 opacity-100'
      }`}
    >
      {/* Layer 1: Deep Charcoal, Muted Crimson & Golden Radial Environmental Lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-700"
        style={{
          background: isHovered
            ? 'radial-gradient(circle at 50% 44%, rgba(212, 175, 55, 0.22) 0%, rgba(153, 27, 27, 0.16) 38%, rgba(5, 5, 7, 0.98) 76%)'
            : 'radial-gradient(circle at 50% 44%, rgba(212, 175, 55, 0.12) 0%, rgba(127, 29, 29, 0.10) 36%, rgba(5, 5, 7, 0.99) 74%)',
        }}
      />

      {/* Layer 2: Faint Golden Paths Energy Filaments & Monolithic Wall Silhouette SVG */}
      <svg
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id="hero-gold-filament" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
            <stop offset="50%" stopColor="#FEF08A" stopOpacity={isHovered ? '0.42' : '0.2'} />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="wall-silhouette-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#120E0E" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#050507" stopOpacity="0.98" />
          </linearGradient>
        </defs>

        {/* Subtle ascending Paths filaments behind the SHŌT crest */}
        <g
          stroke="url(#hero-gold-filament)"
          fill="none"
          className="transition-opacity duration-700"
        >
          <path d="M 340 1080 Q 650 660 960 460" strokeWidth="1.2" />
          <path d="M 1580 1080 Q 1270 660 960 460" strokeWidth="1.2" />
          <path d="M 620 1080 Q 790 730 960 460" strokeWidth="0.8" />
          <path d="M 1300 1080 Q 1130 730 960 460" strokeWidth="0.8" />
          <circle
            cx="960"
            cy="460"
            r={isHovered ? '310' : '290'}
            stroke="#D4AF37"
            strokeOpacity={isHovered ? '0.16' : '0.07'}
            strokeWidth="0.9"
            strokeDasharray="6 14"
            className="transition-all duration-700"
          />
        </g>

        {/* Faint Monolithic Wall Silhouette along the lower horizon */}
        <path
          d="M 0 885 L 220 885 L 235 855 L 490 855 L 505 875 L 810 875 L 825 840 L 1095 840 L 1110 875 L 1420 875 L 1435 855 L 1690 855 L 1705 885 L 1920 885 L 1920 1080 L 0 1080 Z"
          fill="url(#wall-silhouette-grad)"
        />
        <line
          x1="0"
          y1="885"
          x2="1920"
          y2="885"
          stroke="#D4AF37"
          strokeOpacity="0.08"
          strokeWidth="1"
        />
      </svg>

      {/* Layer 3: Subtle Atmospheric Smoke & Ash Particles Canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
      />

      {/* Layer 4: Vignette Frame */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 shadow-[inset_0_0_160px_rgba(0,0,0,0.95)]"
      />

      {/* Main Focal Composition */}
      <div className="relative z-10 flex max-w-4xl flex-col items-center text-center">
        {/* Top architectural hairline ornament */}
        <div className="mb-8 flex items-center gap-4 opacity-80">
          <div
            className={`h-px bg-gradient-to-r from-transparent to-[#D4AF37] transition-all duration-500 ${
              isHovered ? 'w-20' : 'w-12'
            }`}
          />
          <span className="font-mono text-[10px] tracking-[0.42em] text-[#D4AF37]/90">
            845 · SHIGANSHINA
          </span>
          <div
            className={`h-px bg-gradient-to-l from-transparent to-[#D4AF37] transition-all duration-500 ${
              isHovered ? 'w-20' : 'w-12'
            }`}
          />
        </div>

        {/* Monumental SHŌT Title */}
        <div className="relative">
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute -inset-x-16 -inset-y-8 rounded-full bg-[#D4AF37]/10 blur-3xl transition-opacity duration-700 ${
              isHovered ? 'opacity-95' : 'opacity-40'
            }`}
          />
          <h1
            className="relative font-display text-7xl font-extrabold tracking-[0.28em] text-[#F4F1EA] transition-transform duration-700 sm:text-8xl md:text-[7.5rem] pl-[0.28em]"
            style={{
              textShadow: isHovered
                ? '0 0 45px rgba(212, 175, 55, 0.38), 0 12px 35px rgba(0, 0, 0, 0.95)'
                : '0 0 24px rgba(212, 175, 55, 0.18), 0 10px 30px rgba(0, 0, 0, 0.95)',
            }}
          >
            SHŌT
          </h1>
        </div>

        {/* Subtitle: THE WORLD BEYOND THE WALLS */}
        <p className="mt-6 font-display text-sm font-semibold tracking-[0.36em] text-[#E6DFD3] sm:text-base md:text-lg pl-[0.36em]">
          THE WORLD BEYOND THE WALLS
        </p>

        {/* Supporting Line: AN INTERACTIVE CINEMATIC EXPERIENCE */}
        <p className="mt-3 font-sans text-[11px] font-medium tracking-[0.28em] text-[#A39E93] sm:text-xs pl-[0.28em]">
          AN INTERACTIVE CINEMATIC EXPERIENCE
        </p>

        {/* Bespoke Cinematic Entrance Control: ENTER EXPERIENCE */}
        <div className="mt-14">
          <button
            type="button"
            onClick={onEnterExperience}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onFocus={() => setIsHovered(true)}
            onBlur={() => setIsHovered(false)}
            className="group relative flex items-center gap-5 bg-[#0A090D]/80 px-10 py-4.5 text-xs font-semibold tracking-[0.28em] text-[#F4F1EA] transition-all duration-500 ease-out hover:scale-[1.04] hover:bg-[#141118]/90 focus-visible:outline-2 focus-visible:outline-[#FEF08A] whitespace-nowrap shrink-0 cursor-pointer"
            style={{
              boxShadow: isHovered
                ? '0 0 42px rgba(212, 175, 55, 0.35), inset 0 0 22px rgba(212, 175, 55, 0.16)'
                : '0 0 20px rgba(212, 175, 55, 0.12), inset 0 0 10px rgba(212, 175, 55, 0.05)',
            }}
          >
            {/* Thin Golden Perimeter Frame */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 border border-[#D4AF37]/55 transition-colors duration-500 group-hover:border-[#FEF08A]"
            />

            {/* Sculpted Corner Energy Accents */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -left-1 -top-1 h-2.5 w-2.5 border-l-2 border-t-2 border-[#FEF08A] transition-all duration-500 group-hover:-left-1.5 group-hover:-top-1.5"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-1 -top-1 h-2.5 w-2.5 border-r-2 border-t-2 border-[#FEF08A] transition-all duration-500 group-hover:-right-1.5 group-hover:-top-1.5"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-1 -left-1 h-2.5 w-2.5 border-b-2 border-l-2 border-[#FEF08A] transition-all duration-500 group-hover:-bottom-1.5 group-hover:-left-1.5"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-1 -right-1 h-2.5 w-2.5 border-b-2 border-r-2 border-[#FEF08A] transition-all duration-500 group-hover:-bottom-1.5 group-hover:-right-1.5"
            />

            {/* Animated Golden Energy Line along the bottom edge */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 left-1/2 h-[1.5px] w-1/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#FEF08A] to-transparent transition-all duration-500 group-hover:w-full"
            />

            <span className="relative z-10 font-display text-xs tracking-[0.28em] text-[#F4F1EA] transition-colors duration-300 group-hover:text-[#FEF08A]">
              ENTER EXPERIENCE
            </span>

            <ArrowRight className="relative z-10 h-4 w-4 text-[#D4AF37] transition-all duration-300 group-hover:translate-x-1.5 group-hover:text-[#FEF08A]" />
          </button>
        </div>
      </div>
    </section>
  );
};
