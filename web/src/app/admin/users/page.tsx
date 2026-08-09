'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchUsers } from '@/lib/admin-api';
import type { AdminUser } from '@/lib/admin-types';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetch = async () => {
    setLoading(true);
    try {
      const data = await fetchUsers({ page, limit: 20, search, subscription: filter });
      setUsers(data.users);
      setTotalPages(data.pagination.totalPages);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    fetch();
  }, [page, filter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetch();
  };

  const getSubBadge = (sub: string) => {
    if (sub === 'premium' || sub === 'active')
      return <span className="px-2 py-0.5 text-xs font-medium bg-success/10 text-success rounded-full">Premium</span>;
    if (sub === 'expired')
      return <span className="px-2 py-0.5 text-xs font-medium bg-warning/10 text-warning rounded-full">Expired</span>;
    return <span className="px-2 py-0.5 text-xs font-medium bg-text-disabled/10 text-text-secondary rounded-full">Free</span>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Users</h1>
        <p className="text-text-secondary mt-1">Manage user accounts and subscriptions</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by email, name, or UID..." className="flex-1 px-4 py-2 bg-surface border border-border rounded-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          <button type="submit" className="px-4 py-2 bg-primary text-white rounded-card text-sm font-medium hover:bg-primary/90 transition-colors">Search</button>
        </form>
        <div className="flex gap-2">
          {['all', 'free', 'premium', 'expired'].map((f) => (
            <button key={f} onClick={() => { setFilter(f); setPage(1); }} className={`px-3 py-2 rounded-card text-sm font-medium transition-colors ${filter === f ? 'bg-primary text-white' : 'bg-surface border border-border text-text-secondary hover:text-text-primary'}`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-surface rounded-card border border-border overflow-hidden">
        {loading ? (
          <div className="divide-y divide-border">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-4 animate-pulse"><div className="flex items-center gap-4"><div className="w-10 h-10 bg-background rounded-full" /><div className="flex-1 space-y-2"><div className="h-4 w-48 bg-background rounded" /><div className="h-3 w-32 bg-background rounded" /></div></div></div>
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-text-secondary text-sm">No users found</div>
        ) : (
          <div className="divide-y divide-border">
            {users.map((user) => (
              <Link key={user.uid} href={`/admin/users/detail?uid=${user.uid}`} className="flex items-center gap-4 p-4 hover:bg-background/50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium overflow-hidden flex-shrink-0">
                  {user.photoURL ? <img src={user.photoURL} alt="" className="w-full h-full object-cover" /> : user.displayName?.[0] || user.email?.[0] || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{user.displayName || user.email || user.uid}</p>
                  <p className="text-xs text-text-secondary truncate">{user.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  {getSubBadge(user.subscription)}
                  {user.isAdmin && <span className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">Admin</span>}
                  <span className="text-xs text-text-disabled">{user.journalCount} entries</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 text-sm border border-border rounded-card disabled:opacity-50">Previous</button>
          <span className="text-sm text-text-secondary">Page {page} of {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 text-sm border border-border rounded-card disabled:opacity-50">Next</button>
        </div>
      )}
    </div>
  );
}
