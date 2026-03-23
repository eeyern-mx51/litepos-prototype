import tokens from "../theme/tokens";
import TopAppBar from "../components/TopAppBar";
import NavCard from "../components/NavCard";

export default function MenuScreen({ navigate, goBack }) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: tokens.color.bg.brand,
      }}
    >
      <TopAppBar title="Menu" variant="large" theme="dark" onBack={goBack} />
      <div
        style={{
          flex: 1,
          overflow: "auto",
          padding: "8px 20px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
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
