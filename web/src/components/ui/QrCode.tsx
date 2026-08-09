'use client';

import { useEffect, useRef } from 'react';

interface QrCodeProps {
  value: string;
  size?: number;
  className?: string;
}

export default function QrCode({ value, size = 200, className = '' }: QrCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    async function draw() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const QRCode = await import('qrcode');
      QRCode.toCanvas(canvas, value, {
        width: size,
        margin: 2,
        color: { dark: '#1C1A17', light: '#FFFFFF' },
      });
    }
    draw();
  }, [value, size]);

  return <canvas ref={canvasRef} className={className} />;
}
