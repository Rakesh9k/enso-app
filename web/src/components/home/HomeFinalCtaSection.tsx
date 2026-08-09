import Link from 'next/link';

export default function HomeFinalCtaSection() {
  return (
    <section className="py-24 px-6 bg-surface">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-editorial text-text-primary mb-6">
          Begin when you are ready.
        </h2>
        <p className="text-text-secondary text-lg mb-8">
          No pressure. No streaks to maintain. Just a quiet space waiting for you.
        </p>
        <Link
          href="/download"
          className="inline-block px-8 py-3 rounded-button bg-primary text-on-primary font-medium hover:opacity-90 transition-opacity"
        >
          Download Free
        </Link>
      </div>
    </section>
  );
}
