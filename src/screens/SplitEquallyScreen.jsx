import { useState } from "react";
import tokens from "../theme/tokens";
import TopAppBar from "../components/TopAppBar";
import Icon from "../components/Icon";

// ── Split Equally ──────────────────────────────────────────────────────
// CBA Smart Hospitality–inspired: choose number of patrons, then
// process one payment at a time for each patron's equal share.
export default function SplitEquallyScreen({
  navigate,
  goBack,
  basket = [],
  setBasket,
}) {
  const total = basket.reduce((s, b) => s + b.price * b.qty, 0);
  const [patronCount, setPatronCount] = useState(2);
  const [paidCount, setPaidCount] = useState(0);
  const [showSnackbar, setShowSnackbar] = useState(null);

  const perPerson = total / patronCount;
  // Handle rounding — last person pays the remainder
  const regularShare = Math.floor(perPerson * 100) / 100;
  const lastShare =
    total - regularShare * (patronCount - 1);

  const allPaid = paidCount >= patronCount;
  const currentShare =
    paidCount === patronCount - 1 ? lastShare : regularShare;

  const handlePayPerson = () => {
    const newPaid = paidCount + 1;
    setPaidCount(newPaid);

    setShowSnackbar(currentShare);
    setTimeout(() => setShowSnackbar(null), 2500);

    if (newPaid >= patronCount) {
      // All done
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
      <TopAppBar title="Split Equally" onBack={goBack} theme="light" />

      {/* Summary card */}
      <div
        style={{
          margin: "0 16px 16px",
          padding: "20px 24px",
          background: tokens.color.bg.brand,
          borderRadius: tokens.shape.expressiveLarge,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            style={{
              fontSize: tokens.type.labelMedium.size,
              color: tokens.color.fg.white,
              opacity: 0.7,
              marginBottom: 4,
            }}
          >
            Total Bill
          </div>
          <div
            style={{
              fontSize: tokens.type.headlineMedium.size,
              fontWeight: 700,
              color: tokens.color.fg.white,
            }}
          >
            ${total.toFixed(2)}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontSize: tokens.type.labelMedium.size,
              color: tokens.color.fg.white,
              opacity: 0.7,
              marginBottom: 4,
            }}
          >
            Per Person
          </div>
          <div
            style={{
              fontSize: tokens.type.headlineMedium.size,
              fontWeight: 700,
              color: tokens.color.fg.white,
            }}
          >
            ${regularShare.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Patron selector — only show if no payments started yet */}
      {paidCount === 0 && (
        <div
          style={{
            margin: "0 16px 24px",
            padding: "20px",
            background: tokens.color.bg.surface,
            borderRadius: tokens.shape.expressiveLarge,
            border: `1px solid ${tokens.color.border.onpage}`,
          }}
        >
          <div
            style={{
              fontSize: tokens.type.labelLarge.size,
              fontWeight: 600,
              color: tokens.color.fg.emphasis,
              marginBottom: 16,
              textAlign: "center",
            }}
          >
            Number of patrons
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 24,
            }}
          >
            {/* Minus */}
            <button
              onClick={() => setPatronCount(Math.max(2, patronCount - 1))}
              disabled={patronCount <= 2}
              style={{
                width: 52,
                height: 52,
                borderRadius: tokens.shape.full,
                border: `2px solid ${
                  patronCount <= 2
                    ? tokens.color.border.onpage
                    : tokens.color.border.action.default
                }`,
                background: "transparent",
                cursor: patronCount <= 2 ? "default" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                fontWeight: 600,
                color:
                  patronCount <= 2
                    ? tokens.color.fg.disable
                    : tokens.color.fg.brand,
                fontFamily: "inherit",
                transition: `all ${tokens.motion.duration.short2} ${tokens.motion.easing.standard}`,
              }}
            >
              −
            </button>

            {/* Count */}
            <div style={{ textAlign: "center", minWidth: 60 }}>
              <div
                style={{
                  fontSize: tokens.type.displayMedium.size,
                  fontWeight: 700,
                  color: tokens.color.fg.brand,
                  lineHeight: 1,
                }}
              >
                {patronCount}
              </div>
              <div
                style={{
                  fontSize: tokens.type.labelSmall.size,
                  color: tokens.color.fg.subtle,
                  marginTop: 4,
                }}
              >
                {patronCount === 1 ? "person" : "people"}
              </div>
            </div>

            {/* Plus */}
            <button
              onClick={() => setPatronCount(Math.min(20, patronCount + 1))}
              disabled={patronCount >= 20}
              style={{
                width: 52,
                height: 52,
                borderRadius: tokens.shape.full,
                border: `2px solid ${
                  patronCount >= 20
                    ? tokens.color.border.onpage
                    : tokens.color.border.action.default
                }`,
                background: "transparent",
                cursor: patronCount >= 20 ? "default" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                fontWeight: 600,
                color:
                  patronCount >= 20
                    ? tokens.color.fg.disable
                    : tokens.color.fg.brand,
                fontFamily: "inherit",
                transition: `all ${tokens.motion.duration.short2} ${tokens.motion.easing.standard}`,
              }}
            >
              +
            </button>
          </div>
        </div>
      )}

      {/* Payment progress — patron circles */}
      {paidCount > 0 && (
        <div style={{ padding: "0 16px 8px" }}>
          {/* Progress bar */}
          <div
            style={{
              height: 6,
              borderRadius: 3,
              background: tokens.color.border.onpage,
              overflow: "hidden",
              marginBottom: 8,
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${(paidCount / patronCount) * 100}%`,
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
              fontSize: tokens.type.labelSmall.size,
              color: tokens.color.fg.subtle,
              marginBottom: 16,
            }}
          >
            <span>
              {paidCount} of {patronCount} payments
            </span>
            <span
              style={{
                color: tokens.color.fg.success.icon,
                fontWeight: 600,
              }}
            >
              ${(paidCount * regularShare).toFixed(2)} received
            </span>
          </div>

          {/* Patron circles grid */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              justifyContent: "center",
              padding: "8px 0",
            }}
          >
            {Array.from({ length: patronCount }).map((_, i) => {
              const isPaid = i < paidCount;
              const isCurrent = i === paidCount;
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: tokens.shape.full,
                      background: isPaid
                        ? tokens.color.bg.success.default
                        : isCurrent
                        ? `${tokens.color.fg.brand}15`
                        : tokens.color.bg.surface,
                      border: `2px solid ${
                        isPaid
                          ? tokens.color.fg.success.icon
                          : isCurrent
                          ? tokens.color.fg.brand
                          : tokens.color.border.onpage
                      }`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: `all ${tokens.motion.duration.short2} ${tokens.motion.easing.expressive}`,
                    }}
                  >
                    {isPaid ? (
                      <Icon
                        name="check"
                        size={20}
                        color={tokens.color.fg.white}
                      />
                    ) : (
                      <span
                        style={{
                          fontSize: tokens.type.labelLarge.size,
                          fontWeight: 600,
                          color: isCurrent
                            ? tokens.color.fg.brand
                            : tokens.color.fg.subtle,
                        }}
                      >
                        {i + 1}
                      </span>
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: isPaid
                        ? tokens.color.fg.success.icon
                        : isCurrent
                        ? tokens.color.fg.brand
                        : tokens.color.fg.subtle,
                    }}
                  >
                    {isPaid ? "Paid" : isCurrent ? "Next" : ""}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Bottom action */}
      <div
        style={{
          padding: "12px 16px 20px",
          borderTop: `1px solid ${tokens.color.border.onpage}`,
          background: tokens.color.bg.page,
        }}
      >
        {!allPaid ? (
          <>
            {/* Current payment info */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 12,
                alignItems: "baseline",
              }}
            >
              <span
                style={{
                  fontSize: tokens.type.bodyMedium.size,
                  color: tokens.color.fg.subtle,
                }}
              >
                {paidCount === 0
                  ? `Each person pays`
                  : `Person ${paidCount + 1} of ${patronCount}`}
              </span>
              <span
                style={{
                  fontSize: tokens.type.headlineSmall.size,
                  fontWeight: 700,
                  color: tokens.color.fg.brand,
                }}
              >
                ${currentShare.toFixed(2)}
              </span>
            </div>
            <button
              onClick={handlePayPerson}
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
                transition: `all ${tokens.motion.duration.short2} ${tokens.motion.easing.standard}`,
              }}
            >
              {paidCount === 0
                ? `Charge $${currentShare.toFixed(2)} — Person 1`
                : `Charge $${currentShare.toFixed(2)} — Person ${
                    paidCount + 1
                  }`}
            </button>
          </>
        ) : (
          <>
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
                All {patronCount} payments received
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
          </>
        )}
      </div>

      {/* Snackbar */}
      {showSnackbar !== null && (
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
            animation:
              "slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
            fontSize: tokens.type.bodyMedium.size,
            fontWeight: 500,
          }}
        >
          <Icon name="check" size={20} color={tokens.color.fg.white} />
          <span>
            Payment {paidCount} of {patronCount} — $
            {showSnackbar.toFixed(2)} received
          </span>
        </div>
      )}
    </div>
  );
}
