export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-editorial text-text-primary mb-6">Terms of Service</h1>
        <div className="prose prose-sm text-text-secondary">
          <p>Last updated: January 2025</p>
          <p>By using Enso, you agree to these terms.</p>
          <h2 className="text-lg font-medium text-text-primary mt-8 mb-4">Service</h2>
          <p>Enso provides AI-powered journaling and meditation tools. The service is provided as-is.</p>
          <h2 className="text-lg font-medium text-text-primary mt-8 mb-4">Account</h2>
          <p>You are responsible for your account and the content you create.</p>
          <h2 className="text-lg font-medium text-text-primary mt-8 mb-4">Contact</h2>
          <p>Questions? Email us at hello@ensomode.com</p>
        </div>
      </div>
    </div>
  );
}
