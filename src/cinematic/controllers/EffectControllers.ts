import gsap from 'gsap';
import {
  computeCinematicState,
  ComputedCinematicState,
  ImpactTriggerTracker,
  NavDestructionStage,
} from '../timeline/timelineEngine';
import { ImpactEvent } from '../../data/timelineEvents';

/**
 * 1. LightingController
 * Controls ambient perimeter glow, radial iris pulse, Paths golden energy, and impact flashes via cached DOM refs.
 */
export class LightingController {
  private ambientEl: HTMLElement | null = null;
  private radialEl: HTMLElement | null = null;
  private flashEl: HTMLElement | null = null;
  private videoWrapperEl: HTMLElement | null = null;
  private lastColor = '';
  private lastSecondary = '';
  private wasFlashActive = true;

  public bind(
    ambientEl: HTMLElement | null,
    radialEl: HTMLElement | null,
    flashEl: HTMLElement | null,
    videoWrapperEl: HTMLElement | null
  ) {
    this.ambientEl = ambientEl;
    this.radialEl = radialEl;
    this.flashEl = flashEl;
    this.videoWrapperEl = videoWrapperEl;
    this.lastColor = '';
    this.lastSecondary = '';
    this.wasFlashActive = true;
  }

  public update(state: ComputedCinematicState) {
    if (this.ambientEl) {
      const { color, secondaryColor, intensity } = state.lighting;
      this.ambientEl.style.opacity = (Math.min(0.88, intensity * 0.85)).toFixed(2);
      if (color !== this.lastColor || secondaryColor !== this.lastSecondary) {
        this.lastColor = color;
        this.lastSecondary = secondaryColor;
        this.ambientEl.style.background = `radial-gradient(circle at 50% 50%, transparent 40%, ${color}40 75%, ${secondaryColor}80 100%)`;
      }
    }

    if (this.radialEl) {
      const { radialPulse, eyeDistortion } = state.lighting;
      const op = Math.max(radialPulse * 0.55, eyeDistortion * 0.45);
      this.radialEl.style.opacity = op.toFixed(2);
      if (op > 0.02) {
        const pulseScale = 1 + Math.sin(state.currentTime * 3.2) * 0.035 * radialPulse;
        this.radialEl.style.transform = `scale3d(${pulseScale.toFixed(3)}, ${pulseScale.toFixed(3)}, 1)`;
      }
    }

    if (this.flashEl) {
      if (state.flashOpacity > 0.005) {
        this.wasFlashActive = true;
        this.flashEl.style.opacity = state.flashOpacity.toFixed(3);
        this.flashEl.style.backgroundColor = state.flashColor;
      } else if (this.wasFlashActive) {
        this.wasFlashActive = false;
        this.flashEl.style.opacity = '0';
      }
    }

    if (this.videoWrapperEl) {
      const zoom = state.lighting.cameraZoom;
      const { x, y, rotation } = state.shakeOffset;
      this.videoWrapperEl.style.transform = `translate3d(${x.toFixed(
        1
      )}px, ${y.toFixed(1)}px, 0) scale3d(${zoom.toFixed(
        3
      )}, ${zoom.toFixed(3)}, 1) rotate(${rotation.toFixed(2)}deg)`;
    }
  }
}

/**
 * 2. ScreenShakeController
 * Triggers temporary GSAP impact jolts on UI layers without continuous shaking.
 */
export class ScreenShakeController {
  private stageEl: HTMLElement | null = null;

  public bind(stageEl: HTMLElement | null) {
    this.stageEl = stageEl;
  }

  public triggerImpact(event: ImpactEvent, prefersReducedMotion: boolean) {
    if (!this.stageEl || prefersReducedMotion) return;
    gsap.killTweensOf(this.stageEl);
    const amp = event.shakeIntensity * 10;
    gsap.fromTo(
      this.stageEl,
      { x: -amp, y: amp * 0.6 },
      {
        x: 0,
        y: 0,
        duration: event.durationMs / 1000,
        ease: 'elastic.out(1.2, 0.25)',
        clearProps: 'transform',
      }
    );
  }

  public reset() {
    if (this.stageEl) {
      gsap.killTweensOf(this.stageEl);
      gsap.set(this.stageEl, { clearProps: 'transform' });
    }
  }
}

/**
 * 3. LightningController
 * Controls branching golden lightning arcs & sky shockwave SVG layers.
 */
