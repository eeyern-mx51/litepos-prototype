import { useState, useRef } from "react";
import tokens from "../theme/tokens";
import OrderBar from "../components/OrderBar";
import ProductCard from "../components/ProductCard";
import Icon from "../components/Icon";

// Category tile colours (Square-style)
const catColors = {
  Drinks: { bg: "#E0F2F1", fg: "#00695C" },
  Food: { bg: "#FFF3E0", fg: "#E65100" },
  Favourites: { bg: "#FCE4EC", fg: "#C62828" },
  All: { bg: tokens.color.bg.surface, fg: tokens.color.fg.emphasis },
};


export default function HomeScreen({ navigate, basket, setBasket, products = [] }) {
  const [activeFilter, setActiveFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const searchRef = useRef(null);

  const hasProducts = products.length > 0;
  const categoryList = [...new Set(products.map((p) => p.cat))];

  const handleScan = () => {
    if (!hasProducts) return;
    setScanResult("scanning");
    setTimeout(() => {
      const found = products[Math.floor(Math.random() * products.length)];
      setScanResult(found);
      handleAdd(found);
      setTimeout(() => setScanResult(null), 2000);
    }, 1200);
  };

  const handleAdd = (p) => {
    const existing = basket.find((b) => b.name === p.name);
    if (existing) {
      setBasket(basket.map((b) => (b.name === p.name ? { ...b, qty: b.qty + 1 } : b)));
    } else {
      setBasket([...basket, { name: p.name, price: parseFloat(p.price), qty: 1 }]);
    }
  };

  // Filter logic
  let filtered = products;
  if (activeFilter === "Favourites") {
    filtered = filtered.filter((p) => p.fav);
  } else if (activeFilter && activeFilter !== "All") {
    filtered = filtered.filter((p) => p.cat === activeFilter);
  }
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.price.includes(q)
    );
  }

  const total = basket.reduce((s, b) => s + b.price * b.qty, 0);
  const itemCount = basket.reduce((s, b) => s + b.qty, 0);
  const showCategoryHome = hasProducts && !activeFilter && !searchQuery.trim();

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, position: "relative" }}>

      {/* ── Top bar: menu (left) · settings (right) ───────── */}
      <div
        style={{
          background: tokens.color.bg.brand,
          padding: "6px 4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <button
          onClick={() => navigate("menu")}
          style={{
            width: 48, height: 48, borderRadius: tokens.shape.full,
            border: "none", background: "transparent", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <Icon name="menu" size={24} color={tokens.color.fg.white} />
        </button>

        {activeFilter && !showSearch && (
          <span style={{
            fontSize: tokens.type.titleMedium.size,
            fontWeight: tokens.type.titleMedium.weight,
            color: tokens.color.fg.white,
          }}>
            {activeFilter === "All" ? "All Items" : activeFilter}
          </span>
        )}

        <button
          onClick={() => navigate("litepos-settings")}
          style={{
            width: 48, height: 48, borderRadius: tokens.shape.full,
            border: "none", background: "transparent", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <Icon name="settings" size={24} color={tokens.color.fg.white} />
        </button>
      </div>

      {/* ── Collapsible search bar ────────────────────────── */}
      <div
        style={{
          maxHeight: showSearch ? 72 : 0,
          opacity: showSearch ? 1 : 0,
          overflow: "hidden",
          transition: `max-height ${tokens.motion.duration.medium2} ${tokens.motion.easing.emphasizedDecelerate}, opacity ${tokens.motion.duration.short4} ${tokens.motion.easing.standard}`,
          background: tokens.color.bg.page,
          flexShrink: 0,
        }}
      >
        <div style={{ padding: "8px 16px" }}>
          <div
            style={{
              height: 56,
              borderRadius: tokens.shape.full,
              background: tokens.color.bg.surface,
              display: "flex",
              alignItems: "center",
              padding: "0 8px 0 16px",
              gap: 8,
              boxShadow: searchFocused ? tokens.elevation.level2 : tokens.elevation.level1,
              transition: `box-shadow ${tokens.motion.duration.short4} ${tokens.motion.easing.standard}`,
            }}
          >
            <Icon name="search" size={20} color={tokens.color.fg.subtle} />
            <input
              ref={searchRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search products..."
              style={{
                flex: 1, border: "none", outline: "none", background: "transparent",
                fontSize: tokens.type.bodyLarge.size, lineHeight: tokens.type.bodyLarge.lineHeight,
                letterSpacing: tokens.type.bodyLarge.tracking, color: tokens.color.fg.emphasis,
                fontFamily: "inherit", padding: 0, height: "100%",
              }}
            />
            {searchQuery ? (
              <button
                onClick={() => { setSearchQuery(""); searchRef.current?.focus(); }}
                style={{
                  width: 40, height: 40, borderRadius: tokens.shape.full, border: "none",
                  background: "transparent", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}
              >
                <Icon name="close" size={20} color={tokens.color.fg.subtle} />
              </button>
            ) : (
              <button
                onClick={handleScan}
                disabled={scanResult === "scanning"}
                style={{
                  width: 40, height: 40, borderRadius: tokens.shape.full, border: "none",
                  background: "transparent", cursor: scanResult === "scanning" ? "wait" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}
              >
                <Icon name="scan" size={20} color={scanResult === "scanning" ? tokens.color.fg.brand : tokens.color.fg.subtle} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Content area ──────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflow: "auto",
          background: tokens.color.bg.page,
        }}
      >
        {!hasProducts ? (
          /* ══════════════════════════════════════════════════
             EMPTY STATE — no products configured yet.
             Keypad is the primary action. Nudge to set up catalogue.
             ══════════════════════════════════════════════════ */
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "32px 24px",
              gap: 0,
              height: "100%",
            }}
          >
            {/* Keypad hero */}
            <button
              onClick={() => navigate("keypad")}
              style={{
                width: "100%",
                padding: "28px 20px",
                borderRadius: tokens.shape.expressiveLarge,
                background: tokens.color.bg.action.primary.default,
                border: "none",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 56, height: 56, borderRadius: tokens.shape.full,
                  background: "rgba(255,255,255,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <Icon name="keypad" size={28} color={tokens.color.fg.onAction} />
              </div>
              <span style={{ fontSize: tokens.type.titleMedium.size, fontWeight: tokens.type.titleMedium.weight, color: tokens.color.fg.onAction }}>
                Enter Amount
              </span>
              <span style={{ fontSize: tokens.type.bodySmall.size, color: "rgba(255,255,255,0.7)" }}>
                Key in a sale amount to get started
              </span>
            </button>

            <div style={{ flex: 1, minHeight: 24 }} />

            {/* Set up products nudge */}
            <button
              onClick={() => navigate("product-catalog")}
              style={{
                width: "100%", padding: "16px 20px", borderRadius: tokens.shape.large,
                background: tokens.color.bg.surface, border: `1px solid ${tokens.color.border.onpage}`,
                cursor: "pointer", display: "flex", alignItems: "center", gap: 14, textAlign: "left",
              }}
            >
              <div
                style={{
                  width: 44, height: 44, borderRadius: tokens.shape.medium,
                  background: tokens.color.bg.page, border: `1px solid ${tokens.color.border.onpage}`,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}
              >
                <Icon name="add" size={22} color={tokens.color.fg.brand} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: tokens.type.titleSmall.size, fontWeight: tokens.type.titleSmall.weight, color: tokens.color.fg.emphasis }}>
                  Set up products
                </div>
                <div style={{ fontSize: tokens.type.bodySmall.size, color: tokens.color.fg.subtle, marginTop: 2 }}>
                  Add items for faster checkout with tap-to-sell
                </div>
              </div>
              <Icon name="chevron" size={20} color={tokens.color.fg.subtle} />
            </button>
          </div>
        ) : showCategoryHome ? (
          /* ══════════════════════════════════════════════════
             CATEGORY HOME — tiles grid with manual entry + search
             ══════════════════════════════════════════════════ */
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              padding: "12px 16px 16px",
            }}
          >
            {/* Manual Entry tile — always first, prominent */}
            <CategoryTile
              label="Manual Entry"
              subtitle="Key in amount"
              color={{ bg: tokens.color.bg.brand, fg: tokens.color.fg.white }}
              icon="keypad"
              onClick={() => navigate("keypad")}
            />

            {/* Search tile */}
            <CategoryTile
              label="Search"
              subtitle="Find a product"
              color={{ bg: tokens.color.bg.surface, fg: tokens.color.fg.emphasis }}
              icon="search"
              onClick={() => {
                setShowSearch(true);
                setTimeout(() => searchRef.current?.focus(), 100);
              }}
            />

            {/* Category tiles */}
            {products.some((p) => p.fav) && (
              <CategoryTile
                label="Favourites"
                count={products.filter((p) => p.fav).length}
                color={catColors.Favourites}
                icon="favorite"
                onClick={() => setActiveFilter("Favourites")}
              />
            )}
            {categoryList.map((cat) => (
              <CategoryTile
                key={cat}
                label={cat}
                count={products.filter((p) => p.cat === cat).length}
                color={catColors[cat] || { bg: "#E8EAF6", fg: "#283593" }}
                onClick={() => setActiveFilter(cat)}
              />
            ))}
            <CategoryTile
              label="All Items"
              count={products.length}
              color={catColors.All}
              onClick={() => setActiveFilter("All")}
            />

            {/* Popular quick access */}
            {products.some((p) => p.fav) && (
              <>
                <div
                  style={{
                    gridColumn: "1 / -1",
                    padding: "8px 0 4px",
                    fontSize: tokens.type.labelLarge.size,
                    fontWeight: tokens.type.labelLarge.weight,
                    color: tokens.color.fg.subtle,
                  }}
                >
                  Popular
                </div>
                {products
                  .filter((p) => p.fav)
                  .map((p, i) => (
                    <ProductCard key={i} name={p.name} price={p.price} isFav={p.fav} onClick={() => handleAdd(p)} />
                  ))}
              </>
            )}
          </div>
        ) : filtered.length > 0 ? (
          /* ══════════════════════════════════════════════════
             DRILLED-IN — viewing a category or search results
             ══════════════════════════════════════════════════ */
          <div>
            {activeFilter && !searchQuery.trim() && (
              <button
                onClick={() => setActiveFilter(null)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "10px 16px", background: "transparent", border: "none",
                  cursor: "pointer", fontSize: tokens.type.labelLarge.size,
                  fontWeight: tokens.type.labelLarge.weight, color: tokens.color.fg.brand,
                  width: "100%",
                }}
              >
                <Icon name="back" size={18} color={tokens.color.fg.brand} />
                All Categories
              </button>
            )}
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
          </div>
        ) : (
          /* ── Search/filter empty state ────────────────── */
          <div
            style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", padding: "48px 32px", gap: 12,
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

      {/* ── Scan feedback toast ────────────────────────────── */}
      {scanResult && (
        <div
          style={{
            position: "absolute", bottom: 100, left: 16, right: 16,
            background: scanResult === "scanning" ? tokens.color.bg.snackbar : tokens.color.bg.action.primary.default,
            borderRadius: tokens.shape.medium, padding: "12px 16px",
            display: "flex", alignItems: "center", gap: 10,
            zIndex: 10, boxShadow: tokens.elevation.level3,
          }}
        >
          <Icon name={scanResult === "scanning" ? "scan" : "check"} size={20} color={tokens.color.fg.white} />
          <span style={{ fontSize: tokens.type.bodyMedium.size, color: tokens.color.fg.white, fontWeight: 500 }}>
            {scanResult === "scanning"
              ? "Scanning barcode..."
              : `Added ${scanResult.name} — $${scanResult.price}`}
          </span>
        </div>
      )}

      {/* ── Order bar ──────────────────────────────────────── */}
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


/**
 * CategoryTile — Square/Clover-style coloured tile in the grid.
 * Supports both category tiles (with count) and action tiles (with subtitle).
 */
function CategoryTile({ label, count, subtitle, color, icon, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        height: 88,
        borderRadius: tokens.shape.large,
        background: color.bg,
        border: "none",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",
        padding: "12px 14px",
        transition: `transform ${tokens.motion.duration.short4} ${tokens.motion.easing.standard}`,
      }}
    >
      {icon && (
        <Icon name={icon} size={20} color={color.fg} style={{ opacity: 0.8 }} />
      )}
      <div>
        <div style={{ fontSize: tokens.type.titleSmall.size, fontWeight: 600, color: color.fg }}>
          {label}
        </div>
        <div style={{ fontSize: tokens.type.bodySmall.size, color: color.fg, opacity: 0.7, marginTop: 1 }}>
          {subtitle || (count !== undefined ? `${count} ${count === 1 ? "item" : "items"}` : "")}
        </div>
      </div>
    </button>
  );
}
