import { useState, useCallback, useRef, useEffect } from "react";
import tokens from "./theme/tokens";
import StatusBar from "./components/StatusBar";

// Screens
import HomeScreen from "./screens/HomeScreen";
import KeypadScreen from "./screens/KeypadScreen";
import BasketScreen from "./screens/BasketScreen";
import MenuScreen from "./screens/MenuScreen";
import SettingsScreen from "./screens/SettingsScreen";
import LitePOSSettingsScreen from "./screens/LitePOSSettingsScreen";
import ProductCatalogScreen from "./screens/ProductCatalogScreen";
import AddEditProductScreen from "./screens/AddEditProductScreen";
import HistoryScreen from "./screens/HistoryScreen";
import ReportingScreen from "./screens/ReportingScreen";
import ScanScreen from "./screens/ScanScreen";
import DefaultHomeScreen from "./screens/DefaultHomeScreen";
import ImportProductsScreen from "./screens/ImportProductsScreen";
import PaymentScreen from "./screens/PaymentScreen";
import SplitByItemScreen from "./screens/SplitByItemScreen";
import SplitEquallyScreen from "./screens/SplitEquallyScreen";
import PaymentProcessingScreen from "./screens/PaymentProcessingScreen";

// Sample product catalogue — empty array simulates a new merchant
const sampleProducts = [
  // Drinks
  { name: "Flat White", price: "4.50", fav: true, cat: "Drinks" },
  { name: "Cappuccino", price: "4.80", fav: true, cat: "Drinks" },
  { name: "Long Black", price: "4.00", fav: false, cat: "Drinks" },
  { name: "Chai Latte", price: "5.20", fav: false, cat: "Drinks" },
  { name: "Lemon Squash", price: "3.50", fav: false, cat: "Drinks" },
  { name: "Matcha Latte", price: "5.80", fav: false, cat: "Drinks" },
  { name: "Iced Coffee", price: "5.50", fav: true, cat: "Drinks" },
  { name: "Hot Chocolate", price: "4.50", fav: false, cat: "Drinks" },
  { name: "Fresh OJ", price: "6.00", fav: false, cat: "Drinks" },
  { name: "Espresso", price: "3.50", fav: false, cat: "Drinks" },
  // Food
  { name: "Blueberry Muffin", price: "5.50", fav: true, cat: "Food" },
  { name: "Banana Bread", price: "6.00", fav: false, cat: "Food" },
  { name: "Croissant", price: "4.50", fav: false, cat: "Food" },
  { name: "Avo Toast", price: "14.00", fav: false, cat: "Food" },
  { name: "Eggs Benny", price: "16.50", fav: true, cat: "Food" },
  { name: "Acai Bowl", price: "15.00", fav: false, cat: "Food" },
  { name: "Granola Bowl", price: "12.00", fav: false, cat: "Food" },
  { name: "BLT Sandwich", price: "11.50", fav: false, cat: "Food" },
  { name: "Caesar Salad", price: "13.00", fav: false, cat: "Food" },
  { name: "Chicken Wrap", price: "12.50", fav: true, cat: "Food" },
];

