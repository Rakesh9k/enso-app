'use client';

import { useEffect, useState } from 'react';

interface AnimatedOwlProps {
  emotion?: string;
  size?: number;
  className?: string;
}

const emotionImages: Record<string, string> = {
  calm: '/mascots/owl_calm.png',
  breathe: '/mascots/owl_breathe.png',
  idle: '/mascots/owl_idle.png',
  happy: '/mascots/owl_happy.png',
  curious: '/mascots/owl_curious.png',
  thinking: '/mascots/owl_thinking.png',
  excited: '/mascots/owl_excited.png',
  proud: '/mascots/owl_proud.png',
  grateful: '/mascots/owl_gratitude.png',
  love: '/mascots/owl_love.png',
  hope: '/mascots/owl_hope.png',
  zen: '/mascots/owl_zen.png',
  meditate: '/mascots/owl_meditate.png',
  greeting: '/mascots/owl_greeting.png',
  nod: '/mascots/owl_nod.png',
  reading: '/mascots/owl_reading.png',
  streak: '/mascots/owl_streak.png',
  cheer: '/mascots/owl_cheer.png',
  complete: '/mascots/owl_complete.png',
  confident: '/mascots/owl_confident.png',
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
