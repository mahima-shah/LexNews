import { useRef, useState } from "react";
import { Ic } from "../../constants/icons.jsx";

export function MiraPanel({ open, onClose }) {
  const [messages, setMessages] = useState([{ role: "bot", text: "Hi, I'm Mira, your legal AI. Ask me anything about Indian tax law, corporate compliance, or recent judgments." }]);
  const [input, setInput] = useState("");
  const areaRef = useRef(null);

  const send = () => {
    if (!input.trim()) return;
    setMessages((current) => [...current, { role: "user", text: input }, { role: "bot", text: "Let me look into that for you…" }]);
    setInput("");
    setTimeout(() => {
      if (areaRef.current) areaRef.current.scrollTop = areaRef.current.scrollHeight;
    }, 50);
  };

  return (
    <>
      <div className={`mira-backdrop ${open ? "open" : ""}`} onClick={onClose} />
      <div className={`mira-sheet ${open ? "open" : ""}`}>
        <div className="mira-grabber" />
        <div style={{ padding: "12px 16px 10px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "0.5px solid var(--border)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div className="logo-box" style={{ width: 30, height: 30, borderRadius: 8 }}>
              <Ic.Mira c="#fff" s={16} />
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 500, color: "var(--ink)", margin: 0 }}>Mira</p>
              <p style={{ fontSize: 10, color: "var(--muted)", margin: 0 }}>Legal AI by LexNews</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", display: "flex" }}><Ic.Close c="var(--muted)" /></button>
        </div>

        <div ref={areaRef} style={{ flex: 1, overflowY: "auto", padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
          {messages.map((message, index) => <div key={index} className={message.role === "bot" ? "chat-bubble-bot" : "chat-bubble-user"}>{message.text}</div>)}
        </div>

        {/* Coming soon banner */}
        <a
          href="https://lexlegis.ai/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            margin: "0 14px 10px",
            padding: "10px 14px",
            background: "var(--surface)",
            border: "0.5px solid var(--border)",
            borderRadius: 12,
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 11, color: "var(--muted)" }}>Full Mira experience</span>
          <span style={{
            fontSize: 10,
            fontWeight: 600,
            color: "var(--white)",
            background: "var(--ink)",
            borderRadius: 4,
            padding: "2px 7px",
            letterSpacing: 0.3,
          }}>COMING SOON</span>
          <span style={{ fontSize: 11, color: "var(--muted)" }}>→ lexlegis.ai</span>
        </a>

        <div style={{ padding: "10px 14px 20px", borderTop: "0.5px solid var(--border)", flexShrink: 0 }}>
          <div style={{ background: "var(--surface)", border: "0.5px solid var(--border)", borderRadius: 24, padding: "9px 14px", display: "flex", alignItems: "center", gap: 10 }}>
            <input value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => event.key === "Enter" && send()} placeholder="Ask Mira anything…" style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 13, color: "var(--ink)" }} />
            <button onClick={send} style={{ width: 32, height: 32, background: "var(--ink)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "none", flexShrink: 0 }}><Ic.Up c="#fff" s={14} /></button>
          </div>
        </div>
      </div>
    </>
  );
}