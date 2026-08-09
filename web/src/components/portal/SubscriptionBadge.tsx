interface SubscriptionBadgeProps {
  tier: string;
}

const tierStyles: Record<string, string> = {
  FREE: 'bg-gray-100 text-gray-700 border-gray-200',
  PREMIUM: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  PRO: 'bg-amber-50 text-amber-700 border-amber-200',
};

export default function SubscriptionBadge({ tier }: SubscriptionBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
        tierStyles[tier] || tierStyles.FREE
      }`}
    >
      {tier}
    </span>
  );
}
