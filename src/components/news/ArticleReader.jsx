import { useEffect, useRef, useState } from "react";
import { Ic } from "../../constants/icons.jsx";
import { IconButton } from "../ui/IconButton.jsx";
import { ArticleImage } from "./ArticleImage.jsx";
import { Tag } from "./Tag.jsx";
import { useTranslation } from "../../hooks/useTranslation.js";
import { LANGUAGES } from "../../hooks/useLang.js";

export function ArticleReader({
  articles,
  startIndex,
  onClose,
  onGoHome,
  onViewOlder,
  canViewOlder,
  savedIds,
  onSave,
  onShare,
  hasMore,
  loadingMore,
  onLoadMore,
  lang,
  onMira,           // ← new: opens Mira with article context
}) {
  const slidesRef = useRef(null);
  const [visibleIndex, setVisibleIndex] = useState(startIndex);

  useEffect(() => {
    if (slidesRef.current)
      slidesRef.current.scrollTop = startIndex * slidesRef.current.clientHeight;
    setVisibleIndex(startIndex);
  }, [startIndex]);

  return (
    <div
      className="reader-slides"
      ref={slidesRef}
      onScroll={(event) => {
        const el = event.currentTarget;

        // Track which slide is currently visible
        const index = Math.round(el.scrollTop / el.clientHeight);
        setVisibleIndex(index);

        const nearBottom =
          el.scrollTop + el.clientHeight >= el.scrollHeight - 1200;
        if (nearBottom && hasMore && !loadingMore && onLoadMore) onLoadMore();
      }}
    >
      {articles.map((article, index) => (
        <ReaderSlide
          key={article.id}
          article={article}
          onClose={onClose}
          saved={savedIds.includes(article.id)}
          onSave={onSave}
          onShare={onShare}
          onMira={onMira}     // ← pass down to each slide
          isLast={index === articles.length - 1}
          lang={lang}
          isVisible={index === visibleIndex}
        />
      ))}
      {hasMore ? (
        <div className="reader-slide" style={{ alignItems: "center", justifyContent: "center" }}>
          <p style={{ fontSize: 13, color: "var(--muted)" }}>
            {loadingMore ? "Loading more articles..." : "Swipe to load more..."}
          </p>
        </div>
      ) : (
        <EndOfNewsSlide
          onClose={onGoHome || onClose}
          onViewOlder={canViewOlder ? onViewOlder : null}
        />
      )}
    </div>
  );
}

