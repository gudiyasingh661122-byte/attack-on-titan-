import React from 'react';

interface SvgEffectsOverlayProps {
  lightningGroupRef: React.RefObject<SVGGElement | null>;
  pathsGroupRef: React.RefObject<SVGGElement | null>;
  crackGroupRef: React.RefObject<SVGGElement | null>;
}

export const SvgEffectsOverlay: React.FC<SvgEffectsOverlayProps> = ({
  lightningGroupRef,
  pathsGroupRef,
  crackGroupRef,
}) => {
  return (
    <svg
      viewBox="0 0 1920 1080"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20 h-full w-full"
    >
      <defs>
        <filter id="gold-lightning-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur1" />
          <feGaussianBlur stdDeviation="16" result="blur2" />
          <feMerge>
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="paths-energy-grad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fef08a" stopOpacity="0.1" />
          <stop offset="50%" stopColor="#fef9c3" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* Phase 1 (00:12 - 00:21.5): White-Gold Branching Paths Energy */}
      <g
        ref={pathsGroupRef}
        style={{ opacity: 0, transition: 'opacity 0.25s ease-out' }}
        stroke="url(#paths-energy-grad)"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="180 240"
        filter="url(#gold-lightning-glow)"
      >
        <path
          d="M 80 1040 Q 290 760 440 520 T 860 110"
          strokeWidth="2.2"
        />
        <path
          d="M 280 940 Q 430 680 610 590 T 980 210"
          strokeWidth="1.4"
        />
        <path
          d="M 1840 1020 Q 1620 740 1480 480 T 1060 90"
          strokeWidth="2.2"
        />
        <path
          d="M 1640 930 Q 1490 670 1310 580 T 940 200"
          strokeWidth="1.4"
        />
      </g>

      {/* Phase 2 (00:28.5 - 00:36.5): Branching Golden Lightning Arcs */}
      <g
        ref={lightningGroupRef}
        style={{ opacity: 0 }}
        filter="url(#gold-lightning-glow)"
        fill="none"
      >
        {/* Main Sky-to-Horizon Lightning Column & Branches */}
        <path
          d="M 960 0 L 942 140 L 978 265 L 935 410 L 968 545 L 950 720 L 962 880"
          stroke="#fef9c3"
          strokeWidth="6"
        />
        <path
          d="M 942 140 L 820 230 L 735 215 L 620 310 L 510 385"
          stroke="#fde047"
          strokeWidth="3.2"
        />
        <path
          d="M 978 265 L 1120 330 L 1245 310 L 1390 420 L 1510 470"
          stroke="#fde047"
          strokeWidth="3.2"
        />
        <path
          d="M 935 410 L 780 495 L 670 590 L 540 660"
          stroke="#f59e0b"
          strokeWidth="2.4"
        />
        <path
          d="M 968 545 L 1110 615 L 1230 700 L 1360 760"
          stroke="#f59e0b"
          strokeWidth="2.4"
        />
        {/* Sky Shockwave Ellipses */}
        <ellipse
          cx="960"
          cy="190"
          rx="540"
          ry="72"
          stroke="#fef08a"
          strokeWidth="1.8"
          strokeDasharray="40 24"
          opacity="0.7"
        />
        <ellipse
          cx="960"
          cy="210"
          rx="780"
          ry="105"
          stroke="#f59e0b"
          strokeWidth="1.2"
          strokeDasharray="60 35"
          opacity="0.5"
        />
      </g>

      {/* Phases 3-5 (00:37.0 - 00:84.4): Structural Stone Cracks & Crimson Fissures */}
      <g
        ref={crackGroupRef}
        style={{ opacity: 0, transition: 'opacity 0.3s ease-out' }}
        fill="none"
        strokeLinecap="square"
      >
        {/* Top-Left Corner Wall Fissures */}
        <path
          d="M 0 120 L 95 155 L 160 135 L 245 210 L 310 195 L 385 270"
          stroke="#ef4444"
          strokeWidth="2.2"
        />
        <path
          d="M 160 135 L 185 65 L 240 20"
          stroke="#dc2626"
          strokeWidth="1.5"
        />
        <path
          d="M 245 210 L 210 310 L 255 390"
          stroke="#f97316"
          strokeWidth="1.4"
        />

        {/* Top-Right Corner Wall Fissures */}
        <path
          d="M 1920 140 L 1810 175 L 1735 150 L 1650 230 L 1570 215 L 1490 295"
          stroke="#ef4444"
          strokeWidth="2.2"
        />
        <path
          d="M 1735 150 L 1700 70 L 1655 15"
          stroke="#dc2626"
          strokeWidth="1.5"
        />

        {/* Bottom-Left Structural Fractures */}
        <path
          d="M 0 920 L 115 875 L 210 905 L 315 830 L 410 865"
          stroke="#dc2626"
          strokeWidth="2"
        />
        <path
          d="M 210 905 L 265 985 L 295 1080"
          stroke="#ea580c"
          strokeWidth="1.5"
        />

        {/* Bottom-Right Structural Fractures */}
        <path
          d="M 1920 910 L 1795 865 L 1690 895 L 1585 820 L 1495 855"
          stroke="#dc2626"
          strokeWidth="2"
        />
        <path
          d="M 1690 895 L 1640 980 L 1605 1080"
          stroke="#ea580c"
          strokeWidth="1.5"
        />
      </g>
    </svg>
  );
};
