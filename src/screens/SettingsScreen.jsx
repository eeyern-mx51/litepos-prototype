import tokens from "../theme/tokens";
import TopAppBar from "../components/TopAppBar";
import ListItem from "../components/ListItem";
import Icon from "../components/Icon";

/**
 * Terminal Settings — grouped card pattern matching Clover/Square.
 *
 * Related settings are contained inside surface cards with rounded corners.
 * Section labels sit outside cards as subtle uppercase context.
 * LitePOS gets a prominent hero card since it's the primary feature toggle.
 */

function SettingsCard({ children }) {
  return (
    <div
      style={{
        background: tokens.color.bg.page,
        borderRadius: tokens.shape.expressiveLarge,
        border: `1px solid ${tokens.color.border.onpage}`,
        overflow: "hidden",
        margin: "0 16px 4px",
      }}
    >
      {children}
    </div>
  );
}

function SectionLabel({ label }) {
  return (
    <div
      style={{
        padding: "20px 16px 8px",
        fontSize: tokens.type.labelMedium.size,
        fontWeight: 600,
        color: tokens.color.fg.subtle,
        letterSpacing: tokens.type.labelMedium.tracking,
        textTransform: "uppercase",
      }}
    >
      {label}
    </div>
  );
}

function RadioOption({ label, description, selected, onSelect }) {
  return (
    <button
      onClick={onSelect}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "14px 16px",
        border: "none",
        borderBottom: `1px solid ${tokens.color.border.onpage}`,
        background: selected ? `${tokens.color.fg.brand}08` : "transparent",
        cursor: "pointer",
        fontFamily: "inherit",
        textAlign: "left",
      }}
    >
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: tokens.shape.full,
          border: `2px solid ${selected ? tokens.color.fg.brand : tokens.color.border.onsurface}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transition: `all ${tokens.motion.duration.short2} ${tokens.motion.easing.expressive}`,
        }}
      >
        {selected && (
          <div style={{ width: 10, height: 10, borderRadius: tokens.shape.full, background: tokens.color.fg.brand }} />
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: tokens.type.bodyLarge.size, fontWeight: selected ? 600 : 400, color: selected ? tokens.color.fg.brand : tokens.color.fg.emphasis }}>
          {label}
        </div>
        {description && (
          <div style={{ fontSize: tokens.type.bodySmall.size, color: tokens.color.fg.subtle, marginTop: 2 }}>
            {description}
          </div>
        )}
      </div>
    </button>
  );
}

export default function SettingsScreen({ navigate, goBack, homeScreenMode, setHomeScreenMode }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: tokens.color.bg.surface }}>
      <TopAppBar title="Settings" onBack={goBack} theme="light" />
      <div style={{ flex: 1, overflow: "auto", paddingBottom: 32 }}>

        {/* ── Home Screen mode selector ─────────────────────────── */}
        <SectionLabel label="Home Screen" />
        <SettingsCard>
          <RadioOption
            label="LitePOS"
            description="Product grid with catalogue & basket"
            selected={homeScreenMode === "litepos"}
            onSelect={() => setHomeScreenMode("litepos")}
          />
          <RadioOption
            label="Simple"
            description="Payment, Split Bill & Refund cards"
            selected={homeScreenMode === "simple"}
            onSelect={() => setHomeScreenMode("simple")}
          />
          <RadioOption
            label="Tiles"
            description="Customisable action tiles"
            selected={homeScreenMode === "tiles"}
            onSelect={() => setHomeScreenMode("tiles")}
          />
          <div style={{ borderBottom: "none" }}>
            <RadioOption
              label="Keypad"
              description="Direct amount entry"
              selected={homeScreenMode === "keypad"}
              onSelect={() => setHomeScreenMode("keypad")}
            />
          </div>
        </SettingsCard>

        {/* ── LitePOS settings ────────────────────────────────── */}
        <SectionLabel label="LitePOS" />
        <SettingsCard>
          <ListItem
            leading={<Icon name="store" color={tokens.color.fg.brand} />}
            headline="LitePOS Settings"
            supporting="Configure products, catalogue & receipts"
            trailing={<Icon name="chevron" color={tokens.color.fg.subtle} />}
            onClick={() => navigate("litepos-settings")}
            divider={false}
          />
        </SettingsCard>

        {/* ── Terminal ──────────────────────────────────────────── */}
        <SectionLabel label="Terminal" />
        <SettingsCard>
          <ListItem
            leading={<Icon name="settings" color={tokens.color.fg.brand} />}
            headline="General"
            supporting="Language, time zone, sleep & display"
            trailing={<Icon name="chevron" color={tokens.color.fg.subtle} />}
          />
          <ListItem
            leading={<Icon name="print" color={tokens.color.fg.brand} />}
            headline="Receipts"
            supporting="Print & format options"
            trailing={<Icon name="chevron" color={tokens.color.fg.subtle} />}
          />
          <ListItem
            leading={<Icon name="toggle" color={tokens.color.fg.brand} />}
            headline="Connectivity"
            supporting="WiFi, Bluetooth & cellular"
            trailing={<Icon name="chevron" color={tokens.color.fg.subtle} />}
            divider={false}
          />
        </SettingsCard>

        {/* ── Security ──────────────────────────────────────────── */}
        <SectionLabel label="Security" />
        <SettingsCard>
          <ListItem
            leading={<Icon name="info" color={tokens.color.fg.brand} />}
            headline="Admin PIN"
            supporting="Set or change admin passcode"
            trailing={<Icon name="chevron" color={tokens.color.fg.subtle} />}
          />
          <ListItem
            leading={<Icon name="toggle" color={tokens.color.fg.brand} />}
            headline="Lock Customer Mode"
            supporting="Prevent exit from customer-facing screen"
            trailing={<Icon name="chevron" color={tokens.color.fg.subtle} />}
            divider={false}
          />
        </SettingsCard>

        {/* ── About ─────────────────────────────────────────────── */}
        <SectionLabel label="About" />
        <SettingsCard>
          <ListItem
            headline="Software Version"
            supporting="v3.12.0 (Build 20260318)"
            divider={false}
          />
        </SettingsCard>
      </div>
    </div>
  );
}
