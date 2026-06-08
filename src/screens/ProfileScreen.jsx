import { useState } from "react";
import { Ic } from "../constants/icons.jsx";
import { TopBar } from "../components/layout/TopBar.jsx";
import { BottomNav } from "../components/layout/BottomNav.jsx";
import { SettingsRow } from "../components/ui/SettingsRow.jsx";
import { ARTICLES } from "../data/articles.js";
import { LANGUAGES } from "../hooks/useLang.js";

const LAW_CATS = ["Direct Tax", "Indirect Tax", "Corporate", "General Law"];
const COURTS = ["Supreme Court", "High Court"];
const NEWS_SOURCES = [...new Set(ARTICLES.flatMap((a) => a.sources.map((s) => s.name)))].sort();

function PillGroup({ title, options, selected, onToggle }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <p style={{ fontSize: 10, color: "var(--muted)", fontWeight: 600, letterSpacing: 0.5, marginBottom: 8 }}>
        {title}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
        {options.map((opt) => {
          const on = selected.includes(opt);
          return (
            <button
              key={opt}
              onClick={() => onToggle(opt)}
              style={{
                padding: "6px 12px",
                borderRadius: 20,
                border: `0.5px solid ${on ? "var(--ink)" : "var(--border)"}`,
                background: on ? "var(--ink)" : "var(--surface)",
                color: on ? "var(--white)" : "var(--muted)",
                fontSize: 11,
                fontWeight: on ? 500 : 400,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ProfileScreen({
  onNavigate,
  isSignedIn,
  user,
  darkMode,
  onToggleDarkMode,
  readIds,
  savedIds,
  onSignIn,
  onSignOut,
  feedView,
  onChangeFeedView,
  lang,
  onChangeLang,
}) {
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [selectedLaw, setSelectedLaw] = useState([...LAW_CATS]);
  const [selectedCourts, setSelectedCourts] = useState([...COURTS]);
  const [selectedSources, setSelectedSources] = useState(NEWS_SOURCES.slice(0, 3));

  const toggle = (setter, value) =>
    setter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );

  if (!isSignedIn) {
    return (
      <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <TopBar showProfile={false} />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 32,
            gap: 12,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              background: "var(--ink)",
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 4,
            }}
          >
            <Ic.User c="#fff" s={28} />
          </div>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 22,
              fontWeight: 600,
              color: "var(--ink)",
              textAlign: "center",
            }}
          >
            Welcome to LexNews
          </p>
          <p style={{ fontSize: 13, color: "var(--muted)", textAlign: "center", lineHeight: 1.6 }}>
            Sign in to save articles, set your feed preferences, and get personalised legal news.
          </p>
          <button
            onClick={onSignIn}
            style={{
              width: "100%",
              padding: "13px 0",
              background: "var(--ink)",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 500,
              marginTop: 8,
            }}
          >
            Sign in
          </button>
          <p style={{ fontSize: 12, color: "var(--muted)", textAlign: "center" }}>
            You can browse LexNews without signing in.
          </p>
        </div>
        <BottomNav active="profile" onNavigate={onNavigate} />
      </div>
    );
  }

  const username = user?.email?.split("@")[0] || "";
  const initials = username.replace(/[^a-zA-Z]/g, "").slice(0, 2).toUpperCase() || "U";

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <TopBar showProfile={false} />

      {/* User info */}
      <div
        style={{
          padding: "16px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          borderBottom: "0.5px solid var(--border)",
          flexShrink: 0,
        }}
      >
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
            color: "var(--ink)",
          }}
        >
          {initials}
        </div>
        <div>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 16,
              fontWeight: 600,
              color: "var(--ink)",
              margin: 0,
            }}
          >
            {username || "LexLegis User"}
          </p>
          <p style={{ fontSize: 12, color: "var(--muted)", margin: 0 }}>{user?.email}</p>
        </div>
        <button style={{ marginLeft: "auto", background: "none", border: "none", display: "flex" }}>
          <Ic.Edit c="var(--muted)" s={18} />
        </button>
        <button onClick={() => onNavigate("admin")}>Open Admin</button>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", borderBottom: "0.5px solid var(--border)", flexShrink: 0 }}>
        {[
          [savedIds?.length || 0, "Saved"],
          [readIds?.length || 0, "Read"],
          [0, "Mira chats"],
        ].map(([number, label], index) => (
          <div
            key={label}
            style={{
              flex: 1,
              padding: "12px 0",
              textAlign: "center",
              borderRight: index < 2 ? "0.5px solid var(--border)" : "none",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 18,
                fontWeight: 600,
                color: "var(--ink)",
                margin: 0,
              }}
            >
              {number}
            </p>
            <p style={{ fontSize: 10, color: "var(--muted)", margin: 0 }}>{label}</p>
          </div>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 80px" }}>
        <p
          style={{
            fontSize: 10,
            color: "var(--muted)",
            padding: "14px 0 4px",
            fontWeight: 500,
            letterSpacing: 0.5,
          }}
        >
          PREFERENCES
        </p>

        {/* Feed & Topics expandable */}
        <div style={{ borderBottom: "0.5px solid var(--border)" }}>
          <button
            onClick={() => setPrefsOpen((v) => !v)}
            style={{
              width: "100%",
              background: "none",
              border: "none",
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "13px 0",
              cursor: "pointer",
            }}
          >
            <Ic.Settings c="var(--muted)" s={22} />
            <span style={{ flex: 1, fontSize: 14, color: "var(--ink)", textAlign: "left" }}>
              Feed & Topics
            </span>
            <span style={{ fontSize: 10, color: "var(--muted)", marginRight: 4 }}>
              {selectedLaw.slice(0, 2).join(", ")}
              {selectedLaw.length > 2 ? ` +${selectedLaw.length - 2}` : ""}
            </span>
            <span
              style={{
                fontSize: 12,
                color: "var(--muted)",
                transition: "transform 0.2s",
                display: "inline-block",
                transform: prefsOpen ? "rotate(90deg)" : "rotate(0deg)",
              }}
            >
              ›
            </span>
          </button>

          {prefsOpen && (
            <div style={{ paddingBottom: 16 }}>
              <PillGroup
                title="LAW CATEGORY"
                options={LAW_CATS}
                selected={selectedLaw}
                onToggle={(v) => toggle(setSelectedLaw, v)}
              />
              <PillGroup
                title="COURT"
                options={COURTS}
                selected={selectedCourts}
                onToggle={(v) => toggle(setSelectedCourts, v)}
              />
              <PillGroup
                title="NEWS SOURCES"
                options={NEWS_SOURCES}
                selected={selectedSources}
                onToggle={(v) => toggle(setSelectedSources, v)}
              />
            </div>
          )}
        </div>

        {/* Language preference */}
        <div style={{ borderBottom: "0.5px solid var(--border)", padding: "13px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <Ic.Settings c="var(--muted)" s={22} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, color: "var(--ink)", margin: 0 }}>Article Language</p>
              <p style={{ fontSize: 11, color: "var(--muted)", margin: 0 }}>
                Translate titles & summaries
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap", paddingLeft: 34 }}>
            {LANGUAGES.map(({ code, label, native }) => {
              const active = lang === code;
              return (
                <button
                  key={code ?? "en"}
                  onClick={() => onChangeLang(code)}
                  style={{
                    padding: "6px 13px",
                    borderRadius: 20,
                    border: `0.5px solid ${active ? "var(--ink)" : "var(--border)"}`,
                    background: active ? "var(--ink)" : "var(--surface)",
                    color: active ? "var(--white)" : "var(--muted)",
                    fontSize: 11,
                    fontWeight: active ? 500 : 400,
                    cursor: "pointer",
                    transition: "all 0.15s",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1,
                    lineHeight: 1.3,
                  }}
                >
                  <span>{native}</span>
                  {code && (
                    <span style={{ fontSize: 9, opacity: 0.7 }}>{label}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feed view toggle */}
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
                background: feedView === value ? "var(--ink)" : "var(--surface)",
                color: feedView === value ? "var(--white)" : "var(--ink)",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Dark mode */}
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
            <p style={{ fontSize: 14, color: "var(--ink)", margin: 0 }}>Dark mode</p>
            <p style={{ fontSize: 11, color: "var(--muted)", margin: 0 }}>Switch app appearance</p>
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

        <p
          style={{
            fontSize: 10,
            color: "var(--muted)",
            padding: "14px 0 4px",
            fontWeight: 500,
            letterSpacing: 0.5,
          }}
        >
          MIRA
        </p>
        <SettingsRow Icon={Ic.Mira} label="Mira chat history" />

        <p
          style={{
            fontSize: 10,
            color: "var(--muted)",
            padding: "14px 0 4px",
            fontWeight: 500,
            letterSpacing: 0.5,
          }}
        >
          ACCOUNT
        </p>
        <SettingsRow Icon={Ic.Help} label="Help & support" />
        <SettingsRow Icon={Ic.Logout} label="Sign out" danger onClick={onSignOut} />
      </div>

      <BottomNav active="profile" onNavigate={onNavigate} />
    </div>
  );
}