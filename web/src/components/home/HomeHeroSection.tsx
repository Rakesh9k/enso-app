'use client';

import Link from 'next/link';
import AnimatedOwl from '@/components/ui/AnimatedOwl';

export default function HomeHeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <AnimatedOwl emotion="greeting" size={160} className="mb-8" />
        <h1 className="text-4xl md:text-6xl font-editorial text-text-primary mb-6">
          Your quiet space for<br />
          <span className="italic text-primary">self-understanding</span>
        </h1>
        <p className="text-lg text-text-secondary mb-8 max-w-xl mx-auto">
          Enso is an AI-powered companion that helps you reflect, understand patterns,
          and find clarity through daily journaling and guided meditation.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/download"
            className="px-8 py-3 rounded-button bg-primary text-on-primary font-medium hover:opacity-90 transition-opacity"
          >
            Download Free
          </Link>
          <Link
            href="/about"
            className="px-8 py-3 rounded-button border border-border text-text-primary font-medium hover:bg-background transition-colors"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}
