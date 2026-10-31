import {
  IMPACT_EVENTS,
  ImpactEvent,
  PhaseId,
  TIMELINE_SEGMENTS,
  TimelineSubSegment,
  VIDEO_DURATION,
} from '../../data/timelineEvents';

export type NavDestructionStage =
  | 'intact'
  | 'cracking'
  | 'fragmenting'
  | 'falling'
  | 'dissolved';

export type FragmentSizeTier = 'tiny' | 'small' | 'medium' | 'large';

export interface NavFragmentSpec {
  id: string;
  index: number;
  clipPath: string;
  svgPoints: string;
  centroidX: number; // 0..100%
  centroidY: number; // 0..100%
  sizeTier: FragmentSizeTier;
  isSplinter: boolean;
  breakDelaySec: number; // offset after box breakStartTime
  fallDurationSec: number; // total lifetime before full disappearance
  vx: number; // px/sec horizontal blast drift
  vy0: number; // px/sec initial downward velocity
  gravity: number; // px/sec^2 downward acceleration
  rotXSpeed: number; // deg/sec
  rotYSpeed: number; // deg/sec
  rotZSpeed: number; // deg/sec
  flutterAmp: number; // px horizontal paper-like air flutter
  flutterFreq: number; // rad/sec
}

export interface ComputedFragmentTransform {
  opacity: number;
  dx: number;
  dy: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  scale: number;
  blurPx: number;
}

export interface ComputedBoxDestructionState {
  boxIndex: number;
  stage: NavDestructionStage;
  crackProgress: number; // 0..1
  intactBoxOpacity: number; // 1 while intact/cracking, 0 once fragmented
  fragmentsVisible: boolean;
  crackTremorOffset: { x: number; y: number; rot: number };
  fragments: ComputedFragmentTransform[];
}

export interface ComputedCinematicState {
  currentTime: number;
  progress: number; // 0 to 1
  segment: TimelineSubSegment;
  segmentProgress: number; // 0 to 1 within current segment
  phaseId: PhaseId;
  phaseNumber: number;
  phaseTitle: string;
  subTitle: string;
  lighting: TimelineSubSegment['lighting'];
  particles: TimelineSubSegment['particles'];
  smoke: TimelineSubSegment['smoke'] & { endTransitionOpacity: number };
  debris: TimelineSubSegment['debris'];
  cracks: TimelineSubSegment['cracks'];
  lightning: TimelineSubSegment['lightning'];
  navigation: TimelineSubSegment['navigation'] & {
    destructionStage: NavDestructionStage;
    boxes: ComputedBoxDestructionState[];
  };
  activeImpact: ImpactEvent | null;
  shakeOffset: { x: number; y: number; rotation: number };
  flashOpacity: number;
  flashColor: string;
  isEndingTransition: boolean;
}

/**
 * 10 organic, irregular polygonal shards that seamlessly tessellate 100% of a navigation box (0..100 x 0..100)
 * plus 4 fine paper-like fracture splinters along the seams = 14 high-impact fragments per box (70 total across 5 boxes).
 * Preserves detailed, non-grid physical shattering while cutting DOM layer overhead by ~36%.
 */
const BASE_TESSELLATION_POLYGONS: Array<{
  points: Array<[number, number]>;
  tier: FragmentSizeTier;
  isSplinter?: boolean;
}> = [
  // Top row irregular polygons (5 shards covering y: 0..48)
  {
    points: [
      [0, 0],
      [22, 0],
      [16, 46],
      [0, 38],
    ],
    tier: 'small',
  },
  {
    points: [
      [22, 0],
      [46, 0],
      [39, 52],
      [16, 46],
    ],
    tier: 'large',
  },
  {
    points: [
      [46, 0],
      [68, 0],
      [62, 44],
      [39, 52],
    ],
    tier: 'medium',
  },
  {
    points: [
      [68, 0],
      [86, 0],
      [81, 49],
      [62, 44],
    ],
    tier: 'small',
  },
  {
    points: [
      [86, 0],
      [100, 0],
      [100, 44],
      [81, 49],
    ],
    tier: 'tiny',
  },
  // Bottom row irregular polygons (5 shards covering y: 38..100)
  {
    points: [
      [0, 38],
      [16, 46],
      [24, 100],
      [0, 100],
    ],
    tier: 'medium',
  },
  {
    points: [
      [16, 46],
      [39, 52],
      [48, 100],
      [24, 100],
    ],
    tier: 'large',
  },
  {
    points: [
      [39, 52],
      [62, 44],
      [71, 100],
      [48, 100],
    ],
    tier: 'large',
  },
  {
    points: [
      [62, 44],
      [81, 49],
      [88, 100],
      [71, 100],
    ],
    tier: 'medium',
  },
  {
    points: [
      [81, 49],
      [100, 44],
      [100, 100],
      [88, 100],
    ],
    tier: 'small',
  },
  // 4 fine paper-like internal fracture splinters (tiny fast-falling shards)
  {
    points: [
      [14, 28],
      [27, 22],
      [21, 54],
    ],
    tier: 'tiny',
    isSplinter: true,
  },
  {
    points: [
      [36, 32],
      [51, 26],
      [43, 60],
    ],
    tier: 'tiny',
    isSplinter: true,
  },
  {
    points: [
      [58, 28],
      [73, 36],
      [64, 62],
    ],
    tier: 'tiny',
    isSplinter: true,
  },
  {
    points: [
      [77, 30],
      [92, 24],
      [84, 58],
    ],
    tier: 'tiny',
    isSplinter: true,
  },
];

