import tokens from "../theme/tokens";
import Icon from "./Icon";

export default function BottomNavBar({ items, activeIndex, onSelect }) {
  return (
    <div
      style={{
        height: 80,
        background: tokens.color.surfaceContainerLow,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        borderTop: `1px solid ${tokens.color.outlineVariant}`,
        paddingBottom: 8,
      }}
    >
      {items.map((item, i) => {
        const active = i === activeIndex;
        return (
          <button
            key={i}
            onClick={() => onSelect(i)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              padding: "12px 0 0",
              minWidth: 64,
              transition: `all ${tokens.motion.duration.medium2} ${tokens.motion.easing.emphasized}`,
            }}
          >
            <div
              style={{
                width: active ? 64 : 24,
                height: 32,
                borderRadius: tokens.shape.full,
                background: active ? tokens.color.primaryContainer : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: `all ${tokens.motion.duration.medium2} ${tokens.motion.easing.expressive}`,
              }}
            >
              <Icon
                name={item.icon}
                size={24}
                color={active ? tokens.color.onPrimaryContainer : tokens.color.onSurfaceVariant}
              />
            </div>
            <span
              style={{
                fontSize: tokens.type.labelMedium.size,
                fontWeight: active ? 600 : 500,
                color: active ? tokens.color.onSurface : tokens.color.onSurfaceVariant,
                letterSpacing: tokens.type.labelMedium.tracking,
              }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
