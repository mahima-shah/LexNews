import { useState } from "react";
import { Ic } from "../constants/icons.jsx";
import { RECENT_SEARCHES, TRENDING_TOPICS } from "../data/filters.js";
import { TopBar } from "../components/layout/TopBar.jsx";
import { BottomNav } from "../components/layout/BottomNav.jsx";

export function SearchScreen({ onNavigate }) {
  const [query, setQuery] = useState("");
  const [recents, setRecents] = useState(RECENT_SEARCHES);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <TopBar showProfile={false} />
      <div style={{ padding: "12px 16px 0", flexShrink: 0 }}>
        <div className="search-input-wrap">
          <Ic.Search c="var(--muted-2)" s={18} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search cases, acts, keywords…" />
          {query && <button onClick={() => setQuery("")} style={{ background: "none", border: "none", display: "flex" }}><Ic.Close c="var(--muted-2)" s={16} /></button>}
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "0 0 80px" }}>
        <p style={{ fontSize: 10, color: "var(--muted)", padding: "14px 16px 6px", fontWeight: 500, letterSpacing: 0.5 }}>RECENT SEARCHES</p>
        <div style={{ padding: "0 16px" }}>
          {recents.map((recent, index) => (
            <div key={recent} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "0.5px solid var(--border)" }}>
              <Ic.Clock c="var(--muted-2)" s={16} />
              <span style={{ fontSize: 13, color: "var(--ink)", flex: 1 }}>{recent}</span>
              <button onClick={() => setRecents((items) => items.filter((_, itemIndex) => itemIndex !== index))} style={{ background: "none", border: "none", display: "flex" }}><Ic.Close c="var(--muted-2)" s={14} /></button>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 10, color: "var(--muted)", padding: "16px 16px 8px", fontWeight: 500, letterSpacing: 0.5 }}>TRENDING TOPICS</p>
        <div style={{ padding: "0 16px", display: "flex", flexWrap: "wrap", gap: 7 }}>
          {TRENDING_TOPICS.map((topic) => <span key={topic} className="tag" style={{ borderRadius: 20, fontSize: 12, padding: "5px 12px" }}>{topic}</span>)}
        </div>
      </div>
      <BottomNav active="search" onNavigate={onNavigate} />
    </div>
  );
}
