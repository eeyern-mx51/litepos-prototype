import tokens from "../theme/tokens";
import TopAppBar from "../components/TopAppBar";
import Card from "../components/Card";

export default function KeypadScreen({ navigate }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <TopAppBar title="Manual Entry" onBack={() => navigate("home")} />
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          padding: 24,
        }}
      >
        <div
          style={{
            fontSize: tokens.type.displayLarge.size,
            fontWeight: 300,
            color: tokens.color.onSurface,
          }}
        >
          $0.00
        </div>

        <input
          placeholder="Item description (optional)"
          style={{
            width: "100%",
            maxWidth: 280,
            height: 48,
            borderRadius: tokens.shape.extraLarge,
            border: `1px solid ${tokens.color.outline}`,
            padding: "0 16px",
            fontSize: tokens.type.bodyLarge.size,
            background: tokens.color.surfaceContainerLow,
            color: tokens.color.onSurface,
            textAlign: "center",
            outline: "none",
          }}
        />

        <Card
          variant="filled"
          style={{
            width: "100%",
            maxWidth: 280,
            padding: 12,
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 8,
          }}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, ".", 0, "⌫"].map((k) => (
            <button
              key={k}
              style={{
                height: 52,
                borderRadius: tokens.shape.full,
                border: "none",
                background: tokens.color.surfaceContainerLow,
                fontSize: tokens.type.titleLarge.size,
                fontWeight: 500,
                color: tokens.color.onSurface,
                cursor: "pointer",
              }}
            >
              {k}
            </button>
          ))}
        </Card>

        <button
          style={{
            width: "100%",
            maxWidth: 280,
            height: 56,
            borderRadius: tokens.shape.full,
            background: tokens.color.primary,
            color: tokens.color.onPrimary,
            border: "none",
            fontSize: tokens.type.labelLarge.size,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Add to Basket
        </button>
      </div>
    </div>
  );
}
