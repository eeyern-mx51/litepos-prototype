import tokens from "../theme/tokens";

export default function Chip({ label, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        height: 32,
        borderRadius: tokens.shape.small,
        border: selected ? "none" : `1px solid ${tokens.color.border.onpage}`,
        background: selected ? `${tokens.color.bg.action.primary.default}22` : "transparent",
        color: selected ? tokens.color.fg.brand : tokens.color.fg.subtle,
        fontSize: tokens.type.labelLarge.size,
        fontWeight: tokens.type.labelLarge.weight,
        padding: "0 16px",
        cursor: "pointer",
        transition: `all ${tokens.motion.duration.short4} ${tokens.motion.easing.standard}`,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}
