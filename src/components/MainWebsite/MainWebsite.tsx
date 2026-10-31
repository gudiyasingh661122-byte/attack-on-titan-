import React, { useState } from 'react';
import { Play, Compass, Shield, Clock, Sparkles, ArrowUpRight } from 'lucide-react';
import { MainNavigation } from '../MainNavigation/MainNavigation';
import {
  CHARACTER_DOSSIERS,
  CharacterDossier,
  STORY_CHAPTERS,
  THREE_WALLS_DATA,
  WallRing,
} from '../../data/websiteContent';
import {
  IMPACT_EVENTS,
  PHASE_SUMMARIES,
  PhaseId,
  TIMELINE_SEGMENTS,
} from '../../data/timelineEvents';
import { formatTimecode } from '../../cinematic/timeline/timelineEngine';
import { ConceptStoreSection } from '../Store/ConceptStoreSection';

interface MainWebsiteProps {
  initialSection?: string;
  onReplayIntroAtTime: (startTimeSeconds: number) => void;
}

export const MainWebsite: React.FC<MainWebsiteProps> = ({
  initialSection = 'overview',
  onReplayIntroAtTime,
}) => {
  const [activeSection, setActiveSection] = useState<string>(initialSection);
  const [selectedHeroPhaseIndex, setSelectedHeroPhaseIndex] = useState<number>(1); // Default Golden Lightning preview
  const [selectedWall, setSelectedWall] = useState<WallRing>(THREE_WALLS_DATA[0]);
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterDossier | null>(null);
  const [activeChroniclePhase, setActiveChroniclePhase] = useState<PhaseId>('phase-2');

  const handleNavigateSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const heroPhase = PHASE_SUMMARIES[selectedHeroPhaseIndex] || PHASE_SUMMARIES[0];
  const filteredSegments = TIMELINE_SEGMENTS.filter(
    (seg) => seg.phaseId === activeChroniclePhase
  );

  return (
    <div className="min-h-screen w-full bg-[#070709] text-[#F4F1EA]">
      {/* Strict 3-Zone Top Navigation Bar */}
      <MainNavigation
        activeSection={activeSection}
        onNavigateSection={handleNavigateSection}
        onReplayIntro={(time = 0) => onReplayIntroAtTime(time)}
      />

      <main>
        {/* ================= 1. HERO SPLIT SECTION (#overview) ================= */}
        <section
          id="overview"
          aria-labelledby="hero-heading"
          className="mx-auto max-w-[1280px] px-6 pb-16 pt-12 lg:px-12 lg:pt-20"
        >
          <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12">
            {/* Left Column: Editorial Typographic Hierarchy */}
            <div className="flex flex-col justify-between lg:col-span-6">
              <div>
                <div className="flex items-center gap-2 text-xs text-[#D4AF37]">
                  <span>SHŌT Interactive Chronicle</span>
                  <span aria-hidden="true">·</span>
                  <span>84.4s Frame-Synchronized Experience</span>
                </div>

                <h1
                  id="hero-heading"
                  className="mt-4 font-display text-4xl font-bold leading-[1.12] tracking-tight text-[#F4F1EA] sm:text-5xl lg:text-[3.5rem]"
                >
                  When the Sky Splits Above Shiganshina.
                </h1>

                <p className="mt-6 max-w-xl text-base leading-relaxed text-[#A39E93] sm:text-lg">
                  An interactive visual study of the Founding Titan’s awakening and the unhardening
                  of the Three Walls. Engineered with a master HTML5 video clock that drives
                  real-time atmospheric lighting, branching SVG lightning, structural fractures, and
                  layered ash across five distinct phases.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => onReplayIntroAtTime(0)}
                  className="flex items-center gap-3 border border-[#D4AF37] bg-[#D4AF37] px-6 py-3.5 text-xs font-bold tracking-[0.14em] text-[#070709] transition-colors hover:bg-[#FEF08A] focus-visible:outline-2 focus-visible:outline-[#FEF08A] whitespace-nowrap shrink-0"
                >
                  <Play className="h-4 w-4 fill-[#070709]" />
                  <span>Replay Full 84.4s Experience</span>
                </button>

                <button
                  type="button"
                  onClick={() => onReplayIntroAtTime(29.0)}
                  className="flex items-center gap-2 border border-white/20 bg-white/[0.04] px-5 py-3.5 text-xs font-semibold text-[#F4F1EA] transition-colors hover:border-[#D4AF37] hover:text-[#FEF08A] focus-visible:outline-2 focus-visible:outline-[#D4AF37] whitespace-nowrap shrink-0"
                >
                  <span>Jump to 00:29.0 Lightning Strike</span>
                  <ArrowUpRight className="h-4 w-4 text-[#D4AF37]" />
                </button>
              </div>
            </div>

            {/* Right Column: Matching-Height Interactive Phase Frame Preview */}
            <div className="flex flex-col justify-between border border-white/15 bg-[#0D0D12] lg:col-span-6">
              <div className="relative flex-1 overflow-hidden bg-[#12121A] min-h-[300px]">
                <img
                  src={heroPhase.keyframeImage}
                  alt={`Keyframe from Phase ${heroPhase.number}: ${heroPhase.title}`}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-all duration-500 lg:h-full"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0D0D12] via-[#0D0D12]/30 to-transparent" />

                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
                  <div>
                    <div className="font-mono text-xs text-[#D4AF37] tabular-nums">
                      PHASE 0{heroPhase.number} · {heroPhase.timeRangeLabel}
                    </div>
                    <div className="mt-1 font-display text-xl font-bold text-[#F4F1EA]">
                      {heroPhase.title}
                    </div>
                    <p className="mt-1 max-w-md text-xs text-[#D6D1C7]">{heroPhase.summary}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onReplayIntroAtTime(heroPhase.startTime)}
                    aria-label={`Launch video at Phase ${heroPhase.number}: ${heroPhase.title}`}
                    className="flex items-center gap-1.5 border border-[#D4AF37]/80 bg-[#070709]/90 px-3.5 py-2 text-xs font-semibold text-[#FEF08A] transition-colors hover:bg-[#D4AF37] hover:text-[#070709] whitespace-nowrap shrink-0"
                  >
                    <Play className="h-3.5 w-3.5" />
                    <span>Launch Scene</span>
                  </button>
                </div>
              </div>

              {/* Phase Selector Bar inside Right Preview Container */}
              <div
                role="tablist"
                aria-label="Preview video phases"
                className="grid grid-cols-5 border-t border-white/10 bg-[#09090D]"
              >
                {PHASE_SUMMARIES.map((phase, idx) => {
                  const isSelected = selectedHeroPhaseIndex === idx;
                  return (
                    <button
                      key={phase.id}
                      role="tab"
                      aria-selected={isSelected}
                      type="button"
                      onClick={() => setSelectedHeroPhaseIndex(idx)}
                      className={`px-2 py-3 text-center font-mono text-xs transition-colors whitespace-nowrap shrink-0 tabular-nums ${
                        isSelected
                          ? 'bg-[#D4AF37]/20 text-[#FEF08A] font-semibold border-t-2 border-[#D4AF37]'
                          : 'text-[#A39E93] hover:bg-white/[0.04] hover:text-[#F4F1EA]'
                      }`}
                    >
                      0{phase.number}. {phase.title.split(' ')[0]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Full-Width 4-Column Metric & Technical Strip Below Hero Split */}
          <div className="mt-12 grid grid-cols-2 gap-6 border-y border-white/10 py-8 lg:grid-cols-4">
            <div>
              <div className="font-mono text-2xl font-bold text-[#F4F1EA] tabular-nums sm:text-3xl">
                84.4s
              </div>
              <div className="mt-1 text-xs text-[#A39E93]">
                Master H.264 / AAC Clock · 1920 × 1080 at 30 FPS
              </div>
            </div>
            <div>
              <div className="font-mono text-2xl font-bold text-[#D4AF37] tabular-nums sm:text-3xl">
                5 Phases
              </div>
              <div className="mt-1 text-xs text-[#A39E93]">
                21 Frame-Inspected Atmospheric Sub-Segments
              </div>
            </div>
            <div>
              <div className="font-mono text-2xl font-bold text-[#F4F1EA] tabular-nums sm:text-3xl">
                14 Impacts
              </div>
              <div className="mt-1 text-xs text-[#A39E93]">
                Exponentially Decaying Screen & Shard Jolts
              </div>
            </div>
            <div>
              <div className="font-mono text-2xl font-bold text-[#EF4444] tabular-nums sm:text-3xl">
                3 Walls
              </div>
              <div className="mt-1 text-xs text-[#A39E93]">
                Maria · Rose · Sheena Concentric Architecture
              </div>
            </div>
          </div>
        </section>

        {/* Subtle Editorial Marquee Divider */}
        <div
          aria-hidden="true"
          className="overflow-hidden border-b border-white/10 bg-[#0A0A0E] py-3 text-xs tracking-[0.24em] text-[#8C867B]"
        >
          <div className="animate-marquee flex items-center gap-12 whitespace-nowrap">
            <span>SHŌT CINEMATIC ARCHIVE</span>
            <span>·</span>
            <span>THE COORDINATE & THE PATHS</span>
            <span>·</span>
            <span>00:29.0 GOLDEN LIGHTNING TRANSFORMATION</span>
            <span>·</span>
            <span>UNHARDENING OF WALL MARIA</span>
            <span>·</span>
            <span>FOUNDING TITAN SOVEREIGN RIBCAGE</span>
            <span>·</span>
            <span>PORTFOLIO CONCEPT SHOWCASE</span>
            <span>·</span>
            <span>SHŌT CINEMATIC ARCHIVE</span>
            <span>·</span>
            <span>THE COORDINATE & THE PATHS</span>
            <span>·</span>
            <span>00:29.0 GOLDEN LIGHTNING TRANSFORMATION</span>
            <span>·</span>
            <span>UNHARDENING OF WALL MARIA</span>
          </div>
        </div>

        {/* ================= 2. STORY & WORLD ARCHITECTURE (#story-world) ================= */}
        <section
          id="story-world"
          aria-labelledby="story-world-heading"
          className="mx-auto max-w-[1280px] px-6 py-24 lg:px-12"
        >
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs text-[#D4AF37]">
              <span>01. Narrative & World Architecture</span>
              <span aria-hidden="true">·</span>
              <span>Paradis Island & The Coordinate</span>
            </div>
            <h2
              id="story-world-heading"
              className="mt-3 font-display text-3xl font-bold tracking-tight text-[#F4F1EA] sm:text-4xl"
            >
              The Story Behind the 84.4-Second Cataclysm
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#A39E93]">
              Every visual transition in the SHŌT introduction corresponds to a pivotal turning
              point in the history of Eldia, Paradis Island, and the Three Concentric Walls.
            </p>
          </div>

          {/* 4 Editorial Story Chapters */}
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
            {STORY_CHAPTERS.map((chapter) => (
              <article
                key={chapter.index}
                className="flex flex-col justify-between border border-white/10 bg-[#0D0D12] p-6 sm:p-8"
              >
                <div>
                  <div className="aspect-16/9 w-full overflow-hidden bg-[#14141C]">
                    <img
                      src={chapter.image}
                      alt={chapter.title}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover opacity-85"
                    />
                  </div>

                  <div className="mt-6 flex items-center gap-2 text-xs text-[#A39E93]">
                    <span className="font-mono text-[#D4AF37]">{chapter.index}</span>
                    <span aria-hidden="true">·</span>
                    <span>{chapter.year}</span>
                  </div>

                  <h3 className="mt-2 font-display text-2xl font-bold text-[#F4F1EA]">
                    {chapter.title}
                  </h3>
                  <p className="mt-1 text-xs font-medium text-[#D6D1C7]">{chapter.subtitle}</p>
                  <p className="mt-4 text-sm leading-relaxed text-[#A39E93]">{chapter.summary}</p>
                  <p className="mt-3 text-sm leading-relaxed text-[#A39E93]">{chapter.detail}</p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="font-mono text-xs text-[#D4AF37] tabular-nums">
                    Reel Timecode: {formatTimecode(chapter.videoTimestamp)}
                  </span>
                  <button
                    type="button"
                    onClick={() => onReplayIntroAtTime(chapter.videoTimestamp)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-[#F4F1EA] transition-colors hover:text-[#D4AF37] focus-visible:outline-2 focus-visible:outline-[#D4AF37] whitespace-nowrap shrink-0"
                  >
                    <Play className="h-3.5 w-3.5 text-[#D4AF37]" />
                    <span>Watch Scene</span>
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* Interactive Three Concentric Walls Topology Explorer */}
          <div className="mt-16 border border-white/10 bg-[#0B0B10] p-6 sm:p-10">
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
              {/* Interactive Concentric SVG Wall Diagram */}
              <div className="flex flex-col items-center justify-center lg:col-span-5">
                <svg
                  viewBox="0 0 360 360"
                  role="img"
                  aria-label="Interactive diagram of Wall Maria, Wall Rose, and Wall Sheena"
                  className="h-72 w-72 sm:h-80 sm:w-80"
                >
                  {/* Outer Ring: Wall Maria */}
                  <circle
                    cx="180"
                    cy="180"
                    r="150"
                    fill="none"
                    stroke={selectedWall.id === 'wall-maria' ? '#DC2626' : '#3F3F46'}
                    strokeWidth={selectedWall.id === 'wall-maria' ? '4' : '2'}
                    strokeDasharray="12 6"
                    className="cursor-pointer transition-all"
                    onClick={() => setSelectedWall(THREE_WALLS_DATA[0])}
                  />
                  {/* Middle Ring: Wall Rose */}
                  <circle
                    cx="180"
                    cy="180"
                    r="105"
                    fill="none"
                    stroke={selectedWall.id === 'wall-rose' ? '#EA580C' : '#52525B'}
                    strokeWidth={selectedWall.id === 'wall-rose' ? '4' : '2'}
                    className="cursor-pointer transition-all"
                    onClick={() => setSelectedWall(THREE_WALLS_DATA[1])}
                  />
                  {/* Inner Ring: Wall Sheena */}
                  <circle
                    cx="180"
                    cy="180"
                    r="60"
                    fill="none"
                    stroke={selectedWall.id === 'wall-sheena' ? '#D4AF37' : '#71717A'}
                    strokeWidth={selectedWall.id === 'wall-sheena' ? '4' : '2'}
                    className="cursor-pointer transition-all"
                    onClick={() => setSelectedWall(THREE_WALLS_DATA[2])}
                  />
                  {/* Center Coordinate Node */}
                  <circle cx="180" cy="180" r="6" fill="#D4AF37" />
                  {/* Shiganshina Southern Outlier Gate */}
                  <rect
                    x="170"
                    y="322"
                    width="20"
                    height="14"
                    fill="#DC2626"
                    stroke="#F4F1EA"
                    strokeWidth="1.2"
                  />
                  <text
                    x="180"
                    y="352"
                    textAnchor="middle"
                    fill="#D6D1C7"
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    SHIGANSHINA GATE (SOUTH)
                  </text>
                </svg>
              </div>

              {/* Wall Dossier & Selector */}
              <div className="lg:col-span-7">
                <div className="flex items-center gap-2 text-xs text-[#D4AF37]">
                  <Compass className="h-4 w-4" />
                  <span>Interactive Fortification Cartography</span>
                </div>
                <h3 className="mt-2 font-display text-2xl font-bold text-[#F4F1EA] sm:text-3xl">
                  The Three Concentric Walls of Paradis
                </h3>

                <div className="mt-5 flex flex-wrap gap-2">
                  {THREE_WALLS_DATA.map((wall) => {
                    const isSelected = selectedWall.id === wall.id;
                    return (
                      <button
                        key={wall.id}
                        type="button"
                        onClick={() => setSelectedWall(wall)}
                        className={`border px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                          isSelected
                            ? 'border-[#D4AF37] bg-[#D4AF37]/20 text-[#FEF08A]'
                            : 'border-white/15 bg-white/[0.03] text-[#A39E93] hover:border-white/35 hover:text-[#F4F1EA]'
                        }`}
                      >
                        {wall.name}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 border-t border-white/10 pt-6">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#D6D1C7]">
                    <span className="font-display text-lg font-bold text-[#F4F1EA]">
                      {selectedWall.name}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-[#D4AF37] tabular-nums">
                      Outer Radius: {selectedWall.outerRadiusKm} km
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">
                      Elevation: {selectedWall.heightMeters}m Hardened Stone
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-[#A39E93]">
                    {selectedWall.description}
                  </p>

                  <div className="mt-4 grid grid-cols-1 gap-4 border-t border-white/10 pt-4 text-xs sm:grid-cols-2">
                    <div>
                      <span className="text-[#8C867B]">Key Districts:</span>
                      <div className="mt-1 font-medium text-[#F4F1EA]">
                        {selectedWall.districtHighlight}
                      </div>
                    </div>
                    <div>
                      <span className="text-[#8C867B]">Status During Phase 3 (00:37.0):</span>
                      <div className="mt-1 font-medium text-[#FCA5A5]">
                        {selectedWall.statusInFootage}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 3. CHARACTERS & MANIFESTATIONS (#characters) ================= */}
        <section
          id="characters"
          aria-labelledby="characters-heading"
          className="border-y border-white/10 bg-[#0A0A0F] py-24"
        >
          <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-xs text-[#D4AF37]">
                <span>02. Dramatis Personae & Titan Classifications</span>
                <span aria-hidden="true">·</span>
                <span>Frame-Indexed Archive</span>
              </div>
              <h2
                id="characters-heading"
                className="mt-3 font-display text-3xl font-bold tracking-tight text-[#F4F1EA] sm:text-4xl"
              >
                Key Figures & Manifestations in the Footage
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[#A39E93]">
                Every character and Titan entity below appears directly in the 84.4-second master
                edit. Select any dossier to inspect their lore or jump directly to their timestamp.
              </p>
            </div>

            {/* 3-in-a-Row Character Grid */}
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {CHARACTER_DOSSIERS.map((char) => (
                <article
                  key={char.id}
                  className="flex flex-col justify-between border border-white/10 bg-[#070709] transition-colors hover:border-[#D4AF37]/50"
                >
                  <div>
                    <div className="relative aspect-16/9 w-full overflow-hidden bg-[#14141C]">
                      <img
                        src={char.image}
                        alt={char.name}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#070709] via-transparent to-transparent" />
                      <span className="absolute bottom-2.5 right-3 bg-[#070709]/85 px-2.5 py-1 font-mono text-[11px] text-[#D4AF37] tabular-nums">
                        {char.firstAppearanceTimestamp}
                      </span>
                    </div>

                    <div className="p-6">
                      {/* Clean unboxed metadata with typographic separators */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#A39E93]">
                        <span>{char.role}</span>
                        <span aria-hidden="true">·</span>
                        <span>{char.affiliation}</span>
                      </div>

                      <h3 className="mt-2 font-display text-xl font-bold text-[#F4F1EA]">
                        {char.name}
                      </h3>

                      <div className="mt-1 font-mono text-xs text-[#D4AF37]">
                        {char.titanClassification}
                      </div>

                      <p className="mt-3 text-sm leading-relaxed text-[#A39E93]">
                        {char.biography}
                      </p>

                      <div className="mt-4 border-t border-white/10 pt-3 text-xs text-[#D6D1C7]">
                        {char.keyAttributes.join(' · ')}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/10 px-6 py-4">
                    <button
                      type="button"
                      onClick={() => setSelectedCharacter(char)}
                      className="text-xs font-semibold text-[#D6D1C7] transition-colors hover:text-[#F4F1EA] whitespace-nowrap shrink-0"
                    >
                      Read Full Dossier
                    </button>

                    <button
                      type="button"
                      onClick={() => onReplayIntroAtTime(char.videoTimestamp)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-[#D4AF37] transition-colors hover:text-[#FEF08A] whitespace-nowrap shrink-0"
                    >
                      <Play className="h-3.5 w-3.5" />
                      <span>Jump to {formatTimecode(char.videoTimestamp)}</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ================= 4. MASTER 84.4s TIMELINE & EFFECT ARCHITECTURE (#chronicle) ================= */}
        <section
          id="chronicle"
          aria-labelledby="chronicle-heading"
          className="mx-auto max-w-[1280px] px-6 py-24 lg:px-12"
        >
          <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-10 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-xs text-[#D4AF37]">
                <span>03. Synchronization Engineering</span>
                <span aria-hidden="true">·</span>
                <span>Master Clock Blueprint</span>
              </div>
              <h2
                id="chronicle-heading"
                className="mt-3 font-display text-3xl font-bold tracking-tight text-[#F4F1EA] sm:text-4xl"
              >
                84.4-Second Timeline & Effect Matrix
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[#A39E93]">
                Inspect how the website’s lighting, SVG lightning, stone cracks, and particle
                controllers react to every half-second boundary of the uploaded footage. Click any
                interval to launch the video player at that exact timestamp.
              </p>
            </div>

            {/* Phase Filter Tabs */}
            <div
              role="tablist"
              aria-label="Inspect timeline segments by phase"
              className="flex flex-wrap gap-1.5 bg-[#111116] p-1.5 border border-white/10"
            >
              {PHASE_SUMMARIES.map((p) => {
                const isSelected = activeChroniclePhase === p.id;
                return (
                  <button
                    key={p.id}
                    role="tab"
                    aria-selected={isSelected}
                    type="button"
                    onClick={() => setActiveChroniclePhase(p.id)}
                    className={`px-3.5 py-2 font-mono text-xs transition-colors whitespace-nowrap shrink-0 tabular-nums ${
                      isSelected
                        ? 'bg-[#D4AF37] text-[#070709] font-semibold'
                        : 'text-[#A39E93] hover:text-[#F4F1EA]'
                    }`}
                  >
                    Phase 0{p.number}: {p.title}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sub-Segments Table / Cards for Selected Phase */}
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {filteredSegments.map((seg) => (
              <div
                key={seg.id}
                className="flex flex-col justify-between border border-white/10 bg-[#0D0D12] p-6 transition-colors hover:border-[#D4AF37]/40"
              >
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-mono text-xs font-semibold text-[#D4AF37] tabular-nums">
                      {formatTimecode(seg.startTime)} – {formatTimecode(seg.endTime)}
                    </span>
                    <span className="font-mono text-[11px] text-[#A39E93]">
                      Nav Glow: {seg.navigation.borderGlow.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="mt-2 font-display text-lg font-bold text-[#F4F1EA]">
                    {seg.subTitle}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#A39E93]">{seg.description}</p>
                </div>

                {/* Telemetry Readout of Active Effect Multipliers */}
                <div className="mt-6 border-t border-white/10 pt-4">
                  <div className="grid grid-cols-4 gap-2 font-mono text-[11px] text-[#D6D1C7] tabular-nums">
                    <div>
                      <span className="text-[#8C867B]">Light:</span>{' '}
                      {Math.round(seg.lighting.intensity * 100)}%
                    </div>
                    <div>
                      <span className="text-[#8C867B]">Sparks:</span>{' '}
                      {Math.round(seg.particles.sparksDensity * 100)}%
                    </div>
                    <div>
                      <span className="text-[#8C867B]">Smoke:</span>{' '}
                      {Math.round(seg.smoke.density * 100)}%
                    </div>
                    <div>
                      <span className="text-[#8C867B]">Cracks:</span>{' '}
                      {Math.round(seg.cracks.intensity * 100)}%
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => onReplayIntroAtTime(seg.startTime)}
                      className="flex items-center gap-1.5 border border-[#D4AF37]/60 bg-[#D4AF37]/10 px-3.5 py-1.5 text-xs font-semibold text-[#FEF08A] transition-colors hover:bg-[#D4AF37] hover:text-[#070709] whitespace-nowrap shrink-0"
                    >
                      <Play className="h-3 w-3" />
                      <span>Test Sync at {formatTimecode(seg.startTime)}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Impact Events Quick-Jump Strip */}
          <div className="mt-10 border border-white/10 bg-[#0B0B10] p-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#F4F1EA]">
              <Sparkles className="h-4 w-4 text-[#D4AF37]" />
              <span>Discrete Impact & Screen-Shake Checkpoints (Click to Verify in Player)</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {IMPACT_EVENTS.map((ev) => (
                <button
                  key={ev.id}
                  type="button"
                  onClick={() => onReplayIntroAtTime(Math.max(0, ev.timestamp - 0.3))}
                  className="border border-white/15 bg-black/50 px-3 py-1.5 font-mono text-xs text-[#D6D1C7] transition-colors hover:border-[#D4AF37] hover:text-[#FEF08A] whitespace-nowrap shrink-0 tabular-nums"
                >
                  {formatTimecode(ev.timestamp)} · {ev.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ================= 5. CONCEPT STORE — DEMONSTRATION ONLY (#concept-store) ================= */}
        <ConceptStoreSection onJumpToVideoTimestamp={onReplayIntroAtTime} />
      </main>

      {/* Character Dossier Modal */}
      {selectedCharacter && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="char-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setSelectedCharacter(null)}
        >
          <div
            className="w-full max-w-2xl border border-white/20 bg-[#0B0B10] p-6 text-[#F4F1EA] sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <div className="text-xs text-[#D4AF37]">{selectedCharacter.role}</div>
                <h3 id="char-modal-title" className="mt-1 font-display text-2xl font-bold">
                  {selectedCharacter.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCharacter(null)}
                className="border border-white/15 px-3 py-1 text-xs text-[#A39E93] hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="mt-5 aspect-16/9 w-full overflow-hidden border border-white/10">
              <img
                src={selectedCharacter.image}
                alt={selectedCharacter.name}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
            </div>

            <blockquote className="mt-5 border-y border-white/10 py-3 font-display text-sm italic text-[#FEF08A]">
              “{selectedCharacter.quote}”
            </blockquote>

            <p className="mt-4 text-sm leading-relaxed text-[#A39E93]">
              {selectedCharacter.biography}
            </p>

            <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
              <span className="font-mono text-xs text-[#D4AF37] tabular-nums">
                Appearance: {selectedCharacter.firstAppearanceTimestamp}
              </span>
              <button
                type="button"
                onClick={() => {
                  const ts = selectedCharacter.videoTimestamp;
                  setSelectedCharacter(null);
                  onReplayIntroAtTime(ts);
                }}
                className="flex items-center gap-2 border border-[#D4AF37] bg-[#D4AF37]/20 px-4 py-2 text-xs font-semibold text-[#FEF08A] hover:bg-[#D4AF37]/30"
              >
                <Play className="h-3.5 w-3.5" />
                <span>Watch Scene at {formatTimecode(selectedCharacter.videoTimestamp)}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quiet Editorial Footer */}
      <footer className="border-t border-white/10 bg-[#050507] px-6 py-12 text-xs text-[#8C867B] lg:px-12">
        <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <div className="font-display text-sm font-bold tracking-[0.24em] text-[#F4F1EA]">
              SHŌT
            </div>
            <p className="mt-1">
              Non-commercial frontend engineering & interactive motion portfolio showcase. Not
              affiliated with Hajime Isayama, Kodansha, or the Attack on Titan production committee.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <a href="#overview" className="hover:text-[#F4F1EA]">
              Overview
            </a>
            <a href="#story-world" className="hover:text-[#F4F1EA]">
              Story & World
            </a>
            <a href="#chronicle" className="hover:text-[#F4F1EA]">
              84.4s Timeline
            </a>
            <a href="#concept-store" className="hover:text-[#F4F1EA]">
              Concept Store
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
