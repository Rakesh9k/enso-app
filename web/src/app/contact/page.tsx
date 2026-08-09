export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-editorial text-text-primary mb-6">Contact</h1>
        <p className="text-text-secondary mb-8">We would love to hear from you.</p>
        <div className="bg-surface border border-border rounded-card p-6">
          <p className="text-sm text-text-secondary">
            For support, partnerships, or general inquiries, reach us at{' '}
            <a href="mailto:hello@ensomode.com" className="text-primary hover:underline">hello@ensomode.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
