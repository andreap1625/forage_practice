import { useState } from "react";

// ── Datacom brand tokens ──────────────────────────────
const DC = {
  red:       "#E4002B",
  redDark:   "#B50022",
  redLight:  "#FCEEF1",
  redMid:    "#F9D0D8",
  black:     "#1A1A1A",
  grey90:    "#2D2D2D",
  grey60:    "#666666",
  grey30:    "#B3B3B3",
  grey10:    "#F2F2F2",
  grey05:    "#F8F8F8",
  white:     "#FFFFFF",
  border:    "#E0E0E0",
  green:     "#00875A",
  greenBg:   "#E3F5EE",
  amber:     "#B45300",
  amberBg:   "#FFF3E0",
};

const TEAM = [
  { name: "Aiko Tanaka",    initials: "AT", color: DC.redLight,  text: DC.redDark,  role: "Product Design" },
  { name: "Marcus Webb",    initials: "MW", color: "#E8F0FB",    text: "#1A3A6B",   role: "Engineering" },
  { name: "Priya Suresh",   initials: "PS", color: "#FFF3E0",    text: "#7A3800",   role: "Data Science" },
  { name: "Daniel Osei",    initials: "DO", color: DC.grey10,    text: DC.grey90,   role: "Product" },
  { name: "Sofia Reyes",    initials: "SR", color: DC.redLight,  text: DC.redDark,  role: "Marketing" },
  { name: "James Okafor",   initials: "JO", color: DC.greenBg,   text: "#005235",   role: "Sales" },
  { name: "Elif Çelik",     initials: "EÇ", color: "#EDE8FB",    text: "#3B2294",   role: "Engineering" },
  { name: "Rosa Lindqvist", initials: "RL", color: DC.grey10,    text: DC.grey90,   role: "Customer Success" },
];

const EMOJIS = [
  { emoji: "🚀", label: "Crushing it" },
  { emoji: "💡", label: "Brilliant idea" },
  { emoji: "🤝", label: "Team player" },
  { emoji: "🎯", label: "On target" },
  { emoji: "🌟", label: "Star work" },
  { emoji: "💪", label: "Resilient" },
];

const SEED_KUDOS = [
  { id: 1, from: TEAM[1], to: TEAM[0], emoji: "💡", msg: "Your redesign of the onboarding flow was incredibly thoughtful. Users are completing setup 40% faster!", time: "2h ago", likes: 5, liked: false },
  { id: 2, from: TEAM[3], to: TEAM[2], emoji: "🚀", msg: "The churn prediction model you shipped last sprint is already surfacing accounts we'd have missed. Real impact.", time: "5h ago", likes: 8, liked: false },
  { id: 3, from: TEAM[6], to: TEAM[1], emoji: "🤝", msg: "Jumped in to pair with me on a nasty bug at 5pm without hesitation. That kind of generosity makes us all better.", time: "Yesterday", likes: 12, liked: false },
  { id: 4, from: TEAM[4], to: TEAM[5], emoji: "🎯", msg: "Closed the Meridian deal with such calm confidence. You made the whole room believe in the product.", time: "2 days ago", likes: 9, liked: false },
];

