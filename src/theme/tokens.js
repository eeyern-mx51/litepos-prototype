// ════════════════════════════════════════════════════════════════════
// MXA DESIGN TOKENS — Gecko (GKO) + M3 Expressive for LitePOS
//
// Semantic layer maps to GKO Figma tokens (bg/, fg/, border/).
// M3 Expressive shape/motion for new LitePOS components.
// ════════════════════════════════════════════════════════════════════

const tokens = {
  // ── GKO Semantic Colour System ─────────────────────────────────
  color: {
    // Background tokens
    bg: {
      page: "#FFFFFF",
      surface: "#F5F5F5",
      overlay: "rgba(33, 38, 56, 0.6)",
      statusbar: "#1E2640",
      snackbar: "#212638",
      keypadbar: "#2D3555",
      button: { default: "#FFFFFF", press: "#E8E8EC" },
      brand: "#2D3555",
      action: {
        primary: { default: "#1A7B6F", disable: "rgba(26,123,111,0.25)", press: "#0F5C53" },
        secondary: { default: "#FFFFFF", press: "#E8E8EC" },
      },
      error:   { default: "#D32F2F", disable: "rgba(211,47,47,0.25)", press: "#B71C1C" },
      warning: { default: "#F57C00", disable: "rgba(245,124,0,0.25)", press: "#E65100" },
      success: { default: "#2E7D32", disable: "rgba(46,125,50,0.25)", press: "#1B5E20" },
      info:    { default: "#1565C0", disable: "rgba(21,101,192,0.25)", press: "#0D47A1" },
    },

    // Foreground tokens
    fg: {
      emphasis: "#212638",
      subtle: "#6B7084",
      disable: "#B0B3C0",
      white: "#FFFFFF",
      brand: "#1A7B6F",
      onBrand: "#FFFFFF",
      onAction: "#FFFFFF",
      action: { default: "#1A7B6F", disable: "rgba(26,123,111,0.25)", press: "#0F5C53" },
      error:   { icon: "#EF5350", text: "#D32F2F" },
      warning: { icon: "#FFA726", text: "#F57C00" },
      success: { icon: "#66BB6A", text: "#2E7D32" },
      info:    { icon: "#42A5F5", text: "#1565C0" },
    },

    // Border tokens
    border: {
      onpage: "#E0E0E4",
      onsurface: "#C8C9D0",
      action: { default: "#1A7B6F", disable: "rgba(26,123,111,0.25)" },
      error: "#EF5350",
      warning: "#FFA726",
      success: "#66BB6A",
      info: "#42A5F5",
    },
  },

  // ── Shape System (M3 Expressive) ───────────────────────────────
  shape: {
    none: "0px",
    extraSmall: "4px",
    small: "8px",
    medium: "12px",
    large: "16px",
    extraLarge: "28px",
    full: "9999px",
    expressiveLarge: "24px",
    expressiveExtraLarge: "32px",
  },

  // ── Typography (M3 — maps to GKO M3/ text styles) ─────────────
  type: {
    displayLarge:   { size: "57px", weight: 400, lineHeight: "64px", tracking: "-0.25px" },
    displayMedium:  { size: "45px", weight: 400, lineHeight: "52px", tracking: "0px" },
    displaySmall:   { size: "36px", weight: 400, lineHeight: "44px", tracking: "0px" },
    headlineLarge:  { size: "32px", weight: 600, lineHeight: "40px", tracking: "0px" },
    headlineMedium: { size: "28px", weight: 600, lineHeight: "36px", tracking: "0px" },
    headlineSmall:  { size: "24px", weight: 600, lineHeight: "32px", tracking: "0px" },
    titleLarge:     { size: "22px", weight: 500, lineHeight: "28px", tracking: "0px" },
    titleMedium:    { size: "16px", weight: 600, lineHeight: "24px", tracking: "0.15px" },
    titleSmall:     { size: "14px", weight: 600, lineHeight: "20px", tracking: "0.1px" },
    bodyLarge:      { size: "16px", weight: 400, lineHeight: "24px", tracking: "0.5px" },
    bodyMedium:     { size: "14px", weight: 400, lineHeight: "20px", tracking: "0.25px" },
    bodySmall:      { size: "12px", weight: 400, lineHeight: "16px", tracking: "0.4px" },
    labelLarge:     { size: "14px", weight: 600, lineHeight: "20px", tracking: "0.1px" },
    labelMedium:    { size: "12px", weight: 600, lineHeight: "16px", tracking: "0.5px" },
    labelSmall:     { size: "11px", weight: 600, lineHeight: "16px", tracking: "0.5px" },
  },

  // ── Elevation (M3 Light — maps to GKO M3/Elevation Light/) ────
  elevation: {
    level0: "none",
    level1: "0 1px 2px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)",
    level2: "0 2px 4px rgba(0,0,0,0.1), 0 1px 5px rgba(0,0,0,0.08)",
    level3: "0 4px 8px rgba(0,0,0,0.1), 0 2px 6px rgba(0,0,0,0.08)",
    level4: "0 6px 12px rgba(0,0,0,0.1), 0 3px 8px rgba(0,0,0,0.08)",
    level5: "0 8px 16px rgba(0,0,0,0.12), 0 4px 10px rgba(0,0,0,0.1)",
  },

  // ── Motion (M3 Expressive) ─────────────────────────────────────
  motion: {
    easing: {
      standard: "cubic-bezier(0.2, 0, 0, 1)",
      standardDecelerate: "cubic-bezier(0, 0, 0, 1)",
      emphasized: "cubic-bezier(0.2, 0, 0, 1)",
      emphasizedDecelerate: "cubic-bezier(0.05, 0.7, 0.1, 1.0)",
      expressive: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    },
    duration: {
      short1: "50ms", short2: "100ms", short3: "150ms", short4: "200ms",
      medium1: "250ms", medium2: "300ms", medium3: "350ms", medium4: "400ms",
      long1: "450ms", long2: "500ms",
      expressiveEntry: "500ms", expressiveExit: "300ms",
    },
  },

  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 },
};

export default tokens;
