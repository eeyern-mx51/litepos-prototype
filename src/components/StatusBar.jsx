import tokens from "../theme/tokens";

export default function StatusBar() {
  return (
    <div
      style={{
        height: 24,
        background: tokens.color.surfaceContainerLow,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        fontSize: 12,
        color: tokens.color.onSurfaceVariant,
        fontWeight: 500,
      }}
    >
      <span>9:41</span>
      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        <span style={{ fontSize: 10 }}>5G</span>
        <div
          style={{
            width: 18,
            height: 10,
            border: `1.5px solid ${tokens.color.onSurfaceVariant}`,
            borderRadius: 2,
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 1,
              left: 1,
              right: 3,
              bottom: 1,
              background: tokens.color.onSurfaceVariant,
              borderRadius: 1,
            }}
          />
        </div>
      </div>
    </div>
  );
}
