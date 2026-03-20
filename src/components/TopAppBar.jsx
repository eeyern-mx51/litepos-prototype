import tokens from "../theme/tokens";
import Icon from "./Icon";

export default function TopAppBar({ title, subtitle, onBack, actions = [], variant = "small", theme = "light" }) {
  const isLarge = variant === "large";
  const isDark = theme === "dark";

  const bgColor = isDark ? tokens.color.bg.brand : tokens.color.bg.page;
  const textColor = isDark ? tokens.color.fg.white : tokens.color.fg.emphasis;
  const subtleColor = isDark ? tokens.color.fg.white : tokens.color.fg.subtle;
  const backColor = isDark ? tokens.color.fg.white : tokens.color.fg.brand;

  return (
    <div
      style={{
        background: bgColor,
        padding: isLarge ? "8px 8px 20px" : "8px",
        minHeight: isLarge ? 120 : 56,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {onBack && (
            <button
              onClick={onBack}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                width: 48,
                height: 48,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: tokens.shape.full,
                padding: 0,
              }}
            >
              <Icon name="back" color={backColor} />
            </button>
          )}
          {!isLarge && (
            <span
              style={{
                fontSize: tokens.type.titleLarge.size,
                fontWeight: tokens.type.titleLarge.weight,
                color: textColor,
                letterSpacing: tokens.type.titleLarge.tracking,
              }}
            >
              {title}
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {actions.map((action, i) => (
            <button
              key={i}
              onClick={action.onPress}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                width: 48,
                height: 48,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: tokens.shape.full,
                padding: 0,
              }}
            >
              <Icon name={action.icon} color={subtleColor} />
            </button>
          ))}
        </div>
      </div>
      {isLarge && (
        <div style={{ padding: "0 16px" }}>
          <div
            style={{
              fontSize: tokens.type.headlineMedium.size,
              fontWeight: tokens.type.headlineMedium.weight,
              color: textColor,
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div
              style={{
                fontSize: tokens.type.bodyMedium.size,
                color: subtleColor,
                marginTop: 2,
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
