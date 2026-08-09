'use client';
export default function PortalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-danger/10 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-danger">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h2 className="text-lg font-medium text-text-primary mb-2">Something went wrong</h2>
        <p className="text-sm text-text-secondary mb-4">{error.message}</p>
        <button onClick={reset} className="px-4 py-2 rounded-button bg-primary text-on-primary text-sm font-medium">
          Try again
        </button>
      </div>
    </div>
  );
}
