import { Ic } from "../../constants/icons.jsx";
import { ArticleImage } from "./ArticleImage.jsx";
import { Tag } from "./Tag.jsx";

export function NewsCard({ article, onClick, saved, onSave, onShare, onMore }) {
  return (
    <div className="news-card" onClick={onClick}>
      <ArticleImage article={article} height={180} />

      <div style={{ padding: "12px 14px 10px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 9, gap: 10 }}>
          <Tag article={article} />
          <span style={{ fontSize: 10, color: "var(--muted)", whiteSpace: "nowrap" }}>
            {article.date} · {article.readTime}
          </span>
        </div>

        <h3 style={{
          fontFamily: "var(--font-display)",
          fontSize: 17,
          fontWeight: 600,
          color: "var(--ink)",
          lineHeight: 1.3,
          marginBottom: 2,
        }}>
          {article.title}
        </h3>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 4,
          padding: "8px 10px 10px",
          borderTop: "0.5px solid var(--border)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Source name on the left */}
        <span style={{
          fontSize: 11,
          fontWeight: 500,
          color: "var(--ink)",
          paddingLeft: 4,
          opacity: 0.75,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: "45%",
        }}>
          {article.primarySource}
        </span>

        {/* Action buttons on the right */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {[
            { action: () => onSave(article.id), icon: <Ic.Bookmark s={18} c={saved ? "var(--ink)" : "var(--muted)"} fill={saved ? "var(--ink)" : "none"} /> },
            { action: () => onShare && onShare(article), icon: <Ic.Share s={18} c="var(--muted)" /> },
            { action: () => onMore && onMore(article), icon: <Ic.More s={18} c="var(--muted)" /> },
          ].map((btn, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); btn.action(); }}
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "none",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "background 0.15s, transform 0.15s",
              }}
              onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.85)"; e.currentTarget.style.background = "var(--surface)"; }}
              onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.background = "none"; }}
              onTouchStart={(e) => { e.currentTarget.style.transform = "scale(0.85)"; e.currentTarget.style.background = "var(--surface)"; }}
              onTouchEnd={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.background = "none"; }}
            >
              {btn.icon}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}