import { useState } from "react";
import tokens from "../theme/tokens";
import TopAppBar from "../components/TopAppBar";
import ListItem from "../components/ListItem";
import SectionHeader from "../components/SectionHeader";
import Switch from "../components/Switch";
import Card from "../components/Card";
import Icon from "../components/Icon";

export default function LitePOSSettingsScreen({ navigate }) {
  const [enabled, setEnabled] = useState(true);
  const [homeMode, setHomeMode] = useState("products");
  const [merchantReceipt, setMerchantReceipt] = useState(true);
  const [customerReceipt, setCustomerReceipt] = useState(true);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: tokens.color.bg.page }}>
      <TopAppBar title="LitePOS" onBack={() => navigate("settings")} theme="light" />
      <div style={{ flex: 1, overflow: "auto", paddingBottom: 24, background: tokens.color.bg.page }}>
        {/* Enable/Disable */}
        <SectionHeader title="General" />
        <ListItem
          leading={
            <Icon name="toggle" color={enabled ? tokens.color.fg.brand : tokens.color.fg.subtle} />
          }
          headline="Enable LitePOS"
          supporting={
            enabled
              ? "Active — LitePOS is your home screen"
              : "Disabled — using Simple mode"
          }
          trailing={<Switch checked={enabled} onChange={setEnabled} />}
        />

        {/* Home Screen Mode */}
        <SectionHeader title="Home Screen" />
        <Card variant="outlined" style={{ margin: "0 16px" }}>
          <div style={{ display: "flex", gap: 8 }}>
            {[
              { key: "products", label: "Products", icon: "store" },
              { key: "keypad", label: "Keypad", icon: "keypad" },
            ].map((opt) => (
              <button
                key={opt.key}
                onClick={() => setHomeMode(opt.key)}
                style={{
                  flex: 1,
                  height: 80,
                  borderRadius: tokens.shape.large,
                  border:
                    homeMode === opt.key
                      ? `2px solid ${tokens.color.fg.brand}`
                      : `1px solid ${tokens.color.border.onpage}`,
                  background:
                    homeMode === opt.key ? `${tokens.color.fg.brand}22` : "transparent",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  transition: `all ${tokens.motion.duration.short4} ${tokens.motion.easing.standard}`,
                }}
              >
                <Icon
                  name={opt.icon}
                  size={24}
                  color={
                    homeMode === opt.key
                      ? tokens.color.fg.brand
                      : tokens.color.fg.subtle
                  }
                />
                <span
                  style={{
                    fontSize: tokens.type.labelMedium.size,
                    fontWeight: homeMode === opt.key ? 700 : 500,
                    color:
                      homeMode === opt.key
                        ? tokens.color.fg.brand
                        : tokens.color.fg.subtle,
                  }}
                >
                  {opt.label}
                </span>
              </button>
            ))}
          </div>
        </Card>

        {/* Receipt Configuration */}
        <SectionHeader title="Receipts" />
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
        />

        {/* Admin Notice */}
        <Card variant="filled" style={{ margin: "16px 16px", background: `${tokens.color.bg.info.default}22`, border: `1px solid ${tokens.color.border.info}` }}>
          <div style={{ display: "flex", gap: 12 }}>
            <Icon name="info" size={20} color={tokens.color.fg.info.icon} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: tokens.type.labelMedium.size, fontWeight: 600, color: tokens.color.fg.emphasis }}>
                Admin Override
              </div>
              <div style={{ fontSize: tokens.type.bodySmall.size, color: tokens.color.fg.subtle, marginTop: 4 }}>
                Remote admin can configure settings if enabled
              </div>
            </div>
          </div>
        </Card>

        {/* Product Catalogue */}
        <SectionHeader title="Product Catalogue" />
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
      </div>
    </div>
  );
}
