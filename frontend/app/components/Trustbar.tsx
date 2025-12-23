export default function TrustBar() {
  return (
    <section className="bg-white border-y">
      <div className="max-w-7xl mx-auto px-6 py-5 md:py-6 grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 text-center text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-500">
        <div className="flex flex-col gap-1">
          <span className="text-[var(--accent)] text-lg md:text-xl">10+</span>
          Years Experience
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[var(--accent)] text-lg md:text-xl">500+</span>
          Projects
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[var(--accent)] text-lg md:text-xl">25+</span>
          Designers
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[var(--accent)] text-lg md:text-xl">100%</span>
          Quality Control
        </div>
      </div>
    </section>
  );
}
