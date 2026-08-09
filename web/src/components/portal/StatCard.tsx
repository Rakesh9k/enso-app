interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: string;
}

export default function StatCard({ label, value, icon, trend }: StatCardProps) {
  return (
    <div className="bg-surface border border-border rounded-card p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-text-secondary uppercase tracking-wide">{label}</span>
        {icon && <span className="text-text-disabled">{icon}</span>}
      </div>
      <p className="text-2xl font-semibold text-text-primary">{value}</p>
      {trend && <p className="text-xs text-text-secondary mt-1">{trend}</p>}
    </div>
  );
}
