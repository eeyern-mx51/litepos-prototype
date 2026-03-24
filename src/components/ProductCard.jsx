import tokens from "../theme/tokens";
import Icon from "./Icon";

export default function ProductCard({ name, price, isFav, image, emoji, emojiBg, onClick, onToggleFav }) {
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
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFav?.();
          }}
          style={{
            position: "absolute",
            top: 6,
            right: 6,
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "none",
            background: isFav ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.25)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            transition: "background 0.15s ease",
          }}
        >
          <Icon name={isFav ? "favorite" : "favorite_border"} size={20} color={isFav ? tokens.color.fg.error.icon : "#fff"} />
        </button>
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
