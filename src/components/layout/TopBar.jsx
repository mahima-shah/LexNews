import { Ic } from "../../constants/icons.jsx";
import { Logo } from "./Logo.jsx";

/**
 * Derives 1-2 initials from an email address.
 * "mahesh.sharma@lexlegis.com" → "MS"
 * "rahul@lexlegis.com"         → "RA"
 */
function getInitials(email) {
  if (!email) return null;
  const name = email.split("@")[0];           // "mahesh.sharma"
  const parts = name.split(/[._\-+]/);        // ["mahesh", "sharma"]
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();      // fallback: "RA"
}

/**
 * TopBar
 *
 * Props:
 *  - onProfile: () => void
 *  - isSignedIn: boolean
 *  - user: object | null        ← ADD THIS: pass the user object from useAuth
 *  - showProfile: boolean
 *  - darkMode: boolean
 *  - onBell: () => void         ← ADD THIS: opens NotifPanel
 *  - unreadCount: number        ← ADD THIS: badge count from useArticleUpdates
 */
export function TopBar({
  onProfile,
  isSignedIn,
  user,
  showProfile = true,
  darkMode,
  onBell,
  unreadCount = 0,
}) {
  const initials = isSignedIn ? getInitials(user?.email) : null;

  return (
    <div className="topbar">
      <Logo darkMode={darkMode} />

      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>

        {/* Bell button with optional badge */}
        <div style={{ position: "relative" }}>
          <button
            onClick={onBell}
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "var(--ink)",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "transform 0.15s",
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.9)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onTouchStart={(e) => (e.currentTarget.style.transform = "scale(0.9)")}
            onTouchEnd={(e) => (e.currentTarget.style.transform = "scale(1)")}
            aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
          >
            <Ic.Bell c="var(--white)" s={18} />
          </button>

          {/* Red badge — only shown when unreadCount > 0 */}
          {unreadCount > 0 && (
            <div
              style={{
                position: "absolute",
                top: 1,
                right: 1,
                minWidth: 16,
                height: 16,
                borderRadius: 8,
                background: "#E53E3E",
                border: "1.5px solid var(--bg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 9,
                fontWeight: 700,
                color: "#fff",
                letterSpacing: 0,
                padding: "0 3px",
                pointerEvents: "none",
              }}
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </div>
          )}
        </div>

        {/* Avatar — shows initials when signed in, user icon when not */}
        {showProfile && (
          <button
            onClick={onProfile}
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: isSignedIn ? "var(--ink)" : "var(--surface)",
              border: "0.5px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 600,
              color: isSignedIn ? "var(--white)" : "var(--ink)",
              letterSpacing: 0.5,
              transition: "transform 0.15s, box-shadow 0.15s",
              cursor: "pointer",
              fontFamily: "var(--font-body, sans-serif)",
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.9)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onTouchStart={(e) => (e.currentTarget.style.transform = "scale(0.9)")}
            onTouchEnd={(e) => (e.currentTarget.style.transform = "scale(1)")}
            aria-label={isSignedIn ? "Profile" : "Sign in"}
          >
            {isSignedIn && initials
              ? initials
              : <Ic.User c="var(--ink)" s={16} />
            }
          </button>
        )}

      </div>
    </div>
  );
}