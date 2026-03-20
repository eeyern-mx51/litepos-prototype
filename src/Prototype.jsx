import { useState, useCallback, useRef } from "react";
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
    "product-catalog": <ProductCatalogScreen navigate={navigate} goBack={goBack} products={catalogueEnabled ? products : []} />,
    "add-product": <AddEditProductScreen navigate={navigate} goBack={goBack} editProduct={editProduct} />,
    history: <HistoryScreen navigate={navigate} goBack={goBack} />,
    reporting: <ReportingScreen navigate={navigate} goBack={goBack} />,
    scan: <ScanScreen navigate={navigate} basket={basket} setBasket={setBasket} products={catalogueEnabled ? products : []} goBack={goBack} />,
    "import-scan": <ScanScreen navigate={navigate} basket={basket} setBasket={setBasket} products={[]} mode="import" goBack={goBack} />,
    "import-products": <ImportProductsScreen navigate={navigate} goBack={goBack} />,
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", gap: 16, padding: "20px 0" }}>
      <div
        style={{
          width: 393,
          height: 852,
          borderRadius: 4,
          overflow: "hidden",
          background: tokens.color.bg.page,
          fontFamily: "'Figtree', -apple-system, sans-serif",
          display: "flex",
          flexDirection: "column",
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)",
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
      </div>

      {/* ── Demo controls (outside device frame) ──────── */}
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
            ? "LitePOS on — merchant with products"
            : "LitePOS on — new merchant, keypad only"}
        </div>
      </div>
    </div>
  );
}
