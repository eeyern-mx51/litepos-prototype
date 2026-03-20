import { useState, useEffect } from "react";
import tokens from "./theme/tokens";
import Prototype from "./Prototype";
import ComponentsShowcase from "./pages/ComponentsShowcase";
import DocumentationPage from "./pages/DocumentationPage";

function getHash() {
  return window.location.hash.replace("#", "") || "landing";
}

export default function App() {
  const [page, setPage] = useState(getHash);

  useEffect(() => {
    const onHash = () => setPage(getHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  if (page === "prototype") return <Prototype />;
  if (page === "components") return <ComponentsShowcase />;
  if (page === "docs") return <DocumentationPage />;

  // ── Landing Page ──────────────────────────────────────────────────
  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${tokens.color.bg.brand} 0%, #1a2340 100%)`,
        fontFamily: "'Google Sans', 'Roboto', -apple-system, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
      }}
    >
      {/* Hero */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: tokens.shape.expressiveLarge,
              background: tokens.color.bg.action.primary.default,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width={28} height={28} viewBox="0 0 24 24" fill={tokens.color.fg.white}>
              <path d="M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z" />
            </svg>
          </div>
          <span
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: tokens.color.fg.white,
              letterSpacing: "0.5px",
              opacity: 0.7,
            }}
          >
            mx51
          </span>
        </div>

        <h1
          style={{
            fontSize: tokens.type.displaySmall.size,
            fontWeight: 700,
            color: tokens.color.fg.white,
            margin: 0,
            lineHeight: tokens.type.displaySmall.lineHeight,
            letterSpacing: "-0.5px",
          }}
        >
          LitePOS
        </h1>
        <p
          style={{
            fontSize: tokens.type.titleMedium.size,
            color: tokens.color.fg.white,
            opacity: 0.7,
            marginTop: 8,
            fontWeight: 400,
            maxWidth: 480,
          }}
        >
          Material 3 Expressive interactive prototype for on-device POS
        </p>
      </div>

      {/* Navigation Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 24,
          maxWidth: 900,
          width: "100%",
        }}
      >
        {[
          {
            key: "prototype",
            icon: (
              <svg width={32} height={32} viewBox="0 0 24 24" fill={tokens.color.fg.brand}>
                <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z" />
              </svg>
            ),
            title: "Interactive Prototype",
            desc: "Full device-frame prototype with navigation, basket flow, settings, and all LitePOS screens.",
          },
          {
            key: "components",
            icon: (
              <svg width={32} height={32} viewBox="0 0 24 24" fill={tokens.color.fg.brand}>
                <path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z" />
              </svg>
            ),
            title: "Component Showcase",
            desc: "Browse all M3 Expressive components built for LitePOS with GKO semantic tokens.",
          },
          {
            key: "docs",
            icon: (
              <svg width={32} height={32} viewBox="0 0 24 24" fill={tokens.color.fg.brand}>
                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
              </svg>
            ),
            title: "Flows & Documentation",
            desc: "User journeys, screen maps, and feature documentation for PMs and stakeholders.",
          },
        ].map((card) => (
          <a
            key={card.key}
            href={`#${card.key}`}
            style={{
              textDecoration: "none",
              display: "block",
            }}
          >
            <div
              style={{
                background: tokens.color.fg.white,
                borderRadius: tokens.shape.expressiveLarge,
                padding: 32,
                minHeight: 240,
                display: "flex",
                flexDirection: "column",
                gap: 16,
                transition: `all ${tokens.motion.duration.medium2} ${tokens.motion.easing.expressive}`,
                boxShadow: tokens.elevation.level2,
                cursor: "pointer",
                border: `1px solid transparent`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = tokens.elevation.level4;
                e.currentTarget.style.borderColor = tokens.color.fg.brand;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = tokens.elevation.level2;
                e.currentTarget.style.borderColor = "transparent";
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: tokens.shape.expressiveLarge,
                  background: `${tokens.color.fg.brand}11`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {card.icon}
              </div>
              <div>
                <h2
                  style={{
                    fontSize: tokens.type.titleLarge.size,
                    fontWeight: 600,
                    color: tokens.color.fg.emphasis,
                    margin: 0,
                  }}
                >
                  {card.title}
                </h2>
                <p
                  style={{
                    fontSize: tokens.type.bodyMedium.size,
                    color: tokens.color.fg.subtle,
                    lineHeight: tokens.type.bodyMedium.lineHeight,
                    marginTop: 8,
                  }}
                >
                  {card.desc}
                </p>
              </div>
              <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 6 }}>
                <span
                  style={{
                    fontSize: tokens.type.labelLarge.size,
                    fontWeight: 600,
                    color: tokens.color.fg.brand,
                  }}
                >
                  Open
                </span>
                <svg width={18} height={18} viewBox="0 0 24 24" fill={tokens.color.fg.brand}>
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                </svg>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: 48,
          textAlign: "center",
          color: tokens.color.fg.white,
          opacity: 0.4,
          fontSize: tokens.type.bodySmall.size,
        }}
      >
        LitePOS M3 Expressive Prototype — mx51 Design &amp; Engineering
      </div>
    </div>
  );
}