function ReaderSlide({ article, onClose, saved, onSave, onShare, onMira, isLast, lang, isVisible }) {
  const { translated, loading } = useTranslation(article, lang, isVisible);

  const displayTitle = translated?.title || article.title;
  const summaryText = article.ai_summary || article.body || "";
  const displaySummary = translated?.summary || summaryText;

  const langLabel = lang ? LANGUAGES.find((l) => l.code === lang)?.native : null;

  // Truncate summary to ~60 words
  const truncate = (text) => {
    const words = text.split(/\s+/);
    if (words.length <= 60) return text;
    const truncated = words.slice(0, 60).join(" ");
    const lastSentence = truncated.search(/[.!?][^.!?]*$/);
    return lastSentence !== -1 ? truncated.slice(0, lastSentence + 1) : truncated + "…";
  };

  return (
    <div className="reader-slide">
      <div style={{ position: "absolute", top: 16, left: 16, zIndex: 10 }}>
        <IconButton onClick={onClose} label="Close article">
          <Ic.Back s={18} c="var(--ink)" />
        </IconButton>
      </div>
      <div style={{ position: "absolute", top: 16, right: 16, zIndex: 10, display: "flex", gap: 8 }}>
        <IconButton onClick={() => onSave(article.id)} label="Save article">
          <Ic.Bookmark s={18} c={saved ? "var(--ink)" : "var(--muted)"} fill={saved ? "var(--ink)" : "none"} />
        </IconButton>
        <IconButton label="Share article" onClick={() => onShare && onShare(article)}>
          <Ic.Share s={18} c="var(--muted)" />
        </IconButton>
        {/* MIRA button — opens Mira with this article as context */}
        {onMira && (
          <IconButton label="Ask Mira about this article" onClick={() => onMira(article)}>
            <Ic.Mira s={18} c="var(--muted)" />
          </IconButton>
        )}
        <IconButton label="More options">
          <Ic.More s={18} c="var(--muted)" />
        </IconButton>
      </div>

      <ArticleImage article={article} height={280} />

      <div style={{ flex: 1, overflowY: "auto", padding: "0 0 100px" }}>
        <div style={{ padding: "18px 20px 0" }}>
          <Tag article={article} />

          {/* Title — translated or original */}
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 22,
              fontWeight: 600,
              color: "var(--ink)",
              lineHeight: 1.3,
              marginTop: 10,
              marginBottom: 6,
            }}
          >
            {loading ? (
              <span style={{ opacity: 0.4 }}>{article.title}</span>
            ) : (
              displayTitle
            )}
          </h1>

          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>
            {article.date} · {article.readTime}
          </p>

          {/* Summary block */}
          {(article.ai_summary || article.body) && (
            <div
              style={{
                background: "var(--surface)",
                border: "0.5px solid var(--border)",
                borderRadius: 12,
                padding: 14,
                marginBottom: 20,
              }}
            >
              {/* Label row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "var(--muted)",
                    letterSpacing: 0.4,
                    margin: 0,
                  }}
                >
                  LEXLEGIS SUMMARY
                </p>
                {langLabel && (
                  <span
                    style={{
                      fontSize: 10,
                      color: "var(--muted)",
                      background: "var(--surface-2)",
                      border: "0.5px solid var(--border)",
                      borderRadius: 20,
                      padding: "2px 8px",
                      fontWeight: 500,
                    }}
                  >
                    {langLabel}
                  </span>
                )}
              </div>

              {loading ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {[100, 90, 70].map((w, i) => (
                    <div
                      key={i}
                      style={{
                        height: 12,
                        borderRadius: 6,
                        width: `${w}%`,
                        background: "var(--border)",
                        opacity: 0.6,
                        animation: "pulse 1.4s ease-in-out infinite",
                        animationDelay: `${i * 0.15}s`,
                      }}
                    />
                  ))}
                </div>
              ) : (
                <p
                  style={{
                    fontSize: 14,
                    lineHeight: 1.7,
                    color: "var(--ink)",
                    whiteSpace: "pre-line",
                    margin: 0,
                  }}
                >
                  {truncate(displaySummary)}
                </p>
              )}
            </div>
          )}

          {/* Ask Mira inline prompt — shows at the bottom of each article */}
          {onMira && (
            <button
              onClick={() => onMira(article)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                padding: "12px 14px",
                background: "var(--surface)",
                border: "0.5px solid var(--border)",
                borderRadius: 12,
                cursor: "pointer",
                marginBottom: 20,
                textAlign: "left",
              }}
            >
              <div
                className="logo-box"
                style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0 }}
              >
                <Ic.Mira c="#fff" s={14} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 12, fontWeight: 500, color: "var(--ink)", margin: 0 }}>
                  Ask Mira about this article
                </p>
                <p style={{ fontSize: 11, color: "var(--muted)", margin: 0 }}>
                  Legal AI · Tap to chat
                </p>
              </div>
              <Ic.Up c="var(--muted)" s={14} style={{ transform: "rotate(90deg)" }} />
            </button>
          )}

          {/* Sources */}
          <div style={{ borderTop: "0.5px solid var(--border)", paddingTop: 16, marginBottom: 24 }}>
            <p
              style={{
                fontSize: 10,
                color: "var(--muted)",
                fontWeight: 500,
                letterSpacing: 0.5,
                marginBottom: 10,
              }}
            >
              SOURCES ({article.sources.length})
            </p>
            {article.sources.map((source, index) => (
              <a
                key={source.name}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 0",
                  borderBottom:
                    index < article.sources.length - 1 ? "0.5px solid var(--border)" : "none",
                  textDecoration: "none",
                }}
              >
                <Ic.External c="var(--ink)" />
                <span style={{ fontSize: 12, color: "var(--ink)", flex: 1, textDecoration: "underline" }}>
                  {source.name}
                </span>
                <span style={{ fontSize: 10, color: "var(--muted)" }}>{source.time}</span>
              </a>
            ))}
          </div>

          {!isLast && (
            <p
              style={{
                textAlign: "center",
                fontSize: 11,
                color: "var(--muted)",
                letterSpacing: 0.3,
                paddingBottom: 8,
              }}
            >
              Swipe up for next article
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function EndOfNewsSlide({ onClose, onViewOlder }) {
  return (
    <div
      className="reader-slide"
      style={{ alignItems: "center", justifyContent: "center", padding: 32, textAlign: "center" }}
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
        You're all caught up
      </p>
      <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6, marginBottom: 20 }}>
        You've reached the end of the latest news feed.
      </p>
      {onViewOlder && (
        <button
          onClick={onViewOlder}
          style={{
            padding: "12px 22px",
            background: "var(--ink)",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            fontSize: 13,
            fontWeight: 500,
            marginBottom: 10,
            width: "100%",
          }}
        >
          View older news
        </button>
      )}
      <button
        onClick={onClose}
        style={{
          padding: "12px 22px",
          background: "var(--surface)",
          color: "var(--ink)",
          border: "0.5px solid var(--border)",
          borderRadius: 12,
          fontSize: 13,
          fontWeight: 500,
          width: "100%",
        }}
      >
        Back to feed
      </button>
    </div>
  );
}