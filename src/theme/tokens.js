// ════════════════════════════════════════════════════════════════════
// M3 EXPRESSIVE DESIGN TOKENS — Gecko Bank / LitePOS
// Material 3 Expressive: vibrant color, expressive shapes,
// fluid motion, accessible typography.
// ════════════════════════════════════════════════════════════════════

const tokens = {
  // ── Color System (M3 Expressive — Gecko Bank palette) ──────────
  color: {
    primary: "#1B6B52",
    onPrimary: "#FFFFFF",
    primaryContainer: "#A4F4D3",
    onPrimaryContainer: "#002117",

    secondary: "#4C6359",
    onSecondary: "#FFFFFF",
    secondaryContainer: "#CEE9DB",
    onSecondaryContainer: "#082018",

    tertiary: "#3E6374",
    onTertiary: "#FFFFFF",
    tertiaryContainer: "#C2E8FC",
    onTertiaryContainer: "#001F2A",

    error: "#BA1A1A",
    onError: "#FFFFFF",
    errorContainer: "#FFDAD6",
    onErrorContainer: "#410002",

    surface: "#F6FBF4",
    surfaceDim: "#D6DBD4",
    surfaceBright: "#F6FBF4",
    surfaceContainerLowest: "#FFFFFF",
    surfaceContainerLow: "#F0F5EE",
    surfaceContainer: "#EAF0E8",
    surfaceContainerHigh: "#E5EAE3",
    surfaceContainerHighest: "#DFE4DD",
    onSurface: "#181D19",
    onSurfaceVariant: "#414942",

    outline: "#717972",
    outlineVariant: "#C1C9C0",

    inverseSurface: "#2D322E",
    inverseOnSurface: "#EDF2EB",
    inversePrimary: "#88D7B8",

    scrim: "#000000",
    shadow: "#000000",
  },

  // ── Shape System (M3 Expressive — rounder, more expressive) ────
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

  // ── Typography (M3 Expressive) ─────────────────────────────────
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

  // ── Elevation (M3 tonal elevation) ─────────────────────────────
  elevation: {
    level0: "none",
    level1: "0 1px 2px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)",
    level2: "0 2px 4px rgba(0,0,0,0.1), 0 1px 5px rgba(0,0,0,0.08)",
    level3: "0 4px 8px rgba(0,0,0,0.1), 0 2px 6px rgba(0,0,0,0.08)",
    level4: "0 6px 12px rgba(0,0,0,0.1), 0 3px 8px rgba(0,0,0,0.08)",
    level5: "0 8px 16px rgba(0,0,0,0.12), 0 4px 10px rgba(0,0,0,0.1)",
  },

  // ── Motion (M3 Expressive — fluid, spring-based) ───────────────
  motion: {
    easing: {
      standard: "cubic-bezier(0.2, 0, 0, 1)",
      standardDecelerate: "cubic-bezier(0, 0, 0, 1)",
      standardAccelerate: "cubic-bezier(0.3, 0, 1, 1)",
      emphasized: "cubic-bezier(0.2, 0, 0, 1)",
      emphasizedDecelerate: "cubic-bezier(0.05, 0.7, 0.1, 1.0)",
      emphasizedAccelerate: "cubic-bezier(0.3, 0, 0.8, 0.15)",
      expressive: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    },
    duration: {
      short1: "50ms",
      short2: "100ms",
      short3: "150ms",
      short4: "200ms",
      medium1: "250ms",
      medium2: "300ms",
      medium3: "350ms",
      medium4: "400ms",
      long1: "450ms",
      long2: "500ms",
      long3: "550ms",
      long4: "600ms",
      expressiveEntry: "500ms",
      expressiveExit: "300ms",
    },
  },

  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 },
};

export default tokens;
