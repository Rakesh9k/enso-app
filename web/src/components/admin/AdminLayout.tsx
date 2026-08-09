'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/components/auth/AuthProvider';
import { signOut } from '@/lib/auth';

interface SidebarGroup {
  label: string;
  href: string;
  children?: { href: string; label: string }[];
}

const sidebarGroups: SidebarGroup[] = [
  {
    label: 'Dashboard',
    href: '/admin',
  },
  {
    label: 'Users',
    href: '/admin/users',
  },
  {
    label: 'Subscriptions',
    href: '/admin/subscriptions',
  },
  {
    label: 'AI & Insights',
    href: '/admin/ai',
  },
  {
    label: 'Partners',
    href: '/admin/partners',
    children: [
      { href: '/admin/partners/applications', label: 'Applications' },
      { href: '/admin/partners/referrals', label: 'Referrals' },
      { href: '/admin/partners/commissions', label: 'Commissions' },
      { href: '/admin/partners/payouts', label: 'Payouts' },
    ],
  },
  {
    label: 'Content',
    href: '/admin/content',
    children: [
      { href: '/admin/content/blog', label: 'Blog' },
      { href: '/admin/content/changelog', label: 'Changelog' },
      { href: '/admin/content/notifications', label: 'Notifications' },
    ],
  },
  {
    label: 'Analytics',
    href: '/admin/analytics',
  },
  {
    label: 'System',
    href: '/admin/system',
    children: [
      { href: '/admin/system/health', label: 'Health' },
      { href: '/admin/system/ai-jobs', label: 'AI Jobs' },
      { href: '/admin/system/webhooks', label: 'Webhooks' },
      { href: '/admin/system/audit-logs', label: 'Audit Logs' },
    ],
  },
  {
    label: 'Settings',
    href: '/admin/settings',
    children: [
      { href: '/admin/settings/feature-flags', label: 'Feature Flags' },
    ],
  },
];

export default function AdminSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['Partners', 'Content', 'System', 'Settings']));

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const isActive = (href: string) => pathname === href;
  const isGroupActive = (group: SidebarGroup) =>
    pathname === group.href || group.children?.some((c) => pathname === c.href);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-surface border-r border-border p-4 pt-20">
          <div className="mb-6 px-3">
            <span className="text-xs font-medium text-primary uppercase tracking-wider">Enso Admin</span>
          </div>

          <nav className="flex flex-col gap-0.5 flex-1">
            {sidebarGroups.map((group) => {
              const groupActive = isGroupActive(group);
              const expanded = expandedGroups.has(group.label);

              if (!group.children) {
                return (
                  <Link
                    key={group.href}
                    href={group.href}
                    className={`relative flex items-center gap-3 px-3 py-2 rounded-card text-sm font-medium transition-colors ${
                      isActive(group.href)
                        ? 'text-primary bg-primary/5'
                        : 'text-text-secondary hover:text-text-primary hover:bg-background'
                    }`}
                  >
                    {isActive(group.href) && (
                      <motion.div
                        layoutId="admin-active"
                        className="absolute inset-0 bg-primary/5 rounded-card"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{group.label}</span>
                  </Link>
                );
              }

              return (
                <div key={group.href}>
                  <button
                    onClick={() => toggleGroup(group.label)}
                    className={`w-full relative flex items-center gap-3 px-3 py-2 rounded-card text-sm font-medium transition-colors ${
                      groupActive
                        ? 'text-primary bg-primary/5'
                        : 'text-text-secondary hover:text-text-primary hover:bg-background'
                    }`}
                  >
                    {groupActive && (
                      <motion.div
                        layoutId="admin-active"
                        className="absolute inset-0 bg-primary/5 rounded-card"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 flex-1 text-left">{group.label}</span>
                    <motion.span
                      className="relative z-10 text-text-disabled text-xs"
                      animate={{ rotate: expanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      ▾
                    </motion.span>
                  </button>

                  <AnimatePresence>
                    {expanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-4 pt-0.5 pb-1 space-y-0.5">
                          <Link
                            href={group.href}
                            className={`block px-3 py-1.5 rounded-card text-xs font-medium transition-colors ${
                              isActive(group.href)
                                ? 'text-primary bg-primary/5'
                                : 'text-text-disabled hover:text-text-secondary'
                            }`}
                          >
                            Overview
                          </Link>
                          {group.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={`block px-3 py-1.5 rounded-card text-xs font-medium transition-colors ${
                                isActive(child.href)
                                  ? 'text-primary bg-primary/5'
                                  : 'text-text-disabled hover:text-text-secondary'
                              }`}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>

          <div className="mt-auto pt-4 border-t border-border">
            <div className="flex items-center gap-3 px-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium overflow-hidden">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                ) : (
                  user?.displayName?.[0] || user?.email?.[0] || '?'
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {user?.displayName || 'Admin'}
                </p>
                <p className="text-xs text-text-disabled truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-card text-sm font-medium text-text-secondary hover:text-danger hover:bg-danger/5 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </aside>

        {/* Mobile nav */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-border">
          <nav className="flex items-center justify-around h-16 px-2 overflow-x-auto">
            {sidebarGroups.filter(g => !g.children).map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex flex-col items-center gap-1 px-2 py-1 text-xs font-medium transition-colors whitespace-nowrap ${
                    active ? 'text-primary' : 'text-text-disabled'
                  }`}
                >
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Main content */}
        <main className="flex-1 min-h-screen pb-20 lg:pb-0">
          <div className="max-w-6xl mx-auto px-6 py-8 pt-20 lg:pt-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
