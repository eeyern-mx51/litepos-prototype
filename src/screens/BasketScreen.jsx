import tokens from "../theme/tokens";
import TopAppBar from "../components/TopAppBar";
import ListItem from "../components/ListItem";
import Icon from "../components/Icon";

export default function BasketScreen({ navigate, basket, setBasket }) {
  const total = basket.reduce((s, b) => s + b.price * b.qty, 0);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <TopAppBar
        title="Basket"
        onBack={() => navigate("home")}
        actions={[{ icon: "delete", onPress: () => setBasket([]) }]}
      />
      <div style={{ flex: 1, overflow: "auto" }}>
        {basket.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: tokens.color.onSurfaceVariant,
              gap: 8,
            }}
          >
            <Icon name="cart" size={48} color={tokens.color.outlineVariant} />
            <span style={{ fontSize: tokens.type.bodyLarge.size }}>Basket is empty</span>
          </div>
        ) : (
          basket.map((item, i) => (
            <ListItem
              key={i}
              headline={item.name}
              supporting={`Qty: ${item.qty}`}
              trailing={
                <span
                  style={{
                    fontSize: tokens.type.titleMedium.size,
                    fontWeight: 600,
                    color: tokens.color.primary,
                  }}
                >
                  ${(item.price * item.qty).toFixed(2)}
                </span>
              }
            />
          ))
        )}
      </div>
      {basket.length > 0 && (
        <div style={{ padding: 16, borderTop: `1px solid ${tokens.color.outlineVariant}` }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 16,
              fontSize: tokens.type.headlineSmall.size,
              fontWeight: 600,
            }}
          >
            <span>Total</span>
            <span style={{ color: tokens.color.primary }}>${total.toFixed(2)}</span>
          </div>
          <button
            style={{
              width: "100%",
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
            Proceed to Payment
          </button>
        </div>
      )}
    </div>
  );
}
