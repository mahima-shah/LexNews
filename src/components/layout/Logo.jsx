import lexlegisicon from "../../assets/lexlegisicon.png";
import lexlegisdarkicon from "../../assets/lexlegisdarkicon.png";
import lexlegislogo from "../../assets/lexlegislogo.png";

export function Logo({ darkMode }) {
  return (
    <div className="topbar-logo">
      <img
        src={darkMode ? lexlegisdarkicon : lexlegislogo}
        alt="Lexlegis.ai"
        style={{
          height: 37,
          width: "auto",
          objectFit: "contain",
        }}
      />
    </div>
  );
}