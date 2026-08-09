'use client';

export default function NotificationsAdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Notifications</h1>
        <p className="text-text-secondary mt-1">Send push notifications and in-app messages</p>
      </div>

      <div className="bg-surface rounded-card border border-border p-6 space-y-4">
        <h3 className="text-lg font-semibold text-text-primary">Send Notification</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-text-secondary mb-1">Title</label>
            <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-card text-sm" placeholder="Notification title" />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">Message</label>
            <textarea className="w-full px-4 py-2 bg-background border border-border rounded-card text-sm h-24" placeholder="Notification message" />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">Target</label>
            <select className="w-full px-4 py-2 bg-background border border-border rounded-card text-sm">
              <option value="all">All Users</option>
              <option value="free">Free Users</option>
              <option value="premium">Premium Users</option>
            </select>
          </div>
          <button className="px-4 py-2 bg-primary text-white rounded-card text-sm font-medium hover:bg-primary/90 transition-colors">
            Send Notification
          </button>
        </div>
      </div>
    </div>
  );
}
