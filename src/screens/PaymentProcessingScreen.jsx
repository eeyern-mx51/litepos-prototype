import { useState, useEffect } from "react";
import tokens from "../theme/tokens";
import Icon from "../components/Icon";

// ── Payment Processing ─────────────────────────────────────────────────
// Simulated tap-to-pay flow: waiting → processing → approved.
// Split-aware: reads amount from splitState.amount when doing split rounds,
// and on Done navigates back to the split screen (splitState.returnTo).
export default function PaymentProcessingScreen({
  navigate,
  basket = [],
  setBasket,
  splitState,
  setSplitState,
}) {
  // Determine the amount to charge
  const returnTo = splitState?.returnTo;
  const splitAmount = splitState?.amount;
  const total =
    splitAmount != null
      ? splitAmount
      : basket.reduce((s, b) => s + b.price * b.qty, 0);

  const [stage, setStage] = useState("waiting"); // waiting → processing → approved

  useEffect(() => {
    const t1 = setTimeout(() => setStage("processing"), 2200);
    const t2 = setTimeout(() => setStage("approved"), 3800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // When approved, commit the split progress
  const handleDone = () => {
    if (returnTo === "split-by-item") {
      // Commit pending IDs as paid
      setSplitState((s) => ({
        ...s,
        returnTo: null,
        amount: null,
        byItem: {
          paidIds: [
            ...s.byItem.paidIds,
            ...(s.byItem.pendingIds || []),
          ],
          pendingIds: [],
        },
      }));
      navigate("split-by-item");
    } else if (returnTo === "split-equally") {
      // Increment paid count
      setSplitState((s) => ({
        ...s,
        returnTo: null,
        amount: null,
        equally: {
          ...s.equally,
          paidCount: s.equally.paidCount + 1,
        },
      }));
      navigate("split-equally");
    } else {
      // Pay in full — clear basket and go home
      setBasket([]);
      navigate("home");
    }
  };

  const isSplit = !!returnTo;

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background:
          stage === "approved"
            ? tokens.color.bg.success.default
            : tokens.color.bg.brand,
        alignItems: "center",
        justifyContent: "center",
        transition: `background ${tokens.motion.duration.medium2} ${tokens.motion.easing.standard}`,
        position: "relative",
      }}
    >
      {/* ── Waiting stage ── */}
      {stage === "waiting" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 32,
            padding: 32,
          }}
        >
          {/* Contactless icon with pulse animation */}
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: tokens.shape.full,
              background: "rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: -20,
                borderRadius: tokens.shape.full,
                border: "2px solid rgba(255,255,255,0.15)",
                animation: "pulseRing 2s ease-out infinite",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: -40,
                borderRadius: tokens.shape.full,
                border: "2px solid rgba(255,255,255,0.08)",
                animation: "pulseRing 2s ease-out infinite 0.5s",
              }}
            />
            <svg
              width={56}
              height={56}
              viewBox="0 0 24 24"
              fill={tokens.color.fg.white}
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 2c2.39 0 4.52 1.05 5.98 2.72l-1.43 1.43C15.41 7.18 13.82 6.5 12 6.5S8.59 7.18 7.45 8.15L6.02 6.72C7.48 5.05 9.61 4 12 4zm0 4c1.46 0 2.76.64 3.67 1.65l-1.42 1.42C13.62 10.4 12.85 10 12 10s-1.62.4-2.25 1.07l-1.42-1.42C9.24 8.64 10.54 8 12 8zm0 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z" />
            </svg>
          </div>

          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: tokens.type.displayLarge.size,
                fontWeight: 700,
                color: tokens.color.fg.white,
                lineHeight: 1,
                marginBottom: 8,
              }}
            >
              ${total.toFixed(2)}
            </div>
            <div
              style={{
                fontSize: tokens.type.titleMedium.size,
                color: tokens.color.fg.white,
                opacity: 0.7,
              }}
            >
              Ready for payment
            </div>
          </div>

          <div
            style={{
              fontSize: tokens.type.bodyLarge.size,
              color: tokens.color.fg.white,
              opacity: 0.9,
              textAlign: "center",
              lineHeight: "1.5",
              maxWidth: 260,
            }}
          >
            Tap, insert, or swipe card on the terminal
          </div>
        </div>
      )}

      {/* ── Processing stage ── */}
      {stage === "processing" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 32,
            padding: 32,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: tokens.shape.full,
              border: "4px solid rgba(255,255,255,0.2)",
              borderTopColor: tokens.color.fg.white,
              animation: "spin 0.8s linear infinite",
            }}
          />
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: tokens.type.headlineMedium.size,
                fontWeight: 600,
                color: tokens.color.fg.white,
                marginBottom: 8,
              }}
            >
              Processing...
            </div>
            <div
              style={{
                fontSize: tokens.type.bodyLarge.size,
                color: tokens.color.fg.white,
                opacity: 0.7,
              }}
            >
              ${total.toFixed(2)}
            </div>
          </div>
        </div>
      )}

      {/* ── Approved stage ── */}
      {stage === "approved" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
            padding: 32,
          }}
        >
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: tokens.shape.full,
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation:
                "scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            <Icon name="check" size={48} color={tokens.color.fg.white} />
          </div>

          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: tokens.type.headlineLarge.size,
                fontWeight: 700,
                color: tokens.color.fg.white,
                marginBottom: 4,
              }}
            >
              Approved
            </div>
            <div
              style={{
                fontSize: tokens.type.displaySmall.size,
                fontWeight: 700,
                color: tokens.color.fg.white,
                marginBottom: 8,
              }}
            >
              ${total.toFixed(2)}
            </div>
            <div
              style={{
                fontSize: tokens.type.bodyMedium.size,
                color: tokens.color.fg.white,
                opacity: 0.7,
              }}
            >
              Transaction complete
            </div>
          </div>

          {/* Receipt options */}
          <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
            <button
              onClick={() => {}}
              style={{
                padding: "12px 24px",
                borderRadius: tokens.shape.full,
                background: "rgba(255,255,255,0.2)",
                color: tokens.color.fg.white,
                border: "1px solid rgba(255,255,255,0.3)",
                fontSize: tokens.type.labelLarge.size,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Icon name="print" size={18} color={tokens.color.fg.white} />
              Print
            </button>
            <button
              onClick={() => {}}
              style={{
                padding: "12px 24px",
                borderRadius: tokens.shape.full,
                background: "rgba(255,255,255,0.2)",
                color: tokens.color.fg.white,
                border: "1px solid rgba(255,255,255,0.3)",
                fontSize: tokens.type.labelLarge.size,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Icon name="qr" size={18} color={tokens.color.fg.white} />
              Digital
            </button>
          </div>

          {/* Done / Next button */}
          <button
            onClick={handleDone}
            style={{
              width: "calc(100% - 64px)",
              maxWidth: 300,
              height: 56,
              marginTop: 8,
              borderRadius: tokens.shape.full,
              background: tokens.color.fg.white,
              color: tokens.color.fg.success.icon,
              border: "none",
              fontSize: tokens.type.labelLarge.size,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {isSplit ? "Next Payment" : "Done — New Order"}
          </button>
        </div>
      )}

      {/* CSS Animations */}
      <style>
        {`
          @keyframes pulseRing {
            0% { transform: scale(1); opacity: 1; }
            100% { transform: scale(1.3); opacity: 0; }
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          @keyframes scaleIn {
            0% { transform: scale(0); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes slideUp {
            0% { transform: translateY(20px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
}
