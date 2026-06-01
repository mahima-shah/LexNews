import { Ic } from "../../constants/icons.jsx";
import { ArticleImage } from "./ArticleImage.jsx";
import { Tag } from "./Tag.jsx";

export function NewsCard({ article, onClick, saved, onSave, onShare }) {
  return (
    <div className="news-card" onClick={onClick}>
      <ArticleImage article={article} height={180} />

      <div style={{ padding: "12px 14px 10px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 9,
            gap: 10,
          }}
        >
          <Tag article={article} />

          <span
            style={{
              fontSize: 10,
              color: "var(--muted)",
              whiteSpace: "nowrap",
            }}
          >
            {article.date} · {article.readTime}
          </span>
        </div>

        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 17,
            fontWeight: 600,
            color: "var(--ink)",
            lineHeight: 1.3,
            marginBottom: 2,
          }}
        >
          {article.title}
        </h3>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 14,
          padding: "8px 14px 12px",
          borderTop: "0.5px solid var(--border)",
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          onClick={() => onSave(article.id)}
          style={{
            background: "none",
            border: "none",
            display: "flex",
            padding: 4,
            cursor: "pointer",
          }}
        >
          <Ic.Bookmark
            s={18}
            c={saved ? "var(--ink)" : "var(--muted)"}
            fill={saved ? "var(--ink)" : "none"}
          />
        </button>

        <button
          onClick={(event) => {
            event.stopPropagation();
            if (onShare) onShare(article);
          }}
          style={{
            background: "none",
            border: "none",
            display: "flex",
            padding: 4,
            cursor: "pointer",
          }}
        >
          <Ic.Share s={18} c="var(--muted)" />
        </button>

        <button
          style={{
            background: "none",
            border: "none",
            display: "flex",
            padding: 4,
            cursor: "pointer",
          }}
        >
          <Ic.More s={18} c="var(--muted)" />
        </button>
      </div>
    </div>
  );
}