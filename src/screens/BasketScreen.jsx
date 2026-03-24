import { useState } from "react";
import tokens from "../theme/tokens";
import TopAppBar from "../components/TopAppBar";
import ListItem from "../components/ListItem";
import Icon from "../components/Icon";
import InputBadge from "../components/InputBadge";

export default function BasketScreen({ navigate, goBack, basket, setBasket, keyboardType = "onscreen" }) {
  const total = basket.reduce((s, b) => s + b.price * b.qty, 0);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editName, setEditName] = useState("");

  const startEditing = (index) => {
    setEditingIndex(index);
    setEditName(basket[index].name);
  };

  const finishEditing = () => {
    if (editingIndex !== null && editName.trim()) {
      setBasket(basket.map((b, i) => i === editingIndex ? { ...b, name: editName.trim() } : b));
    }
    setEditingIndex(null);
    setEditName("");
  };

  const increment = (name) => {
    setBasket(basket.map((b) => b.name === name ? { ...b, qty: b.qty + 1 } : b));
  };

  const decrement = (name) => {
    setBasket(
      basket
        .map((b) => b.name === name ? { ...b, qty: b.qty - 1 } : b)
        .filter((b) => b.qty > 0)
    );
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: tokens.color.bg.page, position: "relative" }}>
      <TopAppBar
        title="Basket"
        onBack={goBack}
        theme="light"
        actions={basket.length > 0
          ? [{ icon: "delete", onPress: () => setBasket([]) }]
          : [{ icon: "close", onPress: () => navigate("home") }]}
      />
      <div style={{ flex: 1, overflow: "auto", background: tokens.color.bg.page }}>
        {basket.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: tokens.color.fg.subtle,
              gap: 12,
            }}
          >
            <Icon name="cart" size={48} color={tokens.color.border.onpage} />
            <span style={{ fontSize: tokens.type.bodyLarge.size }}>Basket is empty</span>
          </div>
        ) : (
          basket.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "12px 16px",
                gap: 12,
                borderBottom: i < basket.length - 1 ? `1px solid ${tokens.color.border.onpage}` : "none",
              }}
            >
              {/* Item info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  onClick={item.manual ? (e) => { e.stopPropagation(); startEditing(i); } : undefined}
                  style={{
                    fontSize: tokens.type.bodyLarge.size,
                    fontWeight: 500,
                    color: tokens.color.fg.emphasis,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    cursor: item.manual ? "pointer" : "default",
                  }}
                >
                  {item.name}
                  {item.manual && (
                    <Icon name="edit" size={14} color={tokens.color.fg.subtle} />
                  )}
                </div>
                <div style={{
                  fontSize: tokens.type.bodySmall.size,
                  color: tokens.color.fg.subtle,
                  marginTop: 2,
                }}>
                  ${item.price.toFixed(2)} each
                </div>
              </div>

              {/* Quantity stepper */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 0,
                flexShrink: 0,
              }}>
                <button
                  onClick={() => decrement(item.name)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    border: `1.5px solid ${tokens.color.border.onpage}`,
                    background: tokens.color.bg.page,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0,
                    transition: "background 0.1s ease",
                  }}
                >
                  {item.qty === 1 ? (
                    <Icon name="delete" size={16} color={tokens.color.fg.error.icon} />
                  ) : (
                    <svg width={16} height={16} viewBox="0 0 24 24" fill={tokens.color.fg.emphasis}>
                      <path d="M19 13H5v-2h14v2z" />
                    </svg>
                  )}
                </button>
                <span style={{
                  width: 36,
                  textAlign: "center",
                  fontSize: tokens.type.titleMedium.size,
                  fontWeight: 600,
                  color: tokens.color.fg.emphasis,
                }}>
                  {item.qty}
                </span>
                <button
                  onClick={() => increment(item.name)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    border: `1.5px solid ${tokens.color.border.onpage}`,
                    background: tokens.color.bg.page,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0,
                    transition: "background 0.1s ease",
                  }}
                >
                  <Icon name="add" size={16} color={tokens.color.fg.emphasis} />
                </button>
              </div>

              {/* Line total */}
              <span style={{
                fontSize: tokens.type.titleMedium.size,
                fontWeight: 600,
                color: tokens.color.fg.brand,
                minWidth: 60,
                textAlign: "right",
                flexShrink: 0,
              }}>
                ${(item.price * item.qty).toFixed(2)}
              </span>
            </div>
          ))
        )}
      </div>
      {basket.length > 0 && (
        <div style={{ padding: 16, borderTop: `1px solid ${tokens.color.border.action.default}`, background: tokens.color.bg.page }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 16,
              fontSize: tokens.type.headlineSmall.size,
              fontWeight: 600,
            }}
          >
            <span style={{ color: tokens.color.fg.emphasis }}>Total</span>
            <span style={{ color: tokens.color.fg.brand }}>${total.toFixed(2)}</span>
          </div>
          <button
            onClick={() => navigate("payment")}
            style={{
              width: "100%",
              height: 56,
              borderRadius: tokens.shape.full,
              background: tokens.color.bg.action.primary.default,
              color: tokens.color.fg.onAction,
              border: "none",
              fontSize: tokens.type.labelLarge.size,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Proceed to Payment
          </button>
        </div>
      )}

      {/* ── Rename dialog for manual entries ──────────── */}
      {editingIndex !== null && (
        <>
          <div
            onClick={() => { setEditingIndex(null); setEditName(""); }}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.45)",
              zIndex: 50,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "calc(100% - 48px)",
              background: tokens.color.bg.page,
              borderRadius: tokens.shape.expressiveLarge,
              padding: "24px",
              zIndex: 51,
              boxShadow: tokens.elevation.level3,
            }}
          >
            <div
              style={{
                fontSize: tokens.type.titleLarge.size,
                fontWeight: tokens.type.titleLarge.weight,
                color: tokens.color.fg.emphasis,
              }}
            >
              Rename item
            </div>
            <div
              style={{
                fontSize: tokens.type.bodySmall.size,
                color: tokens.color.fg.subtle,
                marginTop: 4,
                marginBottom: 16,
              }}
            >
              ${basket[editingIndex]?.price.toFixed(2)} each
            </div>
            <input
              autoFocus
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") finishEditing();
                if (e.key === "Escape") { setEditingIndex(null); setEditName(""); }
              }}
              placeholder="Item name"
              style={{
                width: "100%",
                fontSize: tokens.type.bodyLarge.size,
                color: tokens.color.fg.emphasis,
                border: "none",
                borderBottom: `2px solid ${tokens.color.fg.brand}`,
                outline: "none",
                background: "transparent",
                fontFamily: "inherit",
                padding: "8px 0",
                boxSizing: "border-box",
              }}
            />
            <div style={{ marginTop: 8 }}>
              <InputBadge keyboardType={keyboardType} inputType="alpha" />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 8,
                marginTop: 16,
              }}
            >
              <button
                onClick={() => { setEditingIndex(null); setEditName(""); }}
                style={{
                  padding: "10px 20px",
                  borderRadius: tokens.shape.full,
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: tokens.type.labelLarge.size,
                  fontWeight: 600,
                  color: tokens.color.fg.brand,
                  fontFamily: "inherit",
                }}
              >
                Cancel
              </button>
              <button
                onClick={finishEditing}
                disabled={!editName.trim()}
                style={{
                  padding: "10px 20px",
                  borderRadius: tokens.shape.full,
                  border: "none",
                  background: editName.trim() ? tokens.color.bg.action.primary.default : tokens.color.bg.action.primary.disable,
                  cursor: editName.trim() ? "pointer" : "not-allowed",
                  fontSize: tokens.type.labelLarge.size,
                  fontWeight: 600,
                  color: tokens.color.fg.onAction,
                  fontFamily: "inherit",
                }}
              >
                Save
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
