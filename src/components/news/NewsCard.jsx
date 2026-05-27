import { Ic } from "../../constants/icons.jsx";
import { ArticleImage } from "./ArticleImage.jsx";
import { Tag } from "./Tag.jsx";

export function NewsCard({ article, onClick, saved, onSave }) {
  return (
    <div className="news-card" onClick={onClick}>
      <ArticleImage article={article} height={160} />
      <div style={{ padding: "12px 14px 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <Tag article={article} />
          <span style={{ fontSize: 10, color: "var(--muted)" }}>{article.date} · {article.readTime}</span>
        </div>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 600, color: "var(--ink)", lineHeight: 1.35, marginBottom: 4 }}>{article.title}</h3>
        <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5, marginBottom: 10 }}>{article.subtitle}</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 14, padding: "8px 14px", borderTop: "0.5px solid var(--border)" }} onClick={(event) => event.stopPropagation()}>
        <button onClick={() => onSave(article.id)} style={{ background: "none", border: "none", display: "flex", padding: 4 }}>
          <Ic.Bookmark s={18} c={saved ? "var(--ink)" : "var(--muted)"} fill={saved ? "var(--ink)" : "none"} />
        </button>
        <button style={{ background: "none", border: "none", display: "flex", padding: 4 }}><Ic.Share s={18} c="var(--muted)" /></button>
        <button style={{ background: "none", border: "none", display: "flex", padding: 4 }}><Ic.More s={18} c="var(--muted)" /></button>
      </div>
      <div style={{ padding: "0 14px 12px" }}>
        <p style={{ fontSize: 10, color: "var(--muted)", fontWeight: 500, letterSpacing: 0.4, marginBottom: 5 }}>SOURCES ({article.sources.length})</p>
        {article.sources.slice(0, 2).map((source) => (
          <div key={source.name} style={{ display: "flex", alignItems: "center", gap: 6, padding: "3px 0" }}>
            <Ic.External c="var(--muted-2)" />
            <a href={source.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: "var(--ink)", textDecoration: "underline" }} onClick={(event) => event.stopPropagation()}>{source.name}</a>
            <span style={{ fontSize: 10, color: "var(--muted)", marginLeft: "auto" }}>{source.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
