export default function HomeSocialProofSection() {
  return (
    <section className="py-24 px-6 bg-surface">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-editorial text-text-primary mb-16">
          Trusted by people who take their inner life seriously.
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-background rounded-card p-6 border border-border">
            <p className="text-sm text-text-secondary italic mb-4">
              &ldquo;Enso is the first journaling app that doesn&apos;t feel like a chore.
              The owl feels like a friend.&rdquo;
            </p>
            <p className="text-xs text-text-disabled">Early user</p>
          </div>
          <div className="bg-background rounded-card p-6 border border-border">
            <p className="text-sm text-text-secondary italic mb-4">
              &ldquo;The pattern insights helped me realize I journal more on days I walk.
              Now I walk every day.&rdquo;
            </p>
            <p className="text-xs text-text-disabled">Beta tester</p>
          </div>
          <div className="bg-background rounded-card p-6 border border-border">
            <p className="text-sm text-text-secondary italic mb-4">
              &ldquo;Finally an AI wellness app that doesn&apos;t try to be my therapist.
              It just listens.&rdquo;
            </p>
            <p className="text-xs text-text-disabled">Partner</p>
          </div>
        </div>
        <div className="mt-12 flex justify-center gap-12 text-sm text-text-secondary">
          <div>
            <p className="text-2xl font-semibold text-text-primary">1,000+</p>
            <p>Journals written</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-text-primary">500+</p>
            <p>Active users</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-text-primary">50+</p>
            <p>Partners</p>
          </div>
        </div>
      </div>
    </section>
  );
}
