import lexlegisicon from "../../assets/lexlegisicon.png";
import lexlegisdarkicon from "../../assets/lexlegisdarkicon.png";

export function Logo({ darkMode }) {
  return (
    <div className="topbar-logo">
      <img
        src={darkMode ? lexlegisdarkicon : lexlegisicon}
        alt="Lexlegis.ai"
        style={{
          height: 32,
          width: "auto",
          objectFit: "contain",
        }}
      />
    </div>
  );
}