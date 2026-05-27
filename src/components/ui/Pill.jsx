export function Pill({ active, children, onClick }) {
  return <button className={`pill ${active ? "on" : ""}`} onClick={onClick}>{children}</button>;
}
