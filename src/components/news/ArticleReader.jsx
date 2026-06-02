import { useEffect, useRef } from "react";
import { Ic } from "../../constants/icons.jsx";
import { IconButton } from "../ui/IconButton.jsx";
import { ArticleImage } from "./ArticleImage.jsx";
import { Tag } from "./Tag.jsx";

export function ArticleReader({ articles, startIndex, onClose, onGoHome, savedIds, onSave, onShare }) {
  const slidesRef = useRef(null);

  useEffect(() => {
    if (slidesRef.current) slidesRef.current.scrollTop = startIndex * 844;
  }, [startIndex]);

  return (
    <div className="reader-slides" ref={slidesRef}>
      {articles.map((article, index) => (
        <ReaderSlide key={article.id} article={article} onClose={onClose} saved={savedIds.includes(article.id)} onSave={onSave} onShare={onShare} isLast={index === articles.length - 1} />
      ))}
      <EndOfNewsSlide onClose={onGoHome || onClose} />
    </div>
  );
}

function ReaderSlide({ article, onClose, saved, onSave, onShare, isLast }) {
  return (
    <div className="reader-slide">
      <div style={{ position: "absolute", top: 16, left: 16, zIndex: 10 }}>
        <IconButton onClick={onClose} label="Close article"><Ic.Back s={18} c="var(--ink)" /></IconButton>
      </div>
      <div style={{ position: "absolute", top: 16, right: 16, zIndex: 10, display: "flex", gap: 8 }}>
        <IconButton onClick={() => onSave(article.id)} label="Save article"><Ic.Bookmark s={18} c={saved ? "var(--ink)" : "var(--muted)"} fill={saved ? "var(--ink)" : "none"} /></IconButton>
        <IconButton
          label="Share article"
          onClick={() => {
            if (onShare) onShare(article);
          }}
        >
          <Ic.Share s={18} c="var(--muted)" />
        </IconButton>
        <IconButton label="More options"><Ic.More s={18} c="var(--muted)" /></IconButton>
      </div>
      <ArticleImage article={article} height={280} />
      <div style={{ flex: 1, overflowY: "auto", padding: "0 0 100px" }}>
        <div style={{ padding: "18px 20px 0" }}>
          <Tag article={article} />
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--ink)", lineHeight: 1.3, marginTop: 10, marginBottom: 6 }}>{article.title}</h1>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>{article.date} · {article.readTime}</p>
          {article.ai_summary ? (
            <div
              style={{
                background: "var(--surface)",
                border: "0.5px solid var(--border)",
                borderRadius: 12,
                padding: 14,
                marginBottom: 20,
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--muted)",
                  letterSpacing: 0.4,
                  marginBottom: 8,
                }}
              >
                LEXLEGIS SUMMARY
              </p>

              <p
                style={{
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: "var(--ink)",
                  whiteSpace: "pre-line",
                  margin: 0,
                }}
              >
                {article.ai_summary}
              </p>
            </div>
          ) : (
            <p
              style={{
                fontSize: 14,
                color: "var(--ink-2)",
                lineHeight: 1.75,
                whiteSpace: "pre-line",
                marginBottom: 24,
              }}
            >
              {article.body}
            </p>
          )}
          <div style={{ borderTop: "0.5px solid var(--border)", paddingTop: 16, marginBottom: 24 }}>
            <p style={{ fontSize: 10, color: "var(--muted)", fontWeight: 500, letterSpacing: 0.5, marginBottom: 10 }}>SOURCES ({article.sources.length})</p>
            {article.sources.map((source, index) => (
              <a key={source.name} href={source.url} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: index < article.sources.length - 1 ? "0.5px solid var(--border)" : "none", textDecoration: "none" }}>
                <Ic.External c="var(--ink)" />
                <span style={{ fontSize: 12, color: "var(--ink)", flex: 1, textDecoration: "underline" }}>{source.name}</span>
                <span style={{ fontSize: 10, color: "var(--muted)" }}>{source.time}</span>
              </a>
            ))}
          </div>
          {!isLast && <p style={{ textAlign: "center", fontSize: 11, color: "var(--muted)", letterSpacing: 0.3, paddingBottom: 8 }}>Swipe up for next article</p>}
        </div>
      </div>
    </div>
  );
}

function EndOfNewsSlide({ onClose }) {
  return (
    <div
      className="reader-slide"
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
        textAlign: "center",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 24,
          fontWeight: 600,
          color: "var(--ink)",
          marginBottom: 8,
        }}
      >
        You’re all caught up
      </p>

      <p
        style={{
          fontSize: 13,
          color: "var(--muted)",
          lineHeight: 1.6,
          marginBottom: 20,
        }}
      >
        You’ve reached the end of this news feed.
      </p>

      <button
        onClick={onClose}
        style={{
          padding: "12px 22px",
          background: "var(--ink)",
          color: "#fff",
          border: "none",
          borderRadius: 12,
          fontSize: 13,
          fontWeight: 500,
        }}
      >
        Back to feed
      </button>
    </div>
  );
}