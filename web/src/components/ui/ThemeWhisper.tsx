'use client';

import { useState, useEffect } from 'react';

interface ThemeWhisperProps {
  text?: string;
}

export default function ThemeWhisper({ text }: ThemeWhisperProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (text) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [text]);

  if (!visible || !text) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <p className="text-lg font-editorial italic text-text-secondary/60 animate-fade-in">
        {text}
      </p>
    </div>
  );
}
