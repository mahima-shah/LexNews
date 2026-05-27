import { Ic } from "../../constants/icons.jsx";

export function SettingsRow({ Icon, label, note, danger, onClick }) {
  return (
    <div className="settings-row" onClick={onClick}>
      <Icon c={danger ? "var(--danger)" : "var(--muted)"} s={18} />
      <span style={{ fontSize: 13, color: danger ? "var(--danger)" : "var(--ink)", flex: 1 }}>{label}</span>
      {note && <span style={{ fontSize: 11, color: "var(--muted)" }}>{note}</span>}
      {!danger && <Ic.Chevron c="var(--muted-2)" />}
    </div>
  );
}
