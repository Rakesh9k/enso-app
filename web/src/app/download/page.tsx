import Link from 'next/link';
export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl font-editorial text-text-primary mb-6">Download Enso</h1>
        <p className="text-text-secondary text-lg mb-12">Available on Android. iOS coming soon.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="https://play.google.com/store/apps/details?id=com.enso.app" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-6 py-3 rounded-button bg-primary text-on-primary font-medium hover:opacity-90">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M3 20.5v-17A1.5 1.5 0 014.5 2h15A1.5 1.5 0 0121 3.5v17l-9-4.5L3 20.5z"/></svg>
            Get on Google Play
          </a>
        </div>
      </div>
    </div>
  );
}