export class LightningController {
  private svgGroupEl: SVGGElement | null = null;
  private pathsGroupEl: SVGGElement | null = null;
  private wasLightningVisible = true;
  private wasPathsVisible = true;

  public bind(svgGroupEl: SVGGElement | null, pathsGroupEl: SVGGElement | null) {
    this.svgGroupEl = svgGroupEl;
    this.pathsGroupEl = pathsGroupEl;
    this.wasLightningVisible = true;
    this.wasPathsVisible = true;
  }

  public update(state: ComputedCinematicState) {
    if (this.svgGroupEl) {
      const flicker = state.lightning.active
        ? 0.65 + Math.abs(Math.sin(state.currentTime * 42)) * 0.35
        : 0;
      const opacity = state.lightning.intensity * flicker;
      if (opacity > 0.005) {
        this.wasLightningVisible = true;
        this.svgGroupEl.style.opacity = opacity.toFixed(3);
      } else if (this.wasLightningVisible) {
        this.wasLightningVisible = false;
        this.svgGroupEl.style.opacity = '0';
      }
    }

    if (this.pathsGroupEl) {
      const pathsEnergy = state.lighting.pathsEnergy;
      if (pathsEnergy > 0.005) {
        this.wasPathsVisible = true;
        this.pathsGroupEl.style.opacity = pathsEnergy.toFixed(3);
        const dashOffset = -(state.currentTime * 160) % 1000;
        this.pathsGroupEl.style.strokeDashoffset = `${dashOffset.toFixed(1)}px`;
      } else if (this.wasPathsVisible) {
        this.wasPathsVisible = false;
        this.pathsGroupEl.style.opacity = '0';
      }
    }
  }
}

/**
 * 4. CrackController
 * Controls animated structural cracks across screen corners during Phases 3-5.
 */
export class CrackController {
  private crackGroupEl: SVGGElement | null = null;
  private wasVisible = true;

  public bind(crackGroupEl: SVGGElement | null) {
    this.crackGroupEl = crackGroupEl;
    this.wasVisible = true;
  }

  public update(state: ComputedCinematicState) {
    if (!this.crackGroupEl) return;
    const { intensity } = state.cracks;
    if (intensity > 0.005) {
      this.wasVisible = true;
      this.crackGroupEl.style.opacity = intensity.toFixed(3);
    } else if (this.wasVisible) {
      this.wasVisible = false;
      this.crackGroupEl.style.opacity = '0';
    }
  }
}

/**
 * Pre-cached DOM references for each navigation box so zero querySelector calls occur during playback.
 */
interface CachedNavBoxDom {
  wrapperEl: HTMLElement;
  intactBtnEl: HTMLElement | null;
  crackSvgEl: SVGSVGElement | null;
  fragContainerEl: HTMLElement | null;
  fragNodes: HTMLElement[];
  lastStage: NavDestructionStage | '';
  lastIntactOpacity: number;
  lastFragContainerVisible: boolean | null;
  fragHiddenFlags: boolean[];
}

/**
 * 5. NavigationAnimationController
 * High-performance zero-querySelector controller.
 * Caches all box & fragment DOM nodes once on bind(), skips untouched/completed nodes,
 * and uses strictly compositor-only `transform` and `opacity` updates.
 */
export class NavigationAnimationController {
  private containerEl: HTMLElement | null = null;
  private shardEls: HTMLElement[] = [];
  private cachedBoxes: CachedNavBoxDom[] = [];
  private lastDestructionStage = '';
  private lastBorderGlow = '';

  public bind(containerEl: HTMLElement | null, shardEls: HTMLElement[]) {
    this.containerEl = containerEl;
    this.shardEls = shardEls;
    this.cachedBoxes = [];
    this.lastDestructionStage = '';
    this.lastBorderGlow = '';

    if (!containerEl) return;

    for (let i = 0; i < 5; i++) {
      const wrapperEl = containerEl.querySelector<HTMLElement>(
        `[data-nav-box-wrapper="${i}"]`
      );
      if (!wrapperEl) continue;

      const intactBtnEl = wrapperEl.querySelector<HTMLElement>(
        '[data-nav-intact-btn]'
      );
      const crackSvgEl = wrapperEl.querySelector<SVGSVGElement>(
        '[data-nav-crack-svg]'
      );
      const fragContainerEl = wrapperEl.querySelector<HTMLElement>(
        '[data-nav-frag-container]'
      );
      const fragNodeList = fragContainerEl
        ? Array.from(
            fragContainerEl.querySelectorAll<HTMLElement>('[data-frag-index]')
          )
        : [];

      this.cachedBoxes.push({
        wrapperEl,
        intactBtnEl,
        crackSvgEl,
        fragContainerEl,
        fragNodes: fragNodeList,
        lastStage: '',
        lastIntactOpacity: -1,
        lastFragContainerVisible: null,
        fragHiddenFlags: new Array(fragNodeList.length).fill(false),
      });
    }
  }

