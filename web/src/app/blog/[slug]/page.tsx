import Link from 'next/link';
const posts: Record<string, { title: string; content: string; date: string }> = {
  'voice-journaling': {
    title: 'Voice Journaling: Speaking Your Truth',
    date: 'January 2025',
    content: `There is something raw about speaking your thoughts aloud. Writing requires structure — sentences, punctuation, paragraphs. But speaking? Speaking is how you actually think.\n\nEnso's voice journaling lets you speak instead of type. Record your thoughts, and let AI capture the essence without you having to organize it first.\n\nThis isn't about perfect grammar. It's about honest expression.`,
  },
  'mood-tracking': {
    title: 'Mood Tracking Without the Pressure',
    date: 'January 2025',
    content: `Most mood trackers ask you to pick from a list of emotions. But what if you don't know what you're feeling? What if it's complicated?\n\nEnso tracks your mood through your words — the themes you write about, the rooms you choose, the patterns in your journaling. No labels required.\n\nYour mood is a spectrum, not a dropdown.`,
  },
  'power-of-one-honest-line': {
    title: 'The Power of One Honest Line',
    date: 'January 2025',
    content: `You don't need to write three pages to benefit from journaling. One honest line is enough.\n\n"I'm tired but I showed up today."\n"That conversation is still bothering me."\n"I feel good about what I did."\n\nThese small truths accumulate. Over days and weeks, they reveal who you are becoming.\n\nEnso is built for this kind of journaling — brief, honest, and enough.`,
  },
};

export function generateStaticParams() {
  return Object.keys(posts).map((slug) => ({ slug }));
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts[slug];
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
        <p className="text-xs text-text-disabled mb-3">{post.date}</p>
        <h1 className="text-4xl font-editorial text-text-primary mb-8">{post.title}</h1>
        <div className="text-text-secondary leading-relaxed whitespace-pre-line">{post.content}</div>
      </article>
    </div>
  );
}
