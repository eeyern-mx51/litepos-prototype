import tokens from "../theme/tokens";
import Icon from "./Icon";

export default function ProductCard({ name, price, isFav, image, emoji, emojiBg, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        borderRadius: tokens.shape.expressiveLarge,
        background: tokens.color.bg.page,
        overflow: "hidden",
        cursor: "pointer",
        transition: `all ${tokens.motion.duration.short4} ${tokens.motion.easing.standard}`,
        border: `1px solid ${tokens.color.border.onpage}`,
      }}
    >
      <div
        style={{
          height: 96,
          background: image ? tokens.color.bg.surface : emojiBg || tokens.color.bg.surface,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {image ? (
          <img src={image} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : emoji ? (
          <span style={{ fontSize: 40, lineHeight: 1 }}>{emoji}</span>
        ) : (
          <Icon name="image" size={32} color={tokens.color.border.onsurface} />
        )}
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
