import { useState } from "react";

const DC = {
  red:      "#E4002B",
  redDark:  "#B50022",
  redLight: "#FCEEF1",
  redMid:   "#F9D0D8",
  black:    "#1A1A1A",
  grey90:   "#2D2D2D",
  grey60:   "#666666",
  grey30:   "#B3B3B3",
  grey10:   "#F2F2F2",
  grey05:   "#F8F8F8",
  white:    "#FFFFFF",
  border:   "#E0E0E0",
  green:    "#00875A",
  greenBg:  "#E3F5EE",
  greenDark:"#005235",
  amber:    "#B45300",
  amberBg:  "#FFF3E0",
};

const AVATARS = [
  { initials: "AT", bg: DC.redLight,  tx: DC.redDark },
  { initials: "MW", bg: "#E8F0FB",    tx: "#1A3A6B" },
  { initials: "PS", bg: "#FFF3E0",    tx: "#7A3800" },
  { initials: "DO", bg: DC.grey10,    tx: DC.grey90 },
  { initials: "SR", bg: DC.redLight,  tx: DC.redDark },
  { initials: "JO", bg: DC.greenBg,   tx: DC.greenDark },
];

const INITIAL_KUDOS = [
  { id: 1, from: "Aiko Tanaka",  fromA: AVATARS[0], to: "Marcus Webb",    toA: AVATARS[1], emoji: "🚀", msg: "Your code review process is absolutely amazing and you're the best engineer I've ever worked with, incredible!", status: "flagged", reason: "report",  reports: 2, time: "2h ago" },
  { id: 2, from: "Priya Suresh", fromA: AVATARS[2], to: "Daniel Osei",    toA: AVATARS[3], emoji: "💡", msg: "Great product thinking on the roadmap session. Really aligned the team.", status: "visible", reason: null, reports: 0, time: "3h ago" },
  { id: 3, from: "Sofia Reyes",  fromA: AVATARS[4], to: "James Okafor",   toA: AVATARS[5], emoji: "🎯", msg: "Closed that deal so smoothly. Completely dominated the sales call.", status: "flagged", reason: "keyword", reports: 0, time: "4h ago" },
  { id: 4, from: "Marcus Webb",  fromA: AVATARS[1], to: "Aiko Tanaka",    toA: AVATARS[0], emoji: "🌟", msg: "Your redesign made onboarding 40% faster. Real measurable impact.", status: "visible", reason: null, reports: 0, time: "5h ago" },
  { id: 5, from: "Daniel Osei",  fromA: AVATARS[3], to: "Priya Suresh",   toA: AVATARS[2], emoji: "💪", msg: "The churn model is already catching accounts we'd have missed. Great work.", status: "visible", reason: null, reports: 0, time: "Yesterday" },
  { id: 6, from: "James Okafor", fromA: AVATARS[5], to: "Sofia Reyes",    toA: AVATARS[4], emoji: "🤝", msg: "Insane campaign execution. Crushed all our targets this quarter.", status: "flagged", reason: "keyword", reports: 1, time: "Yesterday" },
  { id: 7, from: "Elif Çelik",   fromA: AVATARS[1], to: "Rosa Lindqvist", toA: AVATARS[4], emoji: "💡", msg: "Always goes above and beyond for customers. Truly dedicated.", status: "visible", reason: null, reports: 0, time: "2 days ago" },
];

const INITIAL_KEYWORDS = ["insane", "crush", "kill it", "dominated", "destroy", "crazy"];

const INITIAL_RULES = [
  { icon: "🚩", title: "Auto-hide on user report",          desc: "Hide a kudo from the feed when it receives 2+ reports. Queued for review.", on: true },
  { icon: "🔍", title: "Keyword auto-flag",                 desc: "Flag kudos matching the keyword list. Moderators review before restoring.", on: true },
  { icon: "✅", title: "Manager approval for cross-team kudos", desc: "Kudos sent outside the sender's direct team require manager sign-off.", on: false },
  { icon: "🔔", title: "Notify author when hidden",         desc: "Send the author an in-app notification explaining why their kudo was hidden.", on: true },
  { icon: "🛡️", title: "Repeat offender auto-review",      desc: "Automatically queue all kudos from users with 3+ removed posts in 30 days.", on: false },
];

