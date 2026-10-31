import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { MAIN_NAVIGATION_ITEMS } from '../../data/navigation';

interface MainNavigationProps {
  activeSection: string;
  onNavigateSection: (sectionId: string) => void;
  onReplayIntro: (startTime?: number) => void;
}

export const MainNavigation: React.FC<MainNavigationProps> = ({
  activeSection,
  onNavigateSection,
  onReplayIntro,
}) => {
  const headerRef = useRef<HTMLElement | null>(null);

  // Smooth cinematic reconstruction / reappearance when the main website mounts after the intro
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const items = header.querySelectorAll('[data-reconstruct-nav]');
    gsap.fromTo(
      items,
      { opacity: 0, y: -12, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.65,
        stagger: 0.06,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
      }
    );
  }, []);

  return (
    <header
      ref={headerRef}
      data-testid="restored-main-navigation"
      className="sticky top-0 z-40 flex items-center justify-between gap-8 border-b border-white/10 bg-[#070709]/90 px-6 py-4 backdrop-blur-md lg:px-12"
    >
      {/* Zone 1: Single text element wordmark */}
      <a
        data-reconstruct-nav
        href="#overview"
        onClick={(e) => {
          e.preventDefault();
          onNavigateSection('overview');
        }}
        className="font-display text-xl font-bold tracking-[0.26em] text-[#F4F1EA] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
      >
        SHŌT
      </a>

      {/* Zone 2: 5 concise single-line text navigation links */}
      <nav
        aria-label="Primary Website Navigation"
        className="flex items-center gap-4 overflow-x-auto text-xs font-medium text-[#A39E93] sm:gap-7 sm:text-sm"
      >
        {MAIN_NAVIGATION_ITEMS.map((item) => {
          const isCurrent = activeSection === item.sectionId;
          return (
            <a
              key={item.id}
              data-reconstruct-nav
              href={`#${item.sectionId}`}
              onClick={(e) => {
                e.preventDefault();
                onNavigateSection(item.sectionId);
              }}
              className={`relative py-1 transition-colors whitespace-nowrap shrink-0 hover:text-[#F4F1EA] focus-visible:outline-2 focus-visible:outline-[#D4AF37] ${
                isCurrent
                  ? 'text-[#F4F1EA] underline decoration-[#D4AF37] decoration-2 underline-offset-8'
                  : ''
              }`}
            >
              {item.label}
            </a>
          );
        })}
      </nav>

      {/* Zone 3: 1 primary action */}
      <div data-reconstruct-nav className="flex items-center shrink-0">
        <button
          type="button"
          onClick={() => onReplayIntro(0)}
          className="border border-[#D4AF37]/75 bg-[#D4AF37]/15 px-4 py-2 text-xs font-semibold tracking-[0.12em] text-[#F4F1EA] transition-colors hover:border-[#FEF08A] hover:bg-[#D4AF37]/25 focus-visible:outline-2 focus-visible:outline-[#FEF08A] whitespace-nowrap shrink-0"
        >
          Replay Intro
        </button>
      </div>
    </header>
  );
};
