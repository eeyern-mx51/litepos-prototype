import tokens from "../theme/tokens";
import Icon from "./Icon";

export default function FAB({ icon, label, onClick, variant = "primary" }) {
  const isExtended = !!label;
  const colors = {
    primary:   { bg: tokens.color.primaryContainer,   fg: tokens.color.onPrimaryContainer },
    secondary: { bg: tokens.color.secondaryContainer,  fg: tokens.color.onSecondaryContainer },
    tertiary:  { bg: tokens.color.tertiaryContainer,   fg: tokens.color.onTertiaryContainer },
  };
  const c = colors[variant];

  return (
    <button
      onClick={onClick}
      style={{
        position: "absolute",
        bottom: 96,
        right: 16,
        height: 56,
        minWidth: 56,
        borderRadius: tokens.shape.large,
        background: c.bg,
        border: "none",
        cursor: "pointer",
        boxShadow: tokens.elevation.level3,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: isExtended ? "0 20px 0 16px" : 0,
        transition: `all ${tokens.motion.duration.medium2} ${tokens.motion.easing.expressive}`,
        zIndex: 10,
      }}
    >
      <Icon name={icon} size={24} color={c.fg} />
      {label && (
        <span
          style={{
            fontSize: tokens.type.labelLarge.size,
            fontWeight: tokens.type.labelLarge.weight,
            color: c.fg,
          }}
        >
          {label}
        </span>
      )}
    </button>
  );
}
