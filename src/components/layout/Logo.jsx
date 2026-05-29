import logoIcon from "../../assets/lexlegisicon.png";

export function Logo() {
  return (
    <div className="topbar-logo">
      <img
        src={logoIcon}
        alt="LexLegis"
        style={{
          width: 28,
          height: 28,
          objectFit: "contain",
        }}
      />
      <span className="logo-wordmark">Lexlegis.ai</span>
    </div>
  );
}