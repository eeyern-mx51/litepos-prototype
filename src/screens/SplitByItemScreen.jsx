import { useState } from "react";
import tokens from "../theme/tokens";
import TopAppBar from "../components/TopAppBar";
import Icon from "../components/Icon";

// ── Split by Item ──────────────────────────────────────────────────────
// CBA Smart Hospitality–inspired: select items for this payment round.
// Remaining items stay for subsequent payments.
export default function SplitByItemScreen({
  navigate,
  goBack,
  basket = [],
  setBasket,
}) {
  const [selected, setSelected] = useState({});
  // Track payment round within this split session
  const [paidItems, setPaidItems] = useState([]);
  const [showPaidSnackbar, setShowPaidSnackbar] = useState(null);

  // Items still unpaid
  const remaining = basket.filter(
    (_, i) => !paidItems.includes(i)
  );

  const toggle = (originalIndex) => {
    setSelected((prev) => ({
      ...prev,
      [originalIndex]: !prev[originalIndex],
    }));
  };

  const selectedIndices = Object.keys(selected).filter(
    (k) => selected[k] && !paidItems.includes(Number(k))
  );
  const selectedTotal = selectedIndices.reduce(
    (s, k) => s + basket[k].price * basket[k].qty,
    0
  );
  const totalRemaining = remaining.reduce(
    (s, b) => s + b.price * b.qty,
    0
  );

  const canCharge = selectedIndices.length > 0;

  // All items paid = whole bill done
  const allPaid = remaining.length === 0;

  const handleCharge = () => {
    // Navigate to payment processing with just the selected amount
    navigate("payment-processing", {
      amount: selectedTotal,
      label: `${selectedIndices.length} item${selectedIndices.length !== 1 ? "s" : ""}`,
      onComplete: "split-by-item", // return here after payment
      splitInfo: {
        paidIndices: [...paidItems, ...selectedIndices.map(Number)],
      },
    });
  };

  // After simulated payment returns, mark items as paid
  const handlePayRound = () => {
    const newPaid = [...paidItems, ...selectedIndices.map(Number)];
    setPaidItems(newPaid);
    setSelected({});

    const paidAmount = selectedTotal;
    setShowPaidSnackbar(paidAmount);
    setTimeout(() => setShowPaidSnackbar(null), 2500);

    // If all items now paid, go to processing success
    if (newPaid.length >= basket.length) {
      setTimeout(() => {
        navigate("payment-processing", {
          amount: 0,
          allPaid: true,
        });
      }, 1200);
    }
  };

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: tokens.color.bg.page,
        position: "relative",
      }}
    >
      <TopAppBar title="Split by Item" onBack={goBack} theme="light" />

      {/* Progress bar showing how much is paid */}
      {paidItems.length > 0 && (
        <div style={{ padding: "0 16px 4px" }}>
          <div
            style={{
              height: 6,
              borderRadius: 3,
              background: tokens.color.border.onpage,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${
                  (paidItems.reduce(
                    (s, i) => s + basket[i].price * basket[i].qty,
                    0
                  ) /
                    basket.reduce((s, b) => s + b.price * b.qty, 0)) *
                  100
                }%`,
                background: tokens.color.bg.success.default,
                borderRadius: 3,
                transition: `width ${tokens.motion.duration.medium2} ${tokens.motion.easing.expressive}`,
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 6,
              fontSize: tokens.type.labelSmall.size,
              color: tokens.color.fg.subtle,
            }}
          >
            <span>
              {paidItems.length} of{" "}
              {basket.reduce((s, b) => s + b.qty, 0)} items paid
            </span>
            <span style={{ color: tokens.color.fg.success.icon, fontWeight: 600 }}>
              $
              {paidItems
                .reduce((s, i) => s + basket[i].price * basket[i].qty, 0)
                .toFixed(2)}{" "}
              paid
            </span>
          </div>
        </div>
      )}

      {/* Instruction */}
      <div
        style={{
          padding: "12px 20px 8px",
          fontSize: tokens.type.bodyMedium.size,
          color: tokens.color.fg.subtle,
          lineHeight: "1.4",
        }}
      >
        {allPaid
          ? "All items have been paid!"
          : "Select the items for this payment"}
      </div>

      {/* Item list */}
      <div style={{ flex: 1, overflow: "auto", padding: "0 0 8px" }}>
        {basket.map((item, i) => {
          const isPaid = paidItems.includes(i);
          const isSelected = selected[i] && !isPaid;

          return (
            <button
              key={i}
              onClick={() => !isPaid && toggle(i)}
              disabled={isPaid}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                width: "100%",
                padding: "14px 16px",
                background: isSelected
                  ? `${tokens.color.fg.brand}08`
                  : "transparent",
                border: "none",
                borderBottom: `1px solid ${tokens.color.border.onpage}`,
                cursor: isPaid ? "default" : "pointer",
                opacity: isPaid ? 0.4 : 1,
                textAlign: "left",
                fontFamily: "inherit",
                transition: `all ${tokens.motion.duration.short2} ${tokens.motion.easing.standard}`,
              }}
            >
              {/* Checkbox */}
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: tokens.shape.small,
                  border: isPaid
                    ? `2px solid ${tokens.color.fg.success.icon}`
                    : isSelected
                    ? `2px solid ${tokens.color.fg.brand}`
                    : `2px solid ${tokens.color.border.onsurface}`,
                  background: isPaid
                    ? tokens.color.bg.success.default
                    : isSelected
                    ? tokens.color.bg.action.primary.default
                    : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: `all ${tokens.motion.duration.short2} ${tokens.motion.easing.expressive}`,
                }}
              >
                {(isSelected || isPaid) && (
                  <Icon
                    name="check"
                    size={16}
                    color={tokens.color.fg.white}
                  />
                )}
              </div>

              {/* Item details */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: tokens.type.bodyLarge.size,
                    fontWeight: 500,
                    color: tokens.color.fg.emphasis,
                    textDecoration: isPaid ? "line-through" : "none",
                  }}
                >
                  {item.name}
                </div>
                <div
                  style={{
                    fontSize: tokens.type.bodySmall.size,
                    color: tokens.color.fg.subtle,
                  }}
                >
                  Qty: {item.qty}
                  {isPaid && (
                    <span
                      style={{
                        marginLeft: 8,
                        color: tokens.color.fg.success.icon,
                        fontWeight: 600,
                      }}
                    >
                      Paid
                    </span>
                  )}
                </div>
              </div>

              {/* Price */}
              <div
                style={{
                  fontSize: tokens.type.titleMedium.size,
                  fontWeight: 600,
                  color: isPaid
                    ? tokens.color.fg.subtle
                    : isSelected
                    ? tokens.color.fg.brand
                    : tokens.color.fg.emphasis,
                }}
              >
                ${(item.price * item.qty).toFixed(2)}
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom action bar */}
      {!allPaid && (
        <div
          style={{
            padding: "12px 16px 20px",
            borderTop: `1px solid ${tokens.color.border.onpage}`,
            background: tokens.color.bg.page,
          }}
        >
          {/* Selected summary */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 12,
              fontSize: tokens.type.bodyMedium.size,
            }}
          >
            <span style={{ color: tokens.color.fg.subtle }}>
              {selectedIndices.length} item
              {selectedIndices.length !== 1 ? "s" : ""} selected
            </span>
            <span
              style={{
                fontWeight: 700,
                fontSize: tokens.type.titleMedium.size,
                color: canCharge
                  ? tokens.color.fg.brand
                  : tokens.color.fg.disable,
              }}
            >
              ${selectedTotal.toFixed(2)}
            </span>
          </div>

          {/* Remaining hint */}
          {canCharge && totalRemaining - selectedTotal > 0 && (
            <div
              style={{
                fontSize: tokens.type.labelSmall.size,
                color: tokens.color.fg.subtle,
                marginBottom: 10,
                textAlign: "center",
              }}
            >
              ${(totalRemaining - selectedTotal).toFixed(2)} remaining
              after this payment
            </div>
          )}

          <button
            onClick={handlePayRound}
            disabled={!canCharge}
            style={{
              width: "100%",
              height: 56,
              borderRadius: tokens.shape.full,
              background: canCharge
                ? tokens.color.bg.action.primary.default
                : tokens.color.border.onpage,
              color: canCharge
                ? tokens.color.fg.onAction
                : tokens.color.fg.disable,
              border: "none",
              fontSize: tokens.type.labelLarge.size,
              fontWeight: 600,
              cursor: canCharge ? "pointer" : "default",
              fontFamily: "inherit",
              transition: `all ${tokens.motion.duration.short2} ${tokens.motion.easing.standard}`,
            }}
          >
            {canCharge
              ? `Charge $${selectedTotal.toFixed(2)}`
              : "Select items to pay"}
          </button>
        </div>
      )}

      {/* All paid — done button */}
      {allPaid && (
        <div
          style={{
            padding: "12px 16px 20px",
            borderTop: `1px solid ${tokens.color.border.onpage}`,
            background: tokens.color.bg.page,
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <Icon
              name="check"
              size={20}
              color={tokens.color.fg.success.icon}
            />
            <span
              style={{
                fontSize: tokens.type.titleMedium.size,
                fontWeight: 600,
                color: tokens.color.fg.success.icon,
              }}
            >
              Bill fully paid
            </span>
          </div>
          <button
            onClick={() => {
              setBasket([]);
              navigate("home");
            }}
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
            Done — New Order
          </button>
        </div>
      )}

      {/* Snackbar */}
      {showPaidSnackbar !== null && (
        <div
          style={{
            position: "absolute",
            bottom: 100,
            left: 16,
            right: 16,
            background: tokens.color.bg.brand,
            color: tokens.color.fg.white,
            borderRadius: tokens.shape.medium,
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            boxShadow: tokens.elevation.level3,
            animation: "slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
            fontSize: tokens.type.bodyMedium.size,
            fontWeight: 500,
          }}
        >
          <Icon name="check" size={20} color={tokens.color.fg.white} />
          <span>
            Payment of ${showPaidSnackbar.toFixed(2)} received
          </span>
        </div>
      )}
    </div>
  );
}