export default function KudosFeed() {
  const [kudosList, setKudosList] = useState(SEED_KUDOS);
  const [recipient, setRecipient] = useState("");
  const [msg, setMsg] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [showToast, setShowToast] = useState(false);

  const isValid = recipient !== "" && msg.trim().length >= 10 && selectedEmoji;

  const handleSubmit = () => {
    if (!isValid) return;
    const to = TEAM[parseInt(recipient)];
    const newKudo = {
      id: Date.now(),
      from: { name: "You", initials: "ME", color: DC.redLight, text: DC.redDark },
      to,
      emoji: selectedEmoji,
      msg: msg.trim(),
      time: "Just now",
      likes: 0,
      liked: false,
      isNew: true,
    };
    setKudosList([newKudo, ...kudosList]);
    setRecipient("");
    setMsg("");
    setSelectedEmoji(null);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2800);
  };

  const toggleLike = (id) => {
    setKudosList(kudosList.map(k =>
      k.id === id ? { ...k, liked: !k.liked, likes: k.liked ? k.likes - 1 : k.likes + 1 } : k
    ));
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: DC.grey05, minHeight: "100vh", padding: "0 0 3rem" }}>
      {/* Top bar */}
      <div style={{ background: DC.black, padding: "0 2rem", display: "flex", alignItems: "center", gap: 12, height: 56 }}>
        <div style={{ fontWeight: 700, fontSize: 20, color: DC.white, letterSpacing: "-0.3px" }}>
          data<span style={{ color: DC.red }}>com</span>
        </div>
        <div style={{ width: 1, height: 24, background: "#444", marginLeft: 4 }} />
        <span style={{ fontSize: 14, color: DC.grey30, fontWeight: 400 }}>Kudos</span>
      </div>

      {/* Hero banner */}
      <div style={{ background: `linear-gradient(135deg, ${DC.black} 0%, ${DC.grey90} 60%, #3a0010 100%)`, padding: "2rem 2rem 2.5rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: DC.red, opacity: 0.08 }} />
        <div style={{ position: "absolute", bottom: -60, right: 80, width: 150, height: 150, borderRadius: "50%", background: DC.red, opacity: 0.05 }} />
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(228,0,43,0.15)", border: `1px solid rgba(228,0,43,0.3)`, borderRadius: 20, padding: "4px 12px", marginBottom: 12 }}>
            <span style={{ fontSize: 14 }}>🏆</span>
            <span style={{ fontSize: 12, color: DC.red, fontWeight: 600, letterSpacing: ".04em", textTransform: "uppercase" }}>Peer Recognition</span>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: DC.white, margin: "0 0 6px", letterSpacing: "-0.4px" }}>Give Kudos</h1>
          <p style={{ fontSize: 14, color: DC.grey30, margin: 0 }}>Celebrate the people who make Datacom great.</p>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "1.75rem auto 0", padding: "0 2rem", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.6fr)", gap: "1.25rem", alignItems: "start" }}>
        {/* Form card */}
        <div style={{ background: DC.white, border: `1px solid ${DC.border}`, borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <div style={{ background: DC.red, padding: "14px 18px", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 16 }}>✉️</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: DC.white, letterSpacing: ".04em", textTransform: "uppercase" }}>Send Kudos</span>
          </div>
          <div style={{ padding: "1.25rem" }}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: DC.grey60, display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: ".04em" }}>To</label>
              <select
                style={{ width: "100%", fontSize: 14, color: DC.black, background: DC.grey05, border: `1px solid ${DC.border}`, borderRadius: 8, padding: "9px 11px", outline: "none", fontFamily: "inherit" }}
                value={recipient}
                onChange={e => setRecipient(e.target.value)}
              >
                <option value="">— Select a colleague —</option>
                {TEAM.map((p, i) => <option key={i} value={i}>{p.name} — {p.role}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: DC.grey60, display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: ".04em" }}>Tone</label>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {EMOJIS.map(({ emoji, label }) => (
                  <button
                    key={emoji}
                    title={label}
                    onClick={() => setSelectedEmoji(emoji)}
                    style={{
                      width: 38, height: 38, borderRadius: 8, fontSize: 18, cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      border: selectedEmoji === emoji ? `2px solid ${DC.red}` : `1px solid ${DC.border}`,
                      background: selectedEmoji === emoji ? DC.redLight : DC.grey05,
                      transition: "all .15s",
                    }}
                  >{emoji}</button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: DC.grey60, display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: ".04em" }}>Message</label>
              <textarea
                rows={4}
                placeholder="What did they do that made a difference?"
                value={msg}
                onChange={e => setMsg(e.target.value.slice(0, 200))}
                style={{ width: "100%", fontSize: 14, color: DC.black, background: DC.grey05, border: `1px solid ${DC.border}`, borderRadius: 8, padding: "9px 11px", outline: "none", resize: "none", fontFamily: "inherit", boxSizing: "border-box" }}
              />
              <div style={{ fontSize: 11, color: msg.length > 180 ? DC.amber : DC.grey30, textAlign: "right", marginTop: 3 }}>{msg.length} / 200</div>
            </div>

            <button
              disabled={!isValid}
              onClick={handleSubmit}
              style={{
                width: "100%", padding: "10px", borderRadius: 8, border: "none",
                background: isValid ? DC.red : DC.grey10,
                color: isValid ? DC.white : DC.grey30,
                fontFamily: "inherit", fontSize: 14, fontWeight: 600, cursor: isValid ? "pointer" : "default",
                transition: "background .15s",
              }}
            >
              Send Kudos →
            </button>
          </div>
        </div>

        {/* Feed card */}
        <div style={{ background: DC.white, border: `1px solid ${DC.border}`, borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <div style={{ background: DC.black, padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16 }}>❤️</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: DC.white, letterSpacing: ".04em", textTransform: "uppercase" }}>Team Feed</span>
            </div>
            <span style={{ fontSize: 12, background: DC.red, color: DC.white, padding: "2px 10px", borderRadius: 20, fontWeight: 600 }}>{kudosList.length} kudos</span>
          </div>
          <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: 10, maxHeight: 490, overflowY: "auto" }}>
            {kudosList.length === 0 ? (
              <div style={{ textAlign: "center", color: DC.grey30, fontSize: 14, padding: "2rem" }}>No kudos yet — be the first! 🎉</div>
            ) : kudosList.map((k, idx) => (
              <div key={k.id} style={{ background: DC.grey05, borderRadius: 10, border: `1px solid ${DC.border}`, padding: "12px 14px", display: "flex", gap: 12, position: "relative" }}>
                {idx === 0 && k.time === "Just now" && (
                  <div style={{ position: "absolute", top: 10, left: -1, background: DC.red, color: DC.white, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: "0 4px 4px 0", letterSpacing: ".04em" }}>NEW</div>
                )}
                <div style={{ width: 36, height: 36, minWidth: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, background: k.from.color, color: k.from.text, marginTop: idx === 0 && k.time === "Just now" ? 10 : 0 }}>{k.from.initials}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: DC.black, marginBottom: 4 }}>{k.from.name} <span style={{ color: DC.red, fontWeight: 700 }}>→</span> {k.to.name}</div>
                  <div style={{ fontSize: 13, color: DC.grey60, lineHeight: 1.5, wordBreak: "break-word" }}>{k.msg}</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
                    <span style={{ fontSize: 11, color: DC.grey30 }}>{k.time}</span>
                    <button
                      onClick={() => toggleLike(k.id)}
                      style={{ fontSize: 12, color: k.liked ? DC.red : DC.grey30, background: "none", border: "none", cursor: "pointer", padding: "2px 6px", borderRadius: 20, fontFamily: "inherit", fontWeight: k.liked ? 600 : 400 }}
                    >{k.liked ? "❤️" : "🤍"} {k.likes}</button>
                  </div>
                </div>
                <span style={{ fontSize: 18, position: "absolute", right: 14, top: 12 }}>{k.emoji}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Toast */}
      <div style={{
        position: "fixed", bottom: 24, left: "50%",
        transform: showToast ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(80px)",
        background: DC.black, color: DC.white, padding: "10px 20px",
        borderRadius: 8, fontSize: 14, fontWeight: 500,
        transition: "transform .3s ease", zIndex: 999, pointerEvents: "none",
        borderLeft: `4px solid ${DC.red}`,
      }}>
        🎉 Kudos sent!
      </div>
    </div>
  );
}
