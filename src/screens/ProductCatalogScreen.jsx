import tokens from "../theme/tokens";
import TopAppBar from "../components/TopAppBar";
import FAB from "../components/FAB";
import Icon from "../components/Icon";

/**
 * ProductCatalogScreen
 *
 * Two states:
 *   1. EMPTY — new merchant, no products yet. Shows skeleton placeholder cards
 *      as visual examples of what the catalogue will look like, with a
 *      descriptive prompt and prominent Add Product FAB.
 *   2. POPULATED — has products. Shows real product list items.
 *
 * Top bar: back arrow (left) · "Products" title · close ✕ (right, goes home).
 */

export default function ProductCatalogScreen({ navigate, goBack, products = [] }) {
  const hasProducts = products.length > 0;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", background: tokens.color.bg.surface, minHeight: 0 }}>
      <TopAppBar
        title="Products"
        onBack={goBack}
        theme="light"
        actions={[{ icon: "close", onPress: () => navigate("home") }]}
      />

      <div style={{ flex: 1, minHeight: 0, overflow: "auto", background: tokens.color.bg.surface }}>
        {hasProducts ? (
          /* ═══ POPULATED — real product list ═══ */
          <>
            <div
              style={{
                padding: "4px 16px 8px",
                fontSize: tokens.type.bodySmall.size,
                color: tokens.color.fg.subtle,
              }}
            >
              {products.length} products · Sorted alphabetically
            </div>
            <div style={{ margin: "0 16px", background: tokens.color.bg.page, borderRadius: tokens.shape.expressiveLarge, border: `1px solid ${tokens.color.border.onpage}`, overflow: "hidden" }}>
              {[...products].sort((a, b) => a.name.localeCompare(b.name)).map((p, i) => (
                <button
                  key={i}
                  onClick={() => navigate("edit-product", p)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 16px",
                    background: "transparent",
                    border: "none",
                    borderBottom: i < products.length - 1 ? `1px solid ${tokens.color.border.onpage}` : "none",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      width: 44, height: 44, borderRadius: tokens.shape.medium,
                      background: tokens.color.bg.surface,
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}
                  >
                    <Icon name="image" size={20} color={tokens.color.border.onsurface} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: tokens.type.bodyMedium.size, fontWeight: 500,
                      color: tokens.color.fg.emphasis,
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: tokens.type.bodySmall.size, color: tokens.color.fg.subtle, marginTop: 1 }}>
                      ${p.price}{p.cat ? `  ·  ${p.cat}` : ""}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                    {p.fav && <Icon name="favorite" size={16} color={tokens.color.fg.error.icon} />}
                    <Icon name="chevron" size={20} color={tokens.color.fg.subtle} />
                  </div>
                </button>
              ))}
            </div>
            <div style={{ height: 80 }} /> {/* FAB clearance */}
          </>
        ) : (
          /* ═══ EMPTY — skeleton cards + prompt ═══ */
          <div style={{ padding: "8px 16px 80px" }}>
            {/* Descriptor */}
            <div style={{ padding: "12px 0 16px", textAlign: "center" }}>
              <div style={{
                fontSize: tokens.type.titleSmall.size,
                fontWeight: tokens.type.titleSmall.weight,
                color: tokens.color.fg.emphasis,
              }}>
                Your product catalogue
              </div>
              <div style={{
                fontSize: tokens.type.bodySmall.size,
                color: tokens.color.fg.subtle,
                marginTop: 4,
                lineHeight: 1.5,
              }}>
                Add products for quick tap-to-sell checkout.
                They'll appear here and on your home screen.
              </div>
            </div>

            {/* Skeleton product cards */}
            <div style={{
              background: tokens.color.bg.page,
              borderRadius: tokens.shape.expressiveLarge,
              border: `1px solid ${tokens.color.border.onpage}`,
              overflow: "hidden",
            }}>
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 16px",
                    borderBottom: i < 4 ? `1px solid ${tokens.color.border.onpage}` : "none",
                  }}
                >
                  {/* Skeleton image */}
                  <div
                    style={{
                      width: 44, height: 44, borderRadius: tokens.shape.medium,
                      background: tokens.color.bg.surface,
                      flexShrink: 0,
                    }}
                  />
                  {/* Skeleton text lines */}
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                    <div
                      style={{
                        height: 12,
                        borderRadius: 6,
                        background: tokens.color.bg.surface,
                        width: `${55 + (i * 13) % 35}%`,
                      }}
                    />
                    <div
                      style={{
                        height: 10,
                        borderRadius: 5,
                        background: tokens.color.bg.surface,
                        width: `${30 + (i * 7) % 20}%`,
                      }}
                    />
                  </div>
                  {/* Skeleton chevron */}
                  <div
                    style={{
                      width: 20, height: 20, borderRadius: tokens.shape.full,
                      background: tokens.color.bg.surface,
                      flexShrink: 0,
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Hint at bottom */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              padding: "20px 0 0",
              fontSize: tokens.type.bodySmall.size,
              color: tokens.color.fg.subtle,
            }}>
              <Icon name="info" size={16} color={tokens.color.fg.subtle} />
              <span>Tap + to add your first product</span>
            </div>
          </div>
        )}
      </div>

      <FAB icon="add" label="New Product" onClick={() => navigate("add-product")} variant="primary" />
    </div>
  );
}
