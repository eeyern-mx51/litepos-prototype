import tokens from "../theme/tokens";
import TopAppBar from "../components/TopAppBar";
import NavCard from "../components/NavCard";

export default function MenuScreen({ navigate }) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: tokens.color.bg.brand,
      }}
    >
      <TopAppBar title="Menu" variant="small" theme="dark" onBack={() => navigate("home")} />
      <div
        style={{
          flex: 1,
          overflow: "auto",
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          alignContent: "start",
        }}
      >
        <NavCard icon="receipt" label="Transaction History" onClick={() => navigate("history")} />
        <NavCard icon="chart" label="Settlements" onClick={() => navigate("reporting")} />
        <NavCard icon="chart" label="Terminal Reporting" onClick={() => navigate("reporting")} />
        <NavCard icon="settings" label="Terminal Settings" onClick={() => navigate("settings")} />
        <NavCard icon="info" label="Support" onClick={() => {}} />
      </div>
    </div>
  );
}
