'use client';
import { useAuth } from '@/components/auth/AuthProvider';
export default function ProfilePage() {
  const { user } = useAuth();
  return (
    <div>
      <h1 className="text-2xl font-editorial text-text-primary mb-8">Profile</h1>
      <div className="bg-surface border border-border rounded-card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-medium overflow-hidden">
            {user?.photoURL ? <img src={user.photoURL} alt="" className="w-full h-full object-cover" /> : user?.displayName?.[0] || '?'}
          </div>
          <div>
            <p className="text-lg font-medium text-text-primary">{user?.displayName || 'User'}</p>
            <p className="text-sm text-text-secondary">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
