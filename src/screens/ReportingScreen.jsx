import { useState } from "react";
import tokens from "../theme/tokens";
import TopAppBar from "../components/TopAppBar";
import Card from "../components/Card";

export default function ReportingScreen({ navigate }) {
  const [tab, setTab] = useState("transactions");

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: tokens.color.bg.page }}>
      <TopAppBar
        title="Sales Report"
        onBack={() => navigate("menu")}
        theme="light"
        actions={[{ icon: "print", onPress: () => {} }]}
      />

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: `1px solid ${tokens.color.border.onpage}`, background: tokens.color.bg.page }}>
        {["transactions", "items"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1,
              padding: "12px 0",
              background: "none",
              border: "none",
              borderBottom:
                tab === t
                  ? `3px solid ${tokens.color.fg.brand}`
                  : "3px solid transparent",
              fontSize: tokens.type.titleSmall.size,
              fontWeight: tab === t ? 700 : 500,
              color: tab === t ? tokens.color.fg.brand : tokens.color.fg.subtle,
              cursor: "pointer",
              transition: `all ${tokens.motion.duration.short4} ${tokens.motion.easing.standard}`,
              textTransform: "capitalize",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <div
        style={{
          flex: 1,
          overflow: "auto",
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          background: tokens.color.bg.page,
        }}
      >
        {tab === "transactions" ? (
          <>
            <Card variant="outlined">
              <div
                style={{
                  fontSize: tokens.type.labelMedium.size,
                  color: tokens.color.fg.subtle,
                }}
              >
                Total Sales
              </div>
              <div
                style={{
                  fontSize: tokens.type.headlineLarge.size,
                  fontWeight: 700,
                  color: tokens.color.fg.brand,
                }}
              >
                $1,247.50
              </div>
            </Card>
            <Card variant="outlined">
              <div
                style={{
                  fontSize: tokens.type.labelMedium.size,
                  color: tokens.color.fg.subtle,
                }}
              >
                Transactions
              </div>
              <div style={{ fontSize: tokens.type.headlineMedium.size, fontWeight: 600, color: tokens.color.fg.emphasis }}>42</div>
            </Card>
            <Card variant="outlined">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <div
                    style={{
                      fontSize: tokens.type.labelMedium.size,
                      color: tokens.color.fg.subtle,
                    }}
                  >
                    Tips
                  </div>
                  <div style={{ fontSize: tokens.type.titleLarge.size, fontWeight: 600, color: tokens.color.fg.emphasis }}>
                    $86.20
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: tokens.type.labelMedium.size,
                      color: tokens.color.fg.subtle,
                    }}
                  >
                    Surcharges
                  </div>
                  <div style={{ fontSize: tokens.type.titleLarge.size, fontWeight: 600, color: tokens.color.fg.emphasis }}>
                    $12.40
                  </div>
                </div>
              </div>
            </Card>
          </>
        ) : (
          <>
            <Card variant="outlined">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <div
                    style={{
                      fontSize: tokens.type.labelMedium.size,
                      color: tokens.color.fg.subtle,
                    }}
                  >
                    Item Revenue
                  </div>
                  <div
                    style={{
                      fontSize: tokens.type.headlineLarge.size,
                      fontWeight: 700,
                      color: tokens.color.fg.brand,
                    }}
                  >
                    $1,148.90
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: tokens.type.labelMedium.size,
                      color: tokens.color.fg.subtle,
                    }}
                  >
                    Items Sold
                  </div>
                  <div style={{ fontSize: tokens.type.headlineLarge.size, fontWeight: 700, color: tokens.color.fg.emphasis }}>
                    187
                  </div>
                </div>
              </div>
            </Card>
            {[
              { name: "Flat White", qty: 38, rev: "$171.00" },
              { name: "Cappuccino", qty: 31, rev: "$148.80" },
              { name: "Blueberry Muffin", qty: 24, rev: "$132.00" },
            ].map((item, i) => (
              <Card key={i} variant="filled" style={{ padding: "12px 16px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ fontSize: tokens.type.bodyLarge.size, fontWeight: 500, color: tokens.color.fg.emphasis }}>
                      {item.name}
                    </div>
                    <div
                      style={{
                        fontSize: tokens.type.bodySmall.size,
                        color: tokens.color.fg.subtle,
                      }}
                    >
                      {item.qty} sold
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: tokens.type.titleMedium.size,
                      fontWeight: 600,
                      color: tokens.color.fg.brand,
                    }}
                  >
                    {item.rev}
                  </span>
                </div>
              </Card>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
