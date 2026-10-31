import React from 'react';
import { MAIN_NAVIGATION_ITEMS, NavItem } from '../../data/navigation';
import {
  ComputedBoxDestructionState,
  ComputedCinematicState,
  getNavBoxFragmentSpecs,
} from '../../cinematic/timeline/timelineEngine';

interface FloatingNavigationProps {
  containerRef: React.RefObject<HTMLElement | null>;
  shardRefs: React.MutableRefObject<(HTMLButtonElement | null)[]>;
  cinematicState: ComputedCinematicState;
  onSelectNavItem: (item: NavItem) => void;
  onSeekToPhase: (seconds: number) => void;
}

interface NavShardBoxProps {
  item: NavItem;
  boxIndex: number;
  side: 'left' | 'right';
  glowClasses: string;
  boxState: ComputedBoxDestructionState;
  shardRefs: React.MutableRefObject<(HTMLButtonElement | null)[]>;
  onClick: () => void;
}

const NavShardBox: React.FC<NavShardBoxProps> = ({
  item,
  boxIndex,
  side,
  glowClasses,
  boxState,
  shardRefs,
  onClick,
}) => {
  const fragmentSpecs = getNavBoxFragmentSpecs(boxIndex);
  const shardGeometryClass =
    side === 'left' ? 'stone-shard-left' : 'stone-shard-right';

  return (
    <div
      data-nav-box-wrapper={boxIndex}
      data-box-stage={boxState.stage}
      className="relative overflow-visible"
    >
      {/* 1. INTACT / CRACKING NAVIGATION BOX (Disappears immediately when Stage B fragmentation starts) */}
      <button
        ref={(el) => {
          shardRefs.current[boxIndex] = el;
        }}
        data-nav-intact-btn
        type="button"
        onClick={onClick}
        style={{
          opacity: boxState.intactBoxOpacity,
          pointerEvents: boxState.intactBoxOpacity > 0.5 ? 'auto' : 'none',
        }}
        className={`${shardGeometryClass} group relative overflow-hidden border bg-[#09090D]/80 px-4 py-2.5 text-left backdrop-blur-md transition-colors duration-300 hover:bg-[#14141D]/95 hover:shadow-[0_8px_30px_rgba(212,175,55,0.22)] focus-visible:outline-2 focus-visible:outline-[#D4AF37] ${glowClasses}`}
      >
        <div
          className={`pointer-events-none absolute inset-0 ${
            side === 'left' ? 'bg-gradient-to-br' : 'bg-gradient-to-bl'
          } from-white/[0.08] via-transparent to-black/60 opacity-75 transition-opacity group-hover:opacity-100`}
        />

        {/* Stage A: Spreading Surface Fracture Network (37.0s -> 40.5s) */}
        <svg
          data-nav-crack-svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
          style={{
            opacity:
              boxState.crackProgress > 0
                ? Math.min(1, boxState.crackProgress * 1.15)
                : 0,
            strokeDasharray: 140,
            strokeDashoffset: (1 - boxState.crackProgress) * 140,
          }}
          className="pointer-events-none absolute inset-0 h-full w-full drop-shadow-[0_0_5px_rgba(239,68,68,0.85)]"
        >
          {/* Primary fracture seams matching the exact polygonal tessellation boundaries */}
          <path
            d="M 19 0 L 14 34 L 22 68 L 17 100 M 41 0 L 35 29 L 44 62 L 39 100 M 64 0 L 58 36 L 52 71 L 63 100 M 83 0 L 78 31 L 73 66 L 84 100"
            stroke="#EF4444"
            strokeWidth="1.6"
            fill="none"
          />
          <path
            d="M 0 28 L 14 34 L 35 29 L 58 36 L 78 31 L 100 38 M 0 72 L 22 68 L 44 62 L 52 71 L 73 66 L 100 74"
            stroke="#F97316"
            strokeWidth="1.3"
            fill="none"
          />
          <path
            d="M 14 34 L 44 62 M 58 36 L 73 66 M 35 29 L 22 68"
            stroke="#FEF08A"
            strokeWidth="0.8"
            fill="none"
            opacity="0.8"
          />
        </svg>

        <div className="relative z-10 flex items-center gap-2.5 whitespace-nowrap">
          <span className="font-display text-[11px] font-semibold tracking-widest text-[#D4AF37]/90">
            {item.shortCode}
          </span>
          <span className="font-display text-xs font-semibold tracking-[0.14em] text-[#F4F1EA] transition-colors group-hover:text-[#FEF08A]">
            {item.label}
          </span>
        </div>
      </button>

      {/* 2. STAGE B, C, D: PHYSICAL POLYGONAL & PAPER-LIKE FRAGMENTS (40.5s -> 80.0s) */}
      <div
        data-nav-frag-container
        aria-hidden="true"
        style={{
          opacity: boxState.fragmentsVisible ? 1 : 0,
          perspective: '750px',
        }}
        className="pointer-events-none absolute inset-0 overflow-visible"
      >
        {fragmentSpecs.map((spec, fIdx) => {
          const ft = boxState.fragments[fIdx];
          return (
            <div
              key={spec.id}
              data-frag-index={fIdx}
              data-frag-tier={spec.sizeTier}
              style={{
                clipPath: spec.clipPath,
                opacity: ft ? ft.opacity : 0,
                transform: ft
                  ? `translate3d(${ft.dx.toFixed(1)}px, ${ft.dy.toFixed(
                      1
                    )}px, 0) rotateX(${ft.rotX.toFixed(
                      1
                    )}deg) rotateY(${ft.rotY.toFixed(
                      1
                    )}deg) rotateZ(${ft.rotZ.toFixed(
                      1
                    )}deg) scale(${ft.scale.toFixed(3)})`
                  : 'none',
                transformOrigin: `${spec.centroidX}% ${spec.centroidY}%`,
                willChange: 'transform, opacity',
              }}
              className={`absolute inset-0 ${
                spec.isSplinter
                  ? 'bg-gradient-to-br from-[#DC2626]/90 via-[#271C19] to-[#09090D]'
                  : 'bg-[#0B0B11]/95'
              } border border-[#EF4444]/60 shadow-[0_2px_10px_rgba(220,38,38,0.28)]`}
            >
              {/* Torn stone/paper surface sheen & glowing fracture edge */}
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="pointer-events-none absolute inset-0 h-full w-full"
              >
                <polygon
                  points={spec.svgPoints}
                  fill="rgba(20, 16, 18, 0.92)"
                  stroke={spec.isSplinter ? '#F97316' : '#EF4444'}
                  strokeWidth={spec.isSplinter ? '2.4' : '1.8'}
                />
              </svg>

              {/* Clipped slice of the original navigation typography inside the physical shard */}
              {!spec.isSplinter && (
                <div className="relative z-10 flex h-full w-full items-center gap-2.5 px-4 py-2.5 whitespace-nowrap">
                  <span className="font-display text-[11px] font-semibold tracking-widest text-[#D4AF37]/90">
                    {item.shortCode}
                  </span>
                  <span className="font-display text-xs font-semibold tracking-[0.14em] text-[#F4F1EA]">
                    {item.label}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const FloatingNavigation: React.FC<FloatingNavigationProps> = ({
  containerRef,
  shardRefs,
  cinematicState,
  onSelectNavItem,
  onSeekToPhase,
}) => {
  const { borderGlow, boxes } = cinematicState.navigation;

  const getGlowClasses = () => {
    switch (borderGlow) {
      case 'gold':
        return 'border-[#D4AF37]/65 shadow-[0_0_28px_rgba(212,175,55,0.3)] hover:border-[#FEF08A]';
      case 'crimson':
        return 'border-[#DC2626]/65 shadow-[0_0_28px_rgba(220,38,38,0.32)] hover:border-[#F87171]';
      case 'ember':
        return 'border-[#EA580C]/65 shadow-[0_0_28px_rgba(234,88,12,0.32)] hover:border-[#FDBA74]';
      case 'white':
        return 'border-white/30 shadow-[0_0_22px_rgba(255,255,255,0.14)] hover:border-white/65';
      default:
        return 'border-white/20 hover:border-white/45';
    }
  };

  const glowClasses = getGlowClasses();

  return (
    <nav
      ref={containerRef}
      aria-label="Cinematic Floating World Navigation"
      data-destruction-stage={cinematicState.navigation.destructionStage}
      style={{ opacity: 1 }}
      className="fixed inset-x-0 top-6 z-30 mx-auto flex max-w-[1440px] items-start justify-between overflow-visible px-5 sm:px-10"
    >
      {/* Left Cluster of Floating Stone/Obsidian Shards (Boxes 0, 1, 2) */}
      <div className="flex flex-wrap items-center gap-3 overflow-visible">
        {MAIN_NAVIGATION_ITEMS.slice(0, 3).map((item, idx) => (
          <NavShardBox
            key={item.id}
            item={item}
            boxIndex={idx}
            side="left"
            glowClasses={glowClasses}
            boxState={boxes[idx]}
            shardRefs={shardRefs}
            onClick={() => onSelectNavItem(item)}
          />
        ))}
      </div>

      {/* Center Subtle Architectural SHŌT Branding (Always Visible) */}
      <div className="pointer-events-none hidden flex-col items-center lg:flex">
        <span className="font-display text-sm font-bold tracking-[0.38em] text-[#F4F1EA]/85 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
          SHŌT
        </span>
        <div className="mt-1.5 h-px w-12 bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent" />
      </div>

      {/* Right Cluster of Floating Stone/Obsidian Shards (Boxes 3, 4) */}
      <div className="flex flex-wrap items-center justify-end gap-3 overflow-visible">
        {MAIN_NAVIGATION_ITEMS.slice(3).map((item, idx) => {
          const boxIndex = idx + 3;
          return (
            <NavShardBox
              key={item.id}
              item={item}
              boxIndex={boxIndex}
              side="right"
              glowClasses={glowClasses}
              boxState={boxes[boxIndex]}
              shardRefs={shardRefs}
              onClick={() => {
                if (item.id === 'nav-chronicle') {
                  onSeekToPhase(29.0);
                } else {
                  onSelectNavItem(item);
                }
              }}
            />
          );
        })}
      </div>
    </nav>
  );
};
