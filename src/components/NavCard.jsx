import tokens from "../theme/tokens";
import Icon from "./Icon";

export default function NavCard({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        minHeight: 88,
        borderRadius: tokens.shape.expressiveLarge,
        background: tokens.color.fg.white,
        border: "none",
        cursor: "pointer",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        padding: "0 24px",
        boxShadow: "none",
        fontFamily: "inherit",
        transition: `all ${tokens.motion.duration.short4} ${tokens.motion.easing.standard}`,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: tokens.shape.full,
          border: `2px solid ${tokens.color.fg.brand}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon name={icon} size={22} color={tokens.color.fg.brand} />
      </div>
      <span
        style={{
          fontSize: tokens.type.titleSmall.size,
          fontWeight: 500,
          color: tokens.color.fg.brand,
          textAlign: "left",
        }}
      >
        {label}
      </span>
    </button>
  );
}
