'use client';

import { useEffect, useState } from 'react';

interface AnimatedOwlProps {
  emotion?: string;
  size?: number;
  className?: string;
}

const emotionImages: Record<string, string> = {
  calm: '/mascots/owl_calm.svg',
  breathe: '/mascots/owl_breathe.svg',
  idle: '/mascots/owl_idle.svg',
  happy: '/mascots/owl_happy.svg',
  curious: '/mascots/owl_curious.svg',
  thinking: '/mascots/owl_thinking.svg',
  excited: '/mascots/owl_excited.svg',
  proud: '/mascots/owl_proud.svg',
  grateful: '/mascots/owl_gratitude.svg',
  love: '/mascots/owl_love.svg',
  hope: '/mascots/owl_hope.svg',
  zen: '/mascots/owl_zen.svg',
  meditate: '/mascots/owl_meditate.svg',
  greeting: '/mascots/owl_greeting.svg',
  nod: '/mascots/owl_nod.svg',
  reading: '/mascots/owl_reading.svg',
  streak: '/mascots/owl_streak.svg',
  cheer: '/mascots/owl_cheer.svg',
  complete: '/mascots/owl_complete.svg',
  confident: '/mascots/owl_confident.svg',
};

export default function AnimatedOwl({ emotion = 'calm', size = 120, className = '' }: AnimatedOwlProps) {
  const [src, setSrc] = useState(emotionImages[emotion] || emotionImages.calm);

  useEffect(() => {
    setSrc(emotionImages[emotion] || emotionImages.calm);
  }, [emotion]);

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <div className="absolute inset-0 rounded-full bg-primary/5 blur-xl animate-pulse" />
      <img
        src={src}
        alt="Owl companion"
        width={size}
        height={size}
        className="relative z-10 object-contain"
        style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))' }}
      />
    </div>
  );
}
