import tokens from "../theme/tokens";

export default function Chip({ label, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        height: 32,
        borderRadius: tokens.shape.small,
        border: selected ? "none" : `1px solid ${tokens.color.outline}`,
        background: selected ? tokens.color.secondaryContainer : "transparent",
        color: selected ? tokens.color.onSecondaryContainer : tokens.color.onSurfaceVariant,
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
