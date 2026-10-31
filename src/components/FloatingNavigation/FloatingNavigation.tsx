import React from 'react';
import { MAIN_NAVIGATION_ITEMS, NavItem } from '../../data/navigation';
import { getNavBoxFragmentSpecs } from '../../cinematic/timeline/timelineEngine';

interface FloatingNavigationProps {
  containerRef: React.RefObject<HTMLElement | null>;
  shardRefs: React.MutableRefObject<(HTMLButtonElement | null)[]>;
  onSelectNavItem: (item: NavItem) => void;
  onSeekToPhase: (seconds: number) => void;
}

interface NavShardBoxProps {
  item: NavItem;
  boxIndex: number;
  side: 'left' | 'right';
  shardRefs: React.MutableRefObject<(HTMLButtonElement | null)[]>;
  onClick: () => void;
}

const NavShardBox: React.FC<NavShardBoxProps> = React.memo(
  ({ item, boxIndex, side, shardRefs, onClick }) => {
    const fragmentSpecs = getNavBoxFragmentSpecs(boxIndex);
    const shardGeometryClass =
      side === 'left' ? 'stone-shard-left' : 'stone-shard-right';

    return (
      <div
        data-nav-box-wrapper={boxIndex}
        data-box-stage="intact"
        className="relative overflow-visible"
      >
        {/* 1. INTACT / CRACKING NAVIGATION BOX */}
        <button
          ref={(el) => {
            shardRefs.current[boxIndex] = el;
          }}
          data-nav-intact-btn
          type="button"
          onClick={onClick}
          className={`${shardGeometryClass} group relative overflow-hidden border border-white/25 bg-[#09090D]/85 px-4 py-2.5 text-left transition-colors duration-300 hover:border-[#FEF08A] hover:bg-[#14141D]/95 focus-visible:outline-2 focus-visible:outline-[#D4AF37] cursor-pointer`}
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
              opacity: 0,
              strokeDasharray: 140,
              strokeDashoffset: 140,
            }}
            className="pointer-events-none absolute inset-0 h-full w-full"
          >
            {/* Primary fracture seams matching the exact polygonal tessellation boundaries */}
            <path
              d="M 22 0 L 16 46 L 24 100 M 46 0 L 39 52 L 48 100 M 68 0 L 62 44 L 71 100 M 86 0 L 81 49 L 88 100"
              stroke="#EF4444"
              strokeWidth="1.8"
              fill="none"
            />
            <path
              d="M 0 38 L 16 46 L 39 52 L 62 44 L 81 49 L 100 44"
              stroke="#F97316"
              strokeWidth="1.4"
              fill="none"
            />
            <path
              d="M 16 46 L 48 100 M 62 44 L 88 100 M 39 52 L 24 100"
              stroke="#FEF08A"
              strokeWidth="0.9"
              fill="none"
              opacity="0.85"
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

        {/* 2. STAGE B, C, D: GPU-COMPOSITED PHYSICAL POLYGONAL FRAGMENTS (Hidden from layout tree until 40.4s) */}
        <div
          data-nav-frag-container
          aria-hidden="true"
          style={{
            display: 'none',
            opacity: 0,
          }}
          className="pointer-events-none absolute inset-0 overflow-visible"
        >
          {fragmentSpecs.map((spec, fIdx) => (
            <div
              key={spec.id}
              data-frag-index={fIdx}
              data-frag-tier={spec.sizeTier}
              style={{
                clipPath: spec.clipPath,
                opacity: 0,
                transformOrigin: `${spec.centroidX}% ${spec.centroidY}%`,
                background: spec.isSplinter
                  ? 'linear-gradient(135deg, #EF4444 0%, #271C19 55%, #09090D 100%)'
                  : 'linear-gradient(135deg, rgba(239,68,68,0.45) 0%, rgba(16,14,18,0.96) 24%, rgba(9,9,13,0.98) 100%)',
              }}
              className="absolute inset-0 will-change-[transform,opacity]"
            >
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
          ))}
        </div>
      </div>
    );
  }
);

export const FloatingNavigation: React.FC<FloatingNavigationProps> = React.memo(
  ({ containerRef, shardRefs, onSelectNavItem, onSeekToPhase }) => {
    return (
      <nav
        ref={containerRef}
        aria-label="Cinematic Floating World Navigation"
        data-destruction-stage="intact"
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
  }
);