const BOX_FRAGMENT_SPECS_CACHE: Map<number, NavFragmentSpec[]> = new Map();

/**
 * Generates and caches deterministic irregular polygonal fragment definitions for a navigation box (0..4).
 */
export function getNavBoxFragmentSpecs(boxIndex: number): NavFragmentSpec[] {
  const cached = BOX_FRAGMENT_SPECS_CACHE.get(boxIndex);
  if (cached) return cached;

  const specs: NavFragmentSpec[] = BASE_TESSELLATION_POLYGONS.map((poly, idx) => {
    const seed = (boxIndex + 1) * 37 + (idx + 1) * 19;
    const sinSeed = Math.sin(seed);
    const cosSeed = Math.cos(seed * 1.3);

    const cx =
      poly.points.reduce((acc, pt) => acc + pt[0], 0) / poly.points.length;
    const cy =
      poly.points.reduce((acc, pt) => acc + pt[1], 0) / poly.points.length;

    const clipPath = `polygon(${poly.points
      .map(([px, py]) => `${px}% ${py}%`)
      .join(', ')})`;
    const svgPoints = poly.points.map(([px, py]) => `${px},${py}`).join(' ');

    let fallDurationSec = 24;
    let vy0 = 42;
    let gravity = 22;

    if (poly.tier === 'tiny') {
      fallDurationSec = 7.5 + Math.abs(sinSeed) * 4.5; // Gone by ~49s - 53s
      vy0 = 78 + Math.abs(cosSeed) * 35;
      gravity = 38 + Math.abs(sinSeed) * 14;
    } else if (poly.tier === 'small') {
      fallDurationSec = 14.0 + Math.abs(sinSeed) * 6.0; // Gone by ~55s - 61s
      vy0 = 56 + Math.abs(cosSeed) * 24;
      gravity = 28 + Math.abs(sinSeed) * 10;
    } else if (poly.tier === 'medium') {
      fallDurationSec = 22.0 + Math.abs(sinSeed) * 7.0; // Gone by ~63s - 70s
      vy0 = 42 + Math.abs(cosSeed) * 18;
      gravity = 21 + Math.abs(sinSeed) * 8;
    } else {
      // 'large'
      fallDurationSec = 30.0 + Math.abs(sinSeed) * 6.5; // Gone by ~71s - 78s (all gone before 80s / 84.4s)
      vy0 = 32 + Math.abs(cosSeed) * 14;
      gravity = 16.5 + Math.abs(sinSeed) * 6;
    }

    const radialDirX = (cx - 50) / 50;
    const vx = radialDirX * (34 + Math.abs(sinSeed) * 28) + cosSeed * 18;

    const breakDelaySec =
      Math.abs(sinSeed) * 0.42 + (poly.isSplinter ? 0.0 : 0.1);

    return {
      id: `box-${boxIndex}-frag-${idx}`,
      index: idx,
      clipPath,
      svgPoints,
      centroidX: cx,
      centroidY: cy,
      sizeTier: poly.tier,
      isSplinter: Boolean(poly.isSplinter),
      breakDelaySec,
      fallDurationSec,
      vx,
      vy0,
      gravity,
      rotXSpeed: (sinSeed >= 0 ? 1 : -1) * (65 + Math.abs(cosSeed) * 95),
      rotYSpeed: (cosSeed >= 0 ? 1 : -1) * (55 + Math.abs(sinSeed) * 85),
      rotZSpeed: radialDirX * 75 + sinSeed * 48,
      flutterAmp: poly.tier === 'tiny' || poly.tier === 'small' ? 14 : 8,
      flutterFreq: 2.6 + Math.abs(sinSeed) * 2.2,
    };
  });

  BOX_FRAGMENT_SPECS_CACHE.set(boxIndex, specs);
  return specs;
}

