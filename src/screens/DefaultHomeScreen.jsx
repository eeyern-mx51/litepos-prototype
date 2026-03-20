import tokens from "../theme/tokens";
import Icon from "../components/Icon";

/**
 * Default terminal home screen — shown when LitePOS is OFF.
 * This is a placeholder for the actual terminal home screen
 * which will be designed separately.
 */
export default function DefaultHomeScreen({ navigate }) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: tokens.color.bg.page,
      }}
    >
      {/* ── Top bar ─────────────────────────────────── */}
      <div
        style={{
          padding: "6px 4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <button
          onClick={() => navigate("menu")}
          style={{
            width: 48, height: 48, borderRadius: tokens.shape.full,
            border: "none", background: "transparent", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <Icon name="menu" size={24} color={tokens.color.fg.emphasis} />
        </button>
        <button
          onClick={() => navigate("settings")}
          style={{
            width: 48, height: 48, borderRadius: tokens.shape.full,
            border: "none", background: "transparent", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <Icon name="settings" size={24} color={tokens.color.fg.subtle} />
        </button>
      </div>

      {/* ── Placeholder content ─────────────────────── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px 24px",
          gap: 16,
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: tokens.shape.full,
            background: tokens.color.bg.surface,
            border: `1px solid ${tokens.color.border.onpage}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="home" size={32} color={tokens.color.fg.subtle} />
        </div>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: tokens.type.titleMedium.size,
              fontWeight: tokens.type.titleMedium.weight,
              color: tokens.color.fg.emphasis,
            }}
          >
            Terminal Home
          </div>
          <div
            style={{
              fontSize: tokens.type.bodyMedium.size,
              color: tokens.color.fg.subtle,
              marginTop: 6,
              lineHeight: 1.5,
            }}
          >
            Default terminal home screen placeholder. Enable LitePOS in settings to access the point-of-sale experience.
          </div>
        </div>
        <button
          onClick={() => navigate("settings")}
          style={{
            marginTop: 8,
            padding: "12px 24px",
            borderRadius: tokens.shape.full,
            background: tokens.color.bg.surface,
            border: `1px solid ${tokens.color.border.onpage}`,
            cursor: "pointer",
            fontSize: tokens.type.labelLarge.size,
            fontWeight: 600,
            color: tokens.color.fg.brand,
          }}
        >
          Open Settings
        </button>
      </div>
    </div>
  );
}
