import React, { useEffect, useRef } from 'react';
import { AtmosphericCanvasController } from '../controllers/EffectControllers';
import { computeCinematicState } from '../timeline/timelineEngine';

interface AtmosphericCanvasLayerProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  prefersReducedMotion: boolean;
}

export const AtmosphericCanvasLayer: React.FC<AtmosphericCanvasLayerProps> = ({
  videoRef,
  prefersReducedMotion,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const controllerRef = useRef<AtmosphericCanvasController>(new AtmosphericCanvasController());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      controllerRef.current.init(canvas.width, canvas.height);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    let rafId: number;
    const renderLoop = () => {
      const currentTime = videoRef.current?.currentTime ?? 0;
      const state = computeCinematicState(currentTime, prefersReducedMotion);
      controllerRef.current.render(ctx, canvas.width, canvas.height, state);
      rafId = requestAnimationFrame(renderLoop);
    };

    rafId = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(rafId);
    };
  }, [videoRef, prefersReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20 h-full w-full"
    />
  );
};
