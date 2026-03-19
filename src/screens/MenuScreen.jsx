import tokens from "../theme/tokens";
import TopAppBar from "../components/TopAppBar";
import ListItem from "../components/ListItem";
import SectionHeader from "../components/SectionHeader";
import Icon from "../components/Icon";

export default function MenuScreen({ navigate }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <TopAppBar title="Menu" variant="large" />
      <div style={{ flex: 1, overflow: "auto" }}>
        <SectionHeader title="Terminal" />
        <ListItem
          leading={<Icon name="settings" color={tokens.color.onSurfaceVariant} />}
          headline="Settings"
          supporting="Terminal & LitePOS configuration"
          trailing={<Icon name="chevron" color={tokens.color.onSurfaceVariant} />}
          onClick={() => navigate("settings")}
        />
        <ListItem
          leading={<Icon name="history" color={tokens.color.onSurfaceVariant} />}
          headline="Transaction History"
          supporting="View past transactions"
          trailing={<Icon name="chevron" color={tokens.color.onSurfaceVariant} />}
          onClick={() => navigate("history")}
        />
        <ListItem
          leading={<Icon name="chart" color={tokens.color.onSurfaceVariant} />}
          headline="Reporting"
          supporting="Sales & item reports"
          trailing={<Icon name="chevron" color={tokens.color.onSurfaceVariant} />}
          onClick={() => navigate("reporting")}
        />

        <SectionHeader title="Support" />
        <ListItem
          leading={<Icon name="info" color={tokens.color.onSurfaceVariant} />}
          headline="About"
          supporting="Version & terminal info"
          trailing={<Icon name="chevron" color={tokens.color.onSurfaceVariant} />}
          divider={false}
        />
      </div>
    </div>
  );
}
