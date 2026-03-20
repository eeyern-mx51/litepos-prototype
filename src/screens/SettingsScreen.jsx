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

export default function SettingsScreen({ navigate, goBack }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: tokens.color.bg.surface }}>
      <TopAppBar title="Settings" onBack={goBack} theme="light" />
      <div style={{ flex: 1, overflow: "auto", paddingBottom: 32 }}>

        {/* ── LitePOS — hero card ───────────────────────────────── */}
        <SectionLabel label="LitePOS" />
        <div style={{ padding: "0 16px 4px" }}>
          <button
            onClick={() => navigate("litepos-settings")}
            style={{
              width: "100%",
              background: tokens.color.bg.page,
              borderRadius: tokens.shape.expressiveLarge,
              border: `1px solid ${tokens.color.border.action.default}44`,
              padding: "18px 16px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 14,
              textAlign: "left",
              transition: `all ${tokens.motion.duration.short4} ${tokens.motion.easing.standard}`,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: tokens.shape.large,
                background: `${tokens.color.fg.brand}15`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Icon name="store" size={24} color={tokens.color.fg.brand} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: tokens.type.titleMedium.size,
                  fontWeight: 600,
                  color: tokens.color.fg.emphasis,
                }}
              >
                LitePOS
              </div>
              <div
                style={{
                  fontSize: tokens.type.bodySmall.size,
                  color: tokens.color.fg.subtle,
                  marginTop: 2,
                }}
              >
                Enable, configure & manage products
              </div>
            </div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "3px 10px",
                borderRadius: tokens.shape.full,
                background: `${tokens.color.bg.success.default}18`,
                marginRight: 4,
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: tokens.shape.full,
                  background: tokens.color.fg.success.icon,
                }}
              />
              <span
                style={{
                  fontSize: tokens.type.labelSmall.size,
                  fontWeight: 600,
                  color: tokens.color.fg.success.text,
                }}
              >
                Active
              </span>
            </div>
            <Icon name="chevron" size={20} color={tokens.color.fg.subtle} />
          </button>
        </div>

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
