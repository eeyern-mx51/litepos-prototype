import tokens from "../theme/tokens";
import TopAppBar from "../components/TopAppBar";
import ListItem from "../components/ListItem";
import FAB from "../components/FAB";
import Icon from "../components/Icon";

const products = [
  { name: "Avo Toast", price: "14.00", fav: false, sku: "AVO-001" },
  { name: "Banana Bread", price: "6.00", fav: false, sku: "BRD-002" },
  { name: "Blueberry Muffin", price: "5.50", fav: true, sku: "MUF-003" },
  { name: "Cappuccino", price: "4.80", fav: true, sku: "CAP-004" },
  { name: "Chai Latte", price: "5.20", fav: false, sku: "CHA-005" },
  { name: "Croissant", price: "4.50", fav: false, sku: "CRO-006" },
  { name: "Flat White", price: "4.50", fav: true, sku: "FLW-007" },
  { name: "Long Black", price: "4.00", fav: false, sku: "LBK-008" },
];

export default function ProductCatalogScreen({ navigate }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", background: tokens.color.bg.surface, minHeight: 0 }}>
      <TopAppBar
        title="Products"
        onBack={() => navigate("litepos-settings")}
        theme="light"
        actions={[{ icon: "search", onPress: () => {} }]}
      />
      <div
        style={{
          padding: "4px 16px 8px",
          fontSize: tokens.type.bodySmall.size,
          color: tokens.color.fg.subtle,
          background: tokens.color.bg.surface,
          flexShrink: 0,
        }}
      >
        {products.length} products · Sorted alphabetically
      </div>
      <div style={{ flex: 1, minHeight: 0, overflow: "auto", background: tokens.color.bg.surface }}>
        <div style={{ margin: "0 16px", background: tokens.color.bg.page, borderRadius: tokens.shape.expressiveLarge, border: `1px solid ${tokens.color.border.onpage}`, overflow: "hidden" }}>
          {products.map((p, i) => (
            <ListItem
              key={i}
              leading={
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: tokens.shape.medium,
                    background: tokens.color.bg.surface,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon name="image" size={20} color={tokens.color.border.onsurface} />
                </div>
              }
              headline={p.name}
              supporting={`$${p.price}${p.sku ? `  ·  ${p.sku}` : ""}`}
              trailing={
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {p.fav && <Icon name="favorite" size={18} color={tokens.color.fg.error.icon} />}
                  <Icon name="chevron" color={tokens.color.fg.subtle} />
                </div>
              }
              onClick={() => navigate("edit-product", p)}
              divider={i < products.length - 1}
            />
          ))}
        </div>
      </div>
      <FAB icon="add" label="Add Product" onClick={() => navigate("add-product")} variant="primary" />
    </div>
  );
}
