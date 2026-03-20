import tokens from "../theme/tokens";
import Icon from "./Icon";

/**
 * OrderBar — Fixed bottom bar inspired by Square Handheld / Toast Go patterns.
 *
 * Two states:
 *   1. IDLE (basket empty) — Shows terminal info: mode · terminal name · "Powered by mx51"
 *   2. ACTIVE (basket has items) — Shows item count, total, and a "Charge →" action
 *
 * This replaces both the old floating BasketBanner AND the TerminalInfoBar,
 * giving one predictable bar at the bottom — no floating elements competing
 * with the product grid.
 */
export default function OrderBar({ itemCount = 0, total = 0, onCharge, onKeypad }) {
  const hasItems = itemCount > 0;

  // ── Active state: basket with items ──────────────────────────────
  if (hasItems) {
    return (
      <button
        onClick={onCharge}
        style={{
          width: "100%",
          height: 52,
          background: tokens.color.bg.action.primary.default,
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 12px 0 16px",
          transition: `all ${tokens.motion.duration.expressiveEntry} ${tokens.motion.easing.expressive}`,
        }}
      >
        {/* Left: item count badge + label */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              minWidth: 24,
              height: 24,
              borderRadius: tokens.shape.full,
              background: tokens.color.fg.onAction + "33",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 6px",
            }}
          >
            <span
              style={{
                fontSize: tokens.type.labelMedium.size,
                fontWeight: 700,
                color: tokens.color.fg.onAction,
              }}
            >
              {itemCount}
            </span>
          </div>
          <span
            style={{
              fontSize: tokens.type.titleSmall.size,
              fontWeight: 500,
              color: tokens.color.fg.onAction,
            }}
          >
            {itemCount === 1 ? "item" : "items"} in basket
          </span>
        </div>

        {/* Right: total + charge arrow */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              fontSize: tokens.type.titleMedium.size,
              fontWeight: 700,
              color: tokens.color.fg.onAction,
              letterSpacing: "-0.25px",
            }}
          >
            ${total.toFixed(2)}
          </span>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: tokens.shape.full,
              background: tokens.color.fg.onAction + "22",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="chevron" size={20} color={tokens.color.fg.onAction} />
          </div>
        </div>
      </button>
    );
  }

  // ── Idle state: keypad shortcut + terminal info ─────────────────
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* Keypad shortcut — compact pill, right-aligned */}
      {onKeypad && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "8px 16px",
            background: tokens.color.bg.page,
          }}
        >
          <button
            onClick={onKeypad}
            style={{
              height: 36,
              borderRadius: tokens.shape.full,
              border: `1.5px solid ${tokens.color.fg.brand}`,
              background: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              padding: "0 14px 0 10px",
              transition: `all ${tokens.motion.duration.short4} ${tokens.motion.easing.standard}`,
            }}
          >
            <Icon name="keypad" size={18} color={tokens.color.fg.brand} />
            <span
              style={{
                fontSize: tokens.type.labelMedium.size,
                fontWeight: tokens.type.labelMedium.weight,
                color: tokens.color.fg.brand,
                fontFamily: "inherit",
              }}
            >
              Manual Entry
            </span>
          </button>
        </div>
      )}
      {/* Terminal info strip */}
      <div
        style={{
          height: 40,
          background: tokens.color.bg.statusbar,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          fontSize: tokens.type.labelSmall.size,
          color: tokens.color.fg.white,
          fontWeight: 500,
          transition: `all ${tokens.motion.duration.medium2} ${tokens.motion.easing.standard}`,
        }}
      >
        <div style={{ display: "flex", gap: 16 }}>
          <span>STANDALONE</span>
          <span>Front counter</span>
        </div>
        <span style={{ fontSize: tokens.type.labelSmall.size }}>Powered by mx51</span>
      </div>
    </div>
  );
}
