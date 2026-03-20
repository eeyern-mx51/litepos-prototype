import tokens from "../theme/tokens";
import TopAppBar from "../components/TopAppBar";
import ListItem from "../components/ListItem";
import SectionHeader from "../components/SectionHeader";
import Icon from "../components/Icon";

export default function SettingsScreen({ navigate }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: tokens.color.bg.page }}>
      <TopAppBar title="Settings" onBack={() => navigate("menu")} theme="light" />
      <div style={{ flex: 1, overflow: "auto", background: tokens.color.bg.page }}>
        <SectionHeader title="Terminal" />
        <ListItem
          leading={<Icon name="store" color={tokens.color.fg.brand} />}
          headline="LitePOS"
          supporting="Enable, configure & manage products"
          trailing={<Icon name="chevron" color={tokens.color.fg.subtle} />}
          onClick={() => navigate("litepos-settings")}
        />
        <ListItem
          leading={<Icon name="print" color={tokens.color.fg.brand} />}
          headline="General Settings"
          supporting="Terminal preferences"
          trailing={<Icon name="chevron" color={tokens.color.fg.subtle} />}
        />
        <ListItem
          leading={<Icon name="receipt" color={tokens.color.fg.brand} />}
          headline="Receipts"
          supporting="Print & format options"
          trailing={<Icon name="chevron" color={tokens.color.fg.subtle} />}
          divider={false}
        />
      </div>
    </div>
  );
}
