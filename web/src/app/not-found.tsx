'use client';

import Link from 'next/link';
import AnimatedOwl from '@/components/ui/AnimatedOwl';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center px-6">
        <AnimatedOwl emotion="curious" size={120} className="mb-8" />
        <h1 className="text-6xl font-editorial text-text-primary mb-4">404</h1>
        <p className="text-lg text-text-secondary mb-2 font-editorial italic">
          This page has wandered off.
        </p>
        <p className="text-sm text-text-disabled mb-8">
          Like a thought that drifts away before you can hold it.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 rounded-button bg-primary text-on-primary text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
