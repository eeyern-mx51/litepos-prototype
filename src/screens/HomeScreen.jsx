import { useState, useRef } from "react";
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


export default function HomeScreen({ navigate, basket, setBasket }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef(null);

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

      {/* ── Layer 1: Navy top bar — navigation only ─────────── */}
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
        {/* Left: Menu icon */}
        <button
          onClick={() => navigate("menu")}
          style={{
            width: 40,
            height: 40,
            borderRadius: tokens.shape.full,
            border: "none",
            background: "rgba(255,255,255,0.15)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="menu" size={20} color={tokens.color.fg.white} />
        </button>

        {/* Right: Settings shortcut */}
        <button
          onClick={() => navigate("litepos-settings")}
          style={{
            width: 40,
            height: 40,
            borderRadius: tokens.shape.full,
            border: "none",
            background: "rgba(255,255,255,0.15)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="settings" size={20} color={tokens.color.fg.white} />
        </button>
      </div>

      {/* ── Layer 2: Search bar + Keypad — input methods ─────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 16px",
          background: tokens.color.bg.page,
          flexShrink: 0,
        }}
      >
        {/* Search field with embedded scan icon */}
        <div
          style={{
            flex: 1,
            height: 44,
            borderRadius: tokens.shape.full,
            border: `1.5px solid ${searchFocused ? tokens.color.border.action.default : tokens.color.border.onpage}`,
            background: tokens.color.bg.surface,
            display: "flex",
            alignItems: "center",
            padding: "0 4px 0 14px",
            gap: 8,
            transition: `border-color ${tokens.motion.duration.short4} ${tokens.motion.easing.standard}`,
          }}
        >
          <Icon name="search" size={18} color={tokens.color.fg.subtle} />
          <input
            ref={searchRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Search products..."
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: tokens.type.bodyMedium.size,
              color: tokens.color.fg.emphasis,
              fontFamily: "inherit",
              padding: 0,
              height: "100%",
            }}
          />
          {searchQuery ? (
            <button
              onClick={() => { setSearchQuery(""); searchRef.current?.focus(); }}
              style={{
                width: 32, height: 32,
                borderRadius: tokens.shape.full,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Icon name="close" size={16} color={tokens.color.fg.subtle} />
            </button>
          ) : (
            <button
              onClick={() => {}}
              style={{
                width: 32, height: 32,
                borderRadius: tokens.shape.full,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Icon name="scan" size={18} color={tokens.color.fg.subtle} />
            </button>
          )}
        </div>

        {/* Keypad button — anchored right of search */}
        <button
          onClick={() => navigate("keypad")}
          style={{
            width: 44,
            height: 44,
            borderRadius: tokens.shape.full,
            border: `2px solid ${tokens.color.fg.brand}`,
            background: "transparent",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: `all ${tokens.motion.duration.short4} ${tokens.motion.easing.standard}`,
          }}
        >
          <Icon name="keypad" size={20} color={tokens.color.fg.brand} />
        </button>
      </div>

      {/* ── Layer 3: Filter chips ───────────────────────────── */}
      <div style={{ display: "flex", gap: 8, padding: "4px 16px 8px", overflow: "auto", flexShrink: 0, background: tokens.color.bg.page }}>
        {categories.map((cat) => (
          <Chip
            key={cat}
            label={cat}
            selected={activeFilter === cat}
            onClick={() => setActiveFilter(cat)}
          />
        ))}
      </div>

      {/* ── Layer 4: Product grid ───────────────────────────── */}
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
              padding: "4px 16px 16px",
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
              padding: "48px 32px",
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

      {/* ── Layer 5: Order bar ──────────────────────────────── */}
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