function highlightKeywords(msg, keywords) {
  if (!keywords.length) return msg;
  const parts = msg.split(new RegExp(`(${keywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join("|")})`, "gi"));
  return parts.map((p, i) =>
    keywords.some(k => k.toLowerCase() === p.toLowerCase())
      ? <mark key={i} style={{ background: DC.amberBg, color: DC.amber, borderRadius: 3, padding: "0 3px", fontWeight: 600 }}>{p}</mark>
      : p
  );
}

function Toggle({ on, onChange }) {
  return (
    <div onClick={onChange} style={{ position: "relative", width: 40, height: 22, cursor: "pointer", flexShrink: 0 }}>
      <div style={{ position: "absolute", inset: 0, background: on ? DC.red : DC.grey30, borderRadius: 20, transition: "background .2s" }} />
      <div style={{ position: "absolute", width: 16, height: 16, left: on ? 21 : 3, top: 3, background: DC.white, borderRadius: "50%", transition: "left .2s", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }} />
    </div>
  );
}

const pill = (type) => {
  const map = {
    visible: { bg: DC.greenBg,  color: DC.greenDark },
    hidden:  { bg: DC.amberBg,  color: DC.amber },
    flagged: { bg: DC.redLight,  color: DC.redDark },
    keyword: { bg: DC.amberBg,  color: DC.amber },
    report:  { bg: DC.redLight,  color: DC.redDark },
  };
  const c = map[type] || map.visible;
  return { fontSize: 11, padding: "3px 9px", borderRadius: 20, fontWeight: 600, background: c.bg, color: c.color };
};

