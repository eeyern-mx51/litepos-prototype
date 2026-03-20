import { useState, useMemo } from "react";
import tokens from "../theme/tokens";
import TopAppBar from "../components/TopAppBar";
import Icon from "../components/Icon";

// ── Split by Item ──────────────────────────────────────────────────────
// Explodes basket quantities into individual selectable units.
// e.g. "Flat White × 2" becomes two separate rows so each person
// can pick their own Flat White alongside their main.
export default function SplitByItemScreen({
  navigate,
  goBack,
  basket = [],
  setBasket,
}) {
  // Explode basket into individual units
  // { name, price, basketIndex, unitIndex }
  const units = useMemo(() => {
    const list = [];
    basket.forEach((item, bi) => {
      for (let u = 0; u < item.qty; u++) {
        list.push({
          name: item.name,
          price: item.price,
          basketIndex: bi,
          unitIndex: u,
          id: `${bi}-${u}`,
        });
      }
    });
    return list;
  }, [basket]);

  const [selected, setSelected] = useState({});
  const [paidIds, setPaidIds] = useState([]);
  const [showSnackbar, setShowSnackbar] = useState(null);

  const toggle = (id) => {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const selectedIds = Object.keys(selected).filter(
    (id) => selected[id] && !paidIds.includes(id)
  );
  const selectedTotal = selectedIds.reduce(
    (s, id) => s + units.find((u) => u.id === id).price,
    0
  );

  const unpaidUnits = units.filter((u) => !paidIds.includes(u.id));
  const totalRemaining = unpaidUnits.reduce((s, u) => s + u.price, 0);
  const paidTotal = paidIds.reduce(
    (s, id) => s + units.find((u) => u.id === id).price,
    0
  );
  const grandTotal = units.reduce((s, u) => s + u.price, 0);

  const canCharge = selectedIds.length > 0;
  const allPaid = unpaidUnits.length === 0;

  const handlePayRound = () => {
    const newPaid = [...paidIds, ...selectedIds];
    setPaidIds(newPaid);
    setSelected({});

    setShowSnackbar(selectedTotal);
    setTimeout(() => setShowSnackbar(null), 2500);
  };

  // Group units for display: show product name once as a header,
  // then each unit as a selectable row underneath
  const grouped = useMemo(() => {
    const map = new Map();
    units.forEach((u) => {
      const key = u.basketIndex;
      if (!map.has(key)) {
        map.set(key, { name: u.name, price: u.price, units: [] });
      }
      map.get(key).units.push(u);
    });
    return [...map.values()];
  }, [units]);

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

      {/* Progress bar */}
      {paidIds.length > 0 && (
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
                width: `${(paidTotal / grandTotal) * 100}%`,
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
              {paidIds.length} of {units.length} items paid
            </span>
            <span
              style={{
                color: tokens.color.fg.success.icon,
                fontWeight: 600,
              }}
            >
              ${paidTotal.toFixed(2)} paid
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

      {/* Item list — grouped by product with individual unit rows */}
      <div style={{ flex: 1, overflow: "auto", padding: "0 0 8px" }}>
        {grouped.map((group) => {
          const allGroupPaid = group.units.every((u) =>
            paidIds.includes(u.id)
          );
          const showMultiple = group.units.length > 1;

          return (
            <div key={group.units[0].basketIndex}>
              {/* Product header — shown when qty > 1 */}
              {showMultiple && (
                <div
                  style={{
                    padding: "10px 16px 4px",
                    fontSize: tokens.type.labelMedium.size,
                    fontWeight: 600,
                    color: allGroupPaid
                      ? tokens.color.fg.disable
                      : tokens.color.fg.emphasis,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span>
                    {group.name}{" "}
                    <span style={{ color: tokens.color.fg.subtle, fontWeight: 400 }}>
                      × {group.units.length}
                    </span>
                  </span>
                  <span
                    style={{
                      fontSize: tokens.type.labelSmall.size,
                      color: tokens.color.fg.subtle,
                    }}
                  >
                    ${group.price.toFixed(2)} each
                  </span>
                </div>
              )}

              {/* Individual unit rows */}
              {group.units.map((unit, idx) => {
                const isPaid = paidIds.includes(unit.id);
                const isSelected = selected[unit.id] && !isPaid;

                return (
                  <button
                    key={unit.id}
                    onClick={() => !isPaid && toggle(unit.id)}
                    disabled={isPaid}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      width: "100%",
                      padding: showMultiple
                        ? "12px 16px 12px 32px"
                        : "14px 16px",
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

                    {/* Item label */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: tokens.type.bodyLarge.size,
                          fontWeight: 500,
                          color: tokens.color.fg.emphasis,
                          textDecoration: isPaid ? "line-through" : "none",
                        }}
                      >
                        {showMultiple
                          ? `${unit.name} #${idx + 1}`
                          : unit.name}
                      </div>
                      {isPaid && (
                        <div
                          style={{
                            fontSize: tokens.type.bodySmall.size,
                            color: tokens.color.fg.success.icon,
                            fontWeight: 600,
                          }}
                        >
                          Paid
                        </div>
                      )}
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
                      ${unit.price.toFixed(2)}
                    </div>
                  </button>
                );
              })}
            </div>
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
              {selectedIds.length} item
              {selectedIds.length !== 1 ? "s" : ""} selected
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
            animation: "slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
            fontSize: tokens.type.bodyMedium.size,
            fontWeight: 500,
          }}
        >
          <Icon name="check" size={20} color={tokens.color.fg.white} />
          <span>Payment of ${showSnackbar.toFixed(2)} received</span>
        </div>
      )}
    </div>
  );
}
