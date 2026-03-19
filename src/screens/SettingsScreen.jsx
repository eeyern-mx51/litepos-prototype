import tokens from "../theme/tokens";
import TopAppBar from "../components/TopAppBar";
import ListItem from "../components/ListItem";
import SectionHeader from "../components/SectionHeader";
import Icon from "../components/Icon";

export default function SettingsScreen({ navigate }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <TopAppBar title="Settings" onBack={() => navigate("menu")} />
      <div style={{ flex: 1, overflow: "auto" }}>
        <SectionHeader title="Terminal" />
        <ListItem
          leading={<Icon name="store" color={tokens.color.onSurfaceVariant} />}
          headline="LitePOS"
          supporting="Enable, configure & manage products"
          trailing={<Icon name="chevron" color={tokens.color.onSurfaceVariant} />}
          onClick={() => navigate("litepos-settings")}
        />
        <ListItem
          leading={<Icon name="print" color={tokens.color.onSurfaceVariant} />}
          headline="General Settings"
          supporting="Terminal preferences"
          trailing={<Icon name="chevron" color={tokens.color.onSurfaceVariant} />}
        />
        <ListItem
          leading={<Icon name="receipt" color={tokens.color.onSurfaceVariant} />}
          headline="Receipts"
          supporting="Print & format options"
          trailing={<Icon name="chevron" color={tokens.color.onSurfaceVariant} />}
          divider={false}
        />
      </div>
    </div>
  );
}