export default function ModerationPanel() {
  const [activeTab, setActiveTab] = useState("queue");
  const [kudos, setKudos]         = useState(INITIAL_KUDOS);
  const [keywords, setKeywords]   = useState(INITIAL_KEYWORDS);
  const [rules, setRules]         = useState(INITIAL_RULES);
  const [search, setSearch]       = useState("");
  const [filterStatus, setFilter] = useState("all");
  const [kwInput, setKwInput]     = useState("");

  const flagged   = kudos.filter(k => k.status === "flagged");
  const kwMatches = kudos.filter(k => keywords.some(kw => k.msg.toLowerCase().includes(kw.toLowerCase())));

  const moderate = (id, action) => {
    if (action === "approve") setKudos(kudos.map(k => k.id === id ? { ...k, status: "visible", reason: null } : k));
    else setKudos(kudos.filter(k => k.id !== id));
  };

  const toggleVis = (id) =>
    setKudos(kudos.map(k => k.id === id ? { ...k, status: k.status === "visible" ? "hidden" : "visible" } : k));

  const addKeyword = () => {
    const v = kwInput.trim().toLowerCase();
    if (v && !keywords.includes(v)) { setKeywords([...keywords, v]); setKwInput(""); }
  };

  const filtered = kudos.filter(k => {
    const q = search.toLowerCase();
    const matchQ = !q || k.from.toLowerCase().includes(q) || k.to.toLowerCase().includes(q) || k.msg.toLowerCase().includes(q);
    return matchQ && (filterStatus === "all" || k.status === filterStatus);
  });

  const TABS = [
    { id: "queue",    label: "Review Queue",    count: flagged.length,   badgeBg: DC.red,    badgeTx: DC.white },
    { id: "all",      label: "All Kudos",       count: kudos.length,     badgeBg: DC.grey10, badgeTx: DC.grey60 },
    { id: "keywords", label: "Keyword Filters", count: keywords.length,  badgeBg: DC.amberBg,badgeTx: DC.amber },
    { id: "rules",    label: "Rules",           count: null },
  ];

  const KCard = ({ k, actions }) => (
    <div style={{ background: DC.white, border: `1px solid ${k.status === "flagged" ? DC.redMid : DC.border}`, borderRadius: 10, padding: "13px 15px", marginBottom: 10, borderLeft: k.status === "flagged" ? `3px solid ${DC.red}` : `1px solid ${DC.border}` }}>
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ width: 32, height: 32, minWidth: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, background: k.fromA.bg, color: k.fromA.tx }}>{k.fromA.initials}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: DC.black }}>{k.from} <span style={{ color: DC.red }}>→</span> {k.to} {k.emoji}</div>
          <div style={{ fontSize: 13, color: DC.grey60, marginTop: 3, lineHeight: 1.5 }}>{highlightKeywords(k.msg, keywords)}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
            <span style={pill(k.status)}>{k.status}</span>
            {k.reason === "keyword" && <span style={pill("keyword")}>🔍 keyword</span>}
            {k.reports > 0 && <span style={pill("report")}>🚩 {k.reports} report{k.reports !== 1 ? "s" : ""}</span>}
            <span style={{ fontSize: 11, color: DC.grey30, marginLeft: "auto" }}>{k.time}</span>
            {actions}
          </div>
        </div>
      </div>
    </div>
  );

  const ActionBtn = ({ label, type, onClick }) => {
    const styles = {
      approve: { border: `1px solid ${DC.green}`,  color: DC.green,   bg: "none", hbg: DC.greenBg },
      remove:  { border: `1px solid ${DC.red}`,    color: DC.red,     bg: "none", hbg: DC.redLight },
      default: { border: `1px solid ${DC.border}`, color: DC.grey60,  bg: "none", hbg: DC.grey10 },
    };
    const st = styles[type] || styles.default;
    return (
      <button onClick={onClick} style={{ fontSize: 12, padding: "4px 11px", borderRadius: 7, border: st.border, background: st.bg, color: st.color, cursor: "pointer", fontFamily: "inherit", fontWeight: 500 }}>{label}</button>
    );
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: DC.grey05, minHeight: "100vh" }}>
      {/* Top bar */}
      <div style={{ background: DC.black, padding: "0 2rem", display: "flex", alignItems: "center", gap: 12, height: 56 }}>
        <div style={{ fontWeight: 700, fontSize: 20, color: DC.white, letterSpacing: "-0.3px" }}>data<span style={{ color: DC.red }}>com</span></div>
        <div style={{ width: 1, height: 24, background: "#444" }} />
        <span style={{ fontSize: 14, color: DC.grey30 }}>Moderation Panel</span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, background: DC.redLight, border: `1px solid ${DC.redMid}`, borderRadius: 20, padding: "3px 12px" }}>
          <span style={{ fontSize: 11, color: DC.red, fontWeight: 700 }}>MANAGER VIEW</span>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "1.75rem 2rem" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: "1.5rem" }}>
          {[
            { label: "Pending review", val: flagged.length, valColor: DC.red },
            { label: "Approved today", val: 12, valColor: DC.green },
            { label: "Removed (7d)",   val: 2,  valColor: DC.amber },
            { label: "Avg review time",val: "1.4h", valColor: DC.black },
          ].map(({ label, val, valColor }) => (
            <div key={label} style={{ background: DC.white, border: `1px solid ${DC.border}`, borderRadius: 10, padding: "14px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: DC.grey60, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: valColor }}>{val}</div>
            </div>
          ))}
        </div>

        {/* Card with tabs */}
        <div style={{ background: DC.white, border: `1px solid ${DC.border}`, borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden" }}>
          {/* Tab bar */}
          <div style={{ display: "flex", borderBottom: `1px solid ${DC.border}`, background: DC.grey05 }}>
            {TABS.map(({ id, label, count, badgeBg, badgeTx }) => (
              <button key={id} onClick={() => setActiveTab(id)} style={{
                padding: "13px 18px", fontSize: 13, cursor: "pointer", border: "none", background: "none",
                color: activeTab === id ? DC.black : DC.grey60, fontWeight: activeTab === id ? 600 : 400,
                fontFamily: "inherit", borderBottom: activeTab === id ? `2px solid ${DC.red}` : "2px solid transparent",
                display: "flex", alignItems: "center", gap: 6, transition: "color .15s",
              }}>
                {label}
                {count !== null && <span style={{ fontSize: 11, fontWeight: 700, background: badgeBg, color: badgeTx, padding: "1px 7px", borderRadius: 20 }}>{count}</span>}
              </button>
            ))}
          </div>

          <div style={{ padding: "1.25rem" }}>
            {/* Queue */}
            {activeTab === "queue" && (
              flagged.length === 0
                ? <div style={{ textAlign: "center", color: DC.grey30, fontSize: 14, padding: "2.5rem" }}>✅ Queue is clear — nothing to review</div>
                : flagged.map(k => (
                  <KCard key={k.id} k={k} actions={<>
                    <ActionBtn label="✓ Approve" type="approve" onClick={() => moderate(k.id, "approve")} />
                    <ActionBtn label="✕ Remove"  type="remove"  onClick={() => moderate(k.id, "remove")} />
                  </>} />
                ))
            )}

            {/* All */}
            {activeTab === "all" && (
              <>
                <div style={{ display: "flex", gap: 8, marginBottom: "1rem" }}>
                  <input
                    placeholder="Search by name or message…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ flex: 1, fontSize: 13, padding: "7px 11px", border: `1px solid ${DC.border}`, borderRadius: 8, outline: "none", fontFamily: "inherit", background: DC.grey05 }}
                  />
                  <select value={filterStatus} onChange={e => setFilter(e.target.value)} style={{ fontSize: 13, padding: "7px 11px", border: `1px solid ${DC.border}`, borderRadius: 8, outline: "none", fontFamily: "inherit", background: DC.grey05 }}>
                    <option value="all">All statuses</option>
                    <option value="visible">Visible</option>
                    <option value="hidden">Hidden</option>
                    <option value="flagged">Flagged</option>
                  </select>
                </div>
                {filtered.length === 0
                  ? <div style={{ textAlign: "center", color: DC.grey30, fontSize: 14, padding: "2rem" }}>No kudos match this filter</div>
                  : filtered.map(k => (
                    <KCard key={k.id} k={k} actions={
                      <ActionBtn label={k.status === "visible" ? "🙈 Hide" : "👁 Restore"} type={k.status === "visible" ? "default" : "approve"} onClick={() => toggleVis(k.id)} />
                    } />
                  ))
                }
              </>
            )}

            {/* Keywords */}
            {activeTab === "keywords" && (
              <>
                <div style={{ fontSize: 11, fontWeight: 600, color: DC.grey60, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 10 }}>Active filters</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
                  {keywords.map(kw => (
                    <span key={kw} style={{ display: "flex", alignItems: "center", gap: 4, background: DC.amberBg, color: DC.amber, fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 20 }}>
                      {kw}
                      <button onClick={() => setKeywords(keywords.filter(k => k !== kw))} style={{ background: "none", border: "none", cursor: "pointer", color: DC.amber, fontSize: 14, lineHeight: 1, padding: "0 0 0 2px" }}>×</button>
                    </span>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    placeholder="Add keyword or phrase…"
                    value={kwInput}
                    onChange={e => setKwInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && addKeyword()}
                    style={{ fontSize: 13, padding: "7px 11px", border: `1px solid ${DC.border}`, borderRadius: 8, outline: "none", fontFamily: "inherit", width: 220, background: DC.grey05 }}
                  />
                  <button onClick={addKeyword} style={{ fontSize: 13, padding: "7px 16px", borderRadius: 8, border: `1px solid ${DC.red}`, color: DC.red, background: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>+ Add</button>
                </div>
                {kwMatches.length > 0 && (
                  <>
                    <div style={{ fontSize: 11, fontWeight: 600, color: DC.grey60, textTransform: "uppercase", letterSpacing: ".05em", margin: "1.5rem 0 10px" }}>Matching kudos</div>
                    {kwMatches.map(k => <KCard key={k.id} k={k} actions={null} />)}
                  </>
                )}
              </>
            )}

            {/* Rules */}
            {activeTab === "rules" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {rules.map((r, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, background: DC.grey05, borderRadius: 10, padding: "14px 16px", border: `1px solid ${DC.border}` }}>
                    <span style={{ fontSize: 20, width: 32, textAlign: "center" }}>{r.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: DC.black }}>{r.title}</div>
                      <div style={{ fontSize: 12, color: DC.grey60, marginTop: 2 }}>{r.desc}</div>
                    </div>
                    <Toggle on={r.on} onChange={() => setRules(rules.map((x, j) => j === i ? { ...x, on: !x.on } : x))} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
