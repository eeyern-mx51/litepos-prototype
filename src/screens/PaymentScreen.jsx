import tokens from "../theme/tokens";
import TopAppBar from "../components/TopAppBar";
import Icon from "../components/Icon";

// ── CBA Smart Hospitality–inspired payment option selector ─────────────
// Three prominent cards: Pay in Full, Split by Item, Split Equally
export default function PaymentScreen({ navigate, goBack, basket = [], onSelectSplit }) {
  const total = basket.reduce((s, b) => s + b.price * b.qty, 0);

  const options = [
    {
      key: "pay-full",
      icon: "cart",
      title: "Pay in Full",
      description: "Charge the full amount to one payment method",
      amount: `$${total.toFixed(2)}`,
      target: "payment-processing",
    },
    {
      key: "split-item",
      icon: "receipt",
      title: "Split by Item",
      description: "Select which items each person pays for",
      amount: `${basket.reduce((s, b) => s + b.qty, 0)} items`,
      target: "split-by-item",
    },
    {
      key: "split-equal",
      icon: "store",
      title: "Split Equally",
      description: "Divide the total evenly between patrons",
      amount: `$${total.toFixed(2)}`,
      target: "split-equally",
    },
  ];

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: tokens.color.bg.page,
      }}
    >
      <TopAppBar title="Payment" onBack={goBack} theme="light" />

      {/* Total summary banner */}
      <div
        style={{
          margin: "0 16px 8px",
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
            Order Total
          </div>
          <div
            style={{
              fontSize: tokens.type.displaySmall.size,
              fontWeight: 700,
              color: tokens.color.fg.white,
              lineHeight: 1,
            }}
          >
            ${total.toFixed(2)}
          </div>
        </div>
        <div
          style={{
            fontSize: tokens.type.labelMedium.size,
            color: tokens.color.fg.white,
            opacity: 0.6,
            textAlign: "right",
          }}
        >
          {basket.reduce((s, b) => s + b.qty, 0)} item
          {basket.reduce((s, b) => s + b.qty, 0) !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Section label */}
      <div
        style={{
          padding: "16px 20px 8px",
          fontSize: tokens.type.labelLarge.size,
          fontWeight: 600,
          color: tokens.color.fg.subtle,
        }}
      >
        How would you like to pay?
      </div>

      {/* Option cards */}
      <div
        style={{
          flex: 1,
          padding: "0 16px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {options.map((opt) => (
          <button
            key={opt.key}
            onClick={() => {
              if (opt.key === "split-item" || opt.key === "split-equal") {
                onSelectSplit?.(opt.target);
              } else {
                navigate(opt.target);
              }
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "20px",
              background: tokens.color.bg.surface,
              border: `1.5px solid ${tokens.color.border.onpage}`,
              borderRadius: tokens.shape.expressiveLarge,
              cursor: "pointer",
              textAlign: "left",
              transition: `all ${tokens.motion.duration.short2} ${tokens.motion.easing.standard}`,
              fontFamily: "inherit",
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = "scale(0.98)";
              e.currentTarget.style.borderColor =
                tokens.color.border.action.default;
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.borderColor = tokens.color.border.onpage;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.borderColor = tokens.color.border.onpage;
            }}
          >
            {/* Icon circle */}
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: tokens.shape.full,
                background: `${tokens.color.fg.brand}11`,
                border: `1.5px solid ${tokens.color.border.action.default}33`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Icon name={opt.icon} size={24} color={tokens.color.fg.brand} />
            </div>

            {/* Text */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: tokens.type.titleMedium.size,
                  fontWeight: 600,
                  color: tokens.color.fg.emphasis,
                  marginBottom: 2,
                }}
              >
                {opt.title}
              </div>
              <div
                style={{
                  fontSize: tokens.type.bodySmall.size,
                  color: tokens.color.fg.subtle,
                  lineHeight: "1.3",
                }}
              >
                {opt.description}
              </div>
            </div>

            {/* Chevron */}
            <Icon
              name="chevron"
              size={20}
              color={tokens.color.fg.subtle}
            />
          </button>
        ))}
      </div>

      {/* Footer hint */}
      <div
        style={{
          padding: "16px 20px 24px",
          textAlign: "center",
          fontSize: tokens.type.bodySmall.size,
          color: tokens.color.fg.disable,
          lineHeight: "1.4",
        }}
      >
        Tip can be added on the payment screen
      </div>
    </div>
  );
}
