import React, { useEffect, useRef, useState } from 'react';
import { IntroScreen } from './components/IntroScreen/IntroScreen';
import {
  CinematicVideoExperience,
  CinematicVideoHandle,
} from './components/CinematicVideo/CinematicVideoExperience';
import { MainWebsite } from './components/MainWebsite/MainWebsite';

type ExperienceMode = 'intro' | 'video' | 'website';

export default function App() {
  const [mode, setMode] = useState<ExperienceMode>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1') {
        return 'website';
      }
      if (params.get('video') === '1') {
        return 'video';
      }
    }
    return 'intro';
  });

  const [isIntroExiting, setIsIntroExiting] = useState<boolean>(false);
  const [videoStartTime, setVideoStartTime] = useState<number>(0);
  const [targetSection, setTargetSection] = useState<string>('overview');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [prefersReducedMotion] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  const videoExperienceRef = useRef<CinematicVideoHandle | null>(null);

  useEffect(() => {
    document.body.setAttribute('data-experience-mode', mode);
  }, [mode]);

  const handleEnterExperience = () => {
    setVideoStartTime(0);
    setIsIntroExiting(true);
    // Start playback directly inside the user click gesture for browser autoplay permission
    videoExperienceRef.current?.playFromTime(0);
    setMode('video');
    window.setTimeout(() => {
      setIsIntroExiting(false);
    }, 950);
  };

  const handleCompleteOrSkipVideo = (sectionId?: string) => {
    const dest = sectionId || 'overview';
    setTargetSection(dest);
    setMode('website');
    if (sectionId) {
      window.setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 120);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleReplayIntroAtTime = (startTimeSeconds = 0) => {
    setVideoStartTime(startTimeSeconds);
    setMode('video');
    videoExperienceRef.current?.playFromTime(startTimeSeconds);
  };

  return (
    <div className="min-h-screen w-full bg-[#050507] text-[#F4F1EA]">
      {/* Pre-mounted Cinematic Video Stage so metadata preloads during Intro and play() triggers synchronously on click */}
      {mode !== 'website' && (
        <CinematicVideoExperience
          ref={videoExperienceRef}
          isActive={mode === 'video'}
          initialStartTime={videoStartTime}
          isMuted={isMuted}
          onToggleMute={() => setIsMuted((prev) => !prev)}
          prefersReducedMotion={prefersReducedMotion}
          onCompleteOrSkip={handleCompleteOrSkipVideo}
        />
      )}

      {/* Opening Cinematic Title Sequence Overlay */}
      {(mode === 'intro' || isIntroExiting) && (
        <IntroScreen
          onEnterExperience={handleEnterExperience}
          isExiting={isIntroExiting}
        />
      )}

      {/* Main Attack on Titan Website & Concept Store */}
      {mode === 'website' && (
        <MainWebsite
          initialSection={targetSection}
          onReplayIntroAtTime={handleReplayIntroAtTime}
        />
      )}
    </div>
  );
}
