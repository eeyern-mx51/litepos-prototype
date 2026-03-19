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
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <TopAppBar title="LitePOS" onBack={() => navigate("settings")} />
      <div style={{ flex: 1, overflow: "auto", paddingBottom: 24 }}>
        {/* Enable/Disable */}
        <SectionHeader title="General" />
        <ListItem
          leading={
            <Icon name="toggle" color={enabled ? tokens.color.primary : tokens.color.onSurfaceVariant} />
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
                      ? `2px solid ${tokens.color.primary}`
                      : `1px solid ${tokens.color.outlineVariant}`,
                  background:
                    homeMode === opt.key ? tokens.color.primaryContainer + "44" : "transparent",
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
                      ? tokens.color.primary
                      : tokens.color.onSurfaceVariant
                  }
                />
                <span
                  style={{
                    fontSize: tokens.type.labelMedium.size,
                    fontWeight: homeMode === opt.key ? 700 : 500,
                    color:
                      homeMode === opt.key
                        ? tokens.color.primary
                        : tokens.color.onSurfaceVariant,
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
          leading={<Icon name="print" color={tokens.color.onSurfaceVariant} />}
          headline="Merchant copy — print items"
          supporting="Include basket items on merchant receipt"
          trailing={<Switch checked={merchantReceipt} onChange={setMerchantReceipt} />}
        />
        <ListItem
          leading={<Icon name="receipt" color={tokens.color.onSurfaceVariant} />}
          headline="Customer copy — print items"
          supporting="Include basket items on customer receipt"
          trailing={<Switch checked={customerReceipt} onChange={setCustomerReceipt} />}
        />

        {/* Product Catalogue */}
        <SectionHeader title="Product Catalogue" />
        <ListItem
          leading={<Icon name="store" color={tokens.color.onSurfaceVariant} />}
          headline="Manage Products"
          supporting="Add, edit and organise your catalogue"
          trailing={<Icon name="chevron" color={tokens.color.onSurfaceVariant} />}
          onClick={() => navigate("product-catalog")}
        />
        <ListItem
          leading={<Icon name="qr" color={tokens.color.onSurfaceVariant} />}
          headline="Import Products"
          supporting="Bulk import via QR from Connect Express"
          trailing={<Icon name="chevron" color={tokens.color.onSurfaceVariant} />}
        />
        <ListItem
          leading={<Icon name="scan" color={tokens.color.onSurfaceVariant} />}
          headline="Barcode Settings"
          supporting="UPC-A, UPC-E, EAN-13, EAN-8"
          trailing={<Icon name="chevron" color={tokens.color.onSurfaceVariant} />}
          divider={false}
        />
      </div>
    </div>
  );
}