const BOX_CRACK_START_TIMES = [37.0, 37.2, 37.35, 37.15, 37.3];
const BOX_BREAK_START_TIMES = [40.4, 40.75, 41.05, 40.6, 40.9];

// Pre-allocated neutral fragment array for intact/cracking/dissolved states to avoid GC pressure at 60fps
const ZERO_FRAGMENTS_CACHE: Map<number, ComputedFragmentTransform[]> = new Map();

function getZeroFragments(count: number): ComputedFragmentTransform[] {
  let cached = ZERO_FRAGMENTS_CACHE.get(count);
  if (!cached) {
    cached = Array.from({ length: count }, () => ({
      opacity: 0,
      dx: 0,
      dy: 0,
      rotX: 0,
      rotY: 0,
      rotZ: 0,
      scale: 1,
      blurPx: 0,
    }));
    ZERO_FRAGMENTS_CACHE.set(count, cached);
  }
  return cached;
}

/**
 * Computes the exact physical destruction state and fragment transforms for a navigation box at `currentTime`.
 */
export function computeBoxDestructionState(
  boxIndex: number,
  currentTime: number,
  prefersReducedMotion = false
): ComputedBoxDestructionState {
  const specs = getNavBoxFragmentSpecs(boxIndex);
  const crackStart = BOX_CRACK_START_TIMES[boxIndex] ?? 37.0;
  const breakStart = BOX_BREAK_START_TIMES[boxIndex] ?? 40.6;

  // 1. Before 37.0s: 100% Intact (fast-path: zero per-fragment math or allocations)
  if (currentTime < crackStart) {
    return {
      boxIndex,
      stage: 'intact',
      crackProgress: 0,
      intactBoxOpacity: 1,
      fragmentsVisible: false,
      crackTremorOffset: { x: 0, y: 0, rot: 0 },
      fragments: getZeroFragments(specs.length),
    };
  }

  // 2. Stage A (37.0s -> ~40.6s): Initial Cracks spreading across intact box + subtle impact shakes
  if (currentTime < breakStart) {
    const crackProgress = Math.min(
      1,
      Math.max(0.08, (currentTime - crackStart) / (breakStart - crackStart))
    );
    const tremorIntensity = prefersReducedMotion ? 0 : crackProgress * 2.6;
    const angle = currentTime * 68 + boxIndex * 11;
    return {
      boxIndex,
      stage: 'cracking',
      crackProgress,
      intactBoxOpacity: 1,
      fragmentsVisible: false,
      crackTremorOffset: {
        x: Math.sin(angle) * tremorIntensity,
        y: Math.cos(angle * 1.3) * tremorIntensity * 0.7,
        rot: Math.sin(angle * 0.8) * (tremorIntensity * 0.35),
      },
      fragments: getZeroFragments(specs.length),
    };
  }

  // Fast-path after 80.5s: All fragments have completely dissolved
  if (currentTime >= 80.5) {
    return {
      boxIndex,
      stage: 'dissolved',
      crackProgress: 1,
      intactBoxOpacity: 0,
      fragmentsVisible: false,
      crackTremorOffset: { x: 0, y: 0, rot: 0 },
      fragments: getZeroFragments(specs.length),
    };
  }

  // 3. Stage B, C, D (~40.6s -> 80.5s): Fragmentation -> Falling -> Gradual Disappearance
  let anyVisible = false;
  const elapsedSinceBoxBreak = currentTime - breakStart;
  const motionScale = prefersReducedMotion ? 0.35 : 1;

  const fragments: ComputedFragmentTransform[] = specs.map((spec) => {
    const t = elapsedSinceBoxBreak - spec.breakDelaySec;

    if (t <= 0) {
      anyVisible = true;
      return {
        opacity: 1,
        dx: 0,
        dy: 0,
        rotX: 0,
        rotY: 0,
        rotZ: 0,
        scale: 1,
        blurPx: 0,
      };
    }

    const lifeProgress = t / spec.fallDurationSec;
    if (lifeProgress >= 1) {
      return {
        opacity: 0,
        dx: 0,
        dy: 0,
        rotX: 0,
        rotY: 0,
        rotZ: 0,
        scale: 0.4,
        blurPx: 0,
      };
    }

    anyVisible = true;

    const separationPop = t < 0.55 ? t / 0.55 : 1;
    const radialPushX = ((spec.centroidX - 50) * 0.28) * separationPop;
    const radialPushY = ((spec.centroidY - 50) * 0.2) * separationPop;

    const flutterRamp = t < 1.2 ? t / 1.2 : 1;
    const flutter =
      Math.sin(t * spec.flutterFreq + spec.index) *
      spec.flutterAmp *
      flutterRamp;

    const dx = (radialPushX + spec.vx * t + flutter) * motionScale;
    const dy =
      (radialPushY + spec.vy0 * t + 0.5 * spec.gravity * t * t) * motionScale;

    const rotX = spec.rotXSpeed * t * motionScale;
    const rotY = spec.rotYSpeed * t * motionScale;
    const rotZ = spec.rotZSpeed * t * motionScale;

    const fadeStart =
      spec.sizeTier === 'tiny'
        ? 0.25
        : spec.sizeTier === 'small'
        ? 0.35
        : 0.45;
    const opacity =
      lifeProgress <= fadeStart
        ? 1
        : Math.max(
            0,
            Math.pow(1 - (lifeProgress - fadeStart) / (1 - fadeStart), 1.45)
          );

    const scale =
      lifeProgress <= 0.3
        ? 1
        : Math.max(
            spec.sizeTier === 'tiny' ? 0.32 : 0.52,
            1 - (lifeProgress - 0.3) * 0.6
          );

    return {
      opacity,
      dx,
      dy,
      rotX,
      rotY,
      rotZ,
      scale,
      blurPx: 0,
    };
  });

  const stage: NavDestructionStage = !anyVisible
    ? 'dissolved'
    : elapsedSinceBoxBreak < 2.2
    ? 'fragmenting'
    : 'falling';

  return {
    boxIndex,
    stage,
    crackProgress: 1,
    intactBoxOpacity: 0,
    fragmentsVisible: anyVisible,
    crackTremorOffset: { x: 0, y: 0, rot: 0 },
    fragments,
  };
}

