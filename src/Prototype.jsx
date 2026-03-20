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

export default function Prototype() {
  const [screen, setScreen] = useState("home");
  const [basket, setBasket] = useState([]);
  const [editProduct, setEditProduct] = useState(null);

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
    home: <HomeScreen navigate={navigate} basket={basket} setBasket={setBasket} />,
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
    <div
      style={{
        width: 393,
        height: 852,
        margin: "20px auto",
        borderRadius: 4,
        overflow: "hidden",
        background: tokens.color.bg.page,
        fontFamily: "'Google Sans', 'Roboto', -apple-system, sans-serif",
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
  );
}
