export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-editorial text-text-primary mb-6">Privacy Policy</h1>
        <div className="prose prose-sm text-text-secondary">
          <p>Last updated: January 2025</p>
          <p>Enso respects your privacy. Your journal entries are private and encrypted. We do not sell your data.</p>
          <h2 className="text-lg font-medium text-text-primary mt-8 mb-4">Data Collection</h2>
          <p>We collect only what is necessary to provide the service: your email, journal entries, and usage data.</p>
          <h2 className="text-lg font-medium text-text-primary mt-8 mb-4">Data Usage</h2>
          <p>Your data is used solely to provide you with the Enso experience, including AI-powered insights.</p>
          <h2 className="text-lg font-medium text-text-primary mt-8 mb-4">Contact</h2>
          <p>Questions? Email us at hello@ensomode.com</p>
        </div>
      </div>
    </div>
  );
}