/**
 * Pure deterministic function that resolves the exact timeline sub-segment for any timestamp `t`.
 */
export function getSegmentAtTime(currentTime: number): TimelineSubSegment {
  const clamped = Math.max(0, Math.min(currentTime, VIDEO_DURATION));
  for (let i = 0; i < TIMELINE_SEGMENTS.length; i++) {
    const seg = TIMELINE_SEGMENTS[i];
    if (clamped >= seg.startTime && clamped < seg.endTime) {
      return seg;
    }
  }
  return TIMELINE_SEGMENTS[TIMELINE_SEGMENTS.length - 1];
}

/**
 * Evaluates whether an impact event is currently active at `currentTime`
 * and computes exponentially decaying shake and flash intensity.
 */
export function evaluateActiveImpact(
  currentTime: number,
  prefersReducedMotion = false
): {
  impact: ImpactEvent | null;
  decayFactor: number;
  shakeOffset: { x: number; y: number; rotation: number };
  flashOpacity: number;
  flashColor: string;
} {
  if (prefersReducedMotion) {
    return {
      impact: null,
      decayFactor: 0,
      shakeOffset: { x: 0, y: 0, rotation: 0 },
      flashOpacity: 0,
      flashColor: 'transparent',
    };
  }

  for (let i = IMPACT_EVENTS.length - 1; i >= 0; i--) {
    const ev = IMPACT_EVENTS[i];
    const durationSec = ev.durationMs / 1000;
    const elapsed = currentTime - ev.timestamp;
    if (elapsed >= 0 && elapsed <= durationSec) {
      const normalized = elapsed / durationSec;
      const decayFactor = Math.pow(1 - normalized, 2.2);
      const amplitudePx = ev.shakeIntensity * 14 * decayFactor;
      const angle = elapsed * 95;
      const x = Math.sin(angle) * amplitudePx;
      const y = Math.cos(angle * 1.3) * amplitudePx * 0.75;
      const rotation =
        Math.sin(angle * 0.7) * ev.shakeIntensity * 0.8 * decayFactor;

      return {
        impact: ev,
        decayFactor,
        shakeOffset: { x, y, rotation },
        flashOpacity: ev.flashIntensity * Math.pow(1 - normalized, 2.6),
        flashColor: ev.flashColor,
      };
    }
  }

  return {
    impact: null,
    decayFactor: 0,
    shakeOffset: { x: 0, y: 0, rotation: 0 },
    flashOpacity: 0,
    flashColor: 'transparent',
  };
}

/**
 * Computes the complete synchronized visual state for any given video timestamp `currentTime`.
 */
