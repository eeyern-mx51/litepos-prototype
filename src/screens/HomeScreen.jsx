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

      {/* ── Top bar: MXA pill style — Menu (left) · Logo (center) · Settings (right) ── */}
      <div
        style={{
          background: tokens.color.bg.brand,
          padding: "10px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
          gap: 8,
        }}
      >
        {/* Menu pill */}
        <button
          onClick={() => navigate("menu")}
          style={{
            height: 44,
            borderRadius: tokens.shape.full,
            border: "none",
            background: tokens.color.fg.white,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "0 18px 0 12px",
            fontFamily: "inherit",
            boxShadow: "none",
          }}
        >
          <Icon name="menu" size={20} color={tokens.color.fg.brand} />
          <span
            style={{
              fontSize: tokens.type.labelLarge.size,
              fontWeight: 600,
              color: tokens.color.fg.brand,
            }}
          >
            Menu
          </span>
        </button>

        {/* Center: mx51 scissors logo */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="24" height="24" viewBox="88 -2 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M110.881 1.74244C111.089 1.38814 110.987 0.922623 110.653 0.701023L109.773 0.117029C109.437 -0.106237 108.993 0.00271797 108.784 0.359932L106.152 4.85288C105.696 5.62116 104.898 6.08745 104.04 6.08745H101.295H101.287H98.8006C97.9426 6.08745 97.145 5.62116 96.6887 4.85288L94.0573 0.358683C93.8485 0.00146866 93.4047 -0.107489 93.0679 0.11578L92.1883 0.699772C91.8543 0.921432 91.7525 1.38689 91.9602 1.74119L94.6018 6.2411C95.5149 7.77767 97.0847 8.69513 98.8006 8.69513H101.287H101.295H104.04C105.756 8.69513 107.325 7.77767 108.239 6.2411L110.881 1.74244ZM110.892 18.2587C111.1 18.613 110.999 19.0784 110.665 19.3001L109.785 19.8841C109.448 20.1073 109.005 19.9984 108.795 19.6412L106.167 15.1483C105.711 14.38 104.913 13.9138 104.055 13.9138H101.311H101.303H98.816C97.958 13.9138 97.1603 14.38 96.704 15.1483C96.704 15.1483 94.8783 18.2669 94.0749 19.6391C93.8656 19.9962 93.4224 20.1045 93.0855 19.8813L92.2059 19.2973C91.872 19.0757 91.7701 18.6102 91.9784 18.2558L94.6171 13.7601C95.5303 12.2235 97.1 11.3061 98.816 11.3061H101.303H101.311H104.055C105.771 11.3061 107.341 12.2235 108.254 13.7601L110.892 18.2587Z" fill="white"/>
          </svg>
        </div>

        {/* Settings pill */}
        <button
          onClick={() => navigate("litepos-settings")}
          style={{
            height: 44,
            borderRadius: tokens.shape.full,
            border: "none",
            background: tokens.color.fg.white,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "0 18px 0 12px",
            fontFamily: "inherit",
            boxShadow: "none",
          }}
        >
          <Icon name="settings" size={20} color={tokens.color.fg.brand} />
          <span
            style={{
              fontSize: tokens.type.labelLarge.size,
              fontWeight: 600,
              color: tokens.color.fg.brand,
            }}
          >
            Settings
          </span>
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

      {/* ── Footer: Powered by mx51 ──────────────────────── */}
      <div
        style={{
          flexShrink: 0,
          background: tokens.color.bg.brand,
          padding: "10px 0 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <svg width="111" height="20" viewBox="0 0 111 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M77.3877 8.40266C77.3877 8.43598 77.4093 8.45824 77.4412 8.45824H79.1213C79.3233 8.45824 79.4826 8.62503 79.4826 8.82527V13.8742C79.4826 13.9076 79.5036 13.9298 79.5355 13.9298H80.2802C80.3121 13.9298 80.3331 13.9076 80.3331 13.8742V6.15618C80.3331 6.1228 80.3121 6.10061 80.2802 6.10061H79.5355C79.5036 6.10061 79.4826 6.1228 79.4826 6.15618V6.96803C79.4826 7.36838 79.1634 7.70203 78.7811 7.70203H77.4412C77.4093 7.70203 77.3877 7.72423 77.3877 7.75761V8.40266ZM76.5405 6.87906C76.5724 6.87906 76.5935 6.85681 76.5935 6.82348V6.15618C76.5935 6.1228 76.5724 6.10061 76.5405 6.10061H72.6165C72.5846 6.10061 72.5425 6.10061 72.5317 6.15618L72.0533 10.1042C72.0533 10.1375 72.0743 10.1598 72.1062 10.1598H72.8293C72.8612 10.1598 72.8828 10.1486 72.9038 10.1153C73.2759 9.53702 73.8397 9.27008 74.5413 9.27008C75.5728 9.27008 76.2851 10.093 76.2851 11.2496C76.2851 12.5063 75.5728 13.2626 74.5413 13.2626C73.3294 13.2626 72.8191 12.3617 72.8191 11.7612C72.8191 11.7279 72.7974 11.7056 72.7656 11.7056H72.0214C71.9895 11.7056 71.9679 11.7279 71.9679 11.7612C71.9679 12.6398 72.691 14.041 74.5413 14.041C76.0831 14.041 77.1465 12.9845 77.1465 11.2496C77.1465 9.61486 76.0939 8.49162 74.6477 8.49162C73.8716 8.49162 73.3186 8.81414 73.0739 9.0699C73.0421 9.10328 72.9676 9.09215 72.9784 9.01432L73.2441 6.94577C73.2549 6.87906 73.2867 6.87906 73.3186 6.87906H76.5405ZM69.1351 10.4267C69.1033 10.4711 69.0606 10.4711 69.0287 10.4267L67.5404 8.35815C67.5085 8.3137 67.4869 8.30257 67.455 8.30257H66.6898C66.6573 8.30257 66.6363 8.33595 66.6573 8.36928L68.5611 11.0939C68.5929 11.1385 68.5929 11.1606 68.5611 11.2052L66.6573 13.8742C66.6471 13.8964 66.6573 13.9298 66.6898 13.9298H67.4977C67.5506 13.9298 67.5614 13.9076 67.5825 13.8742L69.0287 11.8835C69.0606 11.8391 69.1033 11.8391 69.1351 11.8835L70.5814 13.8742C70.6024 13.9076 70.6235 13.9298 70.6662 13.9298H71.4849C71.5275 13.9298 71.5275 13.8853 71.5167 13.8742L69.6028 11.2052C69.5709 11.1606 69.5709 11.1385 69.6028 11.0939L71.5167 8.36928C71.5384 8.33595 71.5167 8.30257 71.4849 8.30257H70.7088C70.677 8.30257 70.6559 8.3137 70.6235 8.35815L69.1351 10.4267ZM61.5858 13.8742C61.5858 13.9076 61.6068 13.9298 61.6387 13.9298H62.3834C62.4153 13.9298 62.4363 13.9076 62.4363 13.8742V10.7937C62.4363 9.83729 62.6491 8.96981 63.7654 8.96981C64.8396 8.96981 65.1053 9.87061 65.1053 10.7937V13.8742C65.1053 13.9076 65.1263 13.9298 65.1582 13.9298H65.9029C65.9348 13.9298 65.9558 13.9076 65.9558 13.8742V10.7825C65.9558 9.11441 65.3601 8.19135 63.8718 8.19135C63.0957 8.19135 62.6064 8.46936 62.2235 9.0699C62.2025 9.10328 62.1388 9.10328 62.1171 9.0699C61.8941 8.72518 61.4685 8.19135 60.4695 8.19135C59.5973 8.19135 59.1825 8.64729 59.0124 8.93643C58.9805 8.99207 58.9276 8.98094 58.9168 8.91423L58.8104 8.36928C58.7996 8.32482 58.7786 8.30257 58.7467 8.30257H58.1192C58.0873 8.30257 58.0662 8.32482 58.0662 8.35815V13.8742C58.0662 13.9076 58.0873 13.9298 58.1192 13.9298H58.8639C58.8958 13.9298 58.9168 13.9076 58.9168 13.8742V10.7937C58.9168 9.83729 59.1825 8.96981 60.2459 8.96981C61.373 8.96981 61.5858 9.85949 61.5858 10.7937V13.8742ZM52.3565 13.1069C52.3353 13.1736 52.2609 13.1736 52.2396 13.1069L50.7935 8.35815C50.7829 8.3137 50.7509 8.30257 50.7191 8.30257H49.9322C49.8897 8.30257 49.879 8.32482 49.8897 8.35815L51.6866 13.9298C51.878 14.5303 51.7824 15.3645 51.0912 15.3645H49.9641C49.9322 15.3645 49.9109 15.3867 49.9109 15.42V16.0762C49.9109 16.1095 49.9322 16.1318 49.9641 16.1318H51.155C52.0908 16.1318 52.3459 15.6425 52.6436 14.7194L54.6958 8.35815C54.7064 8.32482 54.6852 8.30257 54.6533 8.30257H53.8664C53.8345 8.30257 53.8026 8.3137 53.792 8.35815L52.3565 13.1069ZM48.72 11.1162C48.72 12.384 48.0608 13.2626 46.9337 13.2626C45.8066 13.2626 45.2324 12.384 45.2324 11.1162C45.2324 9.82616 45.8066 8.96981 46.9337 8.96981C48.0608 8.96981 48.72 9.84842 48.72 11.1162ZM44.3817 13.8742C44.3817 13.9076 44.403 13.9298 44.4349 13.9298H45.0623C45.1048 13.9298 45.1155 13.9187 45.1261 13.8742L45.2324 13.3182C45.2431 13.2515 45.3068 13.2515 45.3388 13.2959C45.3919 13.3738 45.796 14.041 47.0613 14.041C48.6882 14.041 49.5707 12.8511 49.5707 11.1162C49.5707 9.3813 48.6244 8.19135 47.0613 8.19135C46.0086 8.19135 45.5089 8.71405 45.3388 8.94756C45.3068 8.99207 45.2324 8.96981 45.2324 8.91423V6.15618C45.2324 6.1228 45.2111 6.10061 45.1792 6.10061H44.4349C44.403 6.10061 44.3817 6.1228 44.3817 6.15618V13.8742ZM35.95 11.1162C35.95 9.84842 36.6092 8.96981 37.7364 8.96981C38.8635 8.96981 39.4376 9.82616 39.4376 11.1162C39.4376 12.384 38.8635 13.2626 37.7364 13.2626C36.6092 13.2626 35.95 12.384 35.95 11.1162ZM40.2883 6.15618C40.2883 6.1228 40.267 6.10061 40.2351 6.10061H39.4908C39.4589 6.10061 39.4376 6.1228 39.4376 6.15618V8.91423C39.4376 8.96981 39.3632 8.99207 39.3313 8.94756C39.1612 8.71405 38.6614 8.19135 37.6087 8.19135C36.0457 8.19135 35.0994 9.3813 35.0994 11.1162C35.0994 12.8511 35.9819 14.041 37.6087 14.041C38.8741 14.041 39.2781 13.3738 39.3313 13.2959C39.3632 13.2515 39.427 13.2515 39.4376 13.3182L39.544 13.8742C39.5546 13.9187 39.5652 13.9298 39.6078 13.9298H40.2351C40.267 13.9298 40.2883 13.9076 40.2883 13.8742V6.15618ZM33.4406 10.638C33.4406 10.6713 33.4194 10.6825 33.3874 10.6825H30.1763C30.1444 10.6825 30.1231 10.6713 30.1231 10.638C30.1231 10.0152 30.6547 8.96981 31.8031 8.96981C32.9727 8.96981 33.4406 9.904 33.4406 10.638ZM34.27 11.4609C34.3444 11.4609 34.3551 11.3275 34.3551 11.1162C34.3551 9.3813 33.3874 8.19135 31.8031 8.19135C30.2082 8.19135 29.2086 9.37017 29.2086 11.1162C29.2086 12.8511 30.2507 14.041 31.8031 14.041C32.9622 14.041 33.9191 13.5183 34.1743 12.473C34.1849 12.4285 34.1424 12.4174 34.1212 12.4174H33.3237C33.2917 12.4174 33.2598 12.4285 33.2386 12.473C33.0366 12.8734 32.5794 13.2626 31.8031 13.2626C30.7504 13.2626 30.1231 12.4174 30.1231 11.5166C30.1231 11.4832 30.1444 11.4609 30.1763 11.4609H34.27ZM25.8699 13.8742C25.8699 13.9076 25.8912 13.9298 25.923 13.9298H26.6674C26.6992 13.9298 26.7205 13.9076 26.7205 13.8742V10.8715C26.7205 9.65931 27.1884 9.0699 28.3368 9.0699H28.7833C28.8152 9.0699 28.8365 9.04764 28.8365 9.01432V8.24693C28.8365 8.21361 28.8152 8.19135 28.7833 8.19135H28.3049C27.4755 8.19135 27.0182 8.68067 26.8269 8.93643C26.7844 8.99207 26.7312 8.96981 26.7205 8.91423L26.6142 8.35815C26.6035 8.3137 26.5929 8.30257 26.5504 8.30257H25.923C25.8912 8.30257 25.8699 8.32482 25.8699 8.35815V13.8742ZM23.7007 10.638C23.7007 10.6713 23.6795 10.6825 23.6476 10.6825H20.4364C20.4045 10.6825 20.3832 10.6713 20.3832 10.638C20.3832 10.0152 20.9149 8.96981 22.0633 8.96981C23.2329 8.96981 23.7007 9.904 23.7007 10.638ZM24.5301 11.4609C24.6045 11.4609 24.6152 11.3275 24.6152 11.1162C24.6152 9.3813 23.6476 8.19135 22.0633 8.19135C20.4683 8.19135 19.4688 9.37017 19.4688 11.1162C19.4688 12.8511 20.5109 14.041 22.0633 14.041C23.2223 14.041 24.1792 13.5183 24.4344 12.473C24.4451 12.4285 24.4025 12.4174 24.3812 12.4174H23.5838C23.5519 12.4174 23.52 12.4285 23.4987 12.473C23.2967 12.8734 22.8395 13.2626 22.0633 13.2626C21.0106 13.2626 20.3832 12.4174 20.3832 11.5166C20.3832 11.4832 20.4045 11.4609 20.4364 11.4609H24.5301ZM15.8748 8.36928C15.8643 8.32482 15.8323 8.30257 15.8004 8.30257H14.5776C14.5458 8.30257 14.5139 8.32482 14.5032 8.36928L13.4718 13.1069C13.4506 13.1958 13.3655 13.1958 13.3442 13.1069L12.366 8.36928C12.3553 8.3137 12.3235 8.30257 12.2915 8.30257H11.5685C11.526 8.30257 11.5047 8.32482 11.5153 8.36928L12.77 13.8742C12.7807 13.9076 12.802 13.9298 12.8338 13.9298H13.9715C14.0035 13.9298 14.0247 13.9076 14.0354 13.8742L15.1412 9.13667C15.1518 9.0699 15.2475 9.0699 15.2582 9.13667L16.3534 13.8742C16.364 13.9076 16.3852 13.9298 16.4172 13.9298H17.5549C17.5868 13.9298 17.6081 13.9076 17.6187 13.8742L18.8628 8.36928C18.8734 8.32482 18.8415 8.30257 18.8096 8.30257H18.0866C18.0546 8.30257 18.0334 8.3137 18.0227 8.36928L17.0445 13.1069C17.0233 13.1958 16.9382 13.1958 16.9169 13.1069L15.8748 8.36928ZM10.1119 11.1162C10.1119 12.3951 9.45261 13.2626 8.32553 13.2626C7.19838 13.2626 6.53914 12.3951 6.53914 11.1162C6.53914 9.83729 7.19838 8.96981 8.32553 8.96981C9.45261 8.96981 10.1119 9.83729 10.1119 11.1162ZM10.9625 11.1162C10.9625 9.3813 9.98424 8.18022 8.32553 8.18022C6.65612 8.18022 5.6885 9.37017 5.6885 11.1162C5.6885 12.8511 6.65612 14.041 8.32553 14.041C9.98424 14.041 10.9625 12.8511 10.9625 11.1162ZM3.07296 6.87906C3.90236 6.87906 4.45524 7.6464 4.45524 8.42491C4.45524 9.19224 3.90236 9.95958 3.07296 9.95958H0.903802C0.871935 9.95958 0.850645 9.93738 0.850645 9.904V6.93464C0.850645 6.90132 0.871935 6.87906 0.903802 6.87906H3.07296ZM0.79746 13.9298C0.829395 13.9298 0.850645 13.9076 0.850645 13.8742V10.7937C0.850645 10.7603 0.871935 10.7381 0.903802 10.7381H3.17929C4.41275 10.7381 5.30588 9.74827 5.30588 8.42491C5.30588 7.11257 4.41275 6.10061 3.17929 6.10061H0.0531611C0.0212689 6.10061 0 6.1228 0 6.15618V13.8742C0 13.9076 0.0212689 13.9298 0.0531611 13.9298H0.79746ZM110.881 1.74244C111.089 1.38814 110.987 0.922623 110.653 0.701023L109.773 0.117029C109.437 -0.106237 108.993 0.00271797 108.784 0.359932L106.152 4.85288C105.696 5.62116 104.898 6.08745 104.04 6.08745H101.295H101.287H98.8006C97.9426 6.08745 97.145 5.62116 96.6887 4.85288L94.0573 0.358683C93.8485 0.00146866 93.4047 -0.107489 93.0679 0.11578L92.1883 0.699772C91.8543 0.921432 91.7525 1.38689 91.9602 1.74119L94.6018 6.2411C95.5149 7.77767 97.0847 8.69513 98.8006 8.69513H101.287H101.295H104.04C105.756 8.69513 107.325 7.77767 108.239 6.2411L110.881 1.74244ZM110.892 18.2587C111.1 18.613 110.999 19.0784 110.665 19.3001L109.785 19.8841C109.448 20.1073 109.005 19.9984 108.795 19.6412L106.167 15.1483C105.711 14.38 104.913 13.9138 104.055 13.9138H101.311H101.303H98.816C97.958 13.9138 97.1603 14.38 96.704 15.1483C96.704 15.1483 94.8783 18.2669 94.0749 19.6391C93.8656 19.9962 93.4224 20.1045 93.0855 19.8813L92.2059 19.2973C91.872 19.0757 91.7701 18.6102 91.9784 18.2558L94.6171 13.7601C95.5303 12.2235 97.1 11.3061 98.816 11.3061H101.303H101.311H104.055C105.771 11.3061 107.341 12.2235 108.254 13.7601L110.892 18.2587Z" fill="white"/>
        </svg>
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
