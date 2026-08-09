'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { fetchBlogPost } from '@/lib/admin-api';

interface BlogPost {
  title: string;
  slug: string;
  content: string;
  category: string;
  createdAt: string;
}

const fallbackPosts: Record<string, BlogPost> = {
  'voice-journaling': {
    title: 'Voice Journaling: Speaking Your Truth',
    slug: 'voice-journaling',
    content: `There is something raw about speaking your thoughts aloud. Writing requires structure — sentences, punctuation, paragraphs. But speaking? Speaking is how you actually think.\n\nEnso's voice journaling lets you speak instead of type. Record your thoughts, and let AI capture the essence without you having to organize it first.\n\nThis isn't about perfect grammar. It's about honest expression.`,
    category: 'journaling',
    createdAt: '2025-01-15T00:00:00Z',
  },
  'mood-tracking': {
    title: 'Mood Tracking Without the Pressure',
    slug: 'mood-tracking',
    content: `Most mood trackers ask you to pick from a list of emotions. But what if you don't know what you're feeling? What if it's complicated?\n\nEnso tracks your mood through your words — the themes you write about, the rooms you choose, the patterns in your journaling. No labels required.\n\nYour mood is a spectrum, not a dropdown.`,
    category: 'insights',
    createdAt: '2025-01-10T00:00:00Z',
  },
  'power-of-one-honest-line': {
    title: 'The Power of One Honest Line',
    slug: 'power-of-one-honest-line',
    content: `You don't need to write three pages to benefit from journaling. One honest line is enough.\n\n"I'm tired but I showed up today."\n"That conversation is still bothering me."\n"I feel good about what I did."\n\nThese small truths accumulate. Over days and weeks, they reveal who you are becoming.\n\nEnso is built for this kind of journaling — brief, honest, and enough.`,
    category: 'journaling',
    createdAt: '2025-01-05T00:00:00Z',
  },
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function BlogPostContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug');
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) { setLoading(false); return; }

    fetchBlogPost(slug)
      .then((data) => setPost(data.post))
      .catch(() => {
        const fallback = fallbackPosts[slug];
        if (fallback) setPost(fallback);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (!slug) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-editorial text-text-primary mb-4">No post specified</h1>
          <Link href="/blog" className="text-primary text-sm hover:underline">Back to blog</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <article className="max-w-3xl mx-auto px-6 py-16 animate-pulse">
          <div className="h-4 w-24 bg-surface rounded mb-8" />
          <div className="h-3 w-20 bg-surface rounded mb-3" />
          <div className="h-8 w-96 bg-surface rounded mb-8" />
          <div className="space-y-4">
            <div className="h-4 w-full bg-surface rounded" />
            <div className="h-4 w-3/4 bg-surface rounded" />
            <div className="h-4 w-5/6 bg-surface rounded" />
          </div>
        </article>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-editorial text-text-primary mb-4">Post not found</h1>
          <Link href="/blog" className="text-primary text-sm hover:underline">Back to blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <article className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/blog" className="text-sm text-primary hover:underline mb-8 block">&larr; Back to blog</Link>
        <div className="flex items-center gap-2 mb-3">
          <p className="text-xs text-text-disabled">{formatDate(post.createdAt)}</p>
          {post.category && (
            <>
              <span className="text-text-disabled">·</span>
              <span className="text-xs text-primary capitalize">{post.category}</span>
            </>
          )}
        </div>
        <h1 className="text-4xl font-editorial text-text-primary mb-8">{post.title}</h1>
        <div className="text-text-secondary leading-relaxed whitespace-pre-line text-lg">
          {post.content}
        </div>
      </article>
    </div>
  );
}

export default function BlogPostPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background pt-20">
        <article className="max-w-3xl mx-auto px-6 py-16 animate-pulse">
          <div className="h-4 w-24 bg-surface rounded mb-8" />
          <div className="h-8 w-96 bg-surface rounded mb-8" />
        </article>
      </div>
    }>
      <BlogPostContent />
    </Suspense>
  );
}
