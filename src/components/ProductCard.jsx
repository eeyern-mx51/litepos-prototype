import tokens from "../theme/tokens";
import Icon from "./Icon";

export default function ProductCard({ name, price, isFav, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        borderRadius: tokens.shape.expressiveLarge,
        background: tokens.color.bg.surface,
        overflow: "hidden",
        cursor: "pointer",
        transition: `all ${tokens.motion.duration.short4} ${tokens.motion.easing.standard}`,
      }}
    >
      <div
        style={{
          height: 96,
          background: tokens.color.bg.page,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <Icon name="image" size={32} color={tokens.color.border.onpage} />
        {isFav && (
          <div style={{ position: "absolute", top: 8, right: 8 }}>
            <Icon name="favorite" size={16} color={tokens.color.fg.error.icon} />
          </div>
        )}
      </div>
      <div style={{ padding: "8px 12px 12px" }}>
        <div
          style={{
            fontSize: tokens.type.bodyMedium.size,
            fontWeight: 500,
            color: tokens.color.fg.emphasis,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontSize: tokens.type.labelMedium.size,
            color: tokens.color.fg.brand,
            fontWeight: 600,
            marginTop: 2,
          }}
        >
          ${price}
        </div>
      </div>
    </div>
  );
}
