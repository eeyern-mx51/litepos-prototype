import tokens from "../theme/tokens";
import Icon from "./Icon";

/**
 * InputBadge — small inline badge showing the input method for a field.
 *
 * Terminal keyboard modes:
 *   "onscreen"  — full touch QWERTY soft keyboard (handles everything)
 *   "physical"  — hardware numeric-only keypad (0–9, *, #, Enter, Clear)
 *
 * Input types:
 *   "alpha"   — requires letter input (names, descriptions, search)
 *   "numeric" — numbers only (amounts, prices, UPC/barcode)
 *
 * On physical-numeric terminals:
 *   - numeric fields → "Hardware keypad" (green, uses physical buttons)
 *   - alpha fields   → "On-screen keyboard" (amber, needs soft keyboard)
 *
 * On on-screen terminals:
 *   - all fields     → "Touch keyboard" (neutral, everything via soft keyboard)
 */
export default function InputBadge({ keyboardType, inputType = "alpha" }) {
  if (!keyboardType) return null;

  const isPhysical = keyboardType === "physical";

  let label, color, icon;

  if (isPhysical) {
    if (inputType === "numeric") {
      label = "Hardware keypad";
      color = "#1B8A4E";
      icon = "keypad";
    } else {
      label = "On-screen keyboard";
      color = "#C77800";
      icon = "keyboard";
    }
  } else {
    // On-screen mode — show neutral indicator
    label = "Touch keyboard";
    color = tokens.color.fg.subtle;
    icon = "keyboard";
  }

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontSize: 10,
        fontWeight: 600,
        color,
        background: `${color}10`,
        padding: "2px 8px 2px 5px",
        borderRadius: tokens.shape.full,
        letterSpacing: "0.2px",
        whiteSpace: "nowrap",
        lineHeight: 1,
      }}
    >
      <Icon name={icon} size={11} color={color} />
      {label}
    </span>
  );
}
