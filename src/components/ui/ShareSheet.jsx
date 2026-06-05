export function ShareSheet({ article, onClose }) {
  if (!article) return null;

  const shareUrl = article.source_url || article.external_url || window.location.href;
  const shareText = `${article.title}\n${shareUrl}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    alert("Link copied");
  };

  const nativeShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: article.title,
        text: article.subtitle,
        url: shareUrl,
      });
    } else {
      await copyLink();
    }
  };

  return (
    <div style={{
      position: "absolute",
      inset: 0,
      background: "rgba(0,0,0,0.35)",
      zIndex: 300,
      display: "flex",
      alignItems: "flex-end",
      borderRadius: 44,
    }}>
      <div style={{
        background: "var(--white)",
        width: "100%",
        borderRadius: "24px 24px 44px 44px",
        padding: "20px",
      }}>
        <p style={{ fontSize: 18, fontWeight: 600, marginBottom: 6, color: "var(--ink)"}}>Share article</p>
        <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>
          {article.title}
        </p>

        <button onClick={nativeShare} style={buttonStyle}>
          Share
        </button>

        <button onClick={copyLink} style={buttonStyle}>
          Copy link
        </button>

        <button onClick={onClose} style={{ ...buttonStyle, background: "var(--surface)", color: "var(--ink)" }}>
          Cancel
        </button>
      </div>
    </div>
  );
}

const buttonStyle = {
  width: "100%",
  padding: "13px 0",
  marginBottom: 8,
  background: "var(--ink)",
  color: "var(--white)",
  border: "none",
  borderRadius: 12,
  fontSize: 14,
  fontWeight: 500,
  cursor: "pointer",
};