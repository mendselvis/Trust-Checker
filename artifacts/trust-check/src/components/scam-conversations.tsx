type Bubble = {
  side: "them" | "me";
  text: string;
  highlights?: string[];
};

type Conversation = {
  person: string;
  platform: string;
  flagCount: number;
  bubbles: Bubble[];
  chips: string[];
};

const conversations: Conversation[] = [
  {
    person: "Col. James Wheeler",
    platform: "Instagram DM — Day 1",
    flagCount: 4,
    bubbles: [
      {
        side: "them",
        text: "Hi beautiful, I came across your profile and I had to say hello. There is something about you that feels different to anyone I have ever met.",
        highlights: ["There is something about you that feels different to anyone I have ever met"],
      },
      { side: "me", text: "Oh thanks! How did you find me?" },
      {
        side: "them",
        text: "I am a US Army Colonel stationed in Syria. I have been serving for 22 years. It is lonely out here. I feel like I've known you my whole life already.",
        highlights: ["US Army Colonel stationed in Syria", "I feel like I've known you my whole life already"],
      },
      {
        side: "them",
        text: "Let us move to WhatsApp? I don't check Instagram much. My number is +1-800-SCAMMER.",
        highlights: ["Let us move to WhatsApp?"],
      },
    ],
    chips: ["Love bombing", "Military persona", "Overseas claim", "Platform switch"],
  },
  {
    person: "Dr. Samuel Osei",
    platform: "WhatsApp — Day 8",
    flagCount: 3,
    bubbles: [
      {
        side: "them",
        text: "Good morning my darling. I was thinking about you all night. You are my soulmate, I am sure of it.",
        highlights: ["You are my soulmate"],
      },
      { side: "me", text: "Can we video call today? I'd love to see your face!" },
      {
        side: "them",
        text: "I am so sorry, my camera is broken and the hospital internet is very poor here in Qatar. I will fix it soon I promise.",
        highlights: ["my camera is broken"],
      },
      {
        side: "them",
        text: "There is an emergency with my funds. I need $500 to release my equipment from customs or I lose my position. You are the only person I can trust.",
        highlights: ["There is an emergency with my funds", "$500"],
      },
    ],
    chips: ["Love bombing", "Camera excuse", "Financial request", "Urgency pressure"],
  },
];

function HighlightedText({ text, highlights }: { text: string; highlights?: string[] }) {
  if (!highlights || highlights.length === 0) return <>{text}</>;

  const parts: { text: string; highlighted: boolean }[] = [];
  let remaining = text;

  for (const phrase of highlights) {
    const idx = remaining.indexOf(phrase);
    if (idx === -1) continue;
    if (idx > 0) parts.push({ text: remaining.slice(0, idx), highlighted: false });
    parts.push({ text: phrase, highlighted: true });
    remaining = remaining.slice(idx + phrase.length);
  }
  if (remaining) parts.push({ text: remaining, highlighted: false });

  return (
    <>
      {parts.map((p, i) =>
        p.highlighted ? (
          <span
            key={i}
            style={{
              color: "#e2533a",
              textDecoration: "underline",
              textDecorationColor: "rgba(226,83,58,0.6)",
              textDecorationThickness: "2px",
              textUnderlineOffset: "3px",
            }}
          >
            {p.text}
          </span>
        ) : (
          <span key={i}>{p.text}</span>
        )
      )}
    </>
  );
}

export function ScamConversations() {
  return (
    <section className="mt-20">
      <h2 className="text-2xl font-semibold text-white mb-2">
        Seen these messages before?
      </h2>
      <p className="text-slate-400 mb-8 text-base">
        Real scam scripts, word for word. The patterns are always the same.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {conversations.map((conv) => (
          <div
            key={conv.person}
            className="rounded-2xl border border-slate-800 flex flex-col overflow-hidden"
            style={{ background: "#111827" }}
          >
            {/* Card header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
              <div>
                <p className="text-white font-semibold text-sm">{conv.person}</p>
                <p className="text-slate-500 text-xs">{conv.platform}</p>
              </div>
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-full"
                style={{ background: "rgba(226,83,58,0.15)", color: "#e2533a", border: "1px solid rgba(226,83,58,0.3)" }}
              >
                {conv.flagCount} flags detected
              </span>
            </div>

            {/* Chat bubbles */}
            <div className="flex flex-col gap-2.5 px-4 py-4">
              {conv.bubbles.map((bubble, i) => (
                <div
                  key={i}
                  className={`flex ${bubble.side === "me" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className="max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed"
                    style={{
                      background: bubble.side === "them" ? "#1e3a5f" : "#1a3a2a",
                      color: "#e2e8f0",
                      borderBottomLeftRadius: bubble.side === "them" ? "4px" : undefined,
                      borderBottomRightRadius: bubble.side === "me" ? "4px" : undefined,
                    }}
                  >
                    <HighlightedText text={bubble.text} highlights={bubble.highlights} />
                  </div>
                </div>
              ))}
            </div>

            {/* Chips */}
            <div className="flex flex-wrap gap-2 px-4 pb-4 mt-auto">
              {conv.chips.map((chip) => (
                <span
                  key={chip}
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{
                    background: "rgba(226,83,58,0.1)",
                    color: "#e2533a",
                    border: "1px solid rgba(226,83,58,0.25)",
                  }}
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
