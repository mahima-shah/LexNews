export function MoreSheet({ article, onClose }) {
    if (!article) return null;
  
    const optionStyle = {
      width: "100%",
      padding: "13px 0",
      marginBottom: 8,
      background: "var(--surface)",
      color: "var(--ink)",
      border: "0.5px solid var(--border)",
      borderRadius: 12,
      fontSize: 14,
      fontWeight: 500,
    };
  
    const handleComingSoon = (label) => {
      alert(`${label} coming soon`);
    };
  
    return (
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.35)",
          zIndex: 300,
          display: "flex",
          alignItems: "flex-end",
          borderRadius: 44,
        }}
      >
        <div
          onClick={(event) => event.stopPropagation()}
          style={{
            background: "#fff",
            width: "100%",
            borderRadius: "24px 24px 44px 44px",
            padding: "20px",
          }}
        >
          <p style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>
            More options
          </p>
  
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>
            {article.title}
          </p>
  
          <button onClick={() => handleComingSoon("Follow story")} style={optionStyle}>
            Follow this story
          </button>
  
          <button onClick={() => handleComingSoon(`Hide ${article.source_name}`)} style={optionStyle}>
            Hide {article.source_name}
          </button>
  
          <button onClick={() => handleComingSoon("Report issue")} style={optionStyle}>
            Report issue
          </button>
  
          <button
            onClick={onClose}
            style={{
              ...optionStyle,
              background: "var(--ink)",
              color: "#fff",
              border: "none",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }