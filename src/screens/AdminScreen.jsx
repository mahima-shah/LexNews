export function AdminScreen({ onNavigate }) {
    return (
      <div style={{ height: "100%", padding: 20, overflowY: "auto" }}>
        <button onClick={() => onNavigate("profile")}>
          ← Back
        </button>
  
        <h1>Admin</h1>
        <p>Publish articles here.</p>
      </div>
    );
  }