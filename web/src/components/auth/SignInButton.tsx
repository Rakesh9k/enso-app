'use client';

import { motion } from 'framer-motion';

interface SignInButtonProps {
  provider: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  loading?: boolean;
}

export default function SignInButton({ provider, icon, label, onClick, loading }: SignInButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-card border border-border bg-surface hover:bg-background text-text-primary text-sm font-medium transition-colors disabled:opacity-50"
    >
      {icon}
      <span>{label}</span>
    </motion.button>
  );
}
