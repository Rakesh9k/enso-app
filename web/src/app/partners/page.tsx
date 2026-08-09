import Link from 'next/link';
export default function PartnersLanding() {
  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl font-editorial text-text-primary mb-6">Partner Program</h1>
        <p className="text-text-secondary text-lg mb-8">Help others discover Enso and earn commissions.</p>
        <div className="flex gap-4 justify-center">
          <Link href="/partners/apply" className="px-6 py-3 rounded-button bg-primary text-on-primary font-medium">Apply Now</Link>
          <Link href="/partners/faq" className="px-6 py-3 rounded-button border border-border text-text-primary font-medium">Learn More</Link>
        </div>
      </div>
    </div>
  );
}
