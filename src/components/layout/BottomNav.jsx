import { Ic } from "../../constants/icons.jsx";

export function BottomNav({ active, onNavigate }) {
  const items = [
    { id: "home", label: "Home", Icon: Ic.Home },
    { id: "search", label: "Search", Icon: Ic.Search },
    { id: "mira", label: "Mira", fab: true },
    { id: "saved", label: "Saved", Icon: Ic.Bookmark },
    { id: "profile", label: "Profile", Icon: Ic.User },
  ];

  return (
    <div className="bnav">
      {items.map((item) => {
        const isActive = active === item.id;
        if (item.fab) {
          return (
            <button key={item.id} className="fab" onClick={() => onNavigate("mira")} aria-label="Ask Mira">
              <Ic.Mira c="#fff" s={22} />
            </button>
          );
        }
        return (
          <button key={item.id} className="bnav-item" onClick={() => onNavigate(item.id)}>
            <item.Icon c={isActive ? "var(--ink)" : "var(--muted-2)"} s={22} />
            <span className={`bnav-label ${isActive ? "on" : ""}`}>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
