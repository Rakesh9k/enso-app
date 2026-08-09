'use client';

import { useEffect, useRef, useState } from 'react';

interface ThemeAtmosphereProps {
  themeId?: string;
}

const ambientConfigs: Record<string, { particleCount: number; particleSpeed: number; breatheMs: number }> = {
  dune: { particleCount: 15, particleSpeed: 0.2, breatheMs: 3200 },
  forest: { particleCount: 25, particleSpeed: 0.15, breatheMs: 3500 },
  ocean: { particleCount: 30, particleSpeed: 0.25, breatheMs: 3000 },
  night: { particleCount: 35, particleSpeed: 0.1, breatheMs: 4000 },
  blossom: { particleCount: 20, particleSpeed: 0.2, breatheMs: 3400 },
};

export default function ThemeAtmosphere({ themeId = 'dune' }: ThemeAtmosphereProps) {
  const config = ambientConfigs[themeId] || ambientConfigs.dune;

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <div
        className="absolute inset-0 animate-pulse"
        style={{
          animationDuration: `${config.breatheMs}ms`,
          background: 'radial-gradient(ellipse at center, rgba(204,187,160,0.05) 0%, transparent 70%)',
        }}
      />
    </div>
  );
}
