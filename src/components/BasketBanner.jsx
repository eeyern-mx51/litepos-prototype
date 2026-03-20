import tokens from "../theme/tokens";
import Icon from "./Icon";

export default function BasketBanner({ itemCount, total, onClick }) {
  if (itemCount === 0) return null;

  return (
    <div
      onClick={onClick}
      style={{
        position: "absolute",
        bottom: 160,
        left: 16,
        right: 16,
        height: 48,
        borderRadius: tokens.shape.full,
        background: tokens.color.bg.action.primary.default,
        color: tokens.color.fg.onAction,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 8px 0 20px",
        cursor: "pointer",
        boxShadow: tokens.elevation.level3,
        transition: `all ${tokens.motion.duration.expressiveEntry} ${tokens.motion.easing.expressive}`,
        zIndex: 9,
      }}
    >
      <span style={{ fontSize: tokens.type.labelLarge.size, fontWeight: 600 }}>
        {itemCount} item{itemCount > 1 ? "s" : ""} in basket
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: tokens.type.titleMedium.size, fontWeight: 700 }}>
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
          <Icon name="cart" size={18} color={tokens.color.fg.onAction} />
        </div>
      </div>
    </div>
  );
}