  public resetCacheFlags() {
    this.lastDestructionStage = '';
    this.lastBorderGlow = '';
    for (const box of this.cachedBoxes) {
      box.lastStage = '';
      box.lastIntactOpacity = -1;
      box.lastFragContainerVisible = null;
      box.fragHiddenFlags.fill(false);
    }
  }

  public update(state: ComputedCinematicState) {
    if (!this.containerEl) return;
    const { borderGlow, destructionStage, boxes } = state.navigation;

    if (destructionStage !== this.lastDestructionStage) {
      this.lastDestructionStage = destructionStage;
      this.containerEl.setAttribute('data-destruction-stage', destructionStage);
      this.containerEl.style.pointerEvents =
        destructionStage === 'intact' || destructionStage === 'cracking'
          ? 'auto'
          : 'none';
    }

    if (borderGlow !== this.lastBorderGlow) {
      this.lastBorderGlow = borderGlow;
      this.containerEl.setAttribute('data-glow', borderGlow);
    }

    const degToRad = 0.017453292519943295;

    for (let i = 0; i < this.cachedBoxes.length; i++) {
      const cache = this.cachedBoxes[i];
      const boxState = boxes[i];
      if (!cache || !boxState) continue;

      // Update stage attribute only when changed
      if (boxState.stage !== cache.lastStage) {
        cache.lastStage = boxState.stage;
        cache.wrapperEl.setAttribute('data-box-stage', boxState.stage);

        if (cache.intactBtnEl && boxState.stage === 'intact') {
          cache.intactBtnEl.style.transform = '';
        }
        if (cache.crackSvgEl && boxState.stage === 'intact') {
          cache.crackSvgEl.style.opacity = '0';
        }
      }

      // 1. Intact / Cracking Button State
      if (cache.intactBtnEl) {
        if (boxState.intactBoxOpacity !== cache.lastIntactOpacity) {
          cache.lastIntactOpacity = boxState.intactBoxOpacity;
          cache.intactBtnEl.style.opacity = String(boxState.intactBoxOpacity);
          cache.intactBtnEl.style.pointerEvents =
            boxState.intactBoxOpacity > 0.5 ? 'auto' : 'none';
        }

        if (boxState.stage === 'cracking') {
          const { x, y, rot } = boxState.crackTremorOffset;
          cache.intactBtnEl.style.transform = `translate3d(${x.toFixed(
            1
          )}px, ${y.toFixed(1)}px, 0) rotate(${rot.toFixed(2)}deg)`;
        }
      }

      // 2. Stage A Spreading Cracks SVG (Only updated during 'cracking' stage 37.0s - 40.5s)
      if (cache.crackSvgEl && boxState.stage === 'cracking') {
        cache.crackSvgEl.style.opacity = Math.min(
          1,
          boxState.crackProgress * 1.15
        ).toFixed(2);
        const dashOffset = (1 - boxState.crackProgress) * 140;
        cache.crackSvgEl.style.strokeDashoffset = `${dashOffset.toFixed(1)}px`;
      }

      // 3. Stage B, C, D Physical Polygonal Fragments (Active ONLY when fragmentsVisible is true)
      if (cache.fragContainerEl) {
        if (boxState.fragmentsVisible !== cache.lastFragContainerVisible) {
          cache.lastFragContainerVisible = boxState.fragmentsVisible;
          if (boxState.fragmentsVisible) {
            cache.fragContainerEl.style.display = 'block';
            cache.fragContainerEl.style.opacity = '1';
          } else {
            cache.fragContainerEl.style.display = 'none';
            cache.fragContainerEl.style.opacity = '0';
          }
        }

        if (boxState.fragmentsVisible) {
          const fragNodes = cache.fragNodes;
          const frags = boxState.fragments;
          const hiddenFlags = cache.fragHiddenFlags;

          for (let f = 0; f < fragNodes.length; f++) {
            const ft = frags[f];
            if (!ft) continue;

            if (ft.opacity <= 0.008) {
              // Skip DOM writes if this fragment is already marked hidden
              if (!hiddenFlags[f]) {
                hiddenFlags[f] = true;
                fragNodes[f].style.opacity = '0';
              }
            } else {
              hiddenFlags[f] = false;
              const node = fragNodes[f];
              // Simulate 3D paper-like tumbling via 2D foreshortened scaleX/scaleY to avoid
              // expensive per-frame 3D perspective + clip-path re-rasterization in Chromium
              const scaleX = (
                ft.scale *
                (0.32 + 0.68 * Math.abs(Math.cos(ft.rotY * degToRad)))
              ).toFixed(2);
              const scaleY = (
                ft.scale *
                (0.38 + 0.62 * Math.abs(Math.cos(ft.rotX * degToRad)))
              ).toFixed(2);
              node.style.opacity = ft.opacity.toFixed(2);
              node.style.transform = `translate3d(${ft.dx.toFixed(
                1
              )}px, ${ft.dy.toFixed(1)}px, 0) rotate(${ft.rotZ.toFixed(
                1
              )}deg) scale(${scaleX}, ${scaleY})`;
            }
          }
        }
      }
    }
  }

