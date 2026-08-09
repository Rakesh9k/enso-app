'use client';

export default function AdminLoading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 bg-surface rounded-card animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 bg-surface rounded-card animate-pulse" />
        ))}
      </div>
      <div className="h-96 bg-surface rounded-card animate-pulse" />
    </div>
  );
}
