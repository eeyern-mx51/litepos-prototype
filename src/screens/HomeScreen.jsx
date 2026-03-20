import { useState, useRef } from "react";
import tokens from "../theme/tokens";
import OrderBar from "../components/OrderBar";
import ProductCard from "../components/ProductCard";
import Icon from "../components/Icon";


export default function HomeScreen({ navigate, basket, setBasket, products = [] }) {
  const [activeFilter, setActiveFilter] = useState("Favourites");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const searchRef = useRef(null);

  const hasProducts = products.length > 0;
  const categoryList = ["Favourites", ...new Set(products.map((p) => p.cat)), "All Items"];

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

  const openSearch = () => {
    setSearchActive(true);
    setDropdownOpen(false);
    setTimeout(() => searchRef.current?.focus(), 80);
  };

  const closeSearch = () => {
    setSearchActive(false);
    setSearchQuery("");
  };

  // Filter logic — search always spans ALL items; category filter only when search is closed
  let filtered = products;
  if (searchActive) {
    // When search is open, always work against full product list
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = products.filter(
        (p) => p.name.toLowerCase().includes(q) || p.price.includes(q)
      );
    }
    // else: search open but empty query → show all items
  } else if (activeFilter === "Favourites") {
    filtered = filtered.filter((p) => p.fav);
  } else if (activeFilter !== "All Items") {
    filtered = filtered.filter((p) => p.cat === activeFilter);
  }

  const total = basket.reduce((s, b) => s + b.price * b.qty, 0);
  const itemCount = basket.reduce((s, b) => s + b.qty, 0);

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

      {hasProducts && (
        /* ── Filter row: category dropdown | search icon ── */
        /* When search is active, the search input spans the full row */
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "8px 12px 8px 16px",
            background: tokens.color.bg.page,
            flexShrink: 0,
            gap: 8,
            position: "relative",
          }}
        >
          {searchActive ? (
            /* ── Expanded search bar (covers full row) ──── */
            <div
              style={{
                flex: 1,
                height: 44,
                borderRadius: tokens.shape.full,
                background: tokens.color.bg.surface,
                display: "flex",
                alignItems: "center",
                padding: "0 4px 0 14px",
                gap: 8,
                boxShadow: tokens.elevation.level1,
              }}
            >
              <button
                onClick={closeSearch}
                style={{
                  width: 36, height: 36, borderRadius: tokens.shape.full, border: "none",
                  background: "transparent", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}
              >
                <Icon name="back" size={20} color={tokens.color.fg.subtle} />
              </button>
              <input
                ref={searchRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search all products..."
                style={{
                  flex: 1, border: "none", outline: "none", background: "transparent",
                  fontSize: tokens.type.bodyLarge.size, color: tokens.color.fg.emphasis,
                  fontFamily: "inherit", padding: 0, height: "100%",
                }}
              />
              {searchQuery ? (
                <button
                  onClick={() => { setSearchQuery(""); searchRef.current?.focus(); }}
                  style={{
                    width: 36, height: 36, borderRadius: tokens.shape.full, border: "none",
                    background: "transparent", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}
                >
                  <Icon name="close" size={18} color={tokens.color.fg.subtle} />
                </button>
              ) : null}
              <button
                onClick={handleScan}
                disabled={scanResult === "scanning"}
                style={{
                  width: 36, height: 36, borderRadius: tokens.shape.full, border: "none",
                  background: "transparent", cursor: scanResult === "scanning" ? "wait" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}
              >
                <Icon name="scan" size={18} color={scanResult === "scanning" ? tokens.color.fg.brand : tokens.color.fg.subtle} />
              </button>
            </div>
          ) : (
            /* ── Default: Category dropdown + search icon ── */
            <>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  display: "flex", alignItems: "center", gap: 4,
                  background: "transparent", border: "none", cursor: "pointer",
                  padding: "8px 0",
                }}
              >
                <span style={{
                  fontSize: tokens.type.titleSmall.size,
                  fontWeight: 600,
                  color: tokens.color.fg.brand,
                }}>
                  {activeFilter}
                </span>
                <Icon name="expand-more" size={20} color={tokens.color.fg.brand} />
              </button>
              <div style={{ flex: 1 }} />
              <button
                onClick={openSearch}
                style={{
                  width: 44, height: 44, borderRadius: tokens.shape.full, border: "none",
                  background: "transparent", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <Icon name="search" size={22} color={tokens.color.fg.subtle} />
              </button>
            </>
          )}

          {/* ── Dropdown menu ──────────────────────────── */}
          {dropdownOpen && (
            <>
              {/* Backdrop */}
              <div
                onClick={() => setDropdownOpen(false)}
                style={{
                  position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 19,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 16,
                  zIndex: 20,
                  background: tokens.color.bg.page,
                  borderRadius: tokens.shape.medium,
                  boxShadow: tokens.elevation.level3,
                  border: `1px solid ${tokens.color.border.onpage}`,
                  minWidth: 180,
                  overflow: "hidden",
                }}
              >
                {categoryList.map((cat) => {
                  const isActive = cat === activeFilter;
                  const count = cat === "Favourites"
                    ? products.filter((p) => p.fav).length
                    : cat === "All Items"
                    ? products.length
                    : products.filter((p) => p.cat === cat).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => { setActiveFilter(cat); setDropdownOpen(false); }}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "12px 16px",
                        border: "none",
                        background: isActive ? tokens.color.bg.surface : "transparent",
                        cursor: "pointer",
                        fontSize: tokens.type.bodyMedium.size,
                        fontWeight: isActive ? 600 : 400,
                        color: isActive ? tokens.color.fg.brand : tokens.color.fg.emphasis,
                      }}
                    >
                      <span>{cat}</span>
                      <span style={{ fontSize: tokens.type.bodySmall.size, color: tokens.color.fg.subtle }}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

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
          /* ═══ EMPTY STATE — no products configured ═══ */
          <div
            style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              padding: "32px 24px", gap: 0, height: "100%",
            }}
          >
            <button
              onClick={() => navigate("keypad")}
              style={{
                width: "100%", padding: "28px 20px",
                borderRadius: tokens.shape.expressiveLarge,
                background: tokens.color.bg.action.primary.default,
                border: "none", cursor: "pointer",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
              }}
            >
              <div style={{
                width: 56, height: 56, borderRadius: tokens.shape.full,
                background: "rgba(255,255,255,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
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
            <button
              onClick={() => navigate("product-catalog")}
              style={{
                width: "100%", padding: "16px 20px", borderRadius: tokens.shape.large,
                background: tokens.color.bg.surface, border: `1px solid ${tokens.color.border.onpage}`,
                cursor: "pointer", display: "flex", alignItems: "center", gap: 14, textAlign: "left",
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: tokens.shape.medium,
                background: tokens.color.bg.page, border: `1px solid ${tokens.color.border.onpage}`,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
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
        ) : filtered.length > 0 ? (
          /* ═══ PRODUCT GRID ═══ */
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              padding: "4px 16px 16px",
            }}
          >
            {/* Manual Entry tile — same structure as ProductCard */}
            {!searchActive && (
              <div
                onClick={() => navigate("keypad")}
                style={{
                  borderRadius: tokens.shape.expressiveLarge,
                  background: tokens.color.bg.brand,
                  overflow: "hidden",
                  cursor: "pointer",
                  border: `1px solid ${tokens.color.bg.brand}`,
                }}
              >
                <div
                  style={{
                    height: 96,
                    background: "rgba(255,255,255,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon name="keypad" size={32} color="rgba(255,255,255,0.5)" />
                </div>
                <div style={{ padding: "8px 12px 12px" }}>
                  <div style={{ fontSize: tokens.type.bodyMedium.size, fontWeight: 500, color: tokens.color.fg.white }}>
                    Manual Entry
                  </div>
                  <div style={{ fontSize: tokens.type.labelMedium.size, fontWeight: 600, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>
                    Key in amount
                  </div>
                </div>
              </div>
            )}
            {filtered.map((p, i) => (
              <ProductCard key={i} name={p.name} price={p.price} isFav={p.fav} onClick={() => handleAdd(p)} />
            ))}
          </div>
        ) : (
          /* ═══ EMPTY RESULTS ═══ */
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
                : `No ${activeFilter === "Favourites" ? "favourites" : "items"} yet`}
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