  public triggerShardReaction(event: ImpactEvent, prefersReducedMotion: boolean) {
    if (
      prefersReducedMotion ||
      !this.shardEls.length ||
      event.navReaction === 'none' ||
      event.timestamp >= 40.4
    ) {
      return;
    }

    const isStrong = event.navReaction === 'jolt-strong';
    const maxOffset = isStrong ? 9 : 4.5;

    this.shardEls.forEach((el, idx) => {
      if (!el) return;
      gsap.killTweensOf(el);
      const dir = idx % 2 === 0 ? 1 : -1;
      gsap.fromTo(
        el,
        {
          x: dir * maxOffset,
          y: -dir * (maxOffset * 0.6),
          rotation: dir * (isStrong ? 2.2 : 1.0),
        },
        {
          x: 0,
          y: 0,
          rotation: 0,
          duration: 0.45,
          ease: 'back.out(2)',
          clearProps: 'transform',
        }
      );
    });
  }
}

/**
 * 6. AtmosphericCanvasController
 * Optimized with pre-rendered offscreen smoke sprite (zero per-frame createRadialGradient calls)
 * and adaptive particle counts based on device hardware concurrency.
 */
interface CanvasParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  type: 'dust' | 'spark' | 'ash';
}

interface SmokePuff {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
}

interface DebrisChunk {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  vRot: number;
  unitPoints: Array<[number, number]>;
}

export class AtmosphericCanvasController {
  private particles: CanvasParticle[] = [];
  private smokePuffs: SmokePuff[] = [];
  private debrisChunks: DebrisChunk[] = [];
  private smokeSpriteCanvas: HTMLCanvasElement | null = null;
  private initialized = false;

