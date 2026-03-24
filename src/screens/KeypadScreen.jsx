import { useState } from "react";
import tokens from "../theme/tokens";
import TopAppBar from "../components/TopAppBar";
import Card from "../components/Card";
import Icon from "../components/Icon";
import InputBadge from "../components/InputBadge";
import { useSoftKeyboard } from "../components/SoftKeyboard";

/**
 * Keypad Manual Entry Screen
 *
 * Fully functional numeric keypad:
 *   - Builds amount digit by digit (integer cents, displayed as dollars)
 *   - Backspace removes last digit
 *   - Decimal point handled automatically (amount always shows 2 decimal places)
 *   - Optional item description
 *   - "Next →" adds to basket and navigates to basket or processes payment
 *
 * Design: Square-style large amount display, rounded key buttons, full-width CTA.
 */

function formatAmount(cents) {
  return (cents / 100).toFixed(2);
}

export default function KeypadScreen({ navigate, goBack, basket, setBasket, keyboardType = "onscreen" }) {
  const kb = useSoftKeyboard();
  const [cents, setCents] = useState(0);
  const [description, setDescription] = useState("");

  const handleKey = (key) => {
    if (key === "backspace") {
      setCents(Math.floor(cents / 10));
      return;
    }
    if (key === ".") return; // decimal is implicit
    const digit = parseInt(key, 10);
    if (isNaN(digit)) return;
    // Cap at $99,999.99
    const next = cents * 10 + digit;
    if (next > 9999999) return;
    setCents(next);
  };

  const handleNext = () => {
    if (cents === 0) return;
    const amount = cents / 100;
    const itemName = description.trim() || "Manual entry";
    if (setBasket && basket) {
      setBasket([...basket, { name: itemName, price: amount, qty: 1, manual: true }]);
    }
    // Return to home — merchant stays in selling flow, OrderBar shows the update
    navigate("home");
  };

  const canProceed = cents > 0;

  const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9, "00", 0, "backspace"];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: tokens.color.bg.page, minHeight: 0 }}>
      <TopAppBar title="Manual Entry" onBack={goBack} theme="light" />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
        }}
      >
        {/* ── Amount display ────────────────────────────────────── */}
        <div
          style={{
            padding: "24px 24px 8px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
            flexShrink: 0,
          }}
        >
          {/* Input method badges */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
            <InputBadge keyboardType={keyboardType} inputType="numeric" />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 4,
            }}
          >
            <span
              style={{
                fontSize: tokens.type.headlineLarge.size,
                fontWeight: 300,
                color: cents > 0 ? tokens.color.fg.emphasis : tokens.color.fg.disable,
              }}
            >
              $
            </span>
            <span
              style={{
                fontSize: tokens.type.displayLarge.size,
                fontWeight: 300,
                color: cents > 0 ? tokens.color.fg.emphasis : tokens.color.fg.disable,
                letterSpacing: "-1px",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {formatAmount(cents)}
            </span>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <InputBadge keyboardType={keyboardType} inputType="alpha" />
          </div>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onFocus={(e) => kb?.enabled && kb.show("alpha", e.target)}
            inputMode={kb?.enabled ? "none" : undefined}
            placeholder="Item description (optional)"
            style={{
              width: "100%",
              maxWidth: 300,
              height: 44,
              borderRadius: tokens.shape.full,
              border: `1px solid ${tokens.color.border.onpage}`,
              padding: "0 16px",
              fontSize: tokens.type.bodyMedium.size,
              background: tokens.color.bg.surface,
              color: tokens.color.fg.emphasis,
              textAlign: "center",
              outline: "none",
              fontFamily: "inherit",
            }}
          />
        </div>

        {/* ── Keypad grid ───────────────────────────────────────── */}
        {keyboardType === "physical" && (
          <div style={{ textAlign: "center", padding: "4px 32px 0", fontSize: 10, fontWeight: 600, color: "#1B8A4E", letterSpacing: "0.2px" }}>
            Mapped to hardware numeric keypad
          </div>
        )}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "8px 32px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 10,
              maxWidth: 300,
              margin: "0 auto",
              width: "100%",
            }}
          >
            {keys.map((k) => {
              const isBackspace = k === "backspace";
              const isDouble = k === "00";
              return (
                <button
                  key={k}
                  onClick={() => {
                    if (isBackspace) {
                      handleKey("backspace");
                    } else if (isDouble) {
                      handleKey("0");
                      handleKey("0");
                    } else {
                      handleKey(String(k));
                    }
                  }}
                  style={{
                    height: 56,
                    borderRadius: tokens.shape.full,
                    border: "none",
                    background: isBackspace ? "transparent" : tokens.color.bg.surface,
                    fontSize: isDouble ? tokens.type.titleMedium.size : tokens.type.titleLarge.size,
                    fontWeight: 500,
                    color: isBackspace ? tokens.color.fg.brand : tokens.color.fg.emphasis,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: `all ${tokens.motion.duration.short4} ${tokens.motion.easing.standard}`,
                    fontFamily: "inherit",
                  }}
                >
                  {isBackspace ? (
                    <Icon name="delete" size={22} color={tokens.color.fg.brand} />
                  ) : (
                    k
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Action button ─────────────────────────────────────── */}
        <div style={{ padding: "12px 32px 20px", flexShrink: 0 }}>
          <button
            onClick={handleNext}
            disabled={!canProceed}
            style={{
              width: "100%",
              height: 56,
              borderRadius: tokens.shape.full,
              background: canProceed
                ? tokens.color.bg.action.primary.default
                : tokens.color.bg.action.primary.disable,
              color: tokens.color.fg.onAction,
              border: "none",
              fontSize: tokens.type.titleSmall.size,
              fontWeight: 600,
              cursor: canProceed ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              transition: `all ${tokens.motion.duration.medium2} ${tokens.motion.easing.expressive}`,
              fontFamily: "inherit",
            }}
          >
            {canProceed
              ? `Add $${formatAmount(cents)} to basket`
              : "Enter amount"}
            {canProceed && <Icon name="chevron" size={20} color={tokens.color.fg.onAction} />}
          </button>
        </div>
      </div>
    </div>
  );
}
