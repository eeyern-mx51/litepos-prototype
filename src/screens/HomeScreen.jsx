import { useState, useRef } from "react";
import tokens from "../theme/tokens";
import OrderBar from "../components/OrderBar";
import ProductCard from "../components/ProductCard";
import Icon from "../components/Icon";


export default function HomeScreen({ navigate, basket, setBasket, products = [], setProducts }) {
  const [activeFilter, setActiveFilter] = useState("All Items");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const searchRef = useRef(null);

  const hasProducts = products.length > 0;
  const categories = [...new Set(products.map((p) => p.cat))].sort((a, b) => a.localeCompare(b));
  const categoryList = ["All Items", "Favourites", ...categories];
  const MAX_VISIBLE_CHIPS = 5;
  const visibleChips = categoryList.slice(0, MAX_VISIBLE_CHIPS);
  const overflowChips = categoryList.slice(MAX_VISIBLE_CHIPS);
  const hasOverflow = overflowChips.length > 0;
  const activeIsOverflow = overflowChips.includes(activeFilter);

  const toggleFav = (productName) => {
    if (setProducts) {
      setProducts(products.map((p) =>
        p.name === productName ? { ...p, fav: !p.fav } : p
      ));
    }
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
    setSheetOpen(false);
    setTimeout(() => searchRef.current?.focus(), 80);
  };

  const closeSearch = () => {
    setSearchActive(false);
    setSearchQuery("");
  };

  // Sort helper: favourites first, then grouped by category alphabetically, then by name within each group
  const sortProducts = (list) => {
    return [...list].sort((a, b) => {
      // Favourites always first
      if (a.fav && !b.fav) return -1;
      if (!a.fav && b.fav) return 1;
      // Then by category alphabetically
      const catCmp = (a.cat || "").localeCompare(b.cat || "");
      if (catCmp !== 0) return catCmp;
      // Then by name within category
      return a.name.localeCompare(b.name);
    });
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
  filtered = sortProducts(filtered);

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
        {/* Menu button */}
        <button
          onClick={() => navigate("menu")}
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            border: "none",
            background: tokens.color.fg.white,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            flexShrink: 0,
            boxShadow: "none",
          }}
        >
          <Icon name="menu" size={20} color={tokens.color.fg.brand} />
        </button>

        {/* Center: mx51 wordmark logo */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="58" height="19" viewBox="0 0 83 27" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_home_logo)">
              <g clipPath="url(#clip1_home_logo)">
                <path d="M72.7408 7.13967C72.823 7.20345 72.9215 7.24278 73.025 7.25313C73.1751 7.24614 73.3199 7.19543 73.4415 7.10725L78.3043 4.33543V25.8604C78.2901 25.9585 78.299 26.0585 78.3302 26.1526C78.3615 26.2467 78.4143 26.3322 78.4844 26.4023C78.5545 26.4724 78.64 26.5251 78.734 26.5564C78.8281 26.5877 78.9282 26.5965 79.0263 26.5823H81.4951C81.5932 26.5965 81.6933 26.5877 81.7874 26.5564C81.8814 26.5251 81.9669 26.4724 82.037 26.4023C82.1071 26.3322 82.1599 26.2467 82.1912 26.1526C82.2224 26.0585 82.2313 25.9585 82.2171 25.8604V0.721959C82.2311 0.623783 82.222 0.523697 82.1906 0.429636C82.1592 0.335575 82.1063 0.250126 82.0361 0.180064C81.9659 0.110002 81.8803 0.0572537 81.7862 0.0260009C81.6921 -0.00525184 81.592 -0.0141494 81.4939 1.36816e-05H79.3667C79.0435 -0.00181248 78.7268 0.0904701 78.4552 0.2656L73.0674 3.38031C72.9077 3.45033 72.7738 3.56846 72.6844 3.71821C72.595 3.86797 72.5545 4.04189 72.5687 4.21572V6.60849C72.5687 6.88779 72.6273 7.0636 72.7408 7.13967Z" fill="white"/>
                <path d="M70.2069 17.6583C70.2493 18.9063 70.0296 20.1492 69.5621 21.307C69.0945 22.4648 68.3895 23.5117 67.4924 24.3803C66.5506 25.2622 65.4426 25.948 64.2331 26.3975C63.0236 26.8471 61.7368 27.0514 60.4475 26.9987C58.1268 27.0756 55.8492 26.3597 53.9899 24.9688C52.4936 23.8425 51.4601 22.2086 51.0834 20.374L51.056 20.2144C51.0444 20.1457 51.0479 20.0752 51.0663 20.008C51.0847 19.9407 51.1176 19.8783 51.1625 19.825C51.2075 19.7717 51.2636 19.7289 51.3268 19.6994C51.39 19.67 51.4588 19.6547 51.5286 19.6546H54.5909C54.7097 19.6556 54.8251 19.6938 54.921 19.7638C55.017 19.8338 55.0886 19.9321 55.1258 20.0449C55.45 20.9637 56.0561 21.7566 56.8577 22.3104C57.9066 23.0473 59.1649 23.4267 60.4463 23.3927C61.2144 23.4208 61.9801 23.2903 62.6956 23.0092C63.4111 22.7282 64.0609 22.3027 64.6046 21.7593C65.1449 21.2024 65.5666 20.5416 65.8442 19.817C66.1217 19.0924 66.2494 18.319 66.2193 17.5436C66.2656 16.8385 66.1608 16.1317 65.9119 15.4703C65.663 14.809 65.2758 14.2084 64.7761 13.7088C64.2765 13.2091 63.6759 12.8219 63.0146 12.573C62.3532 12.3241 61.6464 12.2193 60.9413 12.2656C60.0666 12.2305 59.1938 12.373 58.3756 12.6844C57.5574 12.9957 56.8108 13.4696 56.1807 14.0773C55.8498 14.4061 55.5725 14.7847 55.359 15.1995L55.3503 15.2169C55.2746 15.3716 55.157 15.5018 55.0108 15.5926C54.8645 15.6835 54.6957 15.7313 54.5236 15.7307H51.7056C51.6441 15.7307 51.5833 15.7178 51.5272 15.6926C51.471 15.6675 51.4209 15.6307 51.38 15.5848C51.3391 15.5388 51.3084 15.4847 51.29 15.426C51.2715 15.3674 51.2657 15.3054 51.273 15.2444C51.3129 14.9052 51.359 14.5436 51.4089 14.1571L53.157 0.68327C53.1526 0.585676 53.1698 0.488316 53.2076 0.398197C53.2453 0.308078 53.3025 0.227443 53.3751 0.162096C53.4477 0.0967491 53.534 0.048316 53.6275 0.0202833C53.7211 -0.00774937 53.8198 -0.0146843 53.9163 -2.21492e-05H68.1034C68.2585 -2.21492e-05 68.4072 0.0615893 68.5169 0.171258C68.6266 0.280927 68.6882 0.42967 68.6882 0.584766V3.02242C68.6882 3.17752 68.6266 3.32626 68.5169 3.43593C68.4072 3.5456 68.2585 3.60721 68.1034 3.60721H56.4226L55.5498 10.7469C57.2052 9.4865 59.2418 8.83007 61.3216 8.88651C62.4925 8.84471 63.66 9.0364 64.756 9.45042C65.8521 9.86444 66.8548 10.4925 67.7056 11.298C68.5445 12.124 69.201 13.1166 69.6327 14.2119C70.0644 15.3072 70.2617 16.4808 70.2119 17.6571" fill="white"/>
                <path d="M48.2769 9.47632C48.3266 9.41114 48.3571 9.33339 48.365 9.25181C48.3729 9.17024 48.3578 9.08808 48.3215 9.0146C48.2852 8.94112 48.2292 8.87922 48.1596 8.83589C48.09 8.79256 48.0097 8.76951 47.9278 8.76934H45.0388C44.8757 8.76361 44.7138 8.79884 44.5679 8.87181C44.4219 8.94478 44.2966 9.05316 44.2034 9.18705L42.0525 12.02C41.9247 12.1879 41.7599 12.3241 41.5709 12.418C41.3819 12.5119 41.1737 12.5608 40.9627 12.5611H38.6722C38.4609 12.561 38.2526 12.5121 38.0633 12.4183C37.8741 12.3244 37.7091 12.1881 37.5812 12.02L35.4303 9.18954C35.3311 9.05276 35.1993 8.94292 35.0469 8.86998C34.8944 8.79704 34.7262 8.7633 34.5575 8.77183H31.7096C31.6283 8.77194 31.5486 8.79458 31.4793 8.83723C31.4101 8.87989 31.354 8.94089 31.3173 9.01347C31.2807 9.08605 31.2648 9.16737 31.2715 9.24841C31.2783 9.32945 31.3073 9.40705 31.3555 9.47258L31.4802 9.6459L35.1834 14.4439C35.4956 14.8482 35.8963 15.1755 36.3548 15.4008C36.8132 15.626 37.3172 15.7431 37.828 15.7432H41.8019C42.3127 15.7431 42.8166 15.626 43.2751 15.4008C43.7336 15.1755 44.1343 14.8482 44.4465 14.4439L48.1497 9.6459C48.1759 9.60974 48.2208 9.54989 48.2744 9.48006M48.1497 26.5836C48.2316 26.5834 48.3118 26.5605 48.3813 26.5173C48.4508 26.4741 48.507 26.4124 48.5434 26.3391C48.5798 26.2658 48.595 26.1838 48.5873 26.1023C48.5797 26.0208 48.5495 25.9431 48.5001 25.8778L44.9116 21.1584C44.5567 20.6928 44.099 20.3156 43.5743 20.0561C43.0496 19.7965 42.472 19.6617 41.8866 19.6621H37.7233C37.139 19.6627 36.5626 19.7979 36.0391 20.0574C35.5155 20.317 35.0589 20.6937 34.7046 21.1584L31.0886 25.8865C31.0389 25.9518 31.0084 26.0297 31.0005 26.1114C30.9927 26.1931 31.0079 26.2753 31.0443 26.3488C31.0807 26.4224 31.137 26.4842 31.2068 26.5275C31.2765 26.5707 31.357 26.5936 31.439 26.5935H34.328C34.4951 26.5973 34.6601 26.5571 34.8067 26.477C34.9534 26.3969 35.0764 26.2797 35.1635 26.1372L37.1373 23.5611C37.3065 23.3401 37.5243 23.1611 37.7738 23.0379C38.0233 22.9146 38.2979 22.8505 38.5762 22.8504H41.0325C41.3122 22.8504 41.5881 22.9152 41.8385 23.0395C42.089 23.1639 42.3074 23.3446 42.4764 23.5673L44.429 26.1384C44.526 26.2802 44.6563 26.396 44.8085 26.4756C44.9607 26.5552 45.1301 26.5961 45.3019 26.5948H48.1547" fill="white"/>
                <path d="M0.723232 26.5823H3.07735C3.1754 26.5962 3.27536 26.5872 3.36931 26.5558C3.46327 26.5245 3.54864 26.4717 3.61867 26.4017C3.68871 26.3316 3.74148 26.2463 3.77283 26.1523C3.80418 26.0583 3.81324 25.9584 3.79929 25.8603V16.8603C3.72851 15.5172 4.17721 14.1983 5.05241 13.177C5.45899 12.7282 5.95827 12.3731 6.51566 12.1362C7.07306 11.8994 7.67526 11.7866 8.28059 11.8055C8.81824 11.7784 9.35487 11.8758 9.84879 12.0898C10.3427 12.3039 10.7806 12.629 11.1285 13.0399C11.8864 14.1062 12.2489 15.4034 12.1534 16.7082V25.8603C12.1392 25.9584 12.1481 26.0585 12.1793 26.1526C12.2106 26.2467 12.2633 26.3321 12.3334 26.4022C12.4035 26.4723 12.489 26.5251 12.5831 26.5564C12.6772 26.5876 12.7772 26.5965 12.8754 26.5823H15.2295C15.3275 26.5962 15.4275 26.5872 15.5214 26.5558C15.6154 26.5245 15.7008 26.4717 15.7708 26.4017C15.8408 26.3316 15.8936 26.2463 15.925 26.1523C15.9563 26.0583 15.9654 25.9584 15.9514 25.8603V16.8603C15.873 15.5116 16.3198 14.1848 17.1983 13.1583C17.6083 12.7154 18.1087 12.3657 18.6657 12.1332C19.2227 11.9006 19.8232 11.7905 20.4265 11.8105C20.9616 11.7821 21.4959 11.8789 21.987 12.0932C22.4781 12.3075 22.9125 12.6333 23.2557 13.0449C24.0002 14.1154 24.3554 15.4088 24.2619 16.7095V25.8616C24.2477 25.9597 24.2565 26.0598 24.2878 26.1538C24.319 26.2479 24.3718 26.3334 24.4419 26.4035C24.512 26.4736 24.5975 26.5264 24.6916 26.5576C24.7857 26.5889 24.8857 26.5977 24.9838 26.5835H27.3379C27.436 26.5975 27.536 26.5884 27.6299 26.5571C27.7239 26.5257 27.8092 26.4729 27.8793 26.4029C27.9493 26.3329 28.0021 26.2475 28.0334 26.1535C28.0648 26.0596 28.0738 25.9596 28.0599 25.8616V15.7618C28.1732 13.7913 27.5357 11.8509 26.2756 10.3317C25.6577 9.66824 24.9024 9.14777 24.0625 8.80662C23.2225 8.46547 22.3182 8.31189 21.4128 8.35659C20.1061 8.33506 18.8165 8.65574 17.6721 9.28677C16.5945 9.8821 15.7362 10.8073 15.2232 11.9264H15.0711C14.6188 10.8084 13.8255 9.86142 12.8041 9.2201C11.7827 8.57878 10.5851 8.27576 9.38159 8.3541C8.19309 8.32854 7.01971 8.62404 5.98508 9.20946C5.02681 9.75899 4.27289 10.6048 3.8367 11.6197H3.68458V9.49375C3.69853 9.39569 3.68947 9.29573 3.65812 9.20178C3.62677 9.10783 3.57399 9.02246 3.50396 8.95243C3.43392 8.88239 3.34855 8.82961 3.2546 8.79826C3.16065 8.76691 3.06069 8.75785 2.96263 8.7718H0.723232C0.625081 8.75764 0.524979 8.76654 0.430864 8.79779C0.336749 8.82904 0.251209 8.88179 0.181026 8.95185C0.110843 9.02192 0.0579472 9.10736 0.0265321 9.20143C-0.004883 9.29549 -0.0139533 9.39557 4.03938e-05 9.49375C4.03938e-05 9.49375 0.241936 26.5823 0.723232 26.5823Z" fill="white"/>
              </g>
            </g>
            <defs>
              <clipPath id="clip0_home_logo"><rect width="82.2145" height="27" fill="white"/></clipPath>
              <clipPath id="clip1_home_logo"><rect width="82.2145" height="27" fill="white"/></clipPath>
            </defs>
          </svg>
        </div>

        {/* LitePOS settings button */}
        <button
          onClick={() => navigate("litepos-settings")}
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            border: "none",
            background: tokens.color.fg.white,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            flexShrink: 0,
            boxShadow: "none",
          }}
        >
          <Icon name="tune" size={20} color={tokens.color.fg.brand} />
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
            /* ── Default: Horizontal category chips + search icon ── */
            <>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  gap: 8,
                  overflow: "auto",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  minWidth: 0,
                }}
              >
                {visibleChips.map((cat) => {
                  const isActive = cat === activeFilter;
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveFilter(cat)}
                      style={{
                        flexShrink: 0,
                        padding: "8px 16px",
                        borderRadius: tokens.shape.full,
                        border: `1.5px solid ${isActive ? tokens.color.fg.brand : tokens.color.border.onpage}`,
                        background: isActive ? tokens.color.bg.action.primary.default : tokens.color.bg.page,
                        color: isActive ? tokens.color.fg.onAction : tokens.color.fg.emphasis,
                        fontSize: tokens.type.labelLarge.size,
                        fontWeight: 600,
                        fontFamily: "inherit",
                        cursor: "pointer",
                        transition: `all ${tokens.motion.duration.short2} ${tokens.motion.easing.standard}`,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {cat}
                    </button>
                  );
                })}
                {hasOverflow && (
                  <button
                    onClick={() => setSheetOpen(true)}
                    style={{
                      flexShrink: 0,
                      padding: "8px 14px",
                      borderRadius: tokens.shape.full,
                      border: `1.5px solid ${activeIsOverflow ? tokens.color.fg.brand : tokens.color.border.onpage}`,
                      background: activeIsOverflow ? tokens.color.bg.action.primary.default : tokens.color.bg.page,
                      color: activeIsOverflow ? tokens.color.fg.onAction : tokens.color.fg.subtle,
                      fontSize: tokens.type.labelLarge.size,
                      fontWeight: 600,
                      fontFamily: "inherit",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      whiteSpace: "nowrap",
                      transition: `all ${tokens.motion.duration.short2} ${tokens.motion.easing.standard}`,
                    }}
                  >
                    {activeIsOverflow ? activeFilter : "More"}
                    <Icon name="expand-more" size={16} color={activeIsOverflow ? tokens.color.fg.onAction : tokens.color.fg.subtle} />
                  </button>
                )}
              </div>
              <button
                onClick={openSearch}
                style={{
                  width: 40, height: 40, borderRadius: tokens.shape.full, border: "none",
                  background: "transparent", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
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
              <ProductCard key={i} name={p.name} price={p.price} isFav={p.fav} image={p.image} emoji={p.emoji} emojiBg={p.emojiBg} onClick={() => handleAdd(p)} onToggleFav={() => toggleFav(p.name)} />
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

      {/* ── Footer: MXA-style terminal identity + branding bar ── */}
      <div
        style={{
          flexShrink: 0,
          overflow: "hidden",
        }}
      >
        <svg width="360" height="90" viewBox="0 0 360 90" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "auto", display: "block" }}>
          <rect width="360" height="62" fill={tokens.color.bg.brand}/>
          <rect width="360" height="28" y="62" fill="#1B2446"/>
          <path d="M141.627 20.144C141.187 20.144 140.783 20.092 140.415 19.988C140.055 19.884 139.735 19.74 139.455 19.556C139.183 19.372 138.955 19.168 138.771 18.944C138.595 18.712 138.471 18.472 138.399 18.224L139.767 17.804C139.871 18.1 140.075 18.36 140.379 18.584C140.683 18.808 141.059 18.924 141.507 18.932C142.027 18.932 142.439 18.824 142.743 18.608C143.047 18.392 143.199 18.108 143.199 17.756C143.199 17.436 143.071 17.176 142.815 16.976C142.559 16.768 142.215 16.608 141.783 16.496L140.751 16.232C140.359 16.128 140.003 15.976 139.683 15.776C139.371 15.576 139.123 15.324 138.939 15.02C138.763 14.716 138.675 14.356 138.675 13.94C138.675 13.156 138.931 12.548 139.443 12.116C139.955 11.676 140.687 11.456 141.639 11.456C142.175 11.456 142.643 11.54 143.043 11.708C143.451 11.868 143.787 12.092 144.051 12.38C144.315 12.66 144.511 12.98 144.639 13.34L143.295 13.772C143.175 13.452 142.967 13.188 142.671 12.98C142.375 12.772 142.007 12.668 141.567 12.668C141.111 12.668 140.751 12.776 140.487 12.992C140.231 13.208 140.103 13.508 140.103 13.892C140.103 14.204 140.203 14.448 140.403 14.624C140.611 14.792 140.891 14.92 141.243 15.008L142.275 15.26C143.027 15.444 143.611 15.76 144.027 16.208C144.443 16.656 144.651 17.152 144.651 17.696C144.651 18.176 144.535 18.6 144.303 18.968C144.071 19.336 143.727 19.624 143.271 19.832C142.823 20.04 142.275 20.144 141.627 20.144ZM148.431 20V12.296H149.823V20H148.431ZM145.851 12.872V11.6H152.403V12.872H145.851ZM159.082 20L155.806 11.6H157.198L160.558 20H159.082ZM152.374 20L155.722 11.6H157.126L153.85 20H152.374ZM153.946 17.936V16.7H158.974V17.936H153.946ZM168.056 20L162.476 12.368L163.592 11.6L169.16 19.208L168.056 20ZM162.152 20V11.6H163.592L163.544 12.8V20H162.152ZM168.056 20V11.6H169.448V20H168.056ZM174.585 20V18.704C174.977 18.704 175.345 18.632 175.689 18.488C176.033 18.336 176.333 18.128 176.589 17.864C176.845 17.6 177.045 17.292 177.189 16.94C177.333 16.588 177.405 16.208 177.405 15.8C177.405 15.392 177.333 15.012 177.189 14.66C177.045 14.308 176.845 14 176.589 13.736C176.333 13.472 176.033 13.268 175.689 13.124C175.345 12.972 174.977 12.896 174.585 12.896V11.6C175.409 11.6 176.137 11.78 176.769 12.14C177.409 12.492 177.909 12.984 178.269 13.616C178.637 14.248 178.821 14.976 178.821 15.8C178.821 16.616 178.637 17.34 178.269 17.972C177.909 18.604 177.409 19.1 176.769 19.46C176.137 19.82 175.409 20 174.585 20ZM172.845 20V18.704H174.585V20H172.845ZM171.945 20V11.6H173.337V20H171.945ZM172.845 12.896V11.6H174.585V12.896H172.845ZM186.609 20L183.333 11.6H184.725L188.085 20H186.609ZM179.901 20L183.249 11.6H184.653L181.377 20H179.901ZM181.473 17.936V16.7H186.501V17.936H181.473ZM189.68 20V11.6H191.072V20H189.68ZM190.652 20V18.728H194.876V20H190.652ZM200.087 20.144C199.255 20.144 198.519 19.96 197.879 19.592C197.239 19.224 196.735 18.712 196.367 18.056C196.007 17.4 195.827 16.648 195.827 15.8C195.827 14.952 196.007 14.204 196.367 13.556C196.735 12.9 197.235 12.388 197.867 12.02C198.499 11.644 199.227 11.456 200.051 11.456C200.883 11.456 201.615 11.644 202.247 12.02C202.887 12.388 203.383 12.9 203.735 13.556C204.095 14.204 204.275 14.952 204.275 15.8C204.275 16.648 204.095 17.4 203.735 18.056C203.383 18.712 202.891 19.224 202.259 19.592C201.635 19.96 200.911 20.144 200.087 20.144ZM200.087 18.872C200.631 18.872 201.111 18.74 201.527 18.476C201.943 18.212 202.267 17.852 202.499 17.396C202.739 16.932 202.859 16.4 202.859 15.8C202.859 15.208 202.739 14.68 202.499 14.216C202.259 13.752 201.927 13.392 201.503 13.136C201.087 12.872 200.603 12.74 200.051 12.74C199.507 12.74 199.023 12.872 198.599 13.136C198.183 13.392 197.851 13.752 197.603 14.216C197.363 14.672 197.243 15.2 197.243 15.8C197.243 16.4 197.363 16.932 197.603 17.396C197.851 17.852 198.187 18.212 198.611 18.476C199.043 18.74 199.535 18.872 200.087 18.872ZM212.158 20L206.578 12.368L207.694 11.6L213.262 19.208L212.158 20ZM206.254 20V11.6H207.694L207.646 12.8V20H206.254ZM212.158 20V11.6H213.55V20H212.158ZM216.047 20V11.6H217.439V20H216.047ZM217.151 20V18.728H221.255V20H217.151ZM217.151 16.352V15.104H220.775V16.352H217.151ZM217.151 12.872V11.6H221.219V12.872H217.151Z" fill="white"/>
          <path d="M114.284 48V32.6H116.154V48H114.284ZM115.978 41.246V39.552H122.578V41.246H115.978ZM115.978 34.294V32.6H123.436V34.294H115.978ZM126.477 42.038C126.477 40.85 126.704 39.8893 127.159 39.156C127.613 38.408 128.193 37.858 128.897 37.506C129.615 37.1393 130.371 36.956 131.163 36.956V38.606C130.517 38.606 129.894 38.716 129.293 38.936C128.706 39.1413 128.222 39.486 127.841 39.97C127.459 40.454 127.269 41.114 127.269 41.95L126.477 42.038ZM125.509 48V37H127.269V48H125.509ZM137.87 48.264C136.8 48.264 135.846 48.022 135.01 47.538C134.174 47.0393 133.522 46.3573 133.052 45.492C132.583 44.6267 132.348 43.6293 132.348 42.5C132.348 41.3707 132.576 40.3733 133.03 39.508C133.5 38.6427 134.152 37.968 134.988 37.484C135.824 36.9853 136.77 36.736 137.826 36.736C138.912 36.736 139.865 36.9853 140.686 37.484C141.522 37.968 142.168 38.6427 142.622 39.508C143.092 40.3733 143.326 41.3707 143.326 42.5C143.326 43.6293 143.092 44.6267 142.622 45.492C142.168 46.3573 141.53 47.0393 140.708 47.538C139.887 48.022 138.941 48.264 137.87 48.264ZM137.87 46.592C138.589 46.592 139.22 46.4233 139.762 46.086C140.305 45.734 140.73 45.25 141.038 44.634C141.346 44.018 141.5 43.3067 141.5 42.5C141.5 41.6933 141.339 40.982 141.016 40.366C140.708 39.75 140.276 39.2733 139.718 38.936C139.176 38.584 138.545 38.408 137.826 38.408C137.108 38.408 136.477 38.584 135.934 38.936C135.392 39.2733 134.959 39.75 134.636 40.366C134.328 40.982 134.174 41.6933 134.174 42.5C134.174 43.3067 134.328 44.018 134.636 44.634C134.959 45.25 135.399 45.734 135.956 46.086C136.514 46.4233 137.152 46.592 137.87 46.592ZM145.811 48V37H147.461L147.571 39.024V48H145.811ZM153.533 48V42.368L155.293 41.708V48H153.533ZM153.533 42.368C153.533 41.2827 153.409 40.454 153.159 39.882C152.91 39.31 152.565 38.9213 152.125 38.716C151.685 38.496 151.187 38.386 150.629 38.386C149.661 38.386 148.906 38.7307 148.363 39.42C147.835 40.0947 147.571 41.0553 147.571 42.302H146.713C146.713 41.1433 146.882 40.146 147.219 39.31C147.557 38.474 148.041 37.836 148.671 37.396C149.317 36.956 150.094 36.736 151.003 36.736C152.338 36.736 153.387 37.1467 154.149 37.968C154.927 38.7893 155.308 40.036 155.293 41.708L153.533 42.368ZM162.435 48.264C161.364 48.264 160.536 47.9853 159.949 47.428C159.362 46.8707 159.069 46.086 159.069 45.074V33.568H160.829V44.898C160.829 45.4553 160.976 45.888 161.269 46.196C161.577 46.4893 162.002 46.636 162.545 46.636C162.721 46.636 162.89 46.614 163.051 46.57C163.227 46.5113 163.454 46.3793 163.733 46.174L164.415 47.604C164.034 47.8533 163.689 48.022 163.381 48.11C163.073 48.2127 162.758 48.264 162.435 48.264ZM157.155 38.562V37H164.129V38.562H157.155ZM176.885 48.264C175.8 48.264 174.839 48.022 174.003 47.538C173.167 47.0393 172.515 46.3573 172.045 45.492C171.576 44.6267 171.341 43.6293 171.341 42.5C171.341 41.3707 171.569 40.3733 172.023 39.508C172.493 38.6427 173.145 37.968 173.981 37.484C174.817 36.9853 175.771 36.736 176.841 36.736C177.897 36.736 178.843 36.978 179.679 37.462C180.515 37.946 181.153 38.628 181.593 39.508L179.987 40.234C179.694 39.6473 179.269 39.1927 178.711 38.87C178.154 38.5327 177.516 38.364 176.797 38.364C176.079 38.364 175.441 38.54 174.883 38.892C174.341 39.244 173.908 39.7353 173.585 40.366C173.277 40.982 173.123 41.6933 173.123 42.5C173.123 43.3067 173.277 44.0253 173.585 44.656C173.908 45.272 174.348 45.756 174.905 46.108C175.477 46.46 176.123 46.636 176.841 46.636C177.56 46.636 178.198 46.4527 178.755 46.086C179.327 45.7193 179.76 45.206 180.053 44.546L181.659 45.272C181.219 46.2107 180.581 46.944 179.745 47.472C178.909 48 177.956 48.264 176.885 48.264ZM188.81 48.264C187.739 48.264 186.786 48.022 185.95 47.538C185.114 47.0393 184.461 46.3573 183.992 45.492C183.522 44.6267 183.288 43.6293 183.288 42.5C183.288 41.3707 183.515 40.3733 183.97 39.508C184.439 38.6427 185.092 37.968 185.928 37.484C186.764 36.9853 187.71 36.736 188.766 36.736C189.851 36.736 190.804 36.9853 191.626 37.484C192.462 37.968 193.107 38.6427 193.562 39.508C194.031 40.3733 194.266 41.3707 194.266 42.5C194.266 43.6293 194.031 44.6267 193.562 45.492C193.107 46.3573 192.469 47.0393 191.648 47.538C190.826 48.022 189.88 48.264 188.81 48.264ZM188.81 46.592C189.528 46.592 190.159 46.4233 190.702 46.086C191.244 45.734 191.67 45.25 191.978 44.634C192.286 44.018 192.44 43.3067 192.44 42.5C192.44 41.6933 192.278 40.982 191.956 40.366C191.648 39.75 191.215 39.2733 190.658 38.936C190.115 38.584 189.484 38.408 188.766 38.408C188.047 38.408 187.416 38.584 186.874 38.936C186.331 39.2733 185.898 39.75 185.576 40.366C185.268 40.982 185.114 41.6933 185.114 42.5C185.114 43.3067 185.268 44.018 185.576 44.634C185.898 45.25 186.338 45.734 186.896 46.086C187.453 46.4233 188.091 46.592 188.81 46.592ZM204.297 48L204.187 45.976V37H205.947V48H204.297ZM196.465 43.292V37H198.225V42.632L196.465 43.292ZM198.225 42.632C198.225 43.7173 198.35 44.546 198.599 45.118C198.848 45.69 199.193 46.086 199.633 46.306C200.088 46.5113 200.594 46.614 201.151 46.614C202.104 46.614 202.845 46.2693 203.373 45.58C203.916 44.8907 204.187 43.93 204.187 42.698H205.045C205.045 43.8567 204.876 44.854 204.539 45.69C204.202 46.526 203.71 47.164 203.065 47.604C202.434 48.044 201.664 48.264 200.755 48.264C199.42 48.264 198.364 47.8533 197.587 47.032C196.824 46.2107 196.45 44.964 196.465 43.292L198.225 42.632ZM209.019 48V37H210.669L210.779 39.024V48H209.019ZM216.741 48V42.368L218.501 41.708V48H216.741ZM216.741 42.368C216.741 41.2827 216.616 40.454 216.367 39.882C216.117 39.31 215.773 38.9213 215.333 38.716C214.893 38.496 214.394 38.386 213.837 38.386C212.869 38.386 212.113 38.7307 211.571 39.42C211.043 40.0947 210.779 41.0553 210.779 42.302H209.921C209.921 41.1433 210.089 40.146 210.427 39.31C210.764 38.474 211.248 37.836 211.879 37.396C212.524 36.956 213.301 36.736 214.211 36.736C215.545 36.736 216.594 37.1467 217.357 37.968C218.134 38.7893 218.515 40.036 218.501 41.708L216.741 42.368ZM225.642 48.264C224.571 48.264 223.743 47.9853 223.156 47.428C222.569 46.8707 222.276 46.086 222.276 45.074V33.568H224.036V44.898C224.036 45.4553 224.183 45.888 224.476 46.196C224.784 46.4893 225.209 46.636 225.752 46.636C225.928 46.636 226.097 46.614 226.258 46.57C226.434 46.5113 226.661 46.3793 226.94 46.174L227.622 47.604C227.241 47.8533 226.896 48.022 226.588 48.11C226.28 48.2127 225.965 48.264 225.642 48.264ZM220.362 38.562V37H227.336V38.562H220.362ZM234.613 48.264C233.542 48.264 232.596 48.022 231.775 47.538C230.968 47.0393 230.33 46.3573 229.861 45.492C229.392 44.6267 229.157 43.6293 229.157 42.5C229.157 41.3707 229.384 40.3733 229.839 39.508C230.308 38.6427 230.954 37.968 231.775 37.484C232.596 36.9853 233.528 36.736 234.569 36.736C235.596 36.736 236.483 36.9927 237.231 37.506C237.979 38.0047 238.558 38.7087 238.969 39.618C239.38 40.5273 239.585 41.598 239.585 42.83H237.825C237.825 41.8913 237.7 41.092 237.451 40.432C237.202 39.7573 236.835 39.2367 236.351 38.87C235.867 38.5033 235.266 38.32 234.547 38.32C233.828 38.32 233.198 38.496 232.655 38.848C232.127 39.1853 231.716 39.6693 231.423 40.3C231.13 40.9307 230.983 41.6713 230.983 42.522C230.983 43.358 231.144 44.084 231.467 44.7C231.79 45.3013 232.23 45.778 232.787 46.13C233.344 46.4673 233.982 46.636 234.701 46.636C235.478 46.636 236.131 46.4527 236.659 46.086C237.187 45.7193 237.598 45.2427 237.891 44.656L239.453 45.426C239.16 45.998 238.778 46.4967 238.309 46.922C237.854 47.3473 237.319 47.6773 236.703 47.912C236.087 48.1467 235.39 48.264 234.613 48.264ZM230.345 42.83V41.312H238.507V42.83H230.345ZM242.836 42.038C242.836 40.85 243.063 39.8893 243.518 39.156C243.973 38.408 244.552 37.858 245.256 37.506C245.975 37.1393 246.73 36.956 247.522 36.956V38.606C246.877 38.606 246.253 38.716 245.652 38.936C245.065 39.1413 244.581 39.486 244.2 39.97C243.819 40.454 243.628 41.114 243.628 41.95L242.836 42.038ZM241.868 48V37H243.628V48H241.868Z" fill="white"/>
          <g clipPath="url(#clip0_footer)">
            <path d="M201.888 74.4027C201.888 74.436 201.909 74.4582 201.941 74.4582H203.621C203.823 74.4582 203.983 74.625 203.983 74.8253V79.8742C203.983 79.9076 204.004 79.9298 204.035 79.9298H204.78C204.812 79.9298 204.833 79.9076 204.833 79.8742V72.1562C204.833 72.1228 204.812 72.1006 204.78 72.1006H204.035C204.004 72.1006 203.983 72.1228 203.983 72.1562V72.968C203.983 73.3684 203.663 73.702 203.281 73.702H201.941C201.909 73.702 201.888 73.7242 201.888 73.7576V74.4027ZM201.041 72.8791C201.072 72.8791 201.093 72.8568 201.093 72.8235V72.1562C201.093 72.1228 201.072 72.1006 201.041 72.1006H197.117C197.085 72.1006 197.043 72.1006 197.032 72.1562L196.553 76.1042C196.553 76.1375 196.574 76.1598 196.606 76.1598H197.329C197.361 76.1598 197.383 76.1486 197.404 76.1153C197.776 75.537 198.34 75.2701 199.041 75.2701C200.073 75.2701 200.785 76.093 200.785 77.2496C200.785 78.5063 200.073 79.2626 199.041 79.2626C197.829 79.2626 197.319 78.3617 197.319 77.7612C197.319 77.7279 197.297 77.7056 197.266 77.7056H196.521C196.49 77.7056 196.468 77.7279 196.468 77.7612C196.468 78.6398 197.191 80.041 199.041 80.041C200.583 80.041 201.646 78.9845 201.646 77.2496C201.646 75.6149 200.594 74.4916 199.148 74.4916C198.372 74.4916 197.819 74.8141 197.574 75.0699C197.542 75.1033 197.468 75.0922 197.478 75.0143L197.744 72.9458C197.755 72.8791 197.787 72.8791 197.819 72.8791H201.041ZM193.635 76.4267C193.603 76.4711 193.561 76.4711 193.529 76.4267L192.04 74.3581C192.008 74.3137 191.987 74.3026 191.955 74.3026H191.19C191.157 74.3026 191.136 74.336 191.157 74.3693L193.061 77.0939C193.093 77.1385 193.093 77.1606 193.061 77.2052L191.157 79.8742C191.147 79.8964 191.157 79.9298 191.19 79.9298H191.998C192.051 79.9298 192.061 79.9076 192.082 79.8742L193.529 77.8835C193.561 77.8391 193.603 77.8391 193.635 77.8835L195.081 79.8742C195.102 79.9076 195.123 79.9298 195.166 79.9298H195.985C196.028 79.9298 196.028 79.8853 196.017 79.8742L194.103 77.2052C194.071 77.1606 194.071 77.1385 194.103 77.0939L196.017 74.3693C196.038 74.336 196.017 74.3026 195.985 74.3026H195.209C195.177 74.3026 195.156 74.3137 195.123 74.3581L193.635 76.4267ZM186.086 79.8742C186.086 79.9076 186.107 79.9298 186.139 79.9298H186.883C186.915 79.9298 186.936 79.9076 186.936 79.8742V76.7937C186.936 75.8373 187.149 74.9698 188.265 74.9698C189.34 74.9698 189.605 75.8706 189.605 76.7937V79.8742C189.605 79.9076 189.626 79.9298 189.658 79.9298H190.403C190.435 79.9298 190.456 79.9076 190.456 79.8742V76.7825C190.456 75.1144 189.86 74.1914 188.372 74.1914C187.596 74.1914 187.106 74.4694 186.724 75.0699C186.702 75.1033 186.639 75.1033 186.617 75.0699C186.394 74.7252 185.969 74.1914 184.969 74.1914C184.097 74.1914 183.683 74.6473 183.512 74.9364C183.481 74.9921 183.428 74.9809 183.417 74.9142L183.31 74.3693C183.3 74.3248 183.279 74.3026 183.247 74.3026H182.619C182.587 74.3026 182.566 74.3248 182.566 74.3581V79.8742C182.566 79.9076 182.587 79.9298 182.619 79.9298H183.364C183.396 79.9298 183.417 79.9076 183.417 79.8742V76.7937C183.417 75.8373 183.683 74.9698 184.746 74.9698C185.873 74.9698 186.086 75.8595 186.086 76.7937V79.8742ZM176.857 79.1069C176.835 79.1736 176.761 79.1736 176.74 79.1069L175.293 74.3581C175.283 74.3137 175.251 74.3026 175.219 74.3026H174.432C174.39 74.3026 174.379 74.3248 174.39 74.3581L176.187 79.9298C176.378 80.5303 176.282 81.3645 175.591 81.3645H174.464C174.432 81.3645 174.411 81.3867 174.411 81.42V82.0762C174.411 82.1095 174.432 82.1318 174.464 82.1318H175.655C176.591 82.1318 176.846 81.6425 177.144 80.7194L179.196 74.3581C179.206 74.3248 179.185 74.3026 179.153 74.3026H178.366C178.335 74.3026 178.303 74.3137 178.292 74.3581L176.857 79.1069ZM173.22 77.1162C173.22 78.384 172.561 79.2626 171.434 79.2626C170.307 79.2626 169.732 78.384 169.732 77.1162C169.732 75.8262 170.307 74.9698 171.434 74.9698C172.561 74.9698 173.22 75.8484 173.22 77.1162ZM168.882 79.8742C168.882 79.9076 168.903 79.9298 168.935 79.9298H169.562C169.605 79.9298 169.615 79.9187 169.626 79.8742L169.732 79.3182C169.743 79.2515 169.807 79.2515 169.839 79.2959C169.892 79.3738 170.296 80.041 171.561 80.041C173.188 80.041 174.071 78.8511 174.071 77.1162C174.071 75.3813 173.124 74.1914 171.561 74.1914C170.509 74.1914 170.009 74.7141 169.839 74.9476C169.807 74.9921 169.732 74.9698 169.732 74.9142V72.1562C169.732 72.1228 169.711 72.1006 169.679 72.1006H168.935C168.903 72.1006 168.882 72.1228 168.882 72.1562V79.8742ZM160.45 77.1162C160.45 75.8484 161.109 74.9698 162.236 74.9698C163.363 74.9698 163.938 75.8262 163.938 77.1162C163.938 78.384 163.363 79.2626 162.236 79.2626C161.109 79.2626 160.45 78.384 160.45 77.1162ZM164.788 72.1562C164.788 72.1228 164.767 72.1006 164.735 72.1006H163.991C163.959 72.1006 163.938 72.1228 163.938 72.1562V74.9142C163.938 74.9698 163.863 74.9921 163.831 74.9476C163.661 74.7141 163.161 74.1914 162.109 74.1914C160.546 74.1914 159.599 75.3813 159.599 77.1162C159.599 78.8511 160.482 80.041 162.109 80.041C163.374 80.041 163.778 79.3738 163.831 79.2959C163.863 79.2515 163.927 79.2515 163.938 79.3182L164.044 79.8742C164.055 79.9187 164.065 79.9298 164.108 79.9298H164.735C164.767 79.9298 164.788 79.9076 164.788 79.8742V72.1562ZM157.941 76.638C157.941 76.6713 157.919 76.6825 157.887 76.6825H154.676C154.644 76.6825 154.623 76.6713 154.623 76.638C154.623 76.0152 155.155 74.9698 156.303 74.9698C157.473 74.9698 157.941 75.904 157.941 76.638ZM158.77 77.4609C158.844 77.4609 158.855 77.3275 158.855 77.1162C158.855 75.3813 157.887 74.1914 156.303 74.1914C154.708 74.1914 153.709 75.3702 153.709 77.1162C153.709 78.8511 154.751 80.041 156.303 80.041C157.462 80.041 158.419 79.5183 158.674 78.473C158.685 78.4285 158.642 78.4174 158.621 78.4174H157.824C157.792 78.4174 157.76 78.4285 157.739 78.473C157.537 78.8734 157.079 79.2626 156.303 79.2626C155.25 79.2626 154.623 78.4174 154.623 77.5166C154.623 77.4832 154.644 77.4609 154.676 77.4609H158.77ZM150.37 79.8742C150.37 79.9076 150.391 79.9298 150.423 79.9298H151.167C151.199 79.9298 151.221 79.9076 151.221 79.8742V76.8715C151.221 75.6593 151.688 75.0699 152.837 75.0699H153.283C153.315 75.0699 153.336 75.0476 153.336 75.0143V74.2469C153.336 74.2136 153.315 74.1914 153.283 74.1914H152.805C151.975 74.1914 151.518 74.6807 151.327 74.9364C151.284 74.9921 151.231 74.9698 151.221 74.9142L151.114 74.3581C151.104 74.3137 151.093 74.3026 151.05 74.3026H150.423C150.391 74.3026 150.37 74.3248 150.37 74.3581V79.8742ZM148.201 76.638C148.201 76.6713 148.179 76.6825 148.148 76.6825H144.936C144.905 76.6825 144.883 76.6713 144.883 76.638C144.883 76.0152 145.415 74.9698 146.563 74.9698C147.733 74.9698 148.201 75.904 148.201 76.638ZM149.03 77.4609C149.105 77.4609 149.115 77.3275 149.115 77.1162C149.115 75.3813 148.148 74.1914 146.563 74.1914C144.968 74.1914 143.969 75.3702 143.969 77.1162C143.969 78.8511 145.011 80.041 146.563 80.041C147.722 80.041 148.679 79.5183 148.934 78.473C148.945 78.4285 148.903 78.4174 148.881 78.4174H148.084C148.052 78.4174 148.02 78.4285 147.999 78.473C147.797 78.8734 147.339 79.2626 146.563 79.2626C145.511 79.2626 144.883 78.4174 144.883 77.5166C144.883 77.4832 144.905 77.4609 144.936 77.4609H149.03ZM140.375 74.3693C140.364 74.3248 140.332 74.3026 140.3 74.3026H139.078C139.046 74.3026 139.014 74.3248 139.003 74.3693L137.972 79.1069C137.951 79.1958 137.865 79.1958 137.844 79.1069L136.866 74.3693C136.855 74.3137 136.823 74.3026 136.792 74.3026H136.069C136.026 74.3026 136.005 74.3248 136.015 74.3693L137.27 79.8742C137.281 79.9076 137.302 79.9298 137.334 79.9298H138.472C138.503 79.9298 138.525 79.9076 138.535 79.8742L139.641 75.1367C139.652 75.0699 139.748 75.0699 139.758 75.1367L140.853 79.8742C140.864 79.9076 140.885 79.9298 140.917 79.9298H142.055C142.087 79.9298 142.108 79.9076 142.119 79.8742L143.363 74.3693C143.373 74.3248 143.342 74.3026 143.31 74.3026H142.587C142.555 74.3026 142.533 74.3137 142.523 74.3693L141.545 79.1069C141.523 79.1958 141.438 79.1958 141.417 79.1069L140.375 74.3693ZM134.612 77.1162C134.612 78.3951 133.953 79.2626 132.826 79.2626C131.698 79.2626 131.039 78.3951 131.039 77.1162C131.039 75.8373 131.698 74.9698 132.826 74.9698C133.953 74.9698 134.612 75.8373 134.612 77.1162ZM135.462 77.1162C135.462 75.3813 134.484 74.1802 132.826 74.1802C131.156 74.1802 130.188 75.3702 130.188 77.1162C130.188 78.8511 131.156 80.041 132.826 80.041C134.484 80.041 135.462 78.8511 135.462 77.1162ZM127.573 72.8791C128.402 72.8791 128.955 73.6464 128.955 74.4249C128.955 75.1922 128.402 75.9596 127.573 75.9596H125.404C125.372 75.9596 125.351 75.9374 125.351 75.904V72.9346C125.351 72.9013 125.372 72.8791 125.404 72.8791H127.573ZM125.297 79.9298C125.329 79.9298 125.351 79.9076 125.351 79.8742V76.7937C125.351 76.7603 125.372 76.7381 125.404 76.7381H127.679C128.913 76.7381 129.806 75.7483 129.806 74.4249C129.806 73.1126 128.913 72.1006 127.679 72.1006H124.553C124.521 72.1006 124.5 72.1228 124.5 72.1562V79.8742C124.5 79.9076 124.521 79.9298 124.553 79.9298H125.297ZM235.381 67.7424C235.589 67.3881 235.487 66.9226 235.153 66.701L234.273 66.117C233.937 65.8938 233.493 66.0027 233.284 66.3599L230.652 70.8529C230.196 71.6212 229.398 72.0875 228.54 72.0875H225.795H225.787H223.301C222.443 72.0875 221.645 71.6212 221.189 70.8529L218.557 66.3587C218.349 66.0015 217.905 65.8925 217.568 66.1158L216.688 66.6998C216.354 66.9214 216.253 67.3869 216.46 67.7412L219.102 72.2411C220.015 73.7777 221.585 74.6951 223.301 74.6951H225.787H225.795H228.54C230.256 74.6951 231.825 73.7777 232.739 72.2411L235.381 67.7424ZM235.392 84.2587C235.6 84.613 235.499 85.0784 235.165 85.3001L234.285 85.8841C233.948 86.1073 233.505 85.9984 233.295 85.6412L230.667 81.1483C230.211 80.38 229.413 79.9138 228.555 79.9138H225.811H225.803H223.316C222.458 79.9138 221.66 80.38 221.204 81.1483C221.204 81.1483 219.378 84.2669 218.575 85.6391C218.366 85.9962 217.922 86.1045 217.586 85.8813L216.706 85.2973C216.372 85.0757 216.27 84.6102 216.478 84.2558L219.117 79.7601C220.03 78.2235 221.6 77.3061 223.316 77.3061H225.803H225.811H228.555C230.271 77.3061 231.841 78.2235 232.754 79.7601L235.392 84.2587Z" fill="white"/>
          </g>
          <defs>
            <clipPath id="clip0_footer">
              <rect width="111" height="20" fill="white" transform="translate(124.5 66)"/>
            </clipPath>
          </defs>
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
              More categories
            </div>

            {/* Overflow category list */}
            <div style={{ flex: 1, overflow: "auto", minHeight: 0 }}>
              {overflowChips.map((cat) => {
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