  private createSmokeSprite() {
    if (typeof document === 'undefined') return;
    const sprite = document.createElement('canvas');
    sprite.width = 128;
    sprite.height = 128;
    const sCtx = sprite.getContext('2d');
    if (sCtx) {
      const grad = sCtx.createRadialGradient(64, 64, 6, 64, 64, 64);
      grad.addColorStop(0, 'rgba(154, 52, 18, 0.42)');
      grad.addColorStop(0.55, 'rgba(69, 20, 14, 0.22)');
      grad.addColorStop(1, 'rgba(7, 7, 9, 0)');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 128, 128);
    }
    this.smokeSpriteCanvas = sprite;
  }

  public init(width: number, height: number) {
    const isLowPowerDevice =
      typeof navigator !== 'undefined' &&
      navigator.hardwareConcurrency &&
      navigator.hardwareConcurrency <= 4;

    const particleCount = isLowPowerDevice ? 38 : 60;
    const smokeCount = isLowPowerDevice ? 9 : 14;
    const debrisCount = isLowPowerDevice ? 12 : 18;

    this.createSmokeSprite();

    this.particles = Array.from({ length: particleCount }, (_, i) => ({
      x: (Math.sin(i * 17.3) * 0.5 + 0.5) * width,
      y: (Math.cos(i * 31.7) * 0.5 + 0.5) * height,
      vx: (i % 2 === 0 ? 1 : -1) * (0.25 + (i % 5) * 0.12),
      vy: -(0.35 + (i % 7) * 0.18),
      size: 1.2 + (i % 4) * 1.1,
      alpha: 0.25 + (i % 6) * 0.1,
      type: i % 3 === 0 ? 'spark' : i % 2 === 0 ? 'ash' : 'dust',
    }));

    this.smokePuffs = Array.from({ length: smokeCount }, (_, i) => ({
      x: (i / smokeCount) * width,
      y: height * (0.55 + (i % 4) * 0.12),
      vx: 0.35 + (i % 3) * 0.25,
      vy: -0.2 - (i % 3) * 0.1,
      radius: 120 + (i % 5) * 45,
      alpha: 0.14 + (i % 4) * 0.05,
    }));

    this.debrisChunks = Array.from({ length: debrisCount }, (_, i) => {
      const sides = 5 + (i % 3);
      const unitPoints: Array<[number, number]> = [];
      for (let s = 0; s < sides; s++) {
        const theta = (s / sides) * Math.PI * 2;
        unitPoints.push([Math.cos(theta), Math.sin(theta) * 0.72]);
      }
      return {
        x: ((i * 73) % 100) * 0.01 * width,
        y: ((i * 41) % 100) * 0.01 * height,
        vx: (i % 2 === 0 ? 1 : -1) * (0.8 + (i % 4) * 0.5),
        vy: 2.2 + (i % 5) * 1.1,
        size: 6 + (i % 4) * 5,
        rotation: i * 0.5,
        vRot: (i % 2 === 0 ? 1 : -1) * 0.04,
        unitPoints,
      };
    });

    this.initialized = true;
  }

  public render(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    state: ComputedCinematicState
  ) {
    if (!this.initialized) {
      this.init(width, height);
    }

    ctx.clearRect(0, 0, width, height);

    // 1. Pre-rendered Smoke Sprite blitting (fast GPU texture drawImage)
    const smokeDensity = state.smoke.density;
    if (smokeDensity > 0.02 && this.smokeSpriteCanvas) {
      for (let i = 0; i < this.smokePuffs.length; i++) {
        const puff = this.smokePuffs[i];
        puff.x += puff.vx * state.smoke.speed;
        puff.y += puff.vy * state.smoke.speed;
        if (puff.x - puff.radius > width) puff.x = -puff.radius;
        if (puff.y + puff.radius < 0) puff.y = height + puff.radius * 0.5;

        ctx.globalAlpha = Math.min(0.88, puff.alpha * smokeDensity * 2.2);
        const diam = puff.radius * 2;
        ctx.drawImage(
          this.smokeSpriteCanvas,
          puff.x - puff.radius,
          puff.y - puff.radius,
          diam,
          diam
        );
      }
    }

    // 2. Particle layer
    const { dustDensity, sparksDensity, ashDensity, color } = state.particles;
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      const typeWeight =
        p.type === 'spark'
          ? sparksDensity
          : p.type === 'ash'
          ? ashDensity
          : dustDensity;
      if (typeWeight <= 0.05) continue;

      p.x += p.vx * (1 + sparksDensity * 1.2);
      p.y += p.vy * (1 + sparksDensity * 1.4);
      if (p.y < -10) p.y = height + 10;
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      ctx.globalAlpha = Math.min(0.95, p.alpha * typeWeight);
      ctx.fillStyle = p.type === 'spark' ? '#fef08a' : color;
      const r = p.size * (p.type === 'spark' ? 1.25 : 1);
      ctx.fillRect(p.x - r, p.y - r, r * 2, r * 2);
    }

    // 3. Debris layer (using pre-computed unit polygon vertices)
    const debrisDensity = state.debris.density;
    if (debrisDensity > 0.05) {
      const activeCount = Math.floor(this.debrisChunks.length * debrisDensity);
      ctx.fillStyle = '#271c19';
      ctx.strokeStyle = 'rgba(234, 88, 12, 0.45)';
      ctx.lineWidth = 1;
      ctx.globalAlpha = Math.min(0.85, debrisDensity * 0.8);

      for (let i = 0; i < activeCount; i++) {
        const d = this.debrisChunks[i];
        d.x += d.vx;
        d.y += d.vy * state.debris.scale;
        d.rotation += d.vRot;

        if (d.y > height + 30) {
          d.y = -25;
          d.x =
            ((i * 97 + Math.floor(state.currentTime * 30)) % 100) *
            0.01 *
            width;
        }

        ctx.save();
        ctx.translate(d.x, d.y);
        ctx.rotate(d.rotation);
        ctx.beginPath();
        const r = d.size * state.debris.scale;
        const pts = d.unitPoints;
        for (let s = 0; s < pts.length; s++) {
          const px = pts[s][0] * r;
          const py = pts[s][1] * r;
          if (s === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }
    }

    // 4. Final smoke transition curtain (81.2s -> 84.4s)
    if (state.smoke.endTransitionOpacity > 0.01) {
      ctx.globalAlpha = 1;
      ctx.fillStyle = `rgba(7, 7, 9, ${(
        state.smoke.endTransitionOpacity * 0.92
      ).toFixed(3)})`;
      ctx.fillRect(0, 0, width, height);
    }
  }
}

