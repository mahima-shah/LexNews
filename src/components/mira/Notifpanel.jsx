import { useEffect, useRef } from "react";

/**
 * NotifPanel
 *
 * A 3/4-height bottom sheet (same pattern as MiraPanel) that shows
 * which saved articles have been updated since the user last checked.
 *
 * Props:
 *  - open: boolean
 *  - onClose: () => void
 *  - updatedArticles: Article[] — only the articles that have updates
 *  - onArticleClick: (article) => void — navigate to that article
 *  - onMarkAllSeen: () => void
 */
export function NotifPanel({ open, onClose, updatedArticles = [], onArticleClick, onMarkAllSeen }) {
  const panelRef = useRef(null);

  // Close on backdrop tap
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Mark all seen when panel opens
  useEffect(() => {
    if (open && updatedArticles.length > 0) {
      onMarkAllSeen?.();
    }
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleBackdropClick}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.35)",
          zIndex: 200,
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.25s ease",
        }}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: "72vh",
          background: "var(--bg)",
          borderRadius: "18px 18px 0 0",
          zIndex: 201,
          transform: open ? "translateY(0)" : "translateY(105%)",
          transition: "transform 0.32s cubic-bezier(0.32, 0.72, 0, 1)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 -4px 40px rgba(0,0,0,0.12)",
        }}
      >
        {/* Handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "var(--border)" }} />
        </div>

        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 20px 14px",
          borderBottom: "0.5px solid var(--border)",
        }}>
          <div>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 17, color: "var(--ink)", fontWeight: 600, margin: 0 }}>
              Updates
            </p>
            <p style={{ fontSize: 12, color: "var(--muted)", margin: "2px 0 0" }}>
              {updatedArticles.length > 0
                ? `${updatedArticles.length} saved article${updatedArticles.length > 1 ? "s" : ""} updated`
                : "You're all caught up"}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "var(--surface)",
              border: "0.5px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: 16,
              color: "var(--muted)",
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 0 32px" }}>
          {updatedArticles.length === 0 ? (
            <EmptyState />
          ) : (
            updatedArticles.map((article) => (
              <UpdateRow
                key={article.id}
                article={article}
                onClick={() => {
                  onArticleClick?.(article);
                  onClose();
                }}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
}

function UpdateRow({ article, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: "14px 20px",
        background: "none",
        border: "none",
        borderBottom: "0.5px solid var(--border)",
        cursor: "pointer",
        textAlign: "left",
        transition: "background 0.15s",
      }}
      onTouchStart={(e) => (e.currentTarget.style.background = "var(--surface)")}
      onTouchEnd={(e) => (e.currentTarget.style.background = "none")}
    >
      {/* Update dot */}
      <div style={{
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: "var(--ink)",
        flexShrink: 0,
        marginTop: 5,
      }} />

      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Tag */}
        <span style={{
          display: "inline-block",
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: 0.5,
          color: "var(--muted)",
          textTransform: "uppercase",
          marginBottom: 4,
        }}>
          {article.tag}
        </span>

        {/* Title */}
        <p style={{
          fontSize: 14,
          fontWeight: 500,
          color: "var(--ink)",
          margin: 0,
          lineHeight: 1.35,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>
          {article.title}
        </p>

        {/* What changed */}
        <p style={{
          fontSize: 12,
          color: "var(--muted)",
          margin: "5px 0 0",
        }}>
          {article.sources?.length > 1
            ? `${article.sources.length} sources now covering this`
            : "New coverage added"}
           · {article.date}
        </p>
      </div>

      {/* Chevron */}
      <span style={{ color: "var(--muted)", fontSize: 14, flexShrink: 0, marginTop: 2 }}>›</span>
    </button>
  );
}

function EmptyState() {
  return (
    <div style={{ textAlign: "center", paddingTop: 56, paddingBottom: 32 }}>
      <div style={{
        width: 52,
        height: 52,
        borderRadius: "50%",
        background: "var(--surface)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 14px",
        fontSize: 22,
      }}>
        🔔
      </div>
      <p style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "var(--ink)", marginBottom: 6 }}>
        All caught up
      </p>
      <p style={{ fontSize: 13, color: "var(--muted)", maxWidth: 220, margin: "0 auto" }}>
        We'll notify you when your saved articles get new coverage or updates.
      </p>
    </div>
  );
}