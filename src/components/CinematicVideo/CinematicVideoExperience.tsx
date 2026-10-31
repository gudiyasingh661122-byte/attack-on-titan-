import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Volume2, VolumeX, ArrowRight, RotateCcw } from 'lucide-react';
import { VIDEO_DURATION, VIDEO_SRC } from '../../data/timelineEvents';
import { VideoTimelineController } from '../../cinematic/controllers/EffectControllers';
import { AtmosphericCanvasLayer } from '../../cinematic/effects/AtmosphericCanvasLayer';
import { SvgEffectsOverlay } from '../../cinematic/effects/SvgEffectsOverlay';
import { FloatingNavigation } from '../FloatingNavigation/FloatingNavigation';
import { NavItem } from '../../data/navigation';

export interface CinematicVideoHandle {
  playFromTime: (startTimeSeconds?: number) => void;
  pausePlayback: () => void;
}

interface CinematicVideoExperienceProps {
  isActive: boolean;
  initialStartTime?: number;
  isMuted: boolean;
  onToggleMute: () => void;
  prefersReducedMotion: boolean;
  onCompleteOrSkip: (targetSectionId?: string) => void;
}

export const CinematicVideoExperience = forwardRef<
  CinematicVideoHandle,
  CinematicVideoExperienceProps
