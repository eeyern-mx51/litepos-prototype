import tokens from "../theme/tokens";
import Icon from "./Icon";

export default function NavCard({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        minHeight: 96,
        borderRadius: tokens.shape.large,
        background: tokens.color.fg.white,
        border: "none",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        padding: 16,
        boxShadow: tokens.elevation.level1,
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
        }}
      >
        <Icon name={icon} size={24} color={tokens.color.fg.brand} />
      </div>
      <span
        style={{
          fontSize: tokens.type.labelLarge.size,
          fontWeight: 600,
          color: tokens.color.fg.emphasis,
          textAlign: "center",
        }}
      >
        {label}
      </span>
    </button>
  );
}
