import { useEffect, useState } from "react";
import { fetchMediaTestArticles } from "../services/mediaTestApi.js";

export function MediaTestScreen() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await fetchMediaTestArticles();
      console.log("media test data:", data);
      setArticles(data);
    }

    load();
  }, []);

  return (
    <div style={{ height: "100%", overflowY: "auto", padding: 16 }}>
      <h2 style={{ marginBottom: 16 }}>Media Test</h2>

      {articles.map((article) => (
        <div
          key={article.id}
          style={{
            border: "1px solid var(--border)",
            borderRadius: 16,
            overflow: "hidden",
            marginBottom: 16,
            background: "var(--white)",
          }}
        >
          <MediaPreview media={article.media} />

          <div style={{ padding: 12 }}>
            <p style={{ fontWeight: 600, color: "var(--ink)" }}>
              {article.title}
            </p>

            <p style={{ fontSize: 12, color: "var(--muted)" }}>
              {article.source}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function MediaPreview({ media = [] }) {
  if (!media || media.length === 0) {
    return (
      <div style={fallbackStyle}>
        No media fallback
      </div>
    );
  }

  const first = media[0];

  if (first.type === "video") {
    return (
      <a href={first.url} target="_blank" rel="noopener noreferrer">
        <div style={{ position: "relative" }}>
          {first.thumbnail_url ? (
            <img
              src={first.thumbnail_url}
              alt={first.caption || "Video thumbnail"}
              style={imageStyle}
            />
          ) : (
            <div style={fallbackStyle}>Video</div>
          )}

          <div style={playOverlayStyle}>
            ▶
          </div>
        </div>
      </a>
    );
  }

  if (media.length > 1) {
    return <ImageCarousel media={media} />;
  }

  return (
    <img
      src={first.url}
      alt={first.caption || "Article media"}
      style={imageStyle}
    />
  );
}

function ImageCarousel({ media }) {
  const [index, setIndex] = useState(0);

  const goPrev = () => {
    setIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
  };

  const goNext = () => {
    setIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
  };

  const current = media[index];

  return (
    <div style={{ position: "relative", height: 180, overflow: "hidden" }}>
      <img
        src={current.url}
        alt={current.caption || `Article media ${index + 1}`}
        style={imageStyle}
      />

      <button onClick={goPrev} style={leftButtonStyle}>‹</button>
      <button onClick={goNext} style={rightButtonStyle}>›</button>

      <div style={dotsStyle}>
        {media.map((_, dotIndex) => (
          <span
            key={dotIndex}
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background:
                dotIndex === index ? "#fff" : "rgba(255,255,255,0.5)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

const imageStyle = {
  width: "100%",
  height: 180,
  objectFit: "cover",
  display: "block",
};

const fallbackStyle = {
  height: 180,
  background: "var(--surface)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "var(--muted)",
  fontSize: 13,
};

const playOverlayStyle = {
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 36,
  color: "#fff",
  background: "rgba(0,0,0,0.25)",
};

const leftButtonStyle = {
  position: "absolute",
  left: 8,
  top: "50%",
  transform: "translateY(-50%)",
  border: "none",
  borderRadius: "50%",
  width: 32,
  height: 32,
  background: "rgba(0,0,0,0.45)",
  color: "#fff",
  cursor: "pointer",
};

const rightButtonStyle = {
  ...leftButtonStyle,
  left: "auto",
  right: 8,
};

const dotsStyle = {
  position: "absolute",
  bottom: 8,
  left: 0,
  right: 0,
  display: "flex",
  justifyContent: "center",
  gap: 6,
};