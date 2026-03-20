import tokens from "../theme/tokens";

export default function Switch({ checked, onChange }) {
  return (
    <div
      onClick={() => onChange(!checked)}
      style={{
        width: 52,
        height: 32,
        borderRadius: tokens.shape.full,
        cursor: "pointer",
        background: checked ? tokens.color.bg.action.primary.default : tokens.color.bg.surface,
        border: checked ? "none" : `2px solid ${tokens.color.border.onpage}`,
        position: "relative",
        transition: `all ${tokens.motion.duration.medium1} ${tokens.motion.easing.expressive}`,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: checked ? 24 : 16,
          height: checked ? 24 : 16,
          borderRadius: tokens.shape.full,
          background: checked ? tokens.color.fg.white : tokens.color.border.onpage,
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          left: checked ? 24 : 4,
          transition: `all ${tokens.motion.duration.medium1} ${tokens.motion.easing.expressive}`,
        }}
      />
    </div>
  );
}
