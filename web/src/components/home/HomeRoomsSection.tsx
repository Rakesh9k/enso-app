export default function HomeRoomsSection() {
  return (
    <section className="py-24 px-6 bg-surface">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-editorial text-text-primary mb-6">
          Eight rooms. Eight moods.
        </h2>
        <p className="text-text-secondary mb-12">
          Each room is a different emotional atmosphere. Choose the one that feels right.
        </p>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {['Chalk', 'Paper', 'Mist', 'Dusk', 'Rain', 'Tide', 'Garden', 'Aurora'].map((room) => (
            <div key={room} className="text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 mb-2" />
              <span className="text-xs text-text-secondary">{room}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
