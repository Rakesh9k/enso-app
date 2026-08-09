'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchBlogPosts } from '@/lib/admin-api';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  coverImage: string | null;
  createdAt: string;
}

const fallbackPosts: BlogPost[] = [
  { id: '1', title: 'Voice Journaling: Speaking Your Truth', slug: 'voice-journaling', excerpt: 'Why speaking your thoughts can be more powerful than writing them.', category: 'journaling', coverImage: null, createdAt: '2025-01-15T00:00:00Z' },
  { id: '2', title: 'Mood Tracking Without the Pressure', slug: 'mood-tracking', excerpt: 'How Enso approaches mood tracking differently.', category: 'insights', coverImage: null, createdAt: '2025-01-10T00:00:00Z' },
  { id: '3', title: 'The Power of One Honest Line', slug: 'power-of-one-honest-line', excerpt: 'Why you don\'t need to write pages to benefit from journaling.', category: 'journaling', coverImage: null, createdAt: '2025-01-05T00:00:00Z' },
];

function formatDate(dateStr: string | null) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogPosts()
      .then((data) => {
        setPosts(data.posts && data.posts.length > 0 ? data.posts : fallbackPosts);
      })
      .catch(() => setPosts(fallbackPosts))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-editorial text-text-primary mb-4">Blog</h1>
        <p className="text-text-secondary mb-8">Reflections on journaling, meditation, and self-understanding.</p>

        {loading ? (
          <div className="space-y-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-surface border border-border rounded-card p-6 animate-pulse">
                <div className="h-3 w-20 bg-background rounded mb-3" />
                <div className="h-5 w-64 bg-background rounded mb-2" />
                <div className="h-4 w-48 bg-background rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/post?slug=${post.slug}`}
                className="block bg-surface border border-border rounded-card p-6 hover:bg-background transition-colors group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-xs text-text-disabled">{formatDate(post.createdAt)}</p>
                  {post.category && (
                    <>
                      <span className="text-text-disabled">·</span>
                      <span className="text-xs text-primary capitalize">{post.category}</span>
                    </>
                  )}
                </div>
                <h2 className="text-lg font-medium text-text-primary mb-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                <p className="text-sm text-text-secondary">{post.excerpt}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