>(
  (
    {
      isActive,
      initialStartTime = 0,
      isMuted,
      onToggleMute,
      prefersReducedMotion,
      onCompleteOrSkip,
    },
    ref
  ) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const videoWrapperRef = useRef<HTMLDivElement | null>(null);
    const stageRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const ambientLightRef = useRef<HTMLDivElement | null>(null);
    const radialLightRef = useRef<HTMLDivElement | null>(null);
    const flashOverlayRef = useRef<HTMLDivElement | null>(null);
    const lightningGroupRef = useRef<SVGGElement | null>(null);
    const pathsGroupRef = useRef<SVGGElement | null>(null);
    const crackGroupRef = useRef<SVGGElement | null>(null);
    const navContainerRef = useRef<HTMLElement | null>(null);
    const navShardRefs = useRef<(HTMLButtonElement | null)[]>([]);

    const controllerRef = useRef<VideoTimelineController>(
      new VideoTimelineController()
    );
    const retryCountRef = useRef<number>(0);
    const controlsTimeoutRef = useRef<number | null>(null);

    const [isBuffering, setIsBuffering] = useState<boolean>(false);
    const [needsManualRetry, setNeedsManualRetry] = useState<boolean>(false);
    const [isTransitioningOut, setIsTransitioningOut] = useState<boolean>(false);
    const [controlsVisible, setControlsVisible] = useState<boolean>(true);

    const startSynchronizedPlayback = useCallback(
      (targetSeconds?: number) => {
        const video = videoRef.current;
        const controller = controllerRef.current;
        if (!video) return;

        setNeedsManualRetry(false);
        setIsTransitioningOut(false);

        if (typeof targetSeconds === 'number' && !Number.isNaN(targetSeconds)) {
          const clamped = Math.max(0, Math.min(targetSeconds, VIDEO_DURATION - 0.2));
          try {
            video.currentTime = clamped;
          } catch {
            // Metadata not yet loaded; handled in onLoadedMetadata
          }
          controller.handleSeek(clamped);
        } else {
          controller.syncFrame();
        }

        video.muted = isMuted;
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsBuffering(false);
              controller.startLoop();
            })
            .catch(() => {
              video.muted = true;
              video
                .play()
                .then(() => {
                  setIsBuffering(false);
                  controller.startLoop();
                })
                .catch(() => {
                  setNeedsManualRetry(true);
                });
            });
        }
      },
      [isMuted]
    );

    useImperativeHandle(ref, () => ({
      playFromTime: (startTimeSeconds = 0) => {
        startSynchronizedPlayback(startTimeSeconds);
      },
      pausePlayback: () => {
        controllerRef.current.stopLoop();
        videoRef.current?.pause();
      },
    }));

    // Bind effect controllers and pre-cache DOM references once on mount
    useEffect(() => {
      const controller = controllerRef.current;
      controller.attachStageAndCanvas(stageRef.current, canvasRef.current);
      controller.lighting.bind(
        ambientLightRef.current,
        radialLightRef.current,
        flashOverlayRef.current,
        videoWrapperRef.current
      );
      controller.screenShake.bind(stageRef.current);
      controller.lightning.bind(lightningGroupRef.current, pathsGroupRef.current);
      controller.cracks.bind(crackGroupRef.current);
      controller.navigation.bind(
        navContainerRef.current,
        navShardRefs.current.filter(
          (Boolean as unknown) as (
            el: HTMLButtonElement | null
          ) => el is HTMLButtonElement
        )
      );

      controller.attachVideo(videoRef.current, prefersReducedMotion);
      controller.syncFrame();

      return () => {
        controller.resetAll();
      };
    }, [prefersReducedMotion]);

    // Start or stop when `isActive` changes
    useEffect(() => {
      if (isActive) {
        startSynchronizedPlayback(initialStartTime);
      } else {
        controllerRef.current.stopLoop();
        if (videoRef.current && !videoRef.current.paused) {
          videoRef.current.pause();
        }
      }
    }, [isActive, initialStartTime, startSynchronizedPlayback]);

    // Sync mute state without restarting playback
    useEffect(() => {
      if (videoRef.current) {
        videoRef.current.muted = isMuted;
      }
    }, [isMuted]);

    // Auto-fade minimal floating visitor controls on pointer inactivity
    useEffect(() => {
      if (!isActive) return;

      const revealControls = () => {
        setControlsVisible((prev) => (prev ? prev : true));
        if (controlsTimeoutRef.current !== null) {
          window.clearTimeout(controlsTimeoutRef.current);
        }
        controlsTimeoutRef.current = window.setTimeout(() => {
          setControlsVisible(false);
        }, 2800);
      };

      revealControls();
      window.addEventListener('mousemove', revealControls, { passive: true });
      window.addEventListener('touchstart', revealControls, { passive: true });
      window.addEventListener('keydown', revealControls, { passive: true });

      return () => {
        window.removeEventListener('mousemove', revealControls);
        window.removeEventListener('touchstart', revealControls);
        window.removeEventListener('keydown', revealControls);
        if (controlsTimeoutRef.current !== null) {
          window.clearTimeout(controlsTimeoutRef.current);
        }
      };
    }, [isActive]);

    const handleSeek = useCallback((targetSeconds: number) => {
      const clamped = Math.max(0, Math.min(targetSeconds, VIDEO_DURATION - 0.1));
      controllerRef.current.handleSeek(clamped);
    }, []);

    const triggerGracefulExit = useCallback(
      (targetSectionId?: string) => {
        if (isTransitioningOut) return;
        setIsTransitioningOut(true);
        controllerRef.current.stopLoop();
        if (videoRef.current) {
          videoRef.current.pause();
        }
        window.setTimeout(() => {
          onCompleteOrSkip(targetSectionId);
        }, 750);
      },
      [isTransitioningOut, onCompleteOrSkip]
    );

    const handleSelectNavItem = useCallback(
      (item: NavItem) => {
        triggerGracefulExit(item.sectionId);
      },
      [triggerGracefulExit]
    );

    const handleVideoError = () => {
      const video = videoRef.current;
      if (!video || !isActive) return;

      if (retryCountRef.current < 2) {
        retryCountRef.current += 1;
        const savedTime = video.currentTime || initialStartTime || 0;
        video.load();
        window.setTimeout(() => {
          startSynchronizedPlayback(savedTime);
        }, 250);
      } else {
        setNeedsManualRetry(true);
      }
    };

    return (
      <div
        ref={stageRef}
        data-testid="cinematic-video-stage"
        data-phase="phase-1"
        aria-hidden={!isActive}
        className={`fixed inset-0 h-screen w-screen overflow-hidden bg-[#050507] select-none transition-opacity duration-700 ${
          !isActive || isTransitioningOut
            ? 'pointer-events-none opacity-0'
            : 'opacity-100'
        }`}
      >
        {/* Floating Stone/Obsidian World Navigation (Memoized — Zero React Re-Renders During Playback) */}
        <FloatingNavigation
          containerRef={navContainerRef}
          shardRefs={navShardRefs}
          onSelectNavItem={handleSelectNavItem}
          onSeekToPhase={handleSeek}
        />

        {/* Full-Screen Viewport Video Layer */}
        <div
          ref={videoWrapperRef}
          className="fixed inset-0 z-10 h-full w-full overflow-hidden will-change-transform"
        >
          <video
            ref={videoRef}
            src={VIDEO_SRC}
            poster="/assets/frames/frame_01_awakening.jpg"
            playsInline
            muted={isMuted}
            preload="auto"
            onLoadedMetadata={() => {
              if (initialStartTime > 0 && videoRef.current) {
                videoRef.current.currentTime = initialStartTime;
              }
              controllerRef.current.syncFrame();
            }}
            onCanPlay={() => {
              setIsBuffering(false);
              setNeedsManualRetry(false);
            }}
            onWaiting={() => {
              if (isActive) setIsBuffering(true);
            }}
            onPlaying={() => {
              retryCountRef.current = 0;
              setIsBuffering(false);
              setNeedsManualRetry(false);
              controllerRef.current.startLoop();
            }}
            onPause={() => {
              controllerRef.current.stopLoop();
              controllerRef.current.syncFrame();
            }}
            onSeeked={() => {
              controllerRef.current.navigation.resetCacheFlags();
              controllerRef.current.syncFrame();
            }}
            onEnded={() => {
              controllerRef.current.stopLoop();
              triggerGracefulExit('overview');
            }}
            onError={handleVideoError}
            className="h-full w-full object-cover object-center"
          />
        </div>

        {/* Layer 1: LightingController Ambient Perimeter & Iris Radial Distortion */}
        <div
          ref={ambientLightRef}
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-15"
        />
        <div
          ref={radialLightRef}
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-15"
        />

        {/* Layer 2: Impact Flash Overlay */}
        <div
          ref={flashOverlayRef}
          aria-hidden="true"
          style={{ opacity: 0 }}
          className="pointer-events-none fixed inset-0 z-25 mix-blend-screen"
        />

        {/* Layer 3: SVG Lightning, Paths Branches, and Structural Stone Cracks */}
        <SvgEffectsOverlay
          lightningGroupRef={lightningGroupRef}
          pathsGroupRef={pathsGroupRef}
          crackGroupRef={crackGroupRef}
        />

        {/* Layer 4: Unified Canvas Particle, Smoke, and Debris Layer */}
        <AtmosphericCanvasLayer
          canvasRef={canvasRef}
          controllerRef={controllerRef}
        />

        {/* Minimal Atmospheric Buffering Pulse */}
        {isBuffering && !needsManualRetry && (
          <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-30 flex items-center justify-center"
          >
            <div className="h-12 w-12 rounded-full border border-[#D4AF37]/40 bg-[#050507]/40" />
          </div>
        )}

        {/* Clean Cinematic Fallback & Retry */}
        {needsManualRetry && (
          <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-[#050507]/85 px-6 text-center backdrop-blur-sm">
            <p className="font-display text-sm tracking-[0.28em] text-[#E6DFD3]">
              THE PATHS AWAIT YOUR SIGNAL
            </p>
            <div className="mt-6 flex items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  retryCountRef.current = 0;
                  startSynchronizedPlayback(videoRef.current?.currentTime || 0);
                }}
                className="flex items-center gap-2.5 border border-[#D4AF37]/70 bg-[#D4AF37]/15 px-6 py-3 font-display text-xs tracking-[0.2em] text-[#FEF08A] transition-colors hover:bg-[#D4AF37]/30 whitespace-nowrap shrink-0"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>RESUME SCENE</span>
              </button>
              <button
                type="button"
                onClick={() => triggerGracefulExit('overview')}
                className="border border-white/20 bg-white/[0.04] px-6 py-3 font-display text-xs tracking-[0.2em] text-[#D6D1C7] transition-colors hover:border-white/40 hover:text-white whitespace-nowrap shrink-0"
              >
                <span>ENTER ARCHIVE</span>
              </button>
            </div>
          </div>
        )}

        {/* Minimal Unobtrusive Floating Visitor Controls */}
        <div
          className={`fixed bottom-7 right-7 z-30 flex items-center gap-3 transition-opacity duration-500 sm:bottom-9 sm:right-10 ${
            controlsVisible
              ? 'opacity-90 hover:opacity-100'
              : 'opacity-0 focus-within:opacity-100'
          }`}
        >
          <button
            type="button"
            onClick={onToggleMute}
            aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
            className="flex h-10 w-10 items-center justify-center border border-white/15 bg-[#070709]/75 text-[#E6DFD3] transition-all duration-300 hover:border-[#D4AF37]/70 hover:text-[#FEF08A] focus-visible:outline-2 focus-visible:outline-[#D4AF37] cursor-pointer"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>

          <button
            type="button"
            onClick={() => triggerGracefulExit('overview')}
            className="group flex h-10 items-center gap-2.5 border border-white/15 bg-[#070709]/75 px-5 font-display text-[11px] font-semibold tracking-[0.22em] text-[#E6DFD3] transition-all duration-300 hover:border-[#D4AF37]/70 hover:text-[#FEF08A] focus-visible:outline-2 focus-visible:outline-[#D4AF37] whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>SKIP INTRO</span>
            <ArrowRight className="h-3.5 w-3.5 text-[#D4AF37] transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    );
  }
);
