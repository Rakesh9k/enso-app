export default function HomeLoopSection() {
  return (
    <section className="py-24 px-6 bg-surface">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-editorial text-text-primary text-center mb-16">
          The Enso Loop
        </h2>
        <div className="grid md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl">1</span>
            </div>
            <h3 className="text-lg font-medium text-text-primary mb-2">Reflect</h3>
            <p className="text-sm text-text-secondary">
              Write one honest line about your day. No word counts. No prompts. Just you.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl">2</span>
            </div>
            <h3 className="text-lg font-medium text-text-primary mb-2">Understand</h3>
            <p className="text-sm text-text-secondary">
              AI gently surfaces patterns you might not see. Themes, moods, and recurring thoughts.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl">3</span>
            </div>
            <h3 className="text-lg font-medium text-text-primary mb-2">Grow</h3>
            <p className="text-sm text-text-secondary">
              Watch your journey unfold over days, weeks, and months. See how far you have come.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
