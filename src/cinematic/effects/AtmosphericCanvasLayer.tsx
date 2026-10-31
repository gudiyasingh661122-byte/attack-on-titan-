import React, { useEffect } from 'react';
import { VideoTimelineController } from '../controllers/EffectControllers';

interface AtmosphericCanvasLayerProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  controllerRef: React.RefObject<VideoTimelineController>;
}

/**
 * Lightweight canvas surface bound to the single centralized VideoTimelineController scheduler.
 * Does not run a duplicate requestAnimationFrame loop.
 */
export const AtmosphericCanvasLayer: React.FC<AtmosphericCanvasLayerProps> = ({
  canvasRef,
  controllerRef,
}) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      controllerRef.current.atmosphere.init(canvas.width, canvas.height);
      controllerRef.current.syncFrame();
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [canvasRef, controllerRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-20 h-full w-full"
    />
  );
};
