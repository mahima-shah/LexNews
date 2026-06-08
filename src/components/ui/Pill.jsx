export function Pill({ active, children, onClick, style }) {
  return (
    <button
      className={`pill ${active ? "on" : ""}`}
      onClick={onClick}
      style={{ flexShrink: 0, ...style }}
    >
      {children}
    </button>
  );
}