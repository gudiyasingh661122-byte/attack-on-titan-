import gsap from 'gsap';
import {
  computeCinematicState,
  ComputedCinematicState,
  ImpactTriggerTracker,
} from '../timeline/timelineEngine';
import { ImpactEvent } from '../../data/timelineEvents';

/**
 * 1. LightingController
 * Controls ambient perimeter glow, radial iris pulse, Paths golden energy, and impact flashes via DOM refs + GSAP.
 */
export class LightingController {
  private ambientEl: HTMLElement | null = null;
  private radialEl: HTMLElement | null = null;
  private flashEl: HTMLElement | null = null;
  private videoWrapperEl: HTMLElement | null = null;

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
  }

  public update(state: ComputedCinematicState) {
    if (this.ambientEl) {
      const { color, secondaryColor, intensity } = state.lighting;
      this.ambientEl.style.opacity = String(Math.min(0.88, intensity * 0.85));
      this.ambientEl.style.background = `radial-gradient(circle at 50% 50%, transparent 38%, ${color}44 74%, ${secondaryColor}88 100%)`;
    }

    if (this.radialEl) {
      const { radialPulse, eyeDistortion, color } = state.lighting;
      const pulseScale = 1 + Math.sin(state.currentTime * 3.2) * 0.04 * radialPulse;
      this.radialEl.style.opacity = String(
        Math.max(radialPulse * 0.55, eyeDistortion * 0.45)
      );
      this.radialEl.style.transform = `scale(${pulseScale.toFixed(3)})`;
      this.radialEl.style.boxShadow = `inset 0 0 ${Math.round(
        90 + eyeDistortion * 80
      )}px ${color}`;
    }

    if (this.flashEl) {
      this.flashEl.style.opacity = String(state.flashOpacity.toFixed(3));
      this.flashEl.style.backgroundColor = state.flashColor;
    }

    if (this.videoWrapperEl) {
      const zoom = state.lighting.cameraZoom;
      const brightness = 1 + state.lighting.brightnessOffset;
      const { x, y, rotation } = state.shakeOffset;
      this.videoWrapperEl.style.transform = `translate3d(${x.toFixed(
        2
      )}px, ${y.toFixed(2)}px, 0) scale(${zoom.toFixed(
        3
      )}) rotate(${rotation.toFixed(2)}deg)`;
      this.videoWrapperEl.style.filter = `brightness(${brightness.toFixed(2)})`;
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

  public bind(svgGroupEl: SVGGElement | null, pathsGroupEl: SVGGElement | null) {
    this.svgGroupEl = svgGroupEl;
    this.pathsGroupEl = pathsGroupEl;
  }

  public update(state: ComputedCinematicState) {
    if (this.svgGroupEl) {
      const flicker = state.lightning.active
        ? 0.65 + Math.abs(Math.sin(state.currentTime * 42)) * 0.35
        : 0;
      const opacity = state.lightning.intensity * flicker;
      this.svgGroupEl.style.opacity = String(opacity.toFixed(3));
    }

    if (this.pathsGroupEl) {
      const pathsEnergy = state.lighting.pathsEnergy;
      this.pathsGroupEl.style.opacity = String(pathsEnergy.toFixed(3));
      const dashOffset = -(state.currentTime * 160) % 1000;
      this.pathsGroupEl.style.strokeDashoffset = `${dashOffset.toFixed(1)}px`;
    }
  }
}

/**
 * 4. CrackController
 * Controls animated structural cracks across screen corners during Phases 3-5.
 */
export class CrackController {
  private crackGroupEl: SVGGElement | null = null;

  public bind(crackGroupEl: SVGGElement | null) {
    this.crackGroupEl = crackGroupEl;
  }

  public update(state: ComputedCinematicState) {
    if (!this.crackGroupEl) return;
    const { intensity, glowColor } = state.cracks;
    this.crackGroupEl.style.opacity = String(intensity.toFixed(3));
    this.crackGroupEl.style.filter =
      intensity > 0.2 ? `drop-shadow(0 0 8px ${glowColor})` : 'none';
  }
}

/**
 * 5. NavigationAnimationController
 * Keeps floating navigation 100% visible from frame 0.0s, drives Stage A surface cracks (37.0s-40.5s),
 * and updates all 22 physical polygonal fragments per box at 60fps during Stage B/C/D (40.5s-80.0s).
 */
export class NavigationAnimationController {
  private containerEl: HTMLElement | null = null;
  private shardEls: HTMLElement[] = [];

  public bind(containerEl: HTMLElement | null, shardEls: HTMLElement[]) {
    this.containerEl = containerEl;
    this.shardEls = shardEls;
  }

  public update(state: ComputedCinematicState) {
    if (!this.containerEl) return;
    const { borderGlow, cracked, destructionStage, boxes } = state.navigation;

    // Navigation container is always visible from the very first frame
    this.containerEl.style.opacity = '1';
    this.containerEl.style.pointerEvents =
      destructionStage === 'intact' || destructionStage === 'cracking'
        ? 'auto'
        : 'none';
    this.containerEl.setAttribute('data-glow', borderGlow);
    this.containerEl.setAttribute('data-cracked', cracked ? 'true' : 'false');
    this.containerEl.setAttribute('data-destruction-stage', destructionStage);

    // High-frequency 60fps DOM updates for each navigation box and its 22 polygonal fragments
    for (let i = 0; i < boxes.length; i++) {
      const boxState = boxes[i];
      const boxWrapper = this.containerEl.querySelector<HTMLElement>(
        `[data-nav-box-wrapper="${i}"]`
      );
      if (!boxWrapper) continue;

      boxWrapper.setAttribute('data-box-stage', boxState.stage);

      const intactBtn = boxWrapper.querySelector<HTMLElement>(
        '[data-nav-intact-btn]'
      );
      if (intactBtn) {
        intactBtn.style.opacity = String(boxState.intactBoxOpacity);
        intactBtn.style.pointerEvents =
          boxState.intactBoxOpacity > 0.5 ? 'auto' : 'none';

        if (boxState.stage === 'cracking') {
          const { x, y, rot } = boxState.crackTremorOffset;
          intactBtn.style.transform = `translate3d(${x.toFixed(
            2
          )}px, ${y.toFixed(2)}px, 0) rotate(${rot.toFixed(2)}deg)`;
        } else if (boxState.stage === 'intact') {
          intactBtn.style.transform = '';
        }
      }

      // Stage A Crack SVG inside intact button
      const crackSvg = boxWrapper.querySelector<SVGSVGElement>(
        '[data-nav-crack-svg]'
      );
      if (crackSvg) {
        crackSvg.style.opacity =
          boxState.crackProgress > 0
            ? String(Math.min(1, boxState.crackProgress * 1.15).toFixed(3))
            : '0';
        const dashOffset = (1 - boxState.crackProgress) * 140;
        crackSvg.style.strokeDashoffset = `${dashOffset.toFixed(1)}px`;
      }

      // Stage B, C, D Physical Polygonal Fragments
      const fragContainer = boxWrapper.querySelector<HTMLElement>(
        '[data-nav-frag-container]'
      );
      if (fragContainer) {
        fragContainer.style.opacity = boxState.fragmentsVisible ? '1' : '0';
        if (boxState.fragmentsVisible) {
          const fragNodes =
            fragContainer.querySelectorAll<HTMLElement>('[data-frag-index]');
          for (let f = 0; f < fragNodes.length; f++) {
            const node = fragNodes[f];
            const ft = boxState.fragments[f];
            if (!ft) continue;
            if (ft.opacity <= 0.005) {
              node.style.opacity = '0';
            } else {
              node.style.opacity = ft.opacity.toFixed(3);
              node.style.transform = `translate3d(${ft.dx.toFixed(
                1
              )}px, ${ft.dy.toFixed(1)}px, 0) rotateX(${ft.rotX.toFixed(
                1
              )}deg) rotateY(${ft.rotY.toFixed(1)}deg) rotateZ(${ft.rotZ.toFixed(
                1
              )}deg) scale(${ft.scale.toFixed(3)})`;
              node.style.filter =
                ft.blurPx > 0.2 ? `blur(${ft.blurPx.toFixed(1)}px)` : 'none';
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
      event.navReaction === 'none'
    ) {
      return;
    }

    // Only apply GSAP impact jolts while the boxes are still intact or in initial cracking (< 40.5s)
    if (event.timestamp >= 40.5) return;

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
          duration: 0.48,
          ease: 'back.out(2)',
          clearProps: 'transform',
        }
      );
    });
  }
}

/**
 * 6. ParticleController, SmokeController & DebrisController
 * High-performance Canvas 2D particle engines synchronized with video state.
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
  sides: number;
}

export class AtmosphericCanvasController {
  private particles: CanvasParticle[] = [];
  private smokePuffs: SmokePuff[] = [];
  private debrisChunks: DebrisChunk[] = [];
  private initialized = false;

  public init(width: number, height: number) {
    this.particles = Array.from({ length: 75 }, (_, i) => ({
      x: (Math.sin(i * 17.3) * 0.5 + 0.5) * width,
      y: (Math.cos(i * 31.7) * 0.5 + 0.5) * height,
      vx: (i % 2 === 0 ? 1 : -1) * (0.25 + (i % 5) * 0.12),
      vy: -(0.35 + (i % 7) * 0.18),
      size: 1.2 + (i % 4) * 1.1,
      alpha: 0.25 + (i % 6) * 0.1,
      type: i % 3 === 0 ? 'spark' : i % 2 === 0 ? 'ash' : 'dust',
    }));

    this.smokePuffs = Array.from({ length: 18 }, (_, i) => ({
      x: (i / 18) * width,
      y: height * (0.55 + (i % 4) * 0.12),
      vx: 0.35 + (i % 3) * 0.25,
      vy: -0.2 - (i % 3) * 0.1,
      radius: 110 + (i % 5) * 45,
      alpha: 0.12 + (i % 4) * 0.05,
    }));

    this.debrisChunks = Array.from({ length: 22 }, (_, i) => ({
      x: ((i * 73) % 100) * 0.01 * width,
      y: ((i * 41) % 100) * 0.01 * height,
      vx: (i % 2 === 0 ? 1 : -1) * (0.8 + (i % 4) * 0.5),
      vy: 2.2 + (i % 5) * 1.1,
      size: 6 + (i % 4) * 5,
      rotation: i * 0.5,
      vRot: (i % 2 === 0 ? 1 : -1) * 0.04,
      sides: 5 + (i % 3),
    }));

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

    const smokeDensity = state.smoke.density;
    if (smokeDensity > 0.02) {
      for (const puff of this.smokePuffs) {
        puff.x += puff.vx * state.smoke.speed;
        puff.y += puff.vy * state.smoke.speed;
        if (puff.x - puff.radius > width) puff.x = -puff.radius;
        if (puff.y + puff.radius < 0) puff.y = height + puff.radius * 0.5;

        const grad = ctx.createRadialGradient(
          puff.x,
          puff.y,
          puff.radius * 0.1,
          puff.x,
          puff.y,
          puff.radius
        );
        grad.addColorStop(0, state.smoke.color);
        grad.addColorStop(1, 'rgba(7, 7, 9, 0)');
        ctx.save();
        ctx.globalAlpha = Math.min(0.9, puff.alpha * smokeDensity * 2.2);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(puff.x, puff.y, puff.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const { dustDensity, sparksDensity, ashDensity, color } = state.particles;
    for (const p of this.particles) {
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

      ctx.save();
      ctx.globalAlpha = Math.min(0.95, p.alpha * typeWeight);
      ctx.fillStyle = p.type === 'spark' ? '#fef08a' : color;
      ctx.beginPath();
      ctx.arc(
        p.x,
        p.y,
        p.size * (p.type === 'spark' ? 1.25 : 1),
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.restore();
    }

    const debrisDensity = state.debris.density;
    if (debrisDensity > 0.05) {
      const activeCount = Math.floor(this.debrisChunks.length * debrisDensity);
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
        ctx.globalAlpha = Math.min(0.85, debrisDensity * 0.8);
        ctx.fillStyle = '#271c19';
        ctx.strokeStyle = 'rgba(234, 88, 12, 0.45)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        const r = d.size * state.debris.scale;
        for (let s = 0; s < d.sides; s++) {
          const theta = (s / d.sides) * Math.PI * 2;
          const px = Math.cos(theta) * r;
          const py = Math.sin(theta) * r * 0.72;
          if (s === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }
    }

    if (state.smoke.endTransitionOpacity > 0.01) {
      ctx.save();
      ctx.fillStyle = `rgba(7, 7, 9, ${(
        state.smoke.endTransitionOpacity * 0.92
      ).toFixed(3)})`;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }
  }
}

/**
 * 7. VideoTimelineController
 * Master clock orchestrator tying HTML5 Video playback, rAF loop, seeking, and all sub-controllers together.
 */
export class VideoTimelineController {
  public lighting = new LightingController();
  public screenShake = new ScreenShakeController();
  public lightning = new LightningController();
  public cracks = new CrackController();
  public navigation = new NavigationAnimationController();
  public impactTracker = new ImpactTriggerTracker();

  private videoEl: HTMLVideoElement | null = null;
  private rafId: number | null = null;
  private prefersReducedMotion = false;
  private onStateSnapshot?: (state: ComputedCinematicState) => void;
  private lastUiDispatchTime = -1;

  public attachVideo(
    videoEl: HTMLVideoElement | null,
    prefersReducedMotion: boolean,
    onStateSnapshot?: (state: ComputedCinematicState) => void
  ) {
    this.videoEl = videoEl;
    this.prefersReducedMotion = prefersReducedMotion;
    this.onStateSnapshot = onStateSnapshot;
  }

  public syncFrame = (forceUiUpdate = false): ComputedCinematicState | null => {
    if (!this.videoEl) return null;
    const currentTime = this.videoEl.currentTime || 0;
    const state = computeCinematicState(currentTime, this.prefersReducedMotion);

    // Update all DOM/SVG/Fragment controllers at 60fps without React re-renders
    this.lighting.update(state);
    this.lightning.update(state);
    this.cracks.update(state);
    this.navigation.update(state);

    // Check discrete impact triggers
    const impact = this.impactTracker.checkTrigger(currentTime);
    if (impact) {
      this.screenShake.triggerImpact(impact, this.prefersReducedMotion);
      this.navigation.triggerShardReaction(impact, this.prefersReducedMotion);
    }

    // Throttle React state snapshots
    if (
      this.onStateSnapshot &&
      (forceUiUpdate || Math.abs(currentTime - this.lastUiDispatchTime) >= 0.12)
    ) {
      this.lastUiDispatchTime = currentTime;
      this.onStateSnapshot(state);
    }

    return state;
  };

  public startLoop() {
    this.stopLoop();
    const tick = () => {
      this.syncFrame(false);
      this.rafId = requestAnimationFrame(tick);
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
    this.syncFrame(true);
  }

  public resetAll() {
    this.stopLoop();
    this.impactTracker.resetAll();
    this.screenShake.reset();
    this.lastUiDispatchTime = -1;
  }
}
