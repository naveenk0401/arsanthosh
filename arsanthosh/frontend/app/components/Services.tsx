const services = [
  {
    title: "Home Interior Design",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop",
    desc: "Bespoke residential designs that reflect your personality."
  },
  {
    title: "Modular Kitchen",
    image: "/kitchen_service.png",
    desc: "Modern, functional, and luxury kitchen solutions."
  },
  {
    title: "Office Interior Design",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop",
    desc: "Productive and inspiring workspaces for your team."
  },
  {
    title: "Turnkey Projects",
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=800&auto=format&fit=crop",
    desc: "Complete end-to-end execution from design to handover."
  },
];

export default function Services() {
  return (
    <section className="bg-[var(--bg)] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-12 gap-4">
          <div>
            <h2 className="text-[10px] md:text-sm uppercase tracking-widest text-[var(--accent)] font-bold mb-2">Capabilities</h2>
            <h3 className="text-2xl md:text-4xl font-bold">Our Services</h3>
          </div>
          <button className="text-[10px] md:text-sm font-bold border-b-2 border-[var(--primary)] pb-1 uppercase tracking-widest hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors">VIEW ALL SERVICES</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {services.map((service) => (
            <div key={service.title} className="group cursor-pointer">
              <div className="relative aspect-[4/5] md:aspect-[3/4] overflow-hidden mb-4">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors" />
              </div>
              <h4 className="text-lg md:text-xl font-bold mb-2">{service.title}</h4>
              <p className="text-xs md:text-sm text-[var(--muted)] leading-relaxed mb-4">
                {service.desc}
              </p>
              <button className="text-[10px] md:text-xs font-bold text-[var(--accent)] uppercase tracking-widest group-hover:translate-x-2 transition-transform inline-block">
                Explore More →
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
