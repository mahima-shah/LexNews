import { Ic } from "../constants/icons.jsx";
import { TopBar } from "../components/layout/TopBar.jsx";
import { BottomNav } from "../components/layout/BottomNav.jsx";
import { SettingsRow } from "../components/ui/SettingsRow.jsx";

export function ProfileScreen({ onNavigate, isSignedIn, user, darkMode, onToggleDarkMode, readIds, savedIds, onSignIn, onSignOut, feedView, onChangeFeedView }) {
  if (!isSignedIn) {
    return (
      <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <TopBar showProfile={false} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, gap: 12 }}>
          <div style={{ width: 64, height: 64, background: "var(--ink)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 4 }}><Ic.User c="#fff" s={28} /></div>
          <p style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--ink)", textAlign: "center" }}>Welcome to LexNews</p>
          <p style={{ fontSize: 13, color: "var(--muted)", textAlign: "center", lineHeight: 1.6 }}>Sign in to save articles, set your feed preferences, and get personalised legal news.</p>
          <button onClick={onSignIn} style={{ width: "100%", padding: "13px 0", background: "var(--ink)", color: "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 500, marginTop: 8 }}>Sign in</button>
          <p style={{ fontSize: 12, color: "var(--muted)", textAlign: "center" }}>You can browse LexNews without signing in.</p>
        </div>
        <BottomNav active="profile" onNavigate={onNavigate} />
      </div>
    );
  }

  const groups = [
    {
      section: "PREFERENCES",
      items: [
        { Icon: Ic.Settings, label: "Feed preferences", note: "Direct Tax, Indirect Tax" },
        { Icon: Ic.Bell, label: "Notifications" },
        { Icon: Ic.Tag, label: "Manage topics" },
      ]
    },
    { section: "MIRA", items: [{ Icon: Ic.Mira, label: "Mira chat history" }] },
    { section: "ACCOUNT", items: [{ Icon: Ic.Help, label: "Help & support" }, { Icon: Ic.Logout, label: "Sign out", danger: true, action: onSignOut }] },
  ];

  const username = user?.email?.split("@")[0] || "";
  const initials =
    username.replace(/[^a-zA-Z]/g, "").slice(0, 2).toUpperCase() || "U";

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <TopBar showProfile={false} />
      <div style={{ padding: "16px", display: "flex", alignItems: "center", gap: 12, borderBottom: "0.5px solid var(--border)", flexShrink: 0 }}>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: "var(--surface)",
            border: "0.5px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            fontWeight: 500,
            color: "var(--ink)"
          }}
        >
          {initials}
        </div>
        <div>
          <p style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 600, color: "var(--ink)", margin: 0 }}>
            {username || "LexLegis User"}
          </p>
          <p style={{ fontSize: 12, color: "var(--muted)", margin: 0 }}>
            {user?.email}
          </p>
        </div>
        <button style={{ marginLeft: "auto", background: "none", border: "none", display: "flex" }}><Ic.Edit c="var(--muted)" s={18} /></button>
        <button onClick={() => onNavigate("admin")}>
          Open Admin
        </button>
      </div>
      <div style={{ display: "flex", borderBottom: "0.5px solid var(--border)", flexShrink: 0 }}>
        {[
          [savedIds?.length || 0, "Saved"],
          [readIds?.length || 0, "Read"],
          [0, "Mira chats"],
        ].map(([number, label], index) => (
          <div key={label} style={{ flex: 1, padding: "12px 0", textAlign: "center", borderRight: index < 2 ? "0.5px solid var(--border)" : "none" }}>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, color: "var(--ink)", margin: 0 }}>{number}</p>
            <p style={{ fontSize: 10, color: "var(--muted)", margin: 0 }}>{label}</p>
          </div>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 80px" }}>
        {groups.map((group) => (
          <div key={group.section}>
            <p style={{ fontSize: 10, color: "var(--muted)", padding: "14px 0 4px", fontWeight: 500, letterSpacing: 0.5 }}>
              {group.section}
            </p>

            {group.items.map((item) => (
              <SettingsRow key={item.label} {...item} onClick={item.action} />
            ))}

            {group.section === "PREFERENCES" && (
              <>
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    padding: "12px 0",
                    borderBottom: "0.5px solid var(--border)",
                  }}
                >
                  {[
                    ["glance", "Glance"],
                    ["reader", "Reader"],
                  ].map(([value, label]) => (
                    <button
                      key={value}
                      onClick={() => onChangeFeedView(value)}
                      style={{
                        flex: 1,
                        padding: "10px",
                        borderRadius: 12,
                        border: "0.5px solid var(--border)",
                        background:
                          feedView === value
                            ? "var(--ink)"
                            : "var(--surface)",
                        color:
                          feedView === value
                            ? "var(--white)"
                            : "var(--ink)",
                        fontSize: 13,
                        fontWeight: 500,
                        cursor: "pointer",
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div
                  onClick={onToggleDarkMode}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "13px 0",
                    borderBottom: "0.5px solid var(--border)",
                    cursor: "pointer",
                  }}
                >
                  <Ic.Settings c="var(--muted)" s={22} />

                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontSize: 14,
                        color: "var(--ink)",
                        margin: 0,
                      }}
                    >
                      Dark mode
                    </p>
                    <p
                      style={{
                        fontSize: 11,
                        color: "var(--muted)",
                        margin: 0,
                      }}
                    >
                      Switch app appearance
                    </p>
                  </div>

                  <div
                    style={{
                      width: 42,
                      height: 24,
                      borderRadius: 999,
                      background: darkMode ? "var(--ink)" : "var(--surface-2)",
                      padding: 3,
                      display: "flex",
                      justifyContent: darkMode ? "flex-end" : "flex-start",
                      transition: "all 0.2s",
                    }}
                  >
                    <div
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        background: darkMode ? "var(--white)" : "#fff",
                        transition: "all 0.2s",
                      }}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      <BottomNav active="profile" onNavigate={onNavigate} />
    </div>
  );
}
