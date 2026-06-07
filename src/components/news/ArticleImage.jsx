export function ArticleImage({ article, height = 200, style = {} }) {
  const media = article.media || [];

  // Future-proof media support
  if (media.length > 0) {
    const first = media[0];

    if (first.type === "video") {
      return (
        <div style={{ width: "100%", height, position: "relative", overflow: "hidden", ...style }}>
          <img src={first.thumbnail_url} alt={article.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 42, color: "#fff", background: "rgba(0,0,0,0.15)" }}>
            ▶
          </div>
        </div>
      );
    }

    return (
      <img src={first.url} alt={article.title} style={{ width: "100%", height, objectFit: "cover", display: "block", ...style }} />
    );
  }

  // Existing image support
  if (article.image_url) {
    return (
      <div style={{ width: "100%", height, background: "var(--surface)", overflow: "hidden", flexShrink: 0, ...style }}>
        <img src={article.image_url} alt={article.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      </div>
    );
  }

  // Category fallback
  const categoryConfig = {
    "Supreme Court": {
      background: "linear-gradient(135deg, #7b0000 0%, #2c0000 100%)",
      emoji: "🏛️",
    },
    "High Court": {
      background: "linear-gradient(135deg, #003366 0%, #001a33 100%)",
      emoji: "⚖️",
    },
    "Direct Tax": {
      background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
      emoji: "📊",
    },
    "Indirect Tax": {
      background: "linear-gradient(135deg, #2d1b69 0%, #11998e 100%)",
      emoji: "📋",
    },
    "Corporate": {
      background: "linear-gradient(135deg, #0a0a0a 0%, #434343 100%)",
      emoji: "🏢",
    },
    "General Law": {
      background: "linear-gradient(135deg, #1a1a1a 0%, #3d3d3d 100%)",
      emoji: "⚖️",
    },
  };

  const config = categoryConfig[article.category] || categoryConfig["General Law"];

  return (
    <div
      style={{
        width: "100%",
        height,
        background: config.background,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        flexShrink: 0,
        ...style,
      }}
    >
      <span style={{ fontSize: 36 }}>{config.emoji}</span>
      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", fontWeight: 500, letterSpacing: 0.5 }}>
        {article.source_name || article.category}
      </span>
    </div>
  );
}