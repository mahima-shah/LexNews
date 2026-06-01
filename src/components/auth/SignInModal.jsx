import { useState } from "react";
import { Ic } from "../../constants/icons.jsx";

export function SignInModal({ onSuccess, onCancel }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!email.trim()) {
      setStatus("Please enter your email.");
      return;
    }

    setLoading(true);
    setStatus("");

    const result = await onSuccess(email);

    setLoading(false);

    if (result?.error) {
      setStatus(result.error.message || "Could not send sign-in link.");
      return;
    }

    setStatus("Check your email for the sign-in link.");
  };

  return (
    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", alignItems: "flex-end", borderRadius: 44 }}>
      <div style={{ background: "#fff", borderRadius: "28px 28px 44px 44px", padding: "28px 24px 40px", width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <p style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600, color: "var(--ink)" }}>
            Sign in
          </p>

          <button onClick={onCancel} style={{ background: "none", border: "none" }}>
            <Ic.Close c="var(--muted)" s={20} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Field
            label="Email"
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
          />

          <button
            onClick={handleContinue}
            disabled={loading}
            style={{
              width: "100%",
              padding: "13px 0",
              background: "var(--ink)",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 500,
              marginTop: 6,
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Sending..." : "Send sign-in link"}
          </button>

          {status && (
            <p style={{ fontSize: 12, color: "var(--muted)", textAlign: "center", lineHeight: 1.5 }}>
              {status}
            </p>
          )}

          <p style={{ fontSize: 11, color: "var(--muted)", textAlign: "center" }}>
            By continuing you agree to LexLegis Terms & Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label style={{ fontSize: 11, color: "var(--muted)", fontWeight: 500, letterSpacing: 0.3, textTransform: "uppercase" }}>
        {label}
      </label>

      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        style={{
          display: "block",
          width: "100%",
          marginTop: 6,
          padding: "11px 14px",
          background: "var(--surface)",
          border: "0.5px solid var(--border)",
          borderRadius: 10,
          fontSize: 14,
          color: "var(--ink)",
          outline: "none",
        }}
      />
    </div>
  );
}