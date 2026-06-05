export function IconButton({ children, onClick, label, size = 36 }) {
  return (
    <button aria-label={label} onClick={onClick} style={{ width: size, height: size, borderRadius: "50%", background: "var(--white)", border: "0.5px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {children}
    </button>
  );
}
