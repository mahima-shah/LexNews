import { Ic } from "../../constants/icons.jsx";
import { Logo } from "./Logo.jsx";

export function TopBar({ onProfile, isSignedIn, showProfile = true }) {
  return (
    <div className="topbar">
      <Logo />
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <Ic.Bell c="var(--muted)" s={20} />
        {showProfile && (
          <button onClick={onProfile} style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--surface)", border: "0.5px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 500, color: "var(--ink)" }}>
            {isSignedIn ? "MS" : <Ic.User c="var(--ink)" s={16} />}
          </button>
        )}
      </div>
    </div>
  );
}
