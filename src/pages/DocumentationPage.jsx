import { useState } from "react";
import tokens from "../theme/tokens";

// ── Reusable section components ───────────────────────────────────────
function DocSection({ title, children }) {
  return (
    <div style={{ marginBottom: 48 }}>
      <h2
        style={{
          fontSize: tokens.type.headlineSmall.size,
          fontWeight: tokens.type.headlineSmall.weight,
          color: tokens.color.fg.emphasis,
          margin: "0 0 16px",
          paddingBottom: 8,
          borderBottom: `2px solid ${tokens.color.fg.brand}`,
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}

function FlowStep({ number, title, description, screens }) {
  return (
    <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: tokens.shape.full,
          background: tokens.color.bg.action.primary.default,
          color: tokens.color.fg.onAction,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          fontSize: tokens.type.labelLarge.size,
          flexShrink: 0,
        }}
      >
        {number}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: tokens.type.titleMedium.size, fontWeight: 600, color: tokens.color.fg.emphasis }}>
          {title}
        </div>
        <div style={{ fontSize: tokens.type.bodyMedium.size, color: tokens.color.fg.subtle, marginTop: 4, lineHeight: "1.5" }}>
          {description}
        </div>
        {screens && (
          <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
            {screens.map((s) => (
              <span
                key={s}
                style={{
                  fontSize: tokens.type.labelSmall.size,
                  fontWeight: 600,
                  color: tokens.color.fg.brand,
                  background: `${tokens.color.fg.brand}11`,
                  padding: "3px 10px",
                  borderRadius: tokens.shape.small,
                  border: `1px solid ${tokens.color.border.action.default}33`,
                }}
              >
                {s}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoCard({ title, items, accent }) {
  const bg = accent === "warning" ? `${tokens.color.bg.warning.default}11` : `${tokens.color.bg.info.default}11`;
  const border = accent === "warning" ? tokens.color.border.warning : tokens.color.border.info;
  const iconColor = accent === "warning" ? tokens.color.fg.warning.icon : tokens.color.fg.info.icon;
  return (
    <div
      style={{
        background: bg,
        border: `1px solid ${border}44`,
        borderRadius: tokens.shape.large,
        padding: 20,
        marginBottom: 16,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <svg width={20} height={20} viewBox="0 0 24 24" fill={iconColor}>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
        </svg>
        <span style={{ fontSize: tokens.type.titleSmall.size, fontWeight: 600, color: tokens.color.fg.emphasis }}>{title}</span>
      </div>
      <ul style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}>
        {items.map((item, i) => (
          <li key={i} style={{ fontSize: tokens.type.bodyMedium.size, color: tokens.color.fg.subtle, lineHeight: "1.5" }}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

// ── Flowchart components ──────────────────────────────────────────────
const FC = {
  brand: tokens.color.bg.action.primary.default,
  brandLight: `${tokens.color.fg.brand}15`,
  text: tokens.color.fg.emphasis,
  subtle: tokens.color.fg.subtle,
  white: "#fff",
  border: tokens.color.border.onpage,
  success: tokens.color.fg.success?.icon || "#4CAF50",
  warning: tokens.color.fg.warning?.icon || "#FF9800",
};

function FlowNode({ x, y, label, type = "screen", width = 140, height = 40 }) {
  const isStart = type === "start" || type === "end";
  const isDecision = type === "decision";
  const isAction = type === "action";
  const rx = isStart ? height / 2 : isDecision ? 4 : 8;

  const bg = isStart ? FC.brand
    : isDecision ? "#FFF3E0"
    : isAction ? FC.brandLight
    : FC.white;
  const stroke = isStart ? FC.brand
    : isDecision ? "#FF9800"
    : isAction ? FC.brand
    : FC.border;
  const textColor = isStart ? FC.white : FC.text;
  const fontSize = label.length > 22 ? 10 : 11;

  return (
    <g>
      {isDecision ? (
        <g transform={`translate(${x}, ${y})`}>
          <polygon
            points={`${width / 2},0 ${width},${height / 2} ${width / 2},${height} 0,${height / 2}`}
            fill={bg}
            stroke={stroke}
            strokeWidth={1.5}
          />
          <text x={width / 2} y={height / 2 + 4} textAnchor="middle" fontSize={fontSize} fontWeight={600} fill={textColor} fontFamily="Figtree, sans-serif">
            {label}
          </text>
        </g>
      ) : (
        <g>
          <rect x={x} y={y} width={width} height={height} rx={rx} fill={bg} stroke={stroke} strokeWidth={1.5} />
          <text x={x + width / 2} y={y + height / 2 + 4} textAnchor="middle" fontSize={fontSize} fontWeight={isStart ? 700 : 500} fill={textColor} fontFamily="Figtree, sans-serif">
            {label}
          </text>
        </g>
      )}
    </g>
  );
}

function FlowArrow({ x1, y1, x2, y2, label, bend }) {
  const mid = bend
    ? `L ${bend.x} ${bend.y} `
    : "";
  const endX = x2;
  const endY = y2;
  const arrowSize = 5;

  // Determine arrow direction for head
  const fromX = bend ? bend.x : x1;
  const fromY = bend ? bend.y : y1;
  const angle = Math.atan2(endY - fromY, endX - fromX);

  return (
    <g>
      <path
        d={`M ${x1} ${y1} ${mid}L ${endX} ${endY}`}
        fill="none"
        stroke={FC.border}
        strokeWidth={1.5}
      />
      <polygon
        points={`${endX},${endY} ${endX - arrowSize * Math.cos(angle - 0.4)},${endY - arrowSize * Math.sin(angle - 0.4)} ${endX - arrowSize * Math.cos(angle + 0.4)},${endY - arrowSize * Math.sin(angle + 0.4)}`}
        fill={FC.border}
      />
      {label && (
        <text
          x={bend ? (x1 + bend.x) / 2 + 4 : (x1 + x2) / 2 + 6}
          y={bend ? (y1 + bend.y) / 2 : (y1 + y2) / 2 - 4}
          fontSize={9}
          fill={FC.subtle}
          fontFamily="Figtree, sans-serif"
          fontWeight={600}
        >
          {label}
        </text>
      )}
    </g>
  );
}

function FlowchartContainer({ children, width = 700, height = 300, title, exportFile }) {
  return (
    <div style={{
      background: tokens.color.bg.surface,
      borderRadius: tokens.shape.expressiveLarge,
      border: `1px solid ${tokens.color.border.onpage}`,
      padding: "20px 16px",
      marginBottom: 24,
      overflowX: "auto",
      position: "relative",
    }}>
      {title && (
        <div style={{
          fontSize: tokens.type.labelMedium.size,
          fontWeight: 600,
          color: tokens.color.fg.subtle,
          textTransform: "uppercase",
          letterSpacing: 1,
          marginBottom: 12,
        }}>
          {title}
        </div>
      )}
      {exportFile && (
        <a
          href={`/flowcharts/${exportFile}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: "absolute",
            top: 14,
            right: 16,
            display: "flex",
            alignItems: "center",
            gap: 5,
            fontSize: tokens.type.labelSmall.size,
            fontWeight: 600,
            color: tokens.color.fg.brand,
            textDecoration: "none",
            padding: "4px 10px",
            borderRadius: tokens.shape.full,
            background: `${tokens.color.fg.brand}0A`,
            border: `1px solid ${tokens.color.fg.brand}22`,
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = `${tokens.color.fg.brand}18`}
          onMouseLeave={(e) => e.currentTarget.style.background = `${tokens.color.fg.brand}0A`}
        >
          <svg width={12} height={12} viewBox="0 0 24 24" fill="currentColor"><path d="M19 19H5V5h7V3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>
          Open SVG for Figma
        </a>
      )}
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: "block", margin: "0 auto" }}>
        {children}
      </svg>
    </div>
  );
}

// ── Screen map node ───────────────────────────────────────────────────
function ScreenNode({ name, type, children }) {
  const isRoot = type === "root";
  const isNav = type === "nav";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div
        style={{
          padding: "8px 20px",
          borderRadius: tokens.shape.full,
          background: isRoot ? tokens.color.bg.action.primary.default : isNav ? tokens.color.bg.brand : tokens.color.bg.page,
          color: isRoot || isNav ? tokens.color.fg.white : tokens.color.fg.emphasis,
          fontSize: tokens.type.labelLarge.size,
          fontWeight: 600,
          border: !isRoot && !isNav ? `1px solid ${tokens.color.border.onpage}` : "none",
          boxShadow: tokens.elevation.level1,
          whiteSpace: "nowrap",
        }}
      >
        {name}
      </div>
      {children && (
        <>
          <div style={{ width: 2, height: 16, background: tokens.color.border.onpage }} />
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>{children}</div>
        </>
      )}
    </div>
  );
}

// ── Main documentation page ───────────────────────────────────────────
export default function DocumentationPage() {
  const [showMapLightbox, setShowMapLightbox] = useState(false);

  const screenMapContent = (
    <div style={{ display: "flex", justifyContent: "center", gap: 32 }}>
      <ScreenNode name="Home" type="root">
        <ScreenNode name="Product Grid" type="nav">
          <ScreenNode name="Basket" type="nav">
            <ScreenNode name="Payment Options" type="nav">
              <ScreenNode name="Pay in Full" />
              <ScreenNode name="Split by Item" />
              <ScreenNode name="Split Equally" />
            </ScreenNode>
          </ScreenNode>
          <ScreenNode name="Keypad" />
          <ScreenNode name="Scan (POS)" />
        </ScreenNode>
        <ScreenNode name="Menu" type="nav">
          <ScreenNode name="History" />
          <ScreenNode name="Reporting" />
          <ScreenNode name="Settings" type="nav">
            <ScreenNode name="LitePOS Settings">
              <ScreenNode name="Product Catalog" type="nav">
                <ScreenNode name="New Product" />
                <ScreenNode name="Edit Product" />
                <ScreenNode name="Categories (CRUD)" />
              </ScreenNode>
              <ScreenNode name="Import Products" type="nav">
                <ScreenNode name="Scan (Import)" />
                <ScreenNode name="Review Import" />
              </ScreenNode>
            </ScreenNode>
          </ScreenNode>
        </ScreenNode>
      </ScreenNode>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: tokens.color.bg.page, fontFamily: "'Figtree', -apple-system, sans-serif" }}>
      {/* Top bar */}
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: tokens.color.bg.brand, padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <a href="#landing" style={{ color: tokens.color.fg.white, textDecoration: "none", opacity: 0.7, fontSize: tokens.type.labelLarge.size, display: "flex", alignItems: "center", gap: 4 }}>
            <svg width={18} height={18} viewBox="0 0 24 24" fill={tokens.color.fg.white}><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" /></svg>
            Back
          </a>
          <h1 style={{ fontSize: tokens.type.titleLarge.size, fontWeight: 600, color: tokens.color.fg.white, margin: 0 }}>
            Flows & Documentation
          </h1>
        </div>
        <span style={{ fontSize: tokens.type.labelMedium.size, color: tokens.color.fg.white, opacity: 0.5 }}>
          LitePOS Product Guide
        </span>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 32px 64px" }}>
        {/* ── Overview ──────────────────────────────────────────── */}
        <DocSection title="What is LitePOS?">
          <p style={{ fontSize: tokens.type.bodyLarge.size, color: tokens.color.fg.emphasis, lineHeight: "1.7", margin: "0 0 16px" }}>
            LitePOS is an on-device point-of-sale solution that transforms a payment terminal into a lightweight POS system. It enables merchants to manage a product catalogue with photos, process transactions via products or manual keypad entry, handle split payments, and view transaction history and reporting — all without needing a separate POS application or hardware.
          </p>
          <p style={{ fontSize: tokens.type.bodyLarge.size, color: tokens.color.fg.emphasis, lineHeight: "1.7", margin: 0 }}>
            LitePOS runs natively on the payment terminal within the existing mx51 application. When enabled via LitePOS Settings, it replaces the default MXA terminal home screen with a product-first experience featuring a photo grid, category filtering, barcode scanning, and a full basket-to-payment flow.
          </p>
        </DocSection>

        {/* ── Screen Map ────────────────────────────────────────── */}
        <DocSection title="Screen Map">
          <div style={{ background: tokens.color.bg.surface, borderRadius: tokens.shape.expressiveLarge, padding: 32, border: `1px solid ${tokens.color.border.onpage}`, overflowX: "auto", position: "relative" }}>
            {screenMapContent}
            <div style={{ marginTop: 16, fontSize: tokens.type.bodySmall.size, color: tokens.color.fg.subtle, textAlign: "center" }}>
              When LitePOS is OFF, the Home screen shows the default MXA terminal home (Payment / Split Bill / Refund cards).
            </div>
            <button onClick={() => setShowMapLightbox(true)} style={{ position: "absolute", top: 12, right: 12, padding: "8px 16px", borderRadius: tokens.shape.full, background: tokens.color.bg.action.primary.default, color: tokens.color.fg.onAction, border: "none", fontSize: tokens.type.labelMedium.size, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6, boxShadow: tokens.elevation.level2 }}>
              <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" /></svg>
              Expand
            </button>
          </div>
        </DocSection>

        {/* ── Lightbox ── */}
        {showMapLightbox && (
          <div onClick={() => setShowMapLightbox(false)} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", padding: 32, cursor: "pointer" }}>
            <div onClick={(e) => e.stopPropagation()} style={{ background: tokens.color.bg.surface, borderRadius: tokens.shape.expressiveLarge, padding: 48, maxWidth: "95vw", maxHeight: "90vh", overflow: "auto", position: "relative", cursor: "default", boxShadow: tokens.elevation.level5 }}>
              <button onClick={() => setShowMapLightbox(false)} style={{ position: "absolute", top: 16, right: 16, width: 40, height: 40, borderRadius: tokens.shape.full, background: tokens.color.bg.page, border: `1px solid ${tokens.color.border.onpage}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: tokens.color.fg.emphasis, fontFamily: "inherit" }}>✕</button>
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: tokens.type.headlineSmall.size, fontWeight: tokens.type.headlineSmall.weight, color: tokens.color.fg.emphasis, margin: 0 }}>Screen Map</h2>
                <p style={{ fontSize: tokens.type.bodyMedium.size, color: tokens.color.fg.subtle, marginTop: 4 }}>Full navigation hierarchy of the LitePOS prototype</p>
              </div>
              {screenMapContent}
              <div style={{ marginTop: 24, fontSize: tokens.type.bodySmall.size, color: tokens.color.fg.subtle, textAlign: "center" }}>
                When LitePOS is OFF, the Home screen shows the default MXA terminal home.
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            FLOW 1 — Enabling LitePOS
            ═══════════════════════════════════════════════════════════════ */}
        <DocSection title="Flow 1 — Enabling LitePOS">
          <p style={{ fontSize: tokens.type.bodyMedium.size, color: tokens.color.fg.subtle, lineHeight: "1.6", marginBottom: 20 }}>
            Merchant navigates to the LitePOS settings page and toggles the feature on. The home screen immediately switches from the default MXA terminal home to the product-first LitePOS experience.
          </p>

          <FlowchartContainer width={680} height={80} title="Flowchart" exportFile="flow1-enable-litepos.html">
            <FlowNode x={0} y={20} label="Home" type="start" width={100} />
            <FlowArrow x1={100} y1={40} x2={140} y2={40} />
            <FlowNode x={140} y={20} label="Menu" width={100} />
            <FlowArrow x1={240} y1={40} x2={280} y2={40} />
            <FlowNode x={280} y={20} label="Settings" width={100} />
            <FlowArrow x1={380} y1={40} x2={420} y2={40} />
            <FlowNode x={420} y={20} label="LitePOS Settings" width={130} />
            <FlowArrow x1={550} y1={40} x2={590} y2={40} />
            <FlowNode x={590} y={20} label="Toggle ON" type="action" width={90} />
          </FlowchartContainer>

          <FlowStep number={1} title="Navigate to Settings" description="From the Home screen, tap the Menu circle button, then tap the 'Terminal settings' NavCard." screens={["Home", "Menu", "Settings"]} />
          <FlowStep number={2} title="Open LitePOS Settings" description="In Settings, tap the 'LitePOS' list item to open the LitePOS configuration page." screens={["Settings", "LitePOS Settings"]} />
          <FlowStep number={3} title="Enable the Feature" description="Toggle the LitePOS switch to ON. The supporting text updates from 'Disabled' to 'Enabled'. The home screen now shows the product grid instead of the default MXA terminal home." screens={["LitePOS Settings"]} />
        </DocSection>

        {/* ═══════════════════════════════════════════════════════════════
            FLOW 2 — Product Catalogue Setup
            ═══════════════════════════════════════════════════════════════ */}
        <DocSection title="Flow 2 — Product Catalogue Setup">
          <p style={{ fontSize: tokens.type.bodyMedium.size, color: tokens.color.fg.subtle, lineHeight: "1.6", marginBottom: 20 }}>
            Before processing transactions via product selection, the merchant sets up their catalogue with products, categories, and photos.
          </p>

          <FlowchartContainer width={750} height={200} title="Flowchart — Add Product" exportFile="flow2-add-product.html">
            <FlowNode x={0} y={20} label="LitePOS Settings" type="start" width={130} />
            <FlowArrow x1={130} y1={40} x2={170} y2={40} />
            <FlowNode x={170} y={20} label="Manage Products" width={130} />
            <FlowArrow x1={300} y1={40} x2={340} y2={40} />
            <FlowNode x={340} y={20} label="Product Catalog" width={120} />
            <FlowArrow x1={460} y1={40} x2={500} y2={40} />
            <FlowNode x={500} y={20} label="Tap + FAB" type="action" width={100} />
            <FlowArrow x1={600} y1={40} x2={640} y2={40} />
            <FlowNode x={640} y={20} label="New Product" width={110} />
            {/* Second row — form fields */}
            <FlowArrow x1={695} y1={60} x2={695} y2={90} />
            <FlowNode x={440} y={90} label="Fill: Name, Price, Category, Photo, SKU" width={300} height={36} />
            <FlowArrow x1={590} y1={126} x2={590} y2={152} />
            <FlowNode x={540} y={152} label="Save Product" type="end" width={110} />
          </FlowchartContainer>

          <FlowchartContainer width={680} height={100} title="Flowchart — Import Product" exportFile="flow2-import-product.html">
            <FlowNode x={0} y={30} label="LitePOS Settings" type="start" width={130} />
            <FlowArrow x1={130} y1={50} x2={160} y2={50} />
            <FlowNode x={160} y={30} label="Import Products" width={120} />
            <FlowArrow x1={280} y1={50} x2={310} y2={50} />
            <FlowNode x={310} y={30} label="Start Scanning" type="action" width={110} />
            <FlowArrow x1={420} y1={50} x2={450} y2={50} />
            <FlowNode x={450} y={30} label="Scan Barcode" width={110} />
            <FlowArrow x1={560} y1={50} x2={590} y2={50} />
            <FlowNode x={590} y={30} label="Review & Save" type="end" width={100} />
            {/* Loop label */}
            <text x={555} y={18} fontSize={9} fill={FC.subtle} fontFamily="Figtree, sans-serif" fontWeight={600}>or Scan Another</text>
            <path d="M 640 30 Q 640 10 590 10 Q 505 10 505 30" fill="none" stroke={FC.border} strokeWidth={1} strokeDasharray="3,3" />
          </FlowchartContainer>

          <FlowStep number={1} title="Access Product Catalogue" description="From LitePOS Settings, tap 'Manage Products' under the Product Catalogue section." screens={["LitePOS Settings", "Product Catalog"]} />
          <FlowStep number={2} title="Manage Categories" description="Expand the Categories section to create, rename, or delete categories. Renaming cascades to all products in that category. Deleting moves affected products to 'Uncategorised'." screens={["Product Catalog"]} />
          <FlowStep number={3} title="Add Products" description="Tap the '+ New Product' FAB. Enter name, price, category, optional photo upload via device file picker, and optional fields (description, SKU, UPC). Toggle favourite for quick-access on the home grid. Product photos display on home grid cards and catalogue list thumbnails." screens={["Product Catalog", "New Product"]} />
          <FlowStep number={4} title="Edit or Delete Products" description="Tap any product in the catalogue to edit. The existing photo loads into the preview where it can be changed or removed. Use the delete button (with confirmation dialog) to remove a product." screens={["Edit Product"]} />
          <FlowStep number={5} title="Import from Connect Express" description="From LitePOS Settings, tap 'Import Products' for a step-by-step guide. Tap 'Start Scanning' to scan Connect Express receipt barcodes. Scanned products pre-fill the form. Choose 'Import Product' to save, or 'Save & Scan Another' to continue." screens={["Import Products", "Scan (Import)", "Review Import"]} />
        </DocSection>

        {/* ═══════════════════════════════════════════════════════════════
            FLOW 3 — Processing a Transaction
            ═══════════════════════════════════════════════════════════════ */}
        <DocSection title="Flow 3 — Processing a Transaction">
          <p style={{ fontSize: tokens.type.bodyMedium.size, color: tokens.color.fg.subtle, lineHeight: "1.6", marginBottom: 20 }}>
            Three entry modes for creating a transaction: product selection from the grid, barcode scanning, or manual amount entry via keypad.
          </p>

          <FlowchartContainer width={750} height={260} title="Flowchart — Transaction Flow" exportFile="flow3-transaction.html">
            {/* Start */}
            <FlowNode x={310} y={0} label="Home" type="start" width={100} />
            {/* Three branches */}
            <FlowArrow x1={310} y1={20} x2={100} y2={70} label="" />
            <FlowArrow x1={360} y1={40} x2={360} y2={70} />
            <FlowArrow x1={410} y1={20} x2={620} y2={70} label="" />
            {/* Path A */}
            <FlowNode x={30} y={70} label="Tap Product" type="action" width={120} />
            <text x={90} y={66} fontSize={10} fontWeight={600} fill={FC.brand} fontFamily="Figtree, sans-serif" textAnchor="middle">A: Products</text>
            {/* Path B */}
            <FlowNode x={300} y={70} label="Scan Barcode" type="action" width={120} />
            <text x={360} y={66} fontSize={10} fontWeight={600} fill={FC.brand} fontFamily="Figtree, sans-serif" textAnchor="middle">B: Scan</text>
            {/* Path C */}
            <FlowNode x={560} y={70} label="Enter Amount" type="action" width={120} />
            <text x={620} y={66} fontSize={10} fontWeight={600} fill={FC.brand} fontFamily="Figtree, sans-serif" textAnchor="middle">C: Keypad</text>
            {/* Converge to basket */}
            <FlowArrow x1={90} y1={110} x2={310} y2={145} />
            <FlowArrow x1={360} y1={110} x2={360} y2={145} />
            <FlowArrow x1={620} y1={110} x2={410} y2={145} />
            <FlowNode x={290} y={145} label="Basket / OrderBar" width={140} />
            <FlowArrow x1={360} y1={185} x2={360} y2={210} />
            {/* Payment decision */}
            <FlowNode x={280} y={210} label="Payment Options" type="decision" width={160} height={46} />
          </FlowchartContainer>

          <FlowchartContainer width={700} height={120} title="Flowchart — Payment Methods" exportFile="flow3-payment-methods.html">
            <FlowNode x={250} y={0} label="Payment Options" type="decision" width={160} height={46} />
            {/* Three payment paths */}
            <FlowArrow x1={250} y1={23} x2={60} y2={80} />
            <FlowArrow x1={330} y1={46} x2={330} y2={80} />
            <FlowArrow x1={410} y1={23} x2={600} y2={80} />
            <FlowNode x={0} y={80} label="Pay in Full" type="end" width={110} />
            <FlowNode x={265} y={80} label="Split by Item" type="end" width={120} />
            <FlowNode x={545} y={80} label="Split Equally" type="end" width={110} />
            {/* Labels */}
            <text x={55} y={75} fontSize={9} fill={FC.subtle} fontFamily="Figtree, sans-serif" fontWeight={600}>Full amount</text>
            <text x={320} y={75} fontSize={9} fill={FC.subtle} fontFamily="Figtree, sans-serif" fontWeight={600}>Per item</text>
            <text x={595} y={75} fontSize={9} fill={FC.subtle} fontFamily="Figtree, sans-serif" fontWeight={600}>Per patron</text>
          </FlowchartContainer>

          <div style={{ fontSize: tokens.type.titleSmall.size, fontWeight: 600, color: tokens.color.fg.brand, marginBottom: 12 }}>Path A — Product Selection</div>
          <FlowStep number={1} title="Browse Products" description="On the Home screen, browse the product grid with photo cards. Filter by category using the horizontal chip bar, or search by name. Products show their uploaded photo, name, and price." screens={["Home (Product Grid)"]} />
          <FlowStep number={2} title="Add to Basket" description="Tap a product card to add it to the basket. The OrderBar at the bottom transitions from hidden to a teal basket bar showing item count and running total." screens={["Home", "OrderBar"]} />
          <FlowStep number={3} title="Review Basket" description="Tap the OrderBar to open the Basket screen. Review items, adjust quantities, remove items, or add more." screens={["Basket"]} />
          <FlowStep number={4} title="Proceed to Payment" description="Tap 'Proceed to Payment' to see three payment options: Pay in Full, Split by Item, or Split Equally." screens={["Basket", "Payment Options"]} />
          <FlowStep number={5} title="Tap to Pay" description="Each payment shows a contactless card prompt, processes the transaction, and displays an 'Approved' confirmation. For split payments, the flow returns for the next patron until all shares are paid." screens={["Payment Processing", "Approved"]} />

          <div style={{ fontSize: tokens.type.titleSmall.size, fontWeight: 600, color: tokens.color.fg.brand, marginBottom: 12, marginTop: 24 }}>Path B — Barcode Scanning</div>
          <FlowStep number={1} title="Open Scanner" description="Tap the barcode scan icon in the Home screen filter bar. This opens a full-screen camera viewfinder with an animated scan line." screens={["Home", "Scan (POS)"]} />
          <FlowStep number={2} title="Scan Product" description="Point the camera at a product barcode. If it matches a catalogue product, it's automatically added to the basket. If no match, an error state is shown and scanning resumes." screens={["Scan (POS)", "Home"]} />

          <div style={{ fontSize: tokens.type.titleSmall.size, fontWeight: 600, color: tokens.color.fg.brand, marginBottom: 12, marginTop: 24 }}>Path C — Keypad Entry</div>
          <FlowStep number={1} title="Open Keypad" description="Tap the Manual Entry tile on the Home screen product grid. The keypad is treated as an input mode alongside products." screens={["Home", "Keypad"]} />
          <FlowStep number={2} title="Enter Amount & Process" description="Key in the transaction amount and tap 'Next' to proceed directly to payment processing." screens={["Keypad", "Payment"]} />
        </DocSection>

        {/* ═══════════════════════════════════════════════════════════════
            FLOW 4 — Split Payments
            ═══════════════════════════════════════════════════════════════ */}
        <DocSection title="Flow 4 — Split Payments">
          <p style={{ fontSize: tokens.type.bodyMedium.size, color: tokens.color.fg.subtle, lineHeight: "1.6", marginBottom: 20 }}>
            Two split payment modes allow merchants to divide a transaction across multiple patrons.
          </p>

          <FlowchartContainer width={700} height={140} title="Flowchart — Split by Item" exportFile="flow4-split-by-item.html">
            <FlowNode x={0} y={50} label="Payment Options" type="start" width={130} />
            <FlowArrow x1={130} y1={70} x2={165} y2={70} />
            <FlowNode x={165} y={50} label="Split by Item" width={110} />
            <FlowArrow x1={275} y1={70} x2={310} y2={70} />
            <FlowNode x={310} y={50} label="Select Items" type="action" width={100} />
            <FlowArrow x1={410} y1={70} x2={445} y2={70} />
            <FlowNode x={445} y={50} label="Tap to Pay" width={100} />
            <FlowArrow x1={545} y1={70} x2={580} y2={70} />
            <FlowNode x={580} y={50} label="Approved" type="end" width={100} />
            {/* Loop back */}
            <text x={430} y={18} fontSize={9} fill={FC.subtle} fontFamily="Figtree, sans-serif" fontWeight={600}>Repeat until all items paid</text>
            <path d="M 630 50 Q 630 10 400 10 Q 220 10 220 50" fill="none" stroke={FC.border} strokeWidth={1} strokeDasharray="4,3" />
            <polygon points="220,50 216,42 224,42" fill={FC.border} />
          </FlowchartContainer>

          <FlowchartContainer width={700} height={140} title="Flowchart — Split Equally" exportFile="flow4-split-equally.html">
            <FlowNode x={0} y={50} label="Payment Options" type="start" width={130} />
            <FlowArrow x1={130} y1={70} x2={165} y2={70} />
            <FlowNode x={165} y={50} label="Split Equally" width={110} />
            <FlowArrow x1={275} y1={70} x2={310} y2={70} />
            <FlowNode x={310} y={50} label="Set # Patrons" type="action" width={110} />
            <FlowArrow x1={420} y1={70} x2={455} y2={70} />
            <FlowNode x={455} y={50} label="Tap to Pay" width={100} />
            <FlowArrow x1={555} y1={70} x2={590} y2={70} />
            <FlowNode x={590} y={50} label="Approved" type="end" width={100} />
            {/* Loop back */}
            <text x={430} y={18} fontSize={9} fill={FC.subtle} fontFamily="Figtree, sans-serif" fontWeight={600}>Repeat for each patron</text>
            <path d="M 640 50 Q 640 10 410 10 Q 220 10 220 50" fill="none" stroke={FC.border} strokeWidth={1} strokeDasharray="4,3" />
            <polygon points="220,50 216,42 224,42" fill={FC.border} />
          </FlowchartContainer>

          <FlowStep number={1} title="Split by Item" description="Explodes basket quantities into individual selectable units (e.g. 'Flat White × 2' becomes two rows). Each patron selects their items, taps 'Charge', and the card-present screen appears. Progress tracked with a green bar until all items are paid." screens={["Split by Item", "Payment Processing"]} />
          <FlowStep number={2} title="Split Equally" description="Set the number of patrons using a stepper. The total is divided evenly (with remainder on the last patron). Each patron taps to pay their share. Progress bar tracks completion." screens={["Split Equally", "Payment Processing"]} />
        </DocSection>

        {/* ═══════════════════════════════════════════════════════════════
            FLOW 5 — Receipts
            ═══════════════════════════════════════════════════════════════ */}
        <DocSection title="Flow 5 — Receipts">
          <p style={{ fontSize: tokens.type.bodyMedium.size, color: tokens.color.fg.subtle, lineHeight: "1.6", marginBottom: 20 }}>
            After a successful transaction, receipts are generated based on the configuration in LitePOS Settings.
          </p>
          <FlowStep number={1} title="Merchant Receipt" description="If 'Merchant copy — print items' is enabled, the merchant receipt includes a breakdown of basket items alongside the transaction details." screens={["LitePOS Settings (config)"]} />
          <FlowStep number={2} title="Customer Receipt" description="If 'Customer copy — print items' is enabled, the customer receipt also includes the basket item breakdown." screens={["LitePOS Settings (config)"]} />
          <InfoCard accent="warning" title="Important" items={[
            "Receipt configuration is set globally in LitePOS Settings, not per-transaction",
            "When LitePOS is disabled, receipts revert to standard payment-only format",
            "Item details on receipts only apply when products/basket are used (not keypad-only transactions)",
          ]} />
        </DocSection>

        {/* ═══════════════════════════════════════════════════════════════
            FLOW 6 — History & Reporting
            ═══════════════════════════════════════════════════════════════ */}
        <DocSection title="Flow 6 — History & Reporting">
          <p style={{ fontSize: tokens.type.bodyMedium.size, color: tokens.color.fg.subtle, lineHeight: "1.6", marginBottom: 20 }}>
            Transaction history and reporting are accessed from the Menu screen.
          </p>

          <FlowchartContainer width={560} height={80} title="Flowchart" exportFile="flow6-history-reporting.html">
            <FlowNode x={0} y={20} label="Home" type="start" width={80} />
            <FlowArrow x1={80} y1={40} x2={110} y2={40} />
            <FlowNode x={110} y={20} label="Menu" width={80} />
            {/* Two branches */}
            <FlowArrow x1={190} y1={30} x2={240} y2={20} />
            <FlowArrow x1={190} y1={50} x2={240} y2={55} />
            <FlowNode x={240} y={0} label="Transaction History" width={150} />
            <FlowNode x={240} y={40} label="Terminal Reporting" width={150} />
            <FlowArrow x1={390} y1={20} x2={430} y2={20} />
            <FlowArrow x1={390} y1={60} x2={430} y2={60} />
            <FlowNode x={430} y={0} label="Search / Filter" type="action" width={110} />
            <FlowNode x={430} y={40} label="Txns / Items Tabs" type="action" width={120} />
          </FlowchartContainer>

          <FlowStep number={1} title="Transaction History" description="From Menu, tap 'Transaction history'. Search by date range, card number (last 4), amount, or transaction status." screens={["Menu", "History"]} />
          <FlowStep number={2} title="Terminal Reporting" description="From Menu, tap 'Terminal reporting'. View aggregated data with tabs for 'Transactions' and 'Items' breakdowns." screens={["Menu", "Reporting"]} />
          <FlowStep number={3} title="Filter & Export" description="Use Chip filters (All, Approved, Declined, Refunded) to narrow results. Reports can be exported or printed." screens={["Reporting"]} />
        </DocSection>

        {/* ═══════════════════════════════════════════════════════════════
            Configuration Reference
            ═══════════════════════════════════════════════════════════════ */}
        <DocSection title="LitePOS Settings Reference">
          <div style={{ background: tokens.color.bg.surface, borderRadius: tokens.shape.expressiveLarge, padding: 24, border: `1px solid ${tokens.color.border.onpage}` }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: tokens.type.bodyMedium.size }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${tokens.color.border.onpage}` }}>
                  <th style={{ textAlign: "left", padding: "8px 12px", color: tokens.color.fg.emphasis, fontWeight: 600 }}>Setting</th>
                  <th style={{ textAlign: "left", padding: "8px 12px", color: tokens.color.fg.emphasis, fontWeight: 600 }}>Section</th>
                  <th style={{ textAlign: "left", padding: "8px 12px", color: tokens.color.fg.emphasis, fontWeight: 600 }}>Type</th>
                  <th style={{ textAlign: "left", padding: "8px 12px", color: tokens.color.fg.emphasis, fontWeight: 600 }}>Default</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["LitePOS", "Top-level toggle", "Switch (Enabled/Disabled)", "On"],
                  ["Manage Products", "Product Catalogue", "Navigation → Product Catalog", "—"],
                  ["Import Products", "Product Catalogue", "Navigation → Import Guide", "—"],
                  ["Barcode Settings", "Product Catalogue", "Navigation", "—"],
                  ["Merchant copy — print items", "Receipts", "Switch", "On"],
                  ["Customer copy — print items", "Receipts", "Switch", "On"],
                ].map(([setting, section, type, def], i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${tokens.color.border.onpage}` }}>
                    <td style={{ padding: "10px 12px", color: tokens.color.fg.emphasis }}>{setting}</td>
                    <td style={{ padding: "10px 12px", color: tokens.color.fg.subtle }}>{section}</td>
                    <td style={{ padding: "10px 12px", color: tokens.color.fg.subtle }}>{type}</td>
                    <td style={{ padding: "10px 12px", color: tokens.color.fg.brand, fontWeight: 600 }}>{def}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DocSection>

        {/* ═══════════════════════════════════════════════════════════════
            Design Decisions
            ═══════════════════════════════════════════════════════════════ */}
        <DocSection title="Design Decisions & Rationale">
          <div style={{ display: "flex", flexDirection: "column", gap: 16, fontSize: tokens.type.bodyMedium.size, color: tokens.color.fg.emphasis, lineHeight: "1.6" }}>
            <div><strong style={{ color: tokens.color.fg.brand }}>Consolidated Settings</strong> — All LitePOS configuration lives under Settings → LitePOS as a simple list item with an Enabled/Disabled switch. Product catalogue, import, barcode settings, and receipt configuration are grouped below.</div>
            <div><strong style={{ color: tokens.color.fg.brand }}>Product-First Home with Photos</strong> — When LitePOS is enabled, the home screen shows a product grid with real product photos. When disabled, the default MXA terminal home is shown (Payment / Split Bill / Refund action cards with payment scheme logos). The keypad is accessible via a Manual Entry tile in the grid.</div>
            <div><strong style={{ color: tokens.color.fg.brand }}>Circle Icon Buttons</strong> — The top bar uses 44px circle icon-only buttons for Menu and LitePOS Settings, with the mx51 wordmark logo centred between them. This keeps the bar clean and ensures the logo is perfectly centred.</div>
            <div><strong style={{ color: tokens.color.fg.brand }}>Product Image Support</strong> — Products support photo uploads via the device file picker. Default sample products ship with professional product photography. Uploaded images persist for the session and display in the home grid (96px cards), catalogue list (44px thumbnails), and edit screen (full preview with edit/delete overlay). Resetting demo data restores default product photos.</div>
            <div><strong style={{ color: tokens.color.fg.brand }}>Fixed Bottom OrderBar</strong> — Inspired by Square and Toast, the bottom of the Home screen has a fixed bar that appears when the basket has items, showing count and total. This replaces competing floating elements and gives the product grid full scrollable space.</div>
            <div><strong style={{ color: tokens.color.fg.brand }}>M3 Expressive for POS</strong> — POS-specific components (ProductCard, OrderBar) use M3 Expressive design language: expressive rounded shapes, spring-based motion, and vibrant teal accents.</div>
            <div><strong style={{ color: tokens.color.fg.brand }}>GKO Semantic Tokens</strong> — All colours use the Gecko semantic token system (bg/, fg/, border/) rather than M3's raw primary/secondary naming. This ensures the prototype maps directly to the Figma token structure.</div>
            <div><strong style={{ color: tokens.color.fg.brand }}>Barcode Scanning (Dual Mode)</strong> — The ScanScreen serves two purposes: POS mode (scan to add to basket) and Import mode (scan Connect Express barcodes to pre-fill the add product form).</div>
            <div><strong style={{ color: tokens.color.fg.brand }}>Category CRUD with Cascading Updates</strong> — Categories are managed inline within the Product Catalog. Renaming cascades to all products. Deleting moves products to "Uncategorised".</div>
            <div><strong style={{ color: tokens.color.fg.brand }}>Split Payment (CBA Smart Hospitality Pattern)</strong> — Three payment options: Pay in Full, Split by Item (explodes quantities into selectable units), and Split Equally (divides by patron count). Both split modes loop through card-present payments with progress tracking until all shares are paid.</div>
            <div><strong style={{ color: tokens.color.fg.brand }}>In-Session Data Persistence</strong> — All product CRUD operations persist in React state and reflect immediately on the Home screen. "Reset All Data" in demo controls restores the sample catalogue with default photos.</div>
            <div><strong style={{ color: tokens.color.fg.brand }}>PWA Standalone Support</strong> — The prototype supports add-to-homescreen as a PWA with proper viewport handling, manifest.json, and standalone mode detection for full-screen terminal simulation.</div>
          </div>
        </DocSection>

        {/* ── References ────────────────────────────────────────── */}
        <DocSection title="References">
          <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: tokens.type.bodyMedium.size }}>
            <a href="https://mx51.atlassian.net/wiki/spaces/BPT/pages/3005677574" target="_blank" rel="noopener" style={{ color: tokens.color.fg.brand, textDecoration: "none" }}>Lite POS User Guide — Confluence</a>
            <a href="https://mx51.atlassian.net/wiki/spaces/BPT/pages/3055288335" target="_blank" rel="noopener" style={{ color: tokens.color.fg.brand, textDecoration: "none" }}>Excalidraw Workflows — Confluence</a>
            <a href="https://www.figma.com/design/wC61NAFjPLN8opURyweXm3/MXA-Design-System" target="_blank" rel="noopener" style={{ color: tokens.color.fg.brand, textDecoration: "none" }}>MXA Design System — Figma</a>
            <a href="https://www.figma.com/design/oVWza8nllR503wjwyavcLZ/MXA---GKO" target="_blank" rel="noopener" style={{ color: tokens.color.fg.brand, textDecoration: "none" }}>MXA GKO Styles — Figma</a>
          </div>
        </DocSection>
      </div>
    </div>
  );
}