/**
 * 7. VideoTimelineController
 * Single centralized rAF animation scheduler coordinating video playback, DOM/SVG controllers,
 * physical navigation fragmentation, and the atmospheric 2D canvas without React re-renders.
 */
export class VideoTimelineController {
  public lighting = new LightingController();
  public screenShake = new ScreenShakeController();
  public lightning = new LightningController();
  public cracks = new CrackController();
  public navigation = new NavigationAnimationController();
  public atmosphere = new AtmosphericCanvasController();
  public impactTracker = new ImpactTriggerTracker();

  private videoEl: HTMLVideoElement | null = null;
  private stageEl: HTMLElement | null = null;
  private canvasEl: HTMLCanvasElement | null = null;
  private canvasCtx: CanvasRenderingContext2D | null = null;
  private rafId: number | null = null;
  private prefersReducedMotion = false;
  private lastPhaseId = '';

  public attachStageAndCanvas(
    stageEl: HTMLElement | null,
    canvasEl: HTMLCanvasElement | null
  ) {
    this.stageEl = stageEl;
    this.canvasEl = canvasEl;
    this.canvasCtx = canvasEl ? canvasEl.getContext('2d') : null;
  }

  public attachVideo(
    videoEl: HTMLVideoElement | null,
    prefersReducedMotion: boolean
  ) {
    this.videoEl = videoEl;
    this.prefersReducedMotion = prefersReducedMotion;
  }

  public syncFrame = (): ComputedCinematicState | null => {
    if (!this.videoEl) return null;
    const currentTime = this.videoEl.currentTime || 0;
    const state = computeCinematicState(currentTime, this.prefersReducedMotion);

    if (this.stageEl && state.phaseId !== this.lastPhaseId) {
      this.lastPhaseId = state.phaseId;
      this.stageEl.setAttribute('data-phase', state.phaseId);
    }

    // Update all DOM/SVG/Fragment controllers in one pass
    this.lighting.update(state);
    this.lightning.update(state);
    this.cracks.update(state);
    this.navigation.update(state);

    // Render atmospheric canvas in the same unified rAF tick
    if (this.canvasEl && this.canvasCtx) {
      this.atmosphere.render(
        this.canvasCtx,
        this.canvasEl.width,
        this.canvasEl.height,
        state
      );
    }

    // Check discrete impact triggers
    const impact = this.impactTracker.checkTrigger(currentTime);
    if (impact) {
      this.screenShake.triggerImpact(impact, this.prefersReducedMotion);
      this.navigation.triggerShardReaction(impact, this.prefersReducedMotion);
    }

    return state;
  };

  public startLoop() {
    this.stopLoop();
    const tick = () => {
      if (this.videoEl && !this.videoEl.paused && !this.videoEl.ended) {
        this.syncFrame();
        this.rafId = requestAnimationFrame(tick);
      } else {
        this.rafId = null;
      }
    };
    this.rafId = requestAnimationFrame(tick);
  }

  public stopLoop() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  public handleSeek(targetTime: number) {
    if (!this.videoEl) return;
    this.videoEl.currentTime = targetTime;
    this.impactTracker.resetForSeek(targetTime);
    this.screenShake.reset();
    this.navigation.resetCacheFlags();
    this.syncFrame();
  }

  public resetAll() {
    this.stopLoop();
    this.impactTracker.resetAll();
    this.screenShake.reset();
    this.navigation.resetCacheFlags();
    this.lastPhaseId = '';
  }
}
