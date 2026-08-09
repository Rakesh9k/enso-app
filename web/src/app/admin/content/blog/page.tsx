'use client';

import { useEffect, useState } from 'react';
import { fetchBlogPosts } from '@/lib/admin-api';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: string;
  createdAt: string;
}

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogPosts()
      .then((data) => setPosts(data.posts))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-semibold text-text-primary">Blog Management</h1><p className="text-text-secondary mt-1">Create and manage blog posts</p></div>
        <button className="px-4 py-2 bg-primary text-white rounded-card text-sm font-medium hover:bg-primary/90 transition-colors">New Post</button>
      </div>

      <div className="bg-surface rounded-card border border-border overflow-hidden">
        {loading ? (
          <div className="divide-y divide-border">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="p-4 animate-pulse"><div className="h-10 bg-background rounded" /></div>)}</div>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center text-text-secondary text-sm">No blog posts yet. Click "New Post" to create one.</div>
        ) : (
          <div className="divide-y divide-border">
            {posts.map((post) => (
              <div key={post.id} className="flex items-center gap-4 p-4 hover:bg-background/50 transition-colors">
                <div className="flex-1"><p className="text-sm font-medium text-text-primary">{post.title}</p><p className="text-xs text-text-secondary">/{post.slug} · {post.category}</p></div>
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${post.status === 'published' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>{post.status}</span>
                <span className="text-xs text-text-disabled">{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : '-'}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
