import Link from 'next/link';
export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-editorial text-text-primary mb-8">Blog</h1>
        <div className="space-y-8">
          {[
            { slug: 'voice-journaling', title: 'Voice Journaling: Speaking Your Truth', excerpt: 'Why speaking your thoughts can be more powerful than writing them.', date: 'January 2025' },
            { slug: 'mood-tracking', title: 'Mood Tracking Without the Pressure', excerpt: 'How Enso approaches mood tracking differently.', date: 'January 2025' },
            { slug: 'power-of-one-honest-line', title: 'The Power of One Honest Line', excerpt: 'Why you don&apos;t need to write pages to benefit from journaling.', date: 'January 2025' },
          ].map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block bg-surface border border-border rounded-card p-6 hover:bg-background transition-colors">
              <p className="text-xs text-text-disabled mb-2">{post.date}</p>
              <h2 className="text-lg font-medium text-text-primary mb-2">{post.title}</h2>
              <p className="text-sm text-text-secondary">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