export default function Prototype() {
  const [screen, setScreen] = useState("home");
  const [basket, setBasket] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [products, setProducts] = useState(sampleProducts);
  // Toggle to simulate new merchant (empty catalogue) vs configured merchant
  const [catalogueEnabled, setCatalogueEnabled] = useState(true);
  // LitePOS feature toggle — when off, show default terminal home
  const [litePosEnabled, setLitePosEnabled] = useState(true);

  // ── Split payment state (persists across navigation to payment-processing) ──
  // splitByItem: { paidIds: string[] }  — tracks which individual unit IDs are paid
  // splitEqually: { patronCount, paidCount }  — tracks how many patrons have paid
  // paymentReturn: screen name to navigate back to after payment-processing completes
  // paymentAmount: the amount being charged in the current payment round
  const [splitState, setSplitState] = useState({
    byItem: { paidIds: [] },
    equally: { patronCount: 2, paidCount: 0 },
    returnTo: null,
    amount: null,
  });

  // ── Mobile & standalone PWA detection ──
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 500);
  const [isStandalone] = useState(() =>
    window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true
  );
  const [showMobileControls, setShowMobileControls] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 500px)");
    const handler = (e) => { setIsMobile(e.matches); if (!e.matches) setShowMobileControls(false); };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Three-finger simultaneous touch toggles controls
  const handleTouchStart = useCallback((e) => {
    if (e.touches.length >= 3) {
      e.preventDefault();
      setShowMobileControls((v) => !v);
    }
  }, []);

  const historyRef = useRef(["home"]);

  const navigate = useCallback(
    (target, data) => {
      if (target === "edit-product") {
        setEditProduct(data || null);
        historyRef.current.push("add-product");
        setScreen("add-product");
        return;
      }
      if (target === "add-product") {
        setEditProduct(null);
      }
      historyRef.current.push(target);
      setScreen(target);
    },
    []
  );

  const goBack = useCallback(() => {
    const history = historyRef.current;
    if (history.length > 1) {
      history.pop(); // remove current
      const prev = history[history.length - 1];
      setScreen(prev);
    } else {
      setScreen("home");
    }
  }, []);

  const screens = {
    home: litePosEnabled
      ? <HomeScreen navigate={navigate} basket={basket} setBasket={setBasket} products={catalogueEnabled ? products : []} />
      : <DefaultHomeScreen navigate={navigate} />,
    keypad: <KeypadScreen navigate={navigate} goBack={goBack} basket={basket} setBasket={setBasket} />,
    basket: <BasketScreen navigate={navigate} goBack={goBack} basket={basket} setBasket={setBasket} />,
    menu: <MenuScreen navigate={navigate} goBack={goBack} />,
    settings: <SettingsScreen navigate={navigate} goBack={goBack} />,
    "litepos-settings": <LitePOSSettingsScreen navigate={navigate} goBack={goBack} litePosEnabled={litePosEnabled} setLitePosEnabled={setLitePosEnabled} />,
    "product-catalog": <ProductCatalogScreen navigate={navigate} goBack={goBack} products={catalogueEnabled ? products : []} setProducts={setProducts} />,
    "add-product": <AddEditProductScreen navigate={navigate} goBack={goBack} editProduct={editProduct} products={products} setProducts={setProducts} />,
    history: <HistoryScreen navigate={navigate} goBack={goBack} />,
    reporting: <ReportingScreen navigate={navigate} goBack={goBack} />,
    scan: <ScanScreen navigate={navigate} basket={basket} setBasket={setBasket} products={catalogueEnabled ? products : []} goBack={goBack} />,
    "import-scan": <ScanScreen navigate={navigate} basket={basket} setBasket={setBasket} products={[]} mode="import" goBack={goBack} />,
    "import-products": <ImportProductsScreen navigate={navigate} goBack={goBack} />,
    payment: <PaymentScreen navigate={navigate} goBack={goBack} basket={basket} onSelectSplit={(type) => {
      // Reset split state when starting a new split
      if (type === "split-by-item") {
        setSplitState(s => ({ ...s, byItem: { paidIds: [] }, returnTo: null, amount: null }));
      } else if (type === "split-equally") {
        setSplitState(s => ({ ...s, equally: { patronCount: 2, paidCount: 0 }, returnTo: null, amount: null }));
      }
      navigate(type);
    }} />,
    "split-by-item": <SplitByItemScreen navigate={navigate} goBack={goBack} basket={basket} setBasket={setBasket} splitState={splitState} setSplitState={setSplitState} />,
    "split-equally": <SplitEquallyScreen navigate={navigate} goBack={goBack} basket={basket} setBasket={setBasket} splitState={splitState} setSplitState={setSplitState} />,
    "payment-processing": <PaymentProcessingScreen navigate={navigate} basket={basket} setBasket={setBasket} splitState={splitState} setSplitState={setSplitState} />,
  };

  // ── Shared demo controls content ──
  const demoControlsContent = (
    <>
      <div style={{ fontWeight: 600, color: "#6B7084", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>
        Demo controls
      </div>
      <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", color: "#212638" }}>
        <input
          type="checkbox"
          checked={litePosEnabled}
          onChange={(e) => setLitePosEnabled(e.target.checked)}
          style={{ accentColor: tokens.color.fg.brand }}
        />
        LitePOS enabled
      </label>
      <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", color: "#212638", opacity: litePosEnabled ? 1 : 0.4, pointerEvents: litePosEnabled ? "auto" : "none" }}>
        <input
          type="checkbox"
          checked={catalogueEnabled}
          onChange={(e) => setCatalogueEnabled(e.target.checked)}
          style={{ accentColor: tokens.color.fg.brand }}
        />
        Product catalogue
      </label>
      <div style={{ fontSize: 11, color: "#6B7084", lineHeight: 1.4 }}>
        {!litePosEnabled
          ? "LitePOS off — showing default terminal home"
          : catalogueEnabled
          ? `LitePOS on — ${products.length} products`
          : "LitePOS on — new merchant, keypad only"}
      </div>
      <div style={{ borderTop: "1px solid #E0E0E4", paddingTop: 10, marginTop: 2 }}>
        <button
          onClick={() => {
            setProducts(sampleProducts);
            setBasket([]);
            setEditProduct(null);
            setScreen("home");
            historyRef.current = ["home"];
            setCatalogueEnabled(true);
            setLitePosEnabled(true);
            setSplitState({ byItem: { paidIds: [] }, equally: { patronCount: 2, paidCount: 0 }, returnTo: null, amount: null });
          }}
          style={{
            width: "100%",
            padding: "8px 12px",
            borderRadius: 8,
            border: "1px solid #E0E0E4",
            background: "#fff",
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 600,
            color: "#E53935",
            fontFamily: "'Figtree', sans-serif",
          }}
        >
          Reset All Data
        </button>
      </div>
    </>
  );

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: isMobile ? "stretch" : "flex-start",
        gap: 16,
        padding: isMobile ? 0 : "20px 0",
        minHeight: isMobile ? (isStandalone ? "100%" : "100dvh") : undefined,
        height: isStandalone ? "100%" : undefined,
        width: isMobile ? "100%" : undefined,
      }}
    >
      {/* ── Device frame ──────────────────────────────── */}
      <div
        onTouchStart={isMobile ? handleTouchStart : undefined}
        style={{
          width: isMobile ? "100%" : 393,
          flex: isMobile ? 1 : undefined,
          height: isMobile ? (isStandalone ? "100%" : "100dvh") : 852,
          borderRadius: isMobile ? 0 : 4,
          overflow: "hidden",
          background: tokens.color.bg.page,
          fontFamily: "'Figtree', -apple-system, sans-serif",
          display: "flex",
          flexDirection: "column",
          boxShadow: isMobile
            ? "none"
            : "0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)",
          position: "relative",
          WebkitFontSmoothing: "antialiased",
        }}
      >
        <StatusBar />

        {/* Screen content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {screens[screen] || screens.home}
        </div>

        {/* ── Mobile: floating demo controls overlay ──── */}
        {isMobile && showMobileControls && (
          <>
            {/* Scrim */}
            <div
              onClick={(e) => { e.stopPropagation(); setShowMobileControls(false); }}
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,0.5)",
                zIndex: 9998,
                animation: "scrimFadeIn 0.15s ease-out",
              }}
            />
            {/* Controls card */}
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "absolute",
                bottom: 24,
                left: 16,
                right: 16,
                zIndex: 9999,
                padding: "16px 18px",
                background: "#F8F9FA",
                borderRadius: 16,
                border: "1px solid #E0E0E4",
                fontSize: 13,
                fontFamily: "'Figtree', sans-serif",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
                animation: "sheetSlideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            >
              {/* Close button */}
              <button
                onClick={() => setShowMobileControls(false)}
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: 18,
                  color: "#6B7084",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ✕
              </button>
              {demoControlsContent}
              <div style={{ fontSize: 10, color: "#9CA0AF", textAlign: "center", marginTop: 2 }}>
                3-finger tap to toggle · Tap outside to close
              </div>
            </div>
            <style>
              {`
                @keyframes sheetSlideUp {
                  0% { transform: translateY(100%); opacity: 0; }
                  100% { transform: translateY(0); opacity: 1; }
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

      {/* ── Desktop: demo controls sidebar ────────────── */}
      {!isMobile && (
        <div
          style={{
            padding: "12px 16px",
            background: "#F8F9FA",
            borderRadius: 12,
            border: "1px solid #E0E0E4",
            fontSize: 13,
            fontFamily: "'Figtree', sans-serif",
            display: "flex",
            flexDirection: "column",
            gap: 10,
            marginTop: 40,
            minWidth: 180,
          }}
        >
          {demoControlsContent}
        </div>
      )}
    </div>
  );
}
