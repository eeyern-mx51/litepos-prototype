import tokens from "../theme/tokens";
import TopAppBar from "../components/TopAppBar";
import Icon from "../components/Icon";

const steps = [
  {
    number: 1,
    icon: "print",
    title: "Print barcode from Connect Express",
    description:
      "On your Connect Express terminal, locate the product you'd like to import and print its barcode via the receipt printer.",
  },
  {
    number: 2,
    icon: "scan",
    title: "Scan the barcode on LitePOS",
    description:
      "Use your LitePOS terminal camera to scan the printed barcode. The product details will be pulled in automatically.",
  },
  {
    number: 3,
    icon: "check",
    title: "Review and save",
    description:
      "Check that the product name, price, and category are correct, then tap Save to add it to your catalogue.",
  },
];

export default function ImportProductsScreen({ navigate, goBack }) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: tokens.color.bg.surface,
      }}
    >
      <TopAppBar
        title="Import Products"
        onBack={goBack}
        theme="light"
      />

      <div style={{ flex: 1, overflow: "auto", padding: "8px 0 32px" }}>
        {/* ── Header ──────────────────────────────────── */}
        <div style={{ padding: "12px 20px 24px" }}>
          <div
            style={{
              fontSize: tokens.type.titleMedium.size,
              fontWeight: tokens.type.titleMedium.weight,
              color: tokens.color.fg.emphasis,
              lineHeight: 1.3,
            }}
          >
            Add products from Connect Express
          </div>
          <div
            style={{
              fontSize: tokens.type.bodyMedium.size,
              color: tokens.color.fg.subtle,
              marginTop: 6,
              lineHeight: 1.5,
            }}
          >
            Import your existing product catalogue in three simple steps.
          </div>
        </div>

        {/* ── Steps ───────────────────────────────────── */}
        <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 0 }}>
          {steps.map((step, i) => (
            <div key={step.number} style={{ display: "flex", gap: 16 }}>
              {/* ── Left: number + connector line ──── */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: 36,
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: tokens.shape.full,
                    background: tokens.color.bg.action.primary.default,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: tokens.type.labelLarge.size,
                    fontWeight: 700,
                    color: "#fff",
                    flexShrink: 0,
                  }}
                >
                  {step.number}
                </div>
                {i < steps.length - 1 && (
                  <div
                    style={{
                      width: 2,
                      flex: 1,
                      background: tokens.color.border.onpage,
                      minHeight: 20,
                    }}
                  />
                )}
              </div>

              {/* ── Right: content card ─────────────── */}
              <div
                style={{
                  flex: 1,
                  paddingBottom: i < steps.length - 1 ? 24 : 0,
                }}
              >
                <div
                  style={{
                    background: tokens.color.bg.page,
                    borderRadius: tokens.shape.large,
                    border: `1px solid ${tokens.color.border.onpage}`,
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: tokens.shape.medium,
                        background: `${tokens.color.fg.brand}12`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Icon name={step.icon} size={18} color={tokens.color.fg.brand} />
                    </div>
                    <div
                      style={{
                        fontSize: tokens.type.titleSmall.size,
                        fontWeight: 600,
                        color: tokens.color.fg.emphasis,
                      }}
                    >
                      {step.title}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: tokens.type.bodySmall.size,
                      color: tokens.color.fg.subtle,
                      lineHeight: 1.5,
                      paddingLeft: 42,
                    }}
                  >
                    {step.description}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Start import button ─────────────────────── */}
        <div style={{ padding: "32px 20px 0" }}>
          <button
            onClick={() => navigate("scan")}
            style={{
              width: "100%",
              height: 52,
              borderRadius: tokens.shape.full,
              background: tokens.color.bg.action.primary.default,
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              fontSize: tokens.type.labelLarge.size,
              fontWeight: 600,
              color: "#fff",
            }}
          >
            <Icon name="scan" size={20} color="#fff" />
            Start Scanning
          </button>
        </div>

        {/* ── Hint ────────────────────────────────────── */}
        <div
          style={{
            padding: "16px 20px 0",
            textAlign: "center",
            fontSize: tokens.type.bodySmall.size,
            color: tokens.color.fg.subtle,
            lineHeight: 1.5,
          }}
        >
          You can repeat this process for each product you'd like to import.
        </div>
      </div>
    </div>
  );
}
