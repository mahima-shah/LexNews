export function ArticleImage({ article, height = 200, style = {} }) {
  const media = article.media || [];

  // Future-proof media support

  if (media.length > 0) {
    const first = media[0];

    if (first.type === "video") {
      return (
        <div
          style={{
            width: "100%",
            height,
            position: "relative",
            overflow: "hidden",
            ...style,
          }}
        >
          <img
            src={first.thumbnail_url}
            alt={article.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />

          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 42,
              color: "#fff",
              background: "rgba(0,0,0,0.15)",
            }}
          >
            ▶
          </div>
        </div>
      );
    }

    return (
      <img
        src={first.url}
        alt={article.title}
        style={{
          width: "100%",
          height,
          objectFit: "cover",
          display: "block",
          ...style,
        }}
      />
    );
  }

  // Existing image support

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

  // Fallback

  return (
    <div
      style={{
        width: "100%",
        height,
        background: "var(--surface)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--muted)",
        fontSize: 13,
        ...style,
      }}
    >
      No image available
    </div>
  );
}