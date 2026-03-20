import tokens from "../theme/tokens";

export default function Card({ children, onClick, variant = "filled", style = {} }) {
  const styles = {
    filled:   { background: tokens.color.bg.surface, border: "none" },
    outlined: { background: tokens.color.bg.page, border: `1px solid ${tokens.color.border.onpage}` },
    elevated: { background: tokens.color.bg.page, border: "none", boxShadow: tokens.elevation.level1 },
    nav:      { background: tokens.color.fg.white, border: "none", boxShadow: tokens.elevation.level1 },
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
