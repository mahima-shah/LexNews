import lexlegisicon from "../../assets/lexlegisicon.png";
import lexlegisdarkicon from "../../assets/lexlegisdarkicon.png";

export function Logo({ darkMode }) {
  return (
    <div className="topbar-logo">
      <img
        src={darkMode ? lexlegisdarkicon : lexlegisicon}
        alt="LexLegis"
        style={{
          height: 30,
          width: "auto",
          objectFit: "contain",
        }}
      />
    </div>
  );
}