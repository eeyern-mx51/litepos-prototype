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
          background: isRoot
            ? tokens.color.bg.action.primary.default
            : isNav
            ? tokens.color.bg.brand
            : tokens.color.bg.page,
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
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            {children}
          </div>
        </>
      )}
    </div>
  );
}

// ── Main documentation page ───────────────────────────────────────────
export default function DocumentationPage() {
  const [showMapLightbox, setShowMapLightbox] = useState(false);

  // ── Screen map content (reused in inline + lightbox) ────────────────
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
    <div
      style={{
        minHeight: "100vh",
        background: tokens.color.bg.page,
        fontFamily: "'Figtree', -apple-system, sans-serif",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: tokens.color.bg.brand,
          padding: "16px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <a
            href="#landing"
            style={{
              color: tokens.color.fg.white,
              textDecoration: "none",
              opacity: 0.7,
              fontSize: tokens.type.labelLarge.size,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <svg width={18} height={18} viewBox="0 0 24 24" fill={tokens.color.fg.white}>
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
            Back
          </a>
          <h1
            style={{
              fontSize: tokens.type.titleLarge.size,
              fontWeight: 600,
              color: tokens.color.fg.white,
              margin: 0,
            }}
          >
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
            LitePOS is an on-device point-of-sale solution that transforms a payment terminal into a lightweight POS system. It enables merchants to manage a product catalogue, process transactions via products or manual keypad entry, and view transaction history and reporting — all without needing a separate POS application or hardware.
          </p>
          <p style={{ fontSize: tokens.type.bodyLarge.size, color: tokens.color.fg.emphasis, lineHeight: "1.7", margin: 0 }}>
            LitePOS runs natively on the payment terminal within the existing mx51 application. When enabled, it replaces the default simple-mode home screen with a product grid, and adds dedicated screens for basket management, transaction processing, receipts, history, and reporting.
          </p>
        </DocSection>

        {/* ── Screen Map ────────────────────────────────────────── */}
        <DocSection title="Screen Map">
          <div
            style={{
              background: tokens.color.bg.surface,
              borderRadius: tokens.shape.expressiveLarge,
              padding: 32,
              border: `1px solid ${tokens.color.border.onpage}`,
              overflowX: "auto",
              position: "relative",
            }}
          >
            {screenMapContent}
            <div style={{ marginTop: 16, fontSize: tokens.type.bodySmall.size, color: tokens.color.fg.subtle, textAlign: "center" }}>
              When LitePOS is OFF, the Home screen shows a Default Terminal Home placeholder instead of the Product Grid.
            </div>
            {/* Expand button */}
            <button
              onClick={() => setShowMapLightbox(true)}
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                padding: "8px 16px",
                borderRadius: tokens.shape.full,
                background: tokens.color.bg.action.primary.default,
                color: tokens.color.fg.onAction,
                border: "none",
                fontSize: tokens.type.labelMedium.size,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                display: "flex",
                alignItems: "center",
                gap: 6,
                boxShadow: tokens.elevation.level2,
              }}
            >
              <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
              </svg>
              Expand
            </button>
          </div>
        </DocSection>

        {/* ── Lightbox overlay for screen map ── */}
        {showMapLightbox && (
          <div
            onClick={() => setShowMapLightbox(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1000,
              background: "rgba(0,0,0,0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 32,
              cursor: "pointer",
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: tokens.color.bg.surface,
                borderRadius: tokens.shape.expressiveLarge,
                padding: 48,
                maxWidth: "95vw",
                maxHeight: "90vh",
                overflow: "auto",
                position: "relative",
                cursor: "default",
                boxShadow: tokens.elevation.level5,
              }}
            >
              {/* Close button */}
              <button
                onClick={() => setShowMapLightbox(false)}
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  width: 40,
                  height: 40,
                  borderRadius: tokens.shape.full,
                  background: tokens.color.bg.page,
                  border: `1px solid ${tokens.color.border.onpage}`,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  color: tokens.color.fg.emphasis,
                  fontFamily: "inherit",
                }}
              >
                ✕
              </button>

              <div style={{ marginBottom: 24 }}>
                <h2
                  style={{
                    fontSize: tokens.type.headlineSmall.size,
                    fontWeight: tokens.type.headlineSmall.weight,
                    color: tokens.color.fg.emphasis,
                    margin: 0,
                  }}
                >
                  Screen Map
                </h2>
                <p
                  style={{
                    fontSize: tokens.type.bodyMedium.size,
                    color: tokens.color.fg.subtle,
                    marginTop: 4,
                  }}
                >
                  Full navigation hierarchy of the LitePOS prototype
                </p>
              </div>

              {screenMapContent}

              <div
                style={{
                  marginTop: 24,
                  fontSize: tokens.type.bodySmall.size,
                  color: tokens.color.fg.subtle,
                  textAlign: "center",
                }}
              >
                When LitePOS is OFF, the Home screen shows a Default Terminal Home placeholder instead of the Product Grid.
              </div>
            </div>
          </div>
        )}

        {/* ── Flow 1: Enabling LitePOS ──────────────────────────── */}
        <DocSection title="Flow 1 — Enabling LitePOS">
          <p style={{ fontSize: tokens.type.bodyMedium.size, color: tokens.color.fg.subtle, lineHeight: "1.6", marginBottom: 20 }}>
            Merchant navigates to the LitePOS settings page and enables the feature. Once enabled, the home screen switches from the default simple mode to the product-first LitePOS experience.
          </p>
          <FlowStep
            number={1}
            title="Navigate to Settings"
            description="From the Home screen, tap the bottom nav 'Menu' tab, then tap the 'Terminal settings' NavCard."
            screens={["Home", "Menu", "Settings"]}
          />
          <FlowStep
            number={2}
            title="Open LitePOS Settings"
            description="In Settings, tap the 'LitePOS' list item to open the consolidated LitePOS configuration page."
            screens={["Settings", "LitePOS Settings"]}
          />
          <FlowStep
            number={3}
            title="Enable the Feature"
            description="Toggle the 'Enable LitePOS' switch to ON. The supporting text updates to 'Active — LitePOS is your home screen'. When OFF, the terminal shows a default home placeholder."
            screens={["LitePOS Settings"]}
          />
        </DocSection>

        {/* ── Flow 2: Product Catalogue Setup ───────────────────── */}
        <DocSection title="Flow 2 — Product Catalogue Setup">
          <p style={{ fontSize: tokens.type.bodyMedium.size, color: tokens.color.fg.subtle, lineHeight: "1.6", marginBottom: 20 }}>
            Before processing transactions via product selection, the merchant needs to set up their product catalogue.
          </p>
          <FlowStep
            number={1}
            title="Access Product Catalogue"
            description="From LitePOS Settings, tap 'Manage Products' under the Product Catalogue section."
            screens={["LitePOS Settings", "Product Catalog"]}
          />
          <FlowStep
            number={2}
            title="Manage Categories"
            description="In the Product Catalog, expand the Categories section to create, rename, or delete categories. Renaming cascades to all products in that category. Deleting moves affected products to 'Uncategorised'."
            screens={["Product Catalog"]}
          />
          <FlowStep
            number={3}
            title="Add Products Manually"
            description="Tap the '+ New Product' FAB to add a product. Enter name, price, category (from preset or custom), optional image via native file picker, and optional fields (description, SKU, UPC). A favourite toggle is also available."
            screens={["Product Catalog", "New Product"]}
          />
          <FlowStep
            number={4}
            title="Edit or Delete Products"
            description="Tap any product in the catalogue to edit its details. Use the delete button (with confirmation dialog) to remove a product from the catalogue."
            screens={["Edit Product"]}
          />
          <FlowStep
            number={5}
            title="Import from Connect Express"
            description="From LitePOS Settings, tap 'Import Products' to see a step-by-step guide. Tap 'Start Scanning' to open the barcode scanner in import mode. Scanned products pre-fill the add product form. Choose 'Import Product' to save, or 'Save & Scan Another' to continue importing."
            screens={["Import Products", "Scan (Import)", "Review Import"]}
          />
          <InfoCard
            accent="info"
            title="Compose Pattern Note"
            items={[
              "Product Catalog uses a LazyColumn with inline category CRUD (TextField for rename, cascading updates)",
              "The 'New Product' FAB uses ExtendedFloatingActionButton with spring animation",
              "Product images use ActivityResultContracts.GetContent for native Android file picking",
              "Delete confirmation uses AlertDialog with scrim overlay",
              "All product mutations persist in shared state and reflect immediately on the Home screen",
            ]}
          />
        </DocSection>

        {/* ── Flow 3: Processing Transactions ───────────────────── */}
        <DocSection title="Flow 3 — Processing a Transaction">
          <p style={{ fontSize: tokens.type.bodyMedium.size, color: tokens.color.fg.subtle, lineHeight: "1.6", marginBottom: 20 }}>
            Three entry modes for creating a transaction: product selection from the grid, barcode scanning, or manual amount entry via keypad.
          </p>

          <div style={{ fontSize: tokens.type.titleSmall.size, fontWeight: 600, color: tokens.color.fg.brand, marginBottom: 12 }}>
            Path A — Product Selection
          </div>
          <FlowStep
            number={1}
            title="Browse Products"
            description="On the Home screen, browse the product grid. Products are displayed as M3 Expressive cards with image, name, and price."
            screens={["Home (Product Grid)"]}
          />
          <FlowStep
            number={2}
            title="Add to Basket"
            description="Tap a product card to add it to the basket. The fixed OrderBar at the bottom transitions from terminal info to a teal basket bar showing item count and running total."
            screens={["Home", "OrderBar"]}
          />
          <FlowStep
            number={3}
            title="Review Basket"
            description="Tap the OrderBar to open the Basket screen. Review items, adjust quantities, remove items, or add more."
            screens={["Basket"]}
          />
          <FlowStep
            number={4}
            title="Proceed to Payment"
            description="Tap 'Proceed to Payment' to see three payment options inspired by CBA Smart Hospitality: Pay in Full, Split by Item, or Split Equally."
            screens={["Basket", "Payment Options"]}
          />
          <FlowStep
            number={5}
            title="Choose Payment Method"
            description="Pay in Full charges the entire amount at once. Split by Item explodes quantities into individual units (e.g. 'Flat White × 2' becomes two selectable rows) so each patron picks their items and taps to pay — the card-present screen appears for each round. Split Equally divides the total by the number of patrons, processing one card-present payment per person."
            screens={["Pay in Full", "Split by Item", "Split Equally"]}
          />
          <FlowStep
            number={6}
            title="Tap to Pay"
            description="Each payment shows a contactless card prompt, processes the transaction, and displays an 'Approved' confirmation with receipt options (Print or Digital QR). For split payments, the flow returns for the next patron until all shares are paid."
            screens={["Payment Processing", "Approved"]}
          />

          <div style={{ fontSize: tokens.type.titleSmall.size, fontWeight: 600, color: tokens.color.fg.brand, marginBottom: 12, marginTop: 24 }}>
            Path B — Barcode Scanning
          </div>
          <FlowStep
            number={1}
            title="Open Scanner"
            description="Tap the barcode scan icon in the Home screen search bar. This opens a full-screen camera viewfinder with an animated scan line."
            screens={["Home", "Scan (POS)"]}
          />
          <FlowStep
            number={2}
            title="Scan Product"
            description="Point the camera at a product barcode. If the barcode matches a product in the catalogue, it's automatically added to the basket and the screen returns to Home with a success snackbar. If no match, an error state is shown and scanning resumes."
            screens={["Scan (POS)", "Home"]}
          />

          <div style={{ fontSize: tokens.type.titleSmall.size, fontWeight: 600, color: tokens.color.fg.brand, marginBottom: 12, marginTop: 24 }}>
            Path C — Keypad Entry
          </div>
          <FlowStep
            number={1}
            title="Open Keypad"
            description="Tap the keypad icon in the top app bar (or if Home mode is set to Keypad, it's the default view). Keypad is treated as an input mode — like Square and Clover — not a floating action."
            screens={["Home", "Keypad"]}
          />
          <FlowStep
            number={2}
            title="Enter Amount"
            description="Use the numeric keypad to enter the transaction amount. Backspace to correct. The amount displays in large type at the top."
            screens={["Keypad"]}
          />
          <FlowStep
            number={3}
            title="Process Payment"
            description="Tap 'Next' to proceed to payment processing with the entered amount."
            screens={["Keypad", "Payment"]}
          />
        </DocSection>

        {/* ── Flow 4: Receipts ──────────────────────────────────── */}
        <DocSection title="Flow 4 — Receipts">
          <p style={{ fontSize: tokens.type.bodyMedium.size, color: tokens.color.fg.subtle, lineHeight: "1.6", marginBottom: 20 }}>
            After a successful transaction, receipts are generated based on the configuration in LitePOS Settings.
          </p>
          <FlowStep
            number={1}
            title="Merchant Receipt"
            description="If 'Merchant copy — print items' is enabled, the merchant receipt includes a breakdown of basket items alongside the transaction details."
            screens={["LitePOS Settings (config)"]}
          />
          <FlowStep
            number={2}
            title="Customer Receipt"
            description="If 'Customer copy — print items' is enabled, the customer receipt also includes the basket item breakdown."
            screens={["LitePOS Settings (config)"]}
          />
          <InfoCard
            accent="warning"
            title="Important"
            items={[
              "Receipt configuration is set globally in LitePOS Settings, not per-transaction",
              "When LitePOS is disabled, receipts revert to standard payment-only format",
              "Item details on receipts only apply when products/basket are used (not keypad-only transactions)",
            ]}
          />
        </DocSection>

        {/* ── Flow 5: History & Reporting ────────────────────────── */}
        <DocSection title="Flow 5 — History & Reporting">
          <p style={{ fontSize: tokens.type.bodyMedium.size, color: tokens.color.fg.subtle, lineHeight: "1.6", marginBottom: 20 }}>
            Transaction history and reporting are accessed from the Menu screen.
          </p>
          <FlowStep
            number={1}
            title="Transaction History"
            description="From Menu, tap 'Transaction history' NavCard. Search by date range, card number (last 4), amount, or transaction status. Results show in a scrollable list with approval status badges."
            screens={["Menu", "History"]}
          />
          <FlowStep
            number={2}
            title="Terminal Reporting"
            description="From Menu, tap 'Terminal reporting' NavCard. View aggregated transaction data with tabs for 'Transactions' and 'Items' breakdowns."
            screens={["Menu", "Reporting"]}
          />
          <FlowStep
            number={3}
            title="Filter & Export"
            description="Use Chip filters (All, Approved, Declined, Refunded) to narrow results. Reports can be exported or printed."
            screens={["Reporting"]}
          />
        </DocSection>

        {/* ── Flow 6: Import from Connect Express ─────────────── */}
        <DocSection title="Flow 6 — Import from Connect Express">
          <p style={{ fontSize: tokens.type.bodyMedium.size, color: tokens.color.fg.subtle, lineHeight: "1.6", marginBottom: 20 }}>
            Merchants with an existing Connect Express catalogue can import products by scanning barcodes printed from the Connect Express terminal.
          </p>
          <FlowStep
            number={1}
            title="Open Import Guide"
            description="From LitePOS Settings → Product Catalogue, tap 'Import Products'. A three-step guide explains the process."
            screens={["LitePOS Settings", "Import Products"]}
          />
          <FlowStep
            number={2}
            title="Print Barcode on Connect Express"
            description="On the Connect Express terminal, locate the product and print its barcode via the receipt printer."
            screens={["Connect Express (external)"]}
          />
          <FlowStep
            number={3}
            title="Scan the Barcode"
            description="Tap 'Start Scanning' to open the camera in import mode. Point at the printed barcode. On match, a success snackbar appears showing the product name and price."
            screens={["Scan (Import)"]}
          />
          <FlowStep
            number={4}
            title="Review & Save"
            description="The scanned product details pre-fill the add product form (name, price, category, description, SKU, UPC). Review the information, optionally add an image, then choose 'Import Product' to save, or 'Save & Scan Another' to save and immediately scan the next product."
            screens={["Review Import"]}
          />
          <InfoCard
            accent="info"
            title="Prototype Behaviour"
            items={[
              "Three sample import products cycle automatically: Soy Cappuccino, Smashed Avo Wrap, Berry Smoothie",
              "80% scan success rate simulated — failed scans show error state and retry automatically",
              "Imported products are saved to the shared catalogue and appear on the Home screen immediately",
            ]}
          />
        </DocSection>

        {/* ── Configuration Summary ─────────────────────────────── */}
        <DocSection title="LitePOS Settings Reference">
          <div
            style={{
              background: tokens.color.bg.surface,
              borderRadius: tokens.shape.expressiveLarge,
              padding: 24,
              border: `1px solid ${tokens.color.border.onpage}`,
            }}
          >
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
                  ["Enable LitePOS", "General", "Toggle", "On"],
                  ["Manage Products", "Product Catalogue", "Navigation → Product Catalog", "—"],
                  ["Import Products", "Product Catalogue", "Navigation → Import Guide", "—"],
                  ["Barcode Settings", "Product Catalogue", "Navigation", "—"],
                  ["Merchant copy — print items", "Receipts", "Toggle", "On"],
                  ["Customer copy — print items", "Receipts", "Toggle", "On"],
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

        {/* ── Design Decisions ───────────────────────────────────── */}
        <DocSection title="Design Decisions & Rationale">
          <div style={{ display: "flex", flexDirection: "column", gap: 16, fontSize: tokens.type.bodyMedium.size, color: tokens.color.fg.emphasis, lineHeight: "1.6" }}>
            <div>
              <strong style={{ color: tokens.color.fg.brand }}>Consolidated Settings</strong> — All LitePOS configuration lives under Settings → LitePOS. The original spec had settings scattered across multiple navigation paths, which created a disjointed experience. Consolidating gives merchants a single place to configure everything.
            </div>
            <div>
              <strong style={{ color: tokens.color.fg.brand }}>Product-First Home</strong> — When LitePOS is enabled, the home screen shows the product grid. When disabled, a default terminal home placeholder is shown. The keypad is always accessible via an icon in the top app bar — treated as an input mode, not a floating action.
            </div>
            <div>
              <strong style={{ color: tokens.color.fg.brand }}>Fixed Bottom OrderBar</strong> — Inspired by Square Handheld and Toast Go, the bottom of the Home screen has a single fixed bar that transitions between two states: idle (terminal info) and active (basket summary with Charge action). This replaces the previous floating BasketBanner + keypad FAB pattern, eliminating competing floating elements and giving the product grid full scrollable space. Every major handheld POS uses this fixed-bar pattern for checkout — it's the most discoverable, predictable placement for the primary action.
            </div>
            <div>
              <strong style={{ color: tokens.color.fg.brand }}>Two Visual Zones</strong> — The app uses two distinct visual patterns: a navy background with white NavCard cards for primary navigation (Menu, History), and a light background with flat lists for settings and detail screens. This matches the existing app patterns merchants are familiar with.
            </div>
            <div>
              <strong style={{ color: tokens.color.fg.brand }}>M3 Expressive for POS</strong> — New POS-specific components (ProductCard, OrderBar) use M3 Expressive design language: expressive rounded shapes, spring-based motion, and vibrant teal accents. This creates a modern, approachable POS experience while maintaining the GKO design system foundation.
            </div>
            <div>
              <strong style={{ color: tokens.color.fg.brand }}>GKO Semantic Tokens</strong> — All colours use the Gecko semantic token system (bg/, fg/, border/) rather than M3's raw primary/secondary naming. This ensures the prototype maps directly to the Figma token structure and can be themed per bank brand (Gecko → CBA → etc.).
            </div>
            <div>
              <strong style={{ color: tokens.color.fg.brand }}>Barcode Scanning (Dual Mode)</strong> — The ScanScreen serves two purposes: POS mode (scan product barcodes to add to basket) and Import mode (scan Connect Express receipt barcodes to pre-fill the add product form). This avoids building two separate scanner UIs while providing distinct post-scan flows.
            </div>
            <div>
              <strong style={{ color: tokens.color.fg.brand }}>Connect Express Import Flow</strong> — Importing products follows a guided three-step process (print barcode → scan → review). After scanning, merchants land on a pre-filled form with two options: "Import Product" (save and return to catalogue) or "Save & Scan Another" (save and re-open scanner). This reduces friction for bulk imports.
            </div>
            <div>
              <strong style={{ color: tokens.color.fg.brand }}>Category CRUD with Cascading Updates</strong> — Categories are managed inline within the Product Catalog screen. Renaming a category updates all products in that category. Deleting a category moves affected products to "Uncategorised". This keeps category management lightweight and avoids a separate settings screen.
            </div>
            <div>
              <strong style={{ color: tokens.color.fg.brand }}>Android-Native Patterns</strong> — Scrollbars are hidden globally (matching Android default), image picking uses the system file browser (not custom Camera/Gallery buttons), and confirmation dialogs appear before destructive actions. These choices ensure the prototype feels native to the terminal's Android OS.
            </div>
            <div>
              <strong style={{ color: tokens.color.fg.brand }}>Split Payment (CBA Smart Hospitality Pattern)</strong> — Inspired by CBA Smart Hospitality, the payment screen presents three clear options: Pay in Full, Split by Item, and Split Equally. Split by Item explodes basket quantities into individual selectable units (e.g. "Flat White × 2" becomes two rows) — each patron picks their items and the full card-present screen (tap/insert/swipe → processing → approved) appears for each round. Split Equally uses a stepper for patron count and shows the card-present screen per person. Both modes track progress with a green bar and complete only when all shares are paid.
            </div>
            <div>
              <strong style={{ color: tokens.color.fg.brand }}>In-Session Data Persistence</strong> — All product CRUD operations (add, edit, delete, import, category changes) persist in shared React state and immediately reflect on the Home screen product grid. A "Reset All Data" button in the demo controls panel restores the sample catalogue for demos.
            </div>
          </div>
        </DocSection>

        {/* ── References ────────────────────────────────────────── */}
        <DocSection title="References">
          <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: tokens.type.bodyMedium.size }}>
            <a href="https://mx51.atlassian.net/wiki/spaces/BPT/pages/3005677574" target="_blank" rel="noopener" style={{ color: tokens.color.fg.brand, textDecoration: "none" }}>
              Lite POS User Guide — Confluence
            </a>
            <a href="https://mx51.atlassian.net/wiki/spaces/BPT/pages/3055288335" target="_blank" rel="noopener" style={{ color: tokens.color.fg.brand, textDecoration: "none" }}>
              Excalidraw Workflows — Confluence
            </a>
            <a href="https://www.figma.com/design/wC61NAFjPLN8opURyweXm3/MXA-Design-System" target="_blank" rel="noopener" style={{ color: tokens.color.fg.brand, textDecoration: "none" }}>
              MXA Design System — Figma
            </a>
            <a href="https://www.figma.com/design/oVWza8nllR503wjwyavcLZ/MXA---GKO" target="_blank" rel="noopener" style={{ color: tokens.color.fg.brand, textDecoration: "none" }}>
              MXA GKO Styles — Figma
            </a>
          </div>
        </DocSection>
      </div>
    </div>
  );
}
