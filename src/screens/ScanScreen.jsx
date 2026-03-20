import { useState, useEffect, useRef } from "react";
import tokens from "../theme/tokens";
import Icon from "../components/Icon";
import OrderBar from "../components/OrderBar";

export default function ScanScreen({ navigate, basket, setBasket, products = [] }) {
  const [phase, setPhase] = useState("scanning"); // scanning | found | error
  const [matchedProduct, setMatchedProduct] = useState(null);
  const [scanLine, setScanLine] = useState(0);
  const timerRef = useRef(null);

  const total = basket.reduce((s, b) => s + b.price * b.qty, 0);
  const itemCount = basket.reduce((s, b) => s + b.qty, 0);

  // Animated scan line
  useEffect(() => {
    const interval = setInterval(() => {
      setScanLine((prev) => (prev >= 100 ? 0 : prev + 1.5));
    }, 20);
    return () => clearInterval(interval);
  }, []);

  // Auto-simulate a scan after 2 seconds
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      simulateScan();
    }, 2200);
    return () => clearTimeout(timerRef.current);
  }, []);

  const simulateScan = () => {
    // 75% chance of match, 25% no match
    const matched = Math.random() < 0.75 && products.length > 0;

    if (matched) {
      const found = products[Math.floor(Math.random() * products.length)];
      setMatchedProduct(found);
      setPhase("found");

      // Add to basket
      const existing = basket.find((b) => b.name === found.name);
      if (existing) {
        setBasket(basket.map((b) => (b.name === found.name ? { ...b, qty: b.qty + 1 } : b)));
      } else {
        setBasket([...basket, { name: found.name, price: parseFloat(found.price), qty: 1 }]);
      }

      // Return to home after showing success
      setTimeout(() => navigate("home"), 1800);
    } else {
      setPhase("error");
      setMatchedProduct(null);

      // Reset to scanning after showing error
      setTimeout(() => {
        setPhase("scanning");
        // Schedule another scan attempt
        timerRef.current = setTimeout(() => simulateScan(), 2200);
      }, 2500);
    }
  };

  const handleTapToScan = () => {
    if (phase !== "scanning") return;
    clearTimeout(timerRef.current);
    simulateScan();
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, background: "#000" }}>

      {/* ── Top bar ─────────────────────────────────── */}
      <div
        style={{
          padding: "6px 4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
          position: "relative",
          zIndex: 5,
        }}
      >
        <button
          onClick={() => navigate("home")}
          style={{
            width: 48, height: 48, borderRadius: tokens.shape.full,
            border: "none", background: "transparent", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <Icon name="back" size={24} color="#fff" />
        </button>
        <span style={{
          fontSize: tokens.type.titleMedium.size,
          fontWeight: tokens.type.titleMedium.weight,
          color: "#fff",
        }}>
          Scan Barcode
        </span>
        <button
          onClick={() => navigate("home")}
          style={{
            width: 48, height: 48, borderRadius: tokens.shape.full,
            border: "none", background: "transparent", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <Icon name="close" size={24} color="#fff" />
        </button>
      </div>

      {/* ── Camera viewfinder area ──────────────────── */}
      <div
        onClick={handleTapToScan}
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          cursor: phase === "scanning" ? "pointer" : "default",
        }}
      >
        {/* Simulated camera background — dark with subtle noise */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
          opacity: 0.9,
        }} />

        {/* Scan target area */}
        <div style={{
          position: "relative",
          width: 260,
          height: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          {/* Corner brackets */}
          {/* Top-left */}
          <div style={{ position: "absolute", top: 0, left: 0, width: 40, height: 40, borderTop: "3px solid #fff", borderLeft: "3px solid #fff", borderRadius: "4px 0 0 0" }} />
          {/* Top-right */}
          <div style={{ position: "absolute", top: 0, right: 0, width: 40, height: 40, borderTop: "3px solid #fff", borderRight: "3px solid #fff", borderRadius: "0 4px 0 0" }} />
          {/* Bottom-left */}
          <div style={{ position: "absolute", bottom: 0, left: 0, width: 40, height: 40, borderBottom: "3px solid #fff", borderLeft: "3px solid #fff", borderRadius: "0 0 0 4px" }} />
          {/* Bottom-right */}
          <div style={{ position: "absolute", bottom: 0, right: 0, width: 40, height: 40, borderBottom: "3px solid #fff", borderRight: "3px solid #fff", borderRadius: "0 0 4px 0" }} />

          {/* Animated scan line */}
          {phase === "scanning" && (
            <div style={{
              position: "absolute",
              left: 8,
              right: 8,
              top: `${scanLine}%`,
              height: 2,
              background: `linear-gradient(90deg, transparent 0%, ${tokens.color.fg.brand} 20%, ${tokens.color.fg.brand} 80%, transparent 100%)`,
              boxShadow: `0 0 8px ${tokens.color.fg.brand}, 0 0 20px ${tokens.color.fg.brand}40`,
              transition: scanLine === 0 ? "none" : "top 20ms linear",
            }} />
          )}

          {/* Success flash */}
          {phase === "found" && (
            <div style={{
              position: "absolute", inset: -4,
              border: `3px solid ${tokens.color.bg.action.primary.default}`,
              borderRadius: 8,
              boxShadow: `0 0 20px ${tokens.color.bg.action.primary.default}60`,
              animation: "none",
            }} />
          )}

          {/* Error flash */}
          {phase === "error" && (
            <div style={{
              position: "absolute", inset: -4,
              border: "3px solid #E53935",
              borderRadius: 8,
              boxShadow: "0 0 20px rgba(229,57,53,0.4)",
            }} />
          )}

          {/* Center icon based on state */}
          {phase === "scanning" && (
            <Icon name="scan" size={48} color="rgba(255,255,255,0.3)" />
          )}
          {phase === "found" && (
            <div style={{
              width: 64, height: 64, borderRadius: tokens.shape.full,
              background: tokens.color.bg.action.primary.default,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Icon name="check" size={36} color="#fff" />
            </div>
          )}
          {phase === "error" && (
            <div style={{
              width: 64, height: 64, borderRadius: tokens.shape.full,
              background: "#E53935",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Icon name="close" size={36} color="#fff" />
            </div>
          )}
        </div>

        {/* Helper text */}
        <div style={{
          position: "relative",
          marginTop: 32,
          textAlign: "center",
        }}>
          <div style={{
            fontSize: tokens.type.bodyMedium.size,
            color: "rgba(255,255,255,0.7)",
            fontWeight: 500,
          }}>
            {phase === "scanning" && "Point camera at barcode"}
            {phase === "found" && "Barcode matched!"}
            {phase === "error" && "Barcode not recognised"}
          </div>
          {phase === "scanning" && (
            <div style={{
              fontSize: tokens.type.bodySmall.size,
              color: "rgba(255,255,255,0.4)",
              marginTop: 4,
            }}>
              Tap anywhere to simulate scan
            </div>
          )}
        </div>
      </div>

      {/* ── Snackbar overlay ────────────────────────── */}
      {(phase === "found" || phase === "error") && (
        <div
          style={{
            position: "absolute",
            bottom: 80,
            left: 16,
            right: 16,
            background: phase === "found" ? tokens.color.bg.action.primary.default : "#E53935",
            borderRadius: tokens.shape.medium,
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            zIndex: 10,
            boxShadow: tokens.elevation.level3,
          }}
        >
          <Icon
            name={phase === "found" ? "check" : "error"}
            size={20}
            color="#fff"
          />
          <span style={{
            fontSize: tokens.type.bodyMedium.size,
            color: "#fff",
            fontWeight: 500,
            flex: 1,
          }}>
            {phase === "found"
              ? `Added ${matchedProduct?.name} — $${matchedProduct?.price}`
              : "Product not found — barcode doesn\u2019t match any items"}
          </span>
        </div>
      )}

      {/* ── Order bar ───────────────────────────────── */}
      <div style={{ flexShrink: 0, position: "relative", zIndex: 5 }}>
        <OrderBar
          itemCount={itemCount}
          total={total}
          onCharge={() => navigate("basket")}
        />
      </div>
    </div>
  );
}
