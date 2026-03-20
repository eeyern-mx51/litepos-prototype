import tokens from "../theme/tokens";

export default function ListItem({ leading, headline, supporting, trailing, onClick, divider = true }) {
  return (
    <div>
      <div
        onClick={onClick}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "12px 16px",
          cursor: onClick ? "pointer" : "default",
          minHeight: 56,
        }}
      >
        {leading && <div style={{ flexShrink: 0 }}>{leading}</div>}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: tokens.type.bodyLarge.size,
              color: tokens.color.fg.emphasis,
              fontWeight: 400,
            }}
          >
            {headline}
          </div>
          {supporting && (
            <div
              style={{
                fontSize: tokens.type.bodyMedium.size,
                color: tokens.color.fg.subtle,
                marginTop: 2,
              }}
            >
              {supporting}
            </div>
          )}
        </div>
        {trailing && <div style={{ flexShrink: 0 }}>{trailing}</div>}
      </div>
      {divider && (
        <div
          style={{
            height: 1,
            background: tokens.color.border.action.default,
            marginLeft: leading ? 72 : 16,
            marginRight: 16,
            opacity: 0.5,
          }}
        />
      )}
    </div>
  );
}