export function computeCinematicState(
  currentTime: number,
  prefersReducedMotion = false
): ComputedCinematicState {
  const clampedTime = Math.max(0, Math.min(currentTime, VIDEO_DURATION));
  const progress = clampedTime / VIDEO_DURATION;
  const segment = getSegmentAtTime(clampedTime);
  const segmentDuration = Math.max(0.1, segment.endTime - segment.startTime);
  const segmentProgress = Math.max(
    0,
    Math.min(1, (clampedTime - segment.startTime) / segmentDuration)
  );

  const impactEval = evaluateActiveImpact(clampedTime, prefersReducedMotion);

  const boxes = [0, 1, 2, 3, 4].map((idx) =>
    computeBoxDestructionState(idx, clampedTime, prefersReducedMotion)
  );

  const destructionStage: NavDestructionStage = boxes[0].stage;

  const isEndingTransition = clampedTime >= 81.2;
  const endTransitionOpacity = isEndingTransition
    ? Math.min(1, Math.max(0, (clampedTime - 81.2) / (VIDEO_DURATION - 81.2)))
    : 0;

  return {
    currentTime: clampedTime,
    progress,
    segment,
    segmentProgress,
    phaseId: segment.phaseId,
    phaseNumber: segment.phaseNumber,
    phaseTitle: segment.phaseTitle,
    subTitle: segment.subTitle,
    lighting: prefersReducedMotion
      ? {
          ...segment.lighting,
          radialPulse: segment.lighting.radialPulse * 0.3,
          eyeDistortion: 0,
          cameraZoom: 1.0,
        }
      : segment.lighting,
    particles: prefersReducedMotion
      ? {
          ...segment.particles,
          dustDensity: segment.particles.dustDensity * 0.35,
          sparksDensity: segment.particles.sparksDensity * 0.25,
          ashDensity: segment.particles.ashDensity * 0.35,
        }
      : segment.particles,
    smoke: {
      ...segment.smoke,
      speed: prefersReducedMotion ? 0.2 : segment.smoke.speed,
      endTransitionOpacity,
    },
    debris: prefersReducedMotion
      ? { density: 0, scale: segment.debris.scale }
      : segment.debris,
    cracks: segment.cracks,
    lightning: prefersReducedMotion
      ? {
          ...segment.lightning,
          intensity: segment.lightning.intensity * 0.4,
        }
      : segment.lightning,
    navigation: {
      visible: true,
      revealProgress: 1,
      borderGlow: segment.navigation.borderGlow,
      cracked: clampedTime >= 37.0,
      destructionStage,
      boxes,
    },
    activeImpact: impactEval.impact,
    shakeOffset: impactEval.shakeOffset,
    flashOpacity: impactEval.flashOpacity,
    flashColor: impactEval.flashColor,
    isEndingTransition,
  };
}

/**
 * ImpactTracker prevents duplicate discrete GSAP triggers during normal forward playback
 * while resetting cleanly when the user seeks or replays the video.
 */
export class ImpactTriggerTracker {
  private triggeredIds = new Set<string>();
  private lastTime = 0;

  public checkTrigger(currentTime: number): ImpactEvent | null {
    if (currentTime < this.lastTime - 0.15 || currentTime > this.lastTime + 1.2) {
      this.resetForSeek(currentTime);
    }
    this.lastTime = currentTime;

    for (const ev of IMPACT_EVENTS) {
      const windowEnd = ev.timestamp + 0.35;
      if (
        currentTime >= ev.timestamp &&
        currentTime <= windowEnd &&
        !this.triggeredIds.has(ev.id)
      ) {
        this.triggeredIds.add(ev.id);
        return ev;
      }
    }
    return null;
  }

  public resetForSeek(targetTime: number): void {
    this.triggeredIds.clear();
    for (const ev of IMPACT_EVENTS) {
      if (ev.timestamp < targetTime - 0.1) {
        this.triggeredIds.add(ev.id);
      }
    }
    this.lastTime = targetTime;
  }

  public resetAll(): void {
    this.triggeredIds.clear();
    this.lastTime = 0;
  }
}

export function formatTimecode(seconds: number): string {
  const clamped = Math.max(0, seconds);
  const mins = Math.floor(clamped / 60);
  const secs = clamped % 60;
  const minsStr = String(mins).padStart(2, '0');
  const secsWhole = String(Math.floor(secs)).padStart(2, '0');
  const tenths = Math.floor((secs - Math.floor(secs)) * 10);
  return `${minsStr}:${secsWhole}.${tenths}`;
}
