import { useRef, useState } from "react";
import { Ic } from "../../constants/icons.jsx";

const MIRA_API = import.meta.env.VITE_MIRA_API_URL || "http://localhost:8000";

export function MiraPanel({ open, onClose, articleId = "", articleTitle = "", articleSummary = "" }) {
  const hasArticleContext = Boolean(articleTitle);

  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hi, I'm Mira, your legal AI. Ask me anything about Indian tax law, corporate compliance, or recent judgments.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const areaRef = useRef(null);

  // Reset messages when panel opens with a new article
  const prevArticleId = useRef(articleId);
  if (open && articleId !== prevArticleId.current) {
    prevArticleId.current = articleId;
    // Reset to fresh greeting when switching articles
    setMessages([
      {
        role: "bot",
        text: hasArticleContext
          ? `Hi! I'm Mira. I can see you're reading "${articleTitle}". Ask me anything about it, or any other legal question.`
          : "Hi, I'm Mira, your legal AI. Ask me anything about Indian tax law, corporate compliance, or recent judgments.",
      },
    ]);
  }

  const scrollToBottom = () => {
    setTimeout(() => {
      if (areaRef.current) areaRef.current.scrollTop = areaRef.current.scrollHeight;
    }, 50);
  };

  const send = async () => {
    if (!input.trim() || loading) return;
    const userText = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setLoading(true);
    scrollToBottom();

    try {
      const res = await fetch(`${MIRA_API}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: articleSummary
            ? `[Article context]\nTitle: ${articleTitle}\nSummary: ${articleSummary}\n\n[User question]\n${userText}`
            : userText,
          articleId,
          articleTitle,
          sessionId: "",
        }),
      });
      const data = await res.json();
      const reply = data.reply || data.error || "Something went wrong.";
      setMessages((prev) => [...prev, { role: "bot", text: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Could not reach Mira. Make sure the server is running." },
      ]);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  return (
    <>
      <div className={`mira-backdrop ${open ? "open" : ""}`} onClick={onClose} />
      <div className={`mira-sheet ${open ? "open" : ""}`}>
        <div className="mira-grabber" />

        {/* Header */}
        <div
          style={{
            padding: "12px 16px 10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "0.5px solid var(--border)",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div className="logo-box" style={{ width: 30, height: 30, borderRadius: 8 }}>
              <Ic.Mira c="#fff" s={16} />
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 500, color: "var(--ink)", margin: 0 }}>Mira</p>
              <p style={{ fontSize: 10, color: "var(--muted)", margin: 0 }}>Legal AI by LexNews</p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", display: "flex" }}
          >
            <Ic.Close c="var(--muted)" />
          </button>
        </div>

        {/* Article context pill — only shown when opened from an article */}
        {hasArticleContext && (
          <div
            style={{
              margin: "10px 14px 0",
              padding: "8px 12px",
              background: "var(--surface)",
              border: "0.5px solid var(--border)",
              borderRadius: 10,
              flexShrink: 0,
            }}
          >
            <p
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: "var(--muted)",
                letterSpacing: 0.4,
                margin: "0 0 2px",
              }}
            >
              ARTICLE CONTEXT
            </p>
            <p
              style={{
                fontSize: 12,
                color: "var(--ink)",
                margin: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {articleTitle}
            </p>
          </div>
        )}

        {/* Chat messages */}
        <div
          ref={areaRef}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "14px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={message.role === "bot" ? "chat-bubble-bot" : "chat-bubble-user"}
            >
              {message.text}
            </div>
          ))}
          {loading && (
            <div className="chat-bubble-bot" style={{ background: "var(--surface-2)", color: "var(--muted)" }}>
              Mira is thinking…
            </div>
          )}
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
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: "var(--white)",
              background: "var(--ink)",
              borderRadius: 4,
              padding: "2px 7px",
              letterSpacing: 0.3,
            }}
          >
            COMING SOON
          </span>
          <span style={{ fontSize: 11, color: "var(--muted)" }}>→ lexlegis.ai</span>
        </a>

        {/* Input bar */}
        <div
          style={{
            padding: "10px 14px 20px",
            borderTop: "0.5px solid var(--border)",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              background: "var(--surface)",
              border: "0.5px solid var(--border)",
              borderRadius: 24,
              padding: "9px 14px",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && send()}
              placeholder={
                hasArticleContext
                  ? `Ask about this article…`
                  : "Ask Mira anything…"
              }
              disabled={loading}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                fontSize: 13,
                color: "var(--ink)",
              }}
            />
            <button
              onClick={send}
              disabled={loading}
              style={{
                width: 32,
                height: 32,
                background: loading ? "var(--muted)" : "var(--ink)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "none",
                flexShrink: 0,
              }}
            >
              <Ic.Up c="#fff" s={14} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}