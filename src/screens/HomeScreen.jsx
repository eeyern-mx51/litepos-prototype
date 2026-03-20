import { useState } from "react";
import tokens from "../theme/tokens";
import OrderBar from "../components/OrderBar";
import Chip from "../components/Chip";
import ProductCard from "../components/ProductCard";
import Icon from "../components/Icon";

const products = [
  { name: "Flat White", price: "4.50", fav: true, cat: "Drinks" },
  { name: "Cappuccino", price: "4.80", fav: true, cat: "Drinks" },
  { name: "Long Black", price: "4.00", fav: false, cat: "Drinks" },
  { name: "Chai Latte", price: "5.20", fav: false, cat: "Drinks" },
  { name: "Blueberry Muffin", price: "5.50", fav: true, cat: "Food" },
  { name: "Banana Bread", price: "6.00", fav: false, cat: "Food" },
  { name: "Croissant", price: "4.50", fav: false, cat: "Food" },
  { name: "Avo Toast", price: "14.00", fav: false, cat: "Food" },
];

const categories = ["All", "Favourites", "Drinks", "Food"];

/**
 * NavPill — pill-shaped navigation button matching existing mx51 app pattern.
 * Navy bg top bar with white pill buttons for Menu / Other actions.
 */
function NavPill({ icon, label, onClick, variant = "default" }) {
  const isPrimary = variant === "primary";
  return (
    <button
      onClick={onClick}
      style={{
        height: 40,
        borderRadius: tokens.shape.full,
        border: "none",
        background: tokens.color.fg.white,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "0 16px",
        transition: `all ${tokens.motion.duration.short4} ${tokens.motion.easing.standard}`,
      }}
    >
      {icon && <Icon name={icon} size={18} color={isPrimary ? tokens.color.fg.brand : tokens.color.fg.emphasis} />}
      <span
        style={{
          fontSize: tokens.type.labelLarge.size,
          fontWeight: 600,
          color: isPrimary ? tokens.color.fg.brand : tokens.color.fg.emphasis,
        }}
      >
        {label}
      </span>
    </button>
  );
}

export default function HomeScreen({ navigate, basket, setBasket }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAdd = (p) => {
    const existing = basket.find((b) => b.name === p.name);
    if (existing) {
      setBasket(basket.map((b) => (b.name === p.name ? { ...b, qty: b.qty + 1 } : b)));
    } else {
      setBasket([...basket, { name: p.name, price: parseFloat(p.price), qty: 1 }]);
    }
  };

  // Filter products
  let filtered = products;
  if (activeFilter === "Favourites") {
    filtered = filtered.filter((p) => p.fav);
  } else if (activeFilter !== "All") {
    filtered = filtered.filter((p) => p.cat === activeFilter);
  }

  // Search
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (p) => p.name.toLowerCase().includes(q) || p.price.includes(q)
    );
  }

  const total = basket.reduce((s, b) => s + b.price * b.qty, 0);
  const itemCount = basket.reduce((s, b) => s + b.qty, 0);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>

      {/* ── Top nav bar (matches existing mx51 app) ──────────── */}
      {searchOpen ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 8px 8px 4px",
            background: tokens.color.bg.brand,
            flexShrink: 0,
          }}
        >
          <button
            onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
            style={{
              width: 40, height: 40,
              borderRadius: tokens.shape.full,
              border: "none", background: "none",
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <Icon name="close" size={20} color={tokens.color.fg.white} />
          </button>
          <input
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            style={{
              flex: 1,
              height: 40,
              borderRadius: tokens.shape.full,
              border: "none",
              padding: "0 16px",
              fontSize: tokens.type.bodyMedium.size,
              color: tokens.color.fg.emphasis,
              background: tokens.color.fg.white,
              outline: "none",
              fontFamily: "inherit",
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              style={{
                width: 40, height: 40,
                borderRadius: tokens.shape.full,
                border: "none", background: "none",
                cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <Icon name="back" size={18} color={tokens.color.fg.white} />
            </button>
          )}
        </div>
      ) : (
        <div
          style={{
            background: tokens.color.bg.brand,
            padding: "10px 12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          {/* Left: Menu pill */}
          <NavPill icon="menu" label="Menu" onClick={() => navigate("menu")} />

          {/* Centre: brand mark or payment logos placeholder */}
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: tokens.shape.full,
                background: tokens.color.fg.brand,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name="store" size={16} color={tokens.color.fg.white} />
            </div>
          </div>

          {/* Right: action pills */}
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => setSearchOpen(true)}
              style={{
                width: 40, height: 40,
                borderRadius: tokens.shape.full,
                border: "none",
                background: "rgba(255,255,255,0.15)",
                cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <Icon name="search" size={20} color={tokens.color.fg.white} />
            </button>
            <NavPill icon="keypad" label="Keypad" onClick={() => navigate("keypad")} variant="primary" />
          </div>
        </div>
      )}

      {/* Filter chips */}
      <div style={{ display: "flex", gap: 8, padding: "8px 16px", overflow: "auto", flexShrink: 0, background: tokens.color.bg.page }}>
        {categories.map((cat) => (
          <Chip
            key={cat}
            label={cat}
            selected={activeFilter === cat}
            onClick={() => setActiveFilter(cat)}
          />
        ))}
      </div>

      {/* Product grid — scrollable, constrained by flex parent */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflow: "auto",
          background: tokens.color.bg.page,
        }}
      >
        {filtered.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              padding: "8px 16px 16px",
            }}
          >
            {filtered.map((p, i) => (
              <ProductCard key={i} name={p.name} price={p.price} isFav={p.fav} onClick={() => handleAdd(p)} />
            ))}
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "64px 32px",
              gap: 12,
            }}
          >
            <Icon name="search" size={40} color={tokens.color.border.onpage} />
            <div style={{ fontSize: tokens.type.bodyLarge.size, color: tokens.color.fg.subtle, textAlign: "center" }}>
              {searchQuery
                ? `No products matching "${searchQuery}"`
                : `No products in ${activeFilter}`}
            </div>
          </div>
        )}
      </div>

      {/* Fixed bottom order bar — idle shows terminal info, active shows basket */}
      <div style={{ flexShrink: 0 }}>
        <OrderBar
          itemCount={itemCount}
          total={total}
          onCharge={() => navigate("basket")}
        />
      </div>
    </div>
  );
}
