import tokens from "../theme/tokens";
import TopAppBar from "../components/TopAppBar";
import ListItem from "../components/ListItem";
import Icon from "../components/Icon";

export default function BasketScreen({ navigate, goBack, basket, setBasket }) {
  const total = basket.reduce((s, b) => s + b.price * b.qty, 0);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: tokens.color.bg.page }}>
      <TopAppBar
        title="Basket"
        onBack={goBack}
        theme="light"
        actions={basket.length > 0
          ? [{ icon: "delete", onPress: () => setBasket([]) }]
          : [{ icon: "close", onPress: () => navigate("home") }]}
      />
      <div style={{ flex: 1, overflow: "auto", background: tokens.color.bg.page }}>
        {basket.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: tokens.color.fg.subtle,
              gap: 12,
            }}
          >
            <Icon name="cart" size={48} color={tokens.color.border.onpage} />
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
                    color: tokens.color.fg.brand,
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
        <div style={{ padding: 16, borderTop: `1px solid ${tokens.color.border.action.default}`, background: tokens.color.bg.page }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 16,
              fontSize: tokens.type.headlineSmall.size,
              fontWeight: 600,
            }}
          >
            <span style={{ color: tokens.color.fg.emphasis }}>Total</span>
            <span style={{ color: tokens.color.fg.brand }}>${total.toFixed(2)}</span>
          </div>
          <button
            style={{
              width: "100%",
              height: 56,
              borderRadius: tokens.shape.full,
              background: tokens.color.bg.action.primary.default,
              color: tokens.color.fg.onAction,
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
