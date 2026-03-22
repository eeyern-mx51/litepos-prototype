import { useState, useRef } from "react";
import tokens from "../theme/tokens";
import OrderBar from "../components/OrderBar";
import ProductCard from "../components/ProductCard";
import Icon from "../components/Icon";


export default function HomeScreen({ navigate, basket, setBasket, products = [] }) {
  const [activeFilter, setActiveFilter] = useState("Favourites");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const searchRef = useRef(null);

  const hasProducts = products.length > 0;
  const categoryList = ["Favourites", ...new Set(products.map((p) => p.cat)), "All Items"];

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
    setSheetOpen(false);
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
          <Icon name="store" size={24} color={tokens.color.fg.white} />
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
                onClick={() => navigate("scan")}
                style={{
                  width: 36, height: 36, borderRadius: tokens.shape.full, border: "none",
                  background: "transparent", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}
              >
                <Icon name="scan" size={18} color={tokens.color.fg.subtle} />
              </button>
            </div>
          ) : (
            /* ── Default: Category chip + search icon ── */
            <>
              <button
                onClick={() => setSheetOpen(true)}
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

      {/* ── Order bar ──────────────────────────────────────── */}
      <div style={{ flexShrink: 0 }}>
        <OrderBar
          itemCount={itemCount}
          total={total}
          onCharge={() => navigate("basket")}
        />
      </div>

      {/* ── Category bottom sheet (M3 ModalBottomSheet) ── */}
      {sheetOpen && (
        <>
          {/* Scrim */}
          <div
            onClick={() => setSheetOpen(false)}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.45)",
              zIndex: 40,
              animation: "scrimFadeIn 0.2s ease-out",
            }}
          />
          {/* Sheet */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 41,
              background: tokens.color.bg.page,
              borderRadius: `${tokens.shape.expressiveLarge} ${tokens.shape.expressiveLarge} 0 0`,
              boxShadow: tokens.elevation.level4,
              maxHeight: "70%",
              display: "flex",
              flexDirection: "column",
              animation: "sheetSlideUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            {/* Drag handle */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "12px 0 4px",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 4,
                  borderRadius: 2,
                  background: tokens.color.border.onsurface,
                }}
              />
            </div>

            {/* Header */}
            <div
              style={{
                padding: "8px 20px 16px",
                fontSize: tokens.type.titleMedium.size,
                fontWeight: 600,
                color: tokens.color.fg.emphasis,
              }}
            >
              Filter by category
            </div>

            {/* Scrollable category list */}
            <div style={{ flex: 1, overflow: "auto", minHeight: 0 }}>
              {categoryList.map((cat) => {
                const isActive = cat === activeFilter;
                const count =
                  cat === "Favourites"
                    ? products.filter((p) => p.fav).length
                    : cat === "All Items"
                    ? products.length
                    : products.filter((p) => p.cat === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveFilter(cat);
                      setSheetOpen(false);
                    }}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      padding: "16px 20px",
                      border: "none",
                      borderBottom: `1px solid ${tokens.color.border.onpage}`,
                      background: isActive
                        ? `${tokens.color.fg.brand}08`
                        : "transparent",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      textAlign: "left",
                    }}
                  >
                    {/* Radio indicator */}
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: tokens.shape.full,
                        border: `2px solid ${
                          isActive
                            ? tokens.color.fg.brand
                            : tokens.color.border.onsurface
                        }`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        transition: `all ${tokens.motion.duration.short2} ${tokens.motion.easing.expressive}`,
                      }}
                    >
                      {isActive && (
                        <div
                          style={{
                            width: 12,
                            height: 12,
                            borderRadius: tokens.shape.full,
                            background: tokens.color.fg.brand,
                          }}
                        />
                      )}
                    </div>

                    {/* Label */}
                    <span
                      style={{
                        flex: 1,
                        fontSize: tokens.type.bodyLarge.size,
                        fontWeight: isActive ? 600 : 400,
                        color: isActive
                          ? tokens.color.fg.brand
                          : tokens.color.fg.emphasis,
                      }}
                    >
                      {cat}
                    </span>

                    {/* Count badge */}
                    <span
                      style={{
                        fontSize: tokens.type.labelSmall.size,
                        fontWeight: 600,
                        color: isActive
                          ? tokens.color.fg.brand
                          : tokens.color.fg.subtle,
                        background: isActive
                          ? `${tokens.color.fg.brand}12`
                          : tokens.color.bg.surface,
                        padding: "3px 10px",
                        borderRadius: tokens.shape.full,
                      }}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom sheet animations */}
          <style>
            {`
              @keyframes sheetSlideUp {
                0% { transform: translateY(100%); }
                100% { transform: translateY(0); }
              }
              @keyframes scrimFadeIn {
                0% { opacity: 0; }
                100% { opacity: 1; }
              }
            `}
          </style>
        </>
      )}
    </div>
  );
}
