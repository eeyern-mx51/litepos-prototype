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

export default function LitePOSSettingsScreen({ navigate }) {
  const [enabled, setEnabled] = useState(true);
  const [homeMode, setHomeMode] = useState("products");
  const [merchantReceipt, setMerchantReceipt] = useState(true);
  const [customerReceipt, setCustomerReceipt] = useState(true);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: tokens.color.bg.surface }}>
      <TopAppBar title="LitePOS" onBack={() => navigate("settings")} theme="light" />
      <div style={{ flex: 1, overflow: "auto", paddingBottom: 32 }}>

        {/* ── Hero: Feature Toggle Card ─────────────────────────── */}
        <div style={{ padding: "12px 16px 4px" }}>
          <div
            style={{
              background: tokens.color.bg.page,
              borderRadius: tokens.shape.expressiveLarge,
              border: `1px solid ${enabled ? tokens.color.border.action.default : tokens.color.border.onpage}`,
              padding: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              transition: `all ${tokens.motion.duration.medium2} ${tokens.motion.easing.standard}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: tokens.shape.large,
                  background: enabled
                    ? `${tokens.color.fg.brand}15`
                    : tokens.color.bg.surface,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: `all ${tokens.motion.duration.short4} ${tokens.motion.easing.standard}`,
                }}
              >
                <Icon
                  name="store"
                  size={24}
                  color={enabled ? tokens.color.fg.brand : tokens.color.fg.disable}
                />
              </div>
              <div>
                <div
                  style={{
                    fontSize: tokens.type.titleMedium.size,
                    fontWeight: 600,
                    color: tokens.color.fg.emphasis,
                  }}
                >
                  LitePOS
                </div>
                <StatusPill active={enabled} />
              </div>
            </div>
            <Switch checked={enabled} onChange={setEnabled} />
          </div>
        </div>

        {/* ── Home Screen Mode ──────────────────────────────────── */}
        <SectionLabel label="Home screen" />
        <SettingsCard>
          <div style={{ padding: 12, display: "flex", gap: 10 }}>
            {[
              { key: "products", label: "Products", icon: "store", desc: "Product grid" },
              { key: "keypad", label: "Keypad", icon: "keypad", desc: "Manual entry" },
            ].map((opt) => {
              const selected = homeMode === opt.key;
              return (
                <button
                  key={opt.key}
                  onClick={() => setHomeMode(opt.key)}
                  style={{
                    flex: 1,
                    height: 88,
                    borderRadius: tokens.shape.large,
                    border: selected
                      ? `2px solid ${tokens.color.fg.brand}`
                      : `1.5px solid ${tokens.color.border.onpage}`,
                    background: selected ? `${tokens.color.fg.brand}12` : "transparent",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    transition: `all ${tokens.motion.duration.short4} ${tokens.motion.easing.standard}`,
                    position: "relative",
                  }}
                >
                  {/* Selected check */}
                  {selected && (
                    <div
                      style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        width: 18,
                        height: 18,
                        borderRadius: tokens.shape.full,
                        background: tokens.color.fg.brand,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <svg width={12} height={12} viewBox="0 0 24 24" fill={tokens.color.fg.white}>
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                    </div>
                  )}
                  <Icon
                    name={opt.icon}
                    size={24}
                    color={selected ? tokens.color.fg.brand : tokens.color.fg.subtle}
                  />
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        fontSize: tokens.type.labelLarge.size,
                        fontWeight: selected ? 700 : 500,
                        color: selected ? tokens.color.fg.brand : tokens.color.fg.emphasis,
                      }}
                    >
                      {opt.label}
                    </div>
                    <div
                      style={{
                        fontSize: tokens.type.labelSmall.size,
                        color: tokens.color.fg.subtle,
                        fontWeight: 400,
                      }}
                    >
                      {opt.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </SettingsCard>

        {/* ── Receipts ──────────────────────────────────────────── */}
        <SectionLabel label="Receipts" />
        <SettingsCard>
          <ListItem
            leading={<Icon name="print" color={tokens.color.fg.brand} />}
            headline="Merchant copy — print items"
            supporting="Include basket items on merchant receipt"
            trailing={<Switch checked={merchantReceipt} onChange={setMerchantReceipt} />}
          />
          <ListItem
            leading={<Icon name="receipt" color={tokens.color.fg.brand} />}
            headline="Customer copy — print items"
            supporting="Include basket items on customer receipt"
            trailing={<Switch checked={customerReceipt} onChange={setCustomerReceipt} />}
            divider={false}
          />
        </SettingsCard>

        {/* ── Product Catalogue ──────────────────────────────────── */}
        <SectionLabel label="Product catalogue" />
        <SettingsCard>
          <ListItem
            leading={<Icon name="store" color={tokens.color.fg.brand} />}
            headline="Manage Products"
            supporting="Add, edit and organise your catalogue"
            trailing={<Icon name="chevron" color={tokens.color.fg.subtle} />}
            onClick={() => navigate("product-catalog")}
          />
          <ListItem
            leading={<Icon name="qr" color={tokens.color.fg.brand} />}
            headline="Import Products"
            supporting="Bulk import via QR from Connect Express"
            trailing={<Icon name="chevron" color={tokens.color.fg.subtle} />}
          />
          <ListItem
            leading={<Icon name="scan" color={tokens.color.fg.brand} />}
            headline="Barcode Settings"
            supporting="UPC-A, UPC-E, EAN-13, EAN-8"
            trailing={<Icon name="chevron" color={tokens.color.fg.subtle} />}
            divider={false}
          />
        </SettingsCard>

        {/* ── Admin Notice ──────────────────────────────────────── */}
        <div style={{ padding: "16px 16px 0" }}>
          <div
            style={{
              background: `${tokens.color.bg.info.default}10`,
              border: `1px solid ${tokens.color.border.info}33`,
              borderRadius: tokens.shape.large,
              padding: "14px 16px",
              display: "flex",
              gap: 12,
              alignItems: "flex-start",
            }}
          >
            <Icon name="info" size={18} color={tokens.color.fg.info.icon} />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: tokens.type.labelMedium.size,
                  fontWeight: 600,
                  color: tokens.color.fg.emphasis,
                }}
              >
                Admin Override
              </div>
              <div
                style={{
                  fontSize: tokens.type.bodySmall.size,
                  color: tokens.color.fg.subtle,
                  marginTop: 2,
                  lineHeight: "1.4",
                }}
              >
                Settings on this page may be remotely configured by an administrator if enabled on Connect Express.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
