import tokens from "../theme/tokens";
import TopAppBar from "../components/TopAppBar";
import Chip from "../components/Chip";
import ProductCard from "../components/ProductCard";
import BasketBanner from "../components/BasketBanner";
import FAB from "../components/FAB";

const products = [
  { name: "Flat White", price: "4.50", fav: true },
  { name: "Cappuccino", price: "4.80", fav: true },
  { name: "Long Black", price: "4.00", fav: false },
  { name: "Chai Latte", price: "5.20", fav: false },
  { name: "Blueberry Muffin", price: "5.50", fav: true },
  { name: "Banana Bread", price: "6.00", fav: false },
  { name: "Croissant", price: "4.50", fav: false },
  { name: "Avo Toast", price: "14.00", fav: false },
];

export default function HomeScreen({ navigate, basket, setBasket }) {
  const handleAdd = (p) => {
    const existing = basket.find((b) => b.name === p.name);
    if (existing) {
      setBasket(basket.map((b) => (b.name === p.name ? { ...b, qty: b.qty + 1 } : b)));
    } else {
      setBasket([...basket, { name: p.name, price: parseFloat(p.price), qty: 1 }]);
    }
  };

  const total = basket.reduce((s, b) => s + b.price * b.qty, 0);
  const itemCount = basket.reduce((s, b) => s + b.qty, 0);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
      <TopAppBar
        title="Gecko Bank"
        variant="small"
        actions={[
          { icon: "search", onPress: () => {} },
          { icon: "scan", onPress: () => {} },
        ]}
      />

      {/* Filter chips */}
      <div style={{ display: "flex", gap: 8, padding: "8px 16px", overflow: "auto" }}>
        <Chip label="All" selected />
        <Chip label="Favourites" />
        <Chip label="Drinks" />
        <Chip label="Food" />
      </div>

      {/* Product grid */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          padding: "8px 12px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          alignContent: "start",
        }}
      >
        {products.map((p, i) => (
          <ProductCard key={i} name={p.name} price={p.price} isFav={p.fav} onClick={() => handleAdd(p)} />
        ))}
      </div>

      {/* Basket banner */}
      <BasketBanner itemCount={itemCount} total={total} onClick={() => navigate("basket")} />

      {/* Keypad FAB */}
      <FAB icon="keypad" onClick={() => navigate("keypad")} variant="tertiary" />
    </div>
  );
}
