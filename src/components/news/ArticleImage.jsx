export function ArticleImage({ article, height = 200, style = {} }) {
  const patternId = `pattern-${article.id}`;
  return (
    <div style={{ width: "100%", height, background: article.imgColor, position: "relative", overflow: "hidden", flexShrink: 0, ...style }}>
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.16 }} viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id={patternId} width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="1.5" fill={article.imgAccent} />
            <line x1="0" y1="20" x2="40" y2="20" stroke={article.imgAccent} strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="400" height="200" fill={`url(#${patternId})`} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 6 }}>
        <span style={{ fontFamily: "var(--font-display)", fontSize: 13, color: article.imgAccent, opacity: 0.75, fontWeight: 500 }}>Article Image</span>
      </div>
    </div>
  );
}
