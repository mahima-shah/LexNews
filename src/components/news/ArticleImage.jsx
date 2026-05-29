export function ArticleImage({ article, height = 200, style = {} }) {
  if (article.image_url) {
    return (
      <div
        style={{
          width: "100%",
          height,
          background: "var(--surface)",
          overflow: "hidden",
          flexShrink: 0,
          ...style,
        }}
      >
        <img
          src={article.image_url}
          alt={article.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height,
        background: "var(--surface)",
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 13,
            color: "var(--muted)",
            fontWeight: 500,
          }}
        >
          Article Image
        </span>
      </div>
    </div>
  );
}