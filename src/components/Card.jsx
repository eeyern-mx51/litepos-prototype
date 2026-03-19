import tokens from "../theme/tokens";

export default function Card({ children, onClick, variant = "filled", style = {} }) {
  const styles = {
    filled:   { background: tokens.color.surfaceContainerHighest, border: "none" },
    outlined: { background: tokens.color.surface, border: `1px solid ${tokens.color.outlineVariant}` },
    elevated: { background: tokens.color.surfaceContainerLow, border: "none", boxShadow: tokens.elevation.level1 },
  };
  const s = styles[variant];

  return (
    <div
      onClick={onClick}
      style={{
        borderRadius: tokens.shape.expressiveLarge,
        padding: 16,
        cursor: onClick ? "pointer" : "default",
        transition: `all ${tokens.motion.duration.short4} ${tokens.motion.easing.standard}`,
        ...s,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
