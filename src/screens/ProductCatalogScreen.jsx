import tokens from "../theme/tokens";
import TopAppBar from "../components/TopAppBar";
import ListItem from "../components/ListItem";
import FAB from "../components/FAB";
import Icon from "../components/Icon";

const products = [
  { name: "Avo Toast", price: "14.00", fav: false },
  { name: "Banana Bread", price: "6.00", fav: false },
  { name: "Blueberry Muffin", price: "5.50", fav: true },
  { name: "Cappuccino", price: "4.80", fav: true },
  { name: "Chai Latte", price: "5.20", fav: false },
  { name: "Croissant", price: "4.50", fav: false },
  { name: "Flat White", price: "4.50", fav: true },
  { name: "Long Black", price: "4.00", fav: false },
];

export default function ProductCatalogScreen({ navigate }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", background: tokens.color.bg.page }}>
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
          background: tokens.color.bg.page,
        }}
      >
        {products.length} products · Sorted alphabetically
      </div>
      <div style={{ flex: 1, overflow: "auto", background: tokens.color.bg.page }}>
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
                <Icon name="image" size={20} color={tokens.color.border.onpage} />
              </div>
            }
            headline={p.name}
            supporting={`$${p.price}`}
            trailing={
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {p.fav && <Icon name="favorite" size={18} color={tokens.color.fg.error.icon} />}
                <Icon name="chevron" color={tokens.color.fg.subtle} />
              </div>
            }
            divider={i < products.length - 1}
          />
        ))}
      </div>
      <FAB icon="add" label="Add Product" onClick={() => {}} variant="primary" />
    </div>
  );
}
