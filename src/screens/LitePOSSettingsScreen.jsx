import { useState } from "react";
import tokens from "../theme/tokens";
import TopAppBar from "../components/TopAppBar";
import ListItem from "../components/ListItem";
import Switch from "../components/Switch";
import Card from "../components/Card";
import Icon from "../components/Icon";

/**
 * LitePOS Settings — Redesigned with Clover/Square patterns:
 *
 * 1. Grouped surface cards — related settings live inside contained cards
 *    (Material: "containment components hold information and actions")
 * 2. Feature toggle as hero — the enable/disable sits in its own prominent card
 *    with a clear status indicator (like Clover's "Lock Customer Mode" pattern)
 * 3. Visual mode picker — large tappable tiles with icons for Products/Keypad
 *    (like Square's grid tiles for quick visual selection)
 * 4. Minimal section labels — outside the cards as subtle context, not inside
 * 5. High-contrast, large tap targets — POS apps used under fast-paced conditions
 *    (Clover guideline: "workflows should involve as few steps as possible")
 */

function SettingsCard({ children, style = {} }) {
  return (
    <div
      style={{
        background: tokens.color.bg.page,
        borderRadius: tokens.shape.expressiveLarge,
        border: `1px solid ${tokens.color.border.onpage}`,
        overflow: "hidden",
        margin: "0 16px 4px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SectionLabel({ label }) {
  return (
    <div
      style={{
        padding: "20px 16px 8px",
        fontSize: tokens.type.labelMedium.size,
        fontWeight: 600,
        color: tokens.color.fg.subtle,
        letterSpacing: tokens.type.labelMedium.tracking,
        textTransform: "uppercase",
      }}
    >
      {label}
    </div>
  );
}

function StatusPill({ active }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 12px",
        borderRadius: tokens.shape.full,
        background: active
          ? `${tokens.color.bg.success.default}18`
          : `${tokens.color.bg.error.default}18`,
        marginTop: 4,
      }}
    >
      <div
        style={{
          width: 6,
          height: 6,
          borderRadius: tokens.shape.full,
          background: active
            ? tokens.color.fg.success.icon
            : tokens.color.fg.error.icon,
        }}
      />
      <span
        style={{
          fontSize: tokens.type.labelSmall.size,
          fontWeight: 600,
          color: active
            ? tokens.color.fg.success.text
            : tokens.color.fg.error.text,
        }}
      >
        {active ? "Active" : "Disabled"}
      </span>
    </div>
  );
}

export default function LitePOSSettingsScreen({ navigate, goBack }) {
  const [merchantReceipt, setMerchantReceipt] = useState(true);
  const [customerReceipt, setCustomerReceipt] = useState(true);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: tokens.color.bg.surface }}>
      <TopAppBar title="LitePOS Settings" onBack={goBack} theme="light" />
      <div style={{ flex: 1, overflow: "auto", paddingBottom: 32 }}>

        {/* ── Product Catalogue ──────────────────────────────────── */}
        <SectionLabel label="Product catalogue" />
        <SettingsCard>
          <ListItem
            headline="Manage Products"
            supporting="Add, edit and organise your catalogue"
            trailing={<Icon name="chevron" color={tokens.color.fg.subtle} />}
            onClick={() => navigate("product-catalog")}
          />
          <ListItem
            headline="Import Products"
            supporting="Bulk import via QR from Connect Express"
            trailing={<Icon name="chevron" color={tokens.color.fg.subtle} />}
            onClick={() => navigate("import-products")}
            divider={false}
          />
        </SettingsCard>

        {/* ── Receipts ──────────────────────────────────────────── */}
        <SectionLabel label="Receipts" />
        <SettingsCard>
          <ListItem
            headline="Merchant copy — print items"
            supporting="Include basket items on merchant receipt"
            trailing={<Switch checked={merchantReceipt} onChange={setMerchantReceipt} />}
          />
          <ListItem
            headline="Customer copy — print items"
            supporting="Include basket items on customer receipt"
            trailing={<Switch checked={customerReceipt} onChange={setCustomerReceipt} />}
            divider={false}
          />
        </SettingsCard>

      </div>
    </div>
  );
}
