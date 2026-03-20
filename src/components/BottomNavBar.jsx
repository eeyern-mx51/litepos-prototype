import tokens from "../theme/tokens";
import Icon from "./Icon";

export default function BottomNavBar({ items, activeIndex, onSelect }) {
  return (
    <div
      style={{
        height: 80,
        background: tokens.color.bg.page,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        borderTop: `1px solid ${tokens.color.border.onpage}`,
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
                background: active ? `${tokens.color.fg.brand}22` : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: `all ${tokens.motion.duration.medium2} ${tokens.motion.easing.expressive}`,
              }}
            >
              <Icon
                name={item.icon}
                size={24}
                color={active ? tokens.color.fg.brand : tokens.color.fg.subtle}
              />
            </div>
            <span
              style={{
                fontSize: tokens.type.labelMedium.size,
                fontWeight: active ? 600 : 500,
                color: active ? tokens.color.fg.emphasis : tokens.color.fg.subtle,
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
