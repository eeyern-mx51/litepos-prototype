import { useState, useCallback } from "react";
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

// Sample product catalogue — empty array simulates a new merchant
const sampleProducts = [
  { name: "Flat White", price: "4.50", fav: true, cat: "Drinks" },
  { name: "Cappuccino", price: "4.80", fav: true, cat: "Drinks" },
  { name: "Long Black", price: "4.00", fav: false, cat: "Drinks" },
  { name: "Chai Latte", price: "5.20", fav: false, cat: "Drinks" },
  { name: "Lemon Squash", price: "3.50", fav: false, cat: "Drinks" },
  { name: "Blueberry Muffin", price: "5.50", fav: true, cat: "Food" },
  { name: "Banana Bread", price: "6.00", fav: false, cat: "Food" },
  { name: "Croissant", price: "4.50", fav: false, cat: "Food" },
  { name: "Avo Toast", price: "14.00", fav: false, cat: "Food" },
  { name: "Eggs Benny", price: "16.50", fav: true, cat: "Food" },
];

export default function Prototype() {
  const [screen, setScreen] = useState("home");
  const [basket, setBasket] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [products, setProducts] = useState(sampleProducts);
  // Toggle to simulate new merchant (empty catalogue) vs configured merchant
  const [catalogueEnabled, setCatalogueEnabled] = useState(true);

  const navigate = useCallback(
    (target, data) => {
      if (target === "edit-product") {
        setEditProduct(data || null);
        setScreen("add-product");
        return;
      }
      if (target === "add-product") {
        setEditProduct(null);
      }
      setScreen(target);
    },
    []
  );

  const screens = {
    home: <HomeScreen navigate={navigate} basket={basket} setBasket={setBasket} products={catalogueEnabled ? products : []} />,
    keypad: <KeypadScreen navigate={navigate} basket={basket} setBasket={setBasket} />,
    basket: <BasketScreen navigate={navigate} basket={basket} setBasket={setBasket} />,
    menu: <MenuScreen navigate={navigate} />,
    settings: <SettingsScreen navigate={navigate} />,
    "litepos-settings": <LitePOSSettingsScreen navigate={navigate} />,
    "product-catalog": <ProductCatalogScreen navigate={navigate} />,
    "add-product": <AddEditProductScreen navigate={navigate} editProduct={editProduct} />,
    history: <HistoryScreen navigate={navigate} />,
    reporting: <ReportingScreen navigate={navigate} />,
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
            checked={catalogueEnabled}
            onChange={(e) => setCatalogueEnabled(e.target.checked)}
            style={{ accentColor: tokens.color.fg.brand }}
          />
          Product catalogue
        </label>
        <div style={{ fontSize: 11, color: "#6B7084", lineHeight: 1.4 }}>
          {catalogueEnabled
            ? "Showing configured merchant with products"
            : "Showing new merchant — keypad only"}
        </div>
      </div>
    </div>
  );
}
