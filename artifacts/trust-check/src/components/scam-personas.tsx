const personas = [
  {
    name: "Col. James Wheeler",
    role: "US Army Colonel, deployed",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=470&fit=crop&auto=format",
    pills: ["Military", "Overseas"],
  },
  {
    name: "Dr. Samuel Osei",
    role: "Surgeon, Qatar",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=470&fit=crop&auto=format",
    pills: ["Medical", "Overseas"],
  },
  {
    name: "Erik Larsson",
    role: "Oil Rig Engineer, offshore",
    image: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=400&h=470&fit=crop&auto=format",
    pills: ["Engineer", "Offshore"],
  },
  {
    name: "David Chen",
    role: "Businessman, abroad",
    image: "https://images.unsplash.com/photo-1556157382-97eda2f9e2bf?w=400&h=470&fit=crop&auto=format",
    pills: ["Business", "Travelling"],
  },
];

export function ScamPersonas() {
  return (
    <section className="mt-24">
      <h2 className="text-2xl font-semibold text-white mb-2">
        These profiles are not real people.
      </h2>
      <p className="text-slate-400 mb-8 text-base">
        AI-generated or stolen photos. Common personas used by romance scammers worldwide.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {personas.map((p) => (
          <div key={p.name} className="rounded-2xl overflow-hidden bg-[#111827] border border-slate-800 flex flex-col">
            {/* Image container */}
            <div className="relative" style={{ aspectRatio: "0.85" }}>
              <img
                src={p.image}
                alt=""
                className="w-full h-full object-cover"
                style={{ filter: "blur(5px) brightness(0.65)" }}
                loading="lazy"
              />
              {/* FAKE stamp */}
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ transform: "rotate(-18deg)" }}
              >
                <span
                  className="text-[#e2533a] text-3xl md:text-4xl font-black tracking-widest select-none"
                  style={{
                    border: "3px solid #e2533a",
                    padding: "2px 12px",
                    borderRadius: "4px",
                    lineHeight: 1.2,
                    opacity: 0.9,
                    textShadow: "0 0 12px rgba(226,83,58,0.4)",
                  }}
                >
                  FAKE
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="p-3 flex flex-col gap-2">
              <p className="text-white font-semibold text-sm leading-tight">{p.name}</p>
              <p className="text-slate-400 text-xs leading-tight">{p.role}</p>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {p.pills.map((pill) => (
                  <span
                    key={pill}
                    className="px-2 py-0.5 rounded-full text-[11px] font-semibold"
                    style={{ background: "rgba(226,83,58,0.15)", color: "#e2533a", border: "1px solid rgba(226,83,58,0.3)" }}
                  >
                    {pill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-5 text-center text-sm text-slate-500 italic">
        These are the 4 most common romance scam personas. Sound familiar?
      </p>
    </section>
  );
}
