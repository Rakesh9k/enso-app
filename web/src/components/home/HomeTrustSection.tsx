import Link from 'next/link';

export default function HomeTrustSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-editorial text-text-primary mb-6">
          Built with care.
        </h2>
        <p className="text-text-secondary text-lg mb-8">
          Enso is built by a small team who believe technology should serve inner life,
          not exploit it.
        </p>
        <div className="flex justify-center gap-6">
          <Link href="/privacy" className="text-sm text-primary hover:underline">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-sm text-primary hover:underline">
            Terms of Service
          </Link>
        </div>
      </div>
    </section>
  );
}
