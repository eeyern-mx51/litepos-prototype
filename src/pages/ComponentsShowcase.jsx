import { useState } from "react";
import tokens from "../theme/tokens";

// Components
import TopAppBar from "../components/TopAppBar";
import BottomNavBar from "../components/BottomNavBar";
import Card from "../components/Card";
import Chip from "../components/Chip";
import FAB from "../components/FAB";
import Icon from "../components/Icon";
import ListItem from "../components/ListItem";
import NavCard from "../components/NavCard";
import OrderBar from "../components/OrderBar";
import ProductCard from "../components/ProductCard";
import SectionHeader from "../components/SectionHeader";
import StatusBar from "../components/StatusBar";
import Switch from "../components/Switch";

// ── Showcase wrapper ──────────────────────────────────────────────────
function Section({ title, description, children }) {
  return (
    <div style={{ marginBottom: 48 }}>
      <h2
        style={{
          fontSize: tokens.type.headlineSmall.size,
          fontWeight: tokens.type.headlineSmall.weight,
          color: tokens.color.fg.emphasis,
          margin: 0,
        }}
      >
        {title}
      </h2>
      {description && (
        <p
          style={{
            fontSize: tokens.type.bodyMedium.size,
            color: tokens.color.fg.subtle,
            lineHeight: tokens.type.bodyMedium.lineHeight,
            marginTop: 4,
            marginBottom: 16,
          }}
        >
          {description}
        </p>
      )}
      <div
        style={{
          marginTop: 16,
          background: tokens.color.bg.surface,
          borderRadius: tokens.shape.expressiveLarge,
          padding: 24,
          border: `1px solid ${tokens.color.border.onpage}`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function TokenSwatch({ label, color, border }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: tokens.shape.medium,
          background: color,
          border: border || `1px solid ${tokens.color.border.onpage}`,
          flexShrink: 0,
        }}
      />
      <div>
        <div style={{ fontSize: tokens.type.labelMedium.size, fontWeight: 600, color: tokens.color.fg.emphasis }}>
          {label}
        </div>
        <div style={{ fontSize: tokens.type.bodySmall.size, color: tokens.color.fg.subtle, fontFamily: "monospace" }}>
          {color}
        </div>
      </div>
    </div>
  );
}

// ── Main showcase component ───────────────────────────────────────────
export default function ComponentsShowcase() {
  const [switchOn, setSwitchOn] = useState(true);
  const [switchOff, setSwitchOff] = useState(false);
  const [selectedChip, setSelectedChip] = useState("All");
  const [navIndex, setNavIndex] = useState(0);

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
            Component Showcase
          </h1>
        </div>
        <span
          style={{
            fontSize: tokens.type.labelMedium.size,
            color: tokens.color.fg.white,
            opacity: 0.5,
          }}
        >
          M3 Expressive + GKO Tokens
        </span>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 32px 64px" }}>

        {/* ── Design Tokens ─────────────────────────────────────── */}
        <Section
          title="Design Tokens — GKO Semantic Colours"
          description="Mapped from Gecko (GKO) Figma token structure. Semantic naming: bg/, fg/, border/."
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
            <div>
              <div style={{ fontSize: tokens.type.titleSmall.size, fontWeight: 600, color: tokens.color.fg.brand, marginBottom: 12 }}>
                Background
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <TokenSwatch label="bg.page" color={tokens.color.bg.page} />
                <TokenSwatch label="bg.surface" color={tokens.color.bg.surface} />
                <TokenSwatch label="bg.brand" color={tokens.color.bg.brand} />
                <TokenSwatch label="bg.statusbar" color={tokens.color.bg.statusbar} />
                <TokenSwatch label="bg.action.primary" color={tokens.color.bg.action.primary.default} />
                <TokenSwatch label="bg.error" color={tokens.color.bg.error.default} />
                <TokenSwatch label="bg.warning" color={tokens.color.bg.warning.default} />
                <TokenSwatch label="bg.success" color={tokens.color.bg.success.default} />
                <TokenSwatch label="bg.info" color={tokens.color.bg.info.default} />
              </div>
            </div>
            <div>
              <div style={{ fontSize: tokens.type.titleSmall.size, fontWeight: 600, color: tokens.color.fg.brand, marginBottom: 12 }}>
                Foreground
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <TokenSwatch label="fg.emphasis" color={tokens.color.fg.emphasis} />
                <TokenSwatch label="fg.subtle" color={tokens.color.fg.subtle} />
                <TokenSwatch label="fg.disable" color={tokens.color.fg.disable} />
                <TokenSwatch label="fg.brand" color={tokens.color.fg.brand} />
                <TokenSwatch label="fg.white" color={tokens.color.fg.white} border={`1px solid ${tokens.color.border.onpage}`} />
                <TokenSwatch label="fg.onAction" color={tokens.color.fg.onAction} border={`1px solid ${tokens.color.border.onpage}`} />
                <TokenSwatch label="fg.error.icon" color={tokens.color.fg.error.icon} />
                <TokenSwatch label="fg.success.icon" color={tokens.color.fg.success.icon} />
              </div>
            </div>
            <div>
              <div style={{ fontSize: tokens.type.titleSmall.size, fontWeight: 600, color: tokens.color.fg.brand, marginBottom: 12 }}>
                Border
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <TokenSwatch label="border.onpage" color={tokens.color.border.onpage} />
                <TokenSwatch label="border.onsurface" color={tokens.color.border.onsurface} />
                <TokenSwatch label="border.action" color={tokens.color.border.action.default} />
                <TokenSwatch label="border.error" color={tokens.color.border.error} />
                <TokenSwatch label="border.warning" color={tokens.color.border.warning} />
                <TokenSwatch label="border.success" color={tokens.color.border.success} />
                <TokenSwatch label="border.info" color={tokens.color.border.info} />
              </div>
            </div>
          </div>
        </Section>

        {/* ── Typography ────────────────────────────────────────── */}
        <Section
          title="Typography Scale"
          description="M3 type scale mapped to GKO text styles. Figtree primary, system fallback."
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              ["Display Large", tokens.type.displayLarge],
              ["Display Medium", tokens.type.displayMedium],
              ["Display Small", tokens.type.displaySmall],
              ["Headline Large", tokens.type.headlineLarge],
              ["Headline Medium", tokens.type.headlineMedium],
              ["Headline Small", tokens.type.headlineSmall],
              ["Title Large", tokens.type.titleLarge],
              ["Title Medium", tokens.type.titleMedium],
              ["Body Large", tokens.type.bodyLarge],
              ["Body Medium", tokens.type.bodyMedium],
              ["Label Large", tokens.type.labelLarge],
              ["Label Medium", tokens.type.labelMedium],
              ["Label Small", tokens.type.labelSmall],
            ].map(([label, t]) => (
              <div key={label} style={{ display: "flex", alignItems: "baseline", gap: 24, borderBottom: `1px solid ${tokens.color.border.onpage}`, paddingBottom: 12 }}>
                <span
                  style={{
                    fontSize: t.size,
                    fontWeight: t.weight,
                    lineHeight: t.lineHeight,
                    color: tokens.color.fg.emphasis,
                    minWidth: 260,
                  }}
                >
                  {label}
                </span>
                <span style={{ fontSize: tokens.type.bodySmall.size, color: tokens.color.fg.subtle, fontFamily: "monospace" }}>
                  {t.size} / {t.weight} / {t.lineHeight}
                </span>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Shape ────────────────────────────────────────────── */}
        <Section
          title="Shape System"
          description="M3 Expressive shape tokens. Used for border-radius across all components."
        >
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {[
              ["None", tokens.shape.none],
              ["Extra Small", tokens.shape.extraSmall],
              ["Small", tokens.shape.small],
              ["Medium", tokens.shape.medium],
              ["Large", tokens.shape.large],
              ["Extra Large", tokens.shape.extraLarge],
              ["Expressive Large", tokens.shape.expressiveLarge],
              ["Expressive XL", tokens.shape.expressiveExtraLarge],
              ["Full", tokens.shape.full],
            ].map(([name, val]) => (
              <div key={name} style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: val,
                    background: tokens.color.bg.action.primary.default,
                    margin: "0 auto 8px",
                  }}
                />
                <div style={{ fontSize: tokens.type.labelSmall.size, fontWeight: 600, color: tokens.color.fg.emphasis }}>{name}</div>
                <div style={{ fontSize: tokens.type.labelSmall.size, color: tokens.color.fg.subtle, fontFamily: "monospace" }}>{val}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Icons ─────────────────────────────────────────────── */}
        <Section
          title="Icon Set"
          description="SVG icon system with 27 Material Symbols icons, mapped to LitePOS use cases."
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
            {[
              "home", "menu", "settings", "back", "cart", "keypad", "receipt",
              "history", "chart", "add", "chevron", "search", "scan", "store",
              "toggle", "print", "image", "edit", "delete", "favorite", "qr",
              "info", "close", "check", "expand-more", "error", "flash",
            ].map((name) => (
              <div
                key={name}
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: tokens.shape.medium,
                  border: `1px solid ${tokens.color.border.onpage}`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                  background: tokens.color.bg.page,
                }}
              >
                <Icon name={name} size={24} color={tokens.color.fg.emphasis} />
                <span style={{ fontSize: 9, color: tokens.color.fg.subtle, fontFamily: "monospace" }}>{name}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Status Bar ────────────────────────────────────────── */}
        <Section
          title="StatusBar"
          description="Android-style status bar. Navy background (bg.statusbar), white text. Always at top of device frame."
        >
          <div style={{ width: 393, borderRadius: 12, overflow: "hidden", border: `1px solid ${tokens.color.border.onpage}` }}>
            <StatusBar />
          </div>
        </Section>

        {/* ── Top App Bar ───────────────────────────────────────── */}
        <Section
          title="TopAppBar"
          description="Two themes: dark (navy bg, white elements) and light (white bg, teal accents). Supports small and large variants with optional back button and action icons."
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ fontSize: tokens.type.labelMedium.size, fontWeight: 600, color: tokens.color.fg.subtle, marginBottom: 4 }}>Dark theme — small</div>
            <div style={{ width: 393, borderRadius: 12, overflow: "hidden", border: `1px solid ${tokens.color.border.onpage}` }}>
              <TopAppBar title="Menu" theme="dark" actions={[{ icon: "settings", onPress: () => {} }]} />
            </div>
            <div style={{ fontSize: tokens.type.labelMedium.size, fontWeight: 600, color: tokens.color.fg.subtle, marginBottom: 4 }}>Light theme — small with back</div>
            <div style={{ width: 393, borderRadius: 12, overflow: "hidden", border: `1px solid ${tokens.color.border.onpage}` }}>
              <TopAppBar title="Settings" theme="light" onBack={() => {}} />
            </div>
            <div style={{ fontSize: tokens.type.labelMedium.size, fontWeight: 600, color: tokens.color.fg.subtle, marginBottom: 4 }}>Dark theme — large</div>
            <div style={{ width: 393, borderRadius: 12, overflow: "hidden", border: `1px solid ${tokens.color.border.onpage}` }}>
              <TopAppBar title="Transaction History" subtitle="Search by date, amount, or card" variant="large" theme="dark" onBack={() => {}} />
            </div>
          </div>
        </Section>

        {/* ── Bottom Navigation ─────────────────────────────────── */}
        <Section
          title="BottomNavBar"
          description="M3 navigation bar with teal active indicator pill. Expressive spring animation on tab switch."
        >
          <div style={{ width: 393, borderRadius: 12, overflow: "hidden", border: `1px solid ${tokens.color.border.onpage}` }}>
            <BottomNavBar
              items={[
                { icon: "home", label: "Home" },
                { icon: "menu", label: "Menu" },
              ]}
              activeIndex={navIndex}
              onSelect={setNavIndex}
            />
          </div>
        </Section>

        {/* ── Cards ─────────────────────────────────────────────── */}
        <Section
          title="Card"
          description="Four variants: filled (surface bg), outlined, elevated (shadow), and nav (white card for navy backgrounds)."
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Card variant="filled"><span style={{ fontSize: tokens.type.bodyMedium.size, color: tokens.color.fg.emphasis }}>Filled Card</span></Card>
            <Card variant="outlined"><span style={{ fontSize: tokens.type.bodyMedium.size, color: tokens.color.fg.emphasis }}>Outlined Card</span></Card>
            <Card variant="elevated"><span style={{ fontSize: tokens.type.bodyMedium.size, color: tokens.color.fg.emphasis }}>Elevated Card</span></Card>
            <div style={{ background: tokens.color.bg.brand, borderRadius: tokens.shape.expressiveLarge, padding: 16 }}>
              <Card variant="nav"><span style={{ fontSize: tokens.type.bodyMedium.size, color: tokens.color.fg.emphasis }}>Nav Card (on navy)</span></Card>
            </div>
          </div>
        </Section>

        {/* ── NavCard ───────────────────────────────────────────── */}
        <Section
          title="NavCard"
          description="Large navigation card for the navy menu screen. White background with outlined teal icon circle and label. Used for primary navigation: History, Settlements, Reporting, Settings."
        >
          <div style={{ background: tokens.color.bg.brand, borderRadius: tokens.shape.expressiveLarge, padding: 24 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              <NavCard icon="history" label="Transaction history" onClick={() => {}} />
              <NavCard icon="chart" label="Terminal reporting" onClick={() => {}} />
              <NavCard icon="settings" label="Terminal settings" onClick={() => {}} />
            </div>
          </div>
        </Section>

        {/* ── ProductCard ───────────────────────────────────────── */}
        <Section
          title="ProductCard"
          description="M3 Expressive product card — new POS pattern. Image placeholder, name, price, optional favourite indicator. Expressive rounded shape."
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            <ProductCard name="Flat White" price="5.50" onClick={() => {}} />
            <ProductCard name="Cappuccino" price="5.00" isFav onClick={() => {}} />
            <ProductCard name="Long Black" price="4.50" onClick={() => {}} />
            <ProductCard name="Chai Latte" price="6.00" onClick={() => {}} />
          </div>
        </Section>

        {/* ── ListItem ──────────────────────────────────────────── */}
        <Section
          title="ListItem"
          description="M3 list item with leading icon, headline, supporting text, trailing element, and teal accent divider."
        >
          <div style={{ background: tokens.color.bg.page, borderRadius: tokens.shape.large, overflow: "hidden" }}>
            <ListItem
              leading={<Icon name="toggle" color={tokens.color.fg.brand} />}
              headline="Enable LitePOS"
              supporting="Active — LitePOS is your home screen"
              trailing={<Switch checked={switchOn} onChange={setSwitchOn} />}
            />
            <ListItem
              leading={<Icon name="store" color={tokens.color.fg.brand} />}
              headline="Manage Products"
              supporting="Add, edit and organise your catalogue"
              trailing={<Icon name="chevron" color={tokens.color.fg.subtle} />}
              onClick={() => {}}
            />
            <ListItem
              leading={<Icon name="print" color={tokens.color.fg.brand} />}
              headline="Merchant copy — print items"
              supporting="Include basket items on merchant receipt"
              trailing={<Switch checked={switchOff} onChange={setSwitchOff} />}
              divider={false}
            />
          </div>
        </Section>

        {/* ── SectionHeader ─────────────────────────────────────── */}
        <Section
          title="SectionHeader"
          description="Teal section divider label used in settings and list screens."
        >
          <div style={{ background: tokens.color.bg.page, borderRadius: tokens.shape.large }}>
            <SectionHeader title="General" />
            <SectionHeader title="Receipts" />
            <SectionHeader title="Product Catalogue" />
          </div>
        </Section>

        {/* ── Chip ──────────────────────────────────────────────── */}
        <Section
          title="Chip"
          description="Filter/selection chip with teal selected state. Used in reporting tabs and filter bars."
        >
          <div style={{ display: "flex", gap: 8 }}>
            {["All", "Approved", "Declined", "Refunded"].map((label) => (
              <Chip
                key={label}
                label={label}
                selected={selectedChip === label}
                onClick={() => setSelectedChip(label)}
              />
            ))}
          </div>
        </Section>

        {/* ── Switch ────────────────────────────────────────────── */}
        <Section
          title="Switch"
          description="M3 Expressive toggle with spring animation. Teal when checked, grey when unchecked. Thumb grows on activation."
        >
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <div style={{ textAlign: "center" }}>
              <Switch checked={true} onChange={() => {}} />
              <div style={{ fontSize: tokens.type.labelSmall.size, color: tokens.color.fg.subtle, marginTop: 8 }}>On</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <Switch checked={false} onChange={() => {}} />
              <div style={{ fontSize: tokens.type.labelSmall.size, color: tokens.color.fg.subtle, marginTop: 8 }}>Off</div>
            </div>
          </div>
        </Section>

        {/* ── FAB ───────────────────────────────────────────────── */}
        <Section
          title="FAB (Floating Action Button)"
          description="Primary action button with M3 Expressive spring motion. Supports icon-only and extended (icon + label) variants."
        >
          <div style={{ display: "flex", gap: 24, alignItems: "flex-end" }}>
            <div style={{ position: "relative", width: 72, height: 72 }}>
              <div style={{
                position: "absolute", bottom: 0, right: 0,
                height: 56, minWidth: 56,
                borderRadius: tokens.shape.large,
                background: tokens.color.bg.action.primary.default,
                boxShadow: tokens.elevation.level3,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon name="keypad" size={24} color={tokens.color.fg.onAction} />
              </div>
            </div>
            <div style={{
              height: 56,
              borderRadius: tokens.shape.large,
              background: tokens.color.bg.action.primary.default,
              boxShadow: tokens.elevation.level3,
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: 8, padding: "0 20px 0 16px",
            }}>
              <Icon name="add" size={24} color={tokens.color.fg.onAction} />
              <span style={{ fontSize: tokens.type.labelLarge.size, fontWeight: 600, color: tokens.color.fg.onAction }}>
                New Product
              </span>
            </div>
          </div>
        </Section>

        {/* ── OrderBar ──────────────────────────────────────────── */}
        <Section
          title="OrderBar"
          description="Fixed bottom bar inspired by Square Handheld and Toast Go. Two states: idle (terminal info) and active (basket summary with Charge action). Replaces the old floating BasketBanner + TerminalInfoBar — one bar, two states, no competing floating elements."
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ fontSize: tokens.type.labelMedium.size, fontWeight: 600, color: tokens.color.fg.subtle, marginBottom: 4 }}>Idle state — no items in basket (shows terminal info)</div>
            <div style={{ width: 393, borderRadius: 12, overflow: "hidden", border: `1px solid ${tokens.color.border.onpage}` }}>
              <OrderBar itemCount={0} total={0} onCharge={() => {}} />
            </div>
            <div style={{ fontSize: tokens.type.labelMedium.size, fontWeight: 600, color: tokens.color.fg.subtle, marginBottom: 4 }}>Active state — items in basket</div>
            <div style={{ width: 393, borderRadius: 12, overflow: "hidden", border: `1px solid ${tokens.color.border.onpage}` }}>
              <OrderBar itemCount={3} total={16.00} onCharge={() => {}} />
            </div>
          </div>
        </Section>

        {/* ── Elevation ─────────────────────────────────────────── */}
        <Section
          title="Elevation System"
          description="M3 Light elevation levels 0–5. Applied via box-shadow."
        >
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {[
              ["Level 0", tokens.elevation.level0],
              ["Level 1", tokens.elevation.level1],
              ["Level 2", tokens.elevation.level2],
              ["Level 3", tokens.elevation.level3],
              ["Level 4", tokens.elevation.level4],
              ["Level 5", tokens.elevation.level5],
            ].map(([name, val]) => (
              <div key={name} style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: tokens.shape.large,
                    background: tokens.color.bg.page,
                    boxShadow: val,
                    margin: "0 auto 8px",
                    border: val === "none" ? `1px solid ${tokens.color.border.onpage}` : "none",
                  }}
                />
                <div style={{ fontSize: tokens.type.labelSmall.size, fontWeight: 600, color: tokens.color.fg.emphasis }}>{name}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Motion ────────────────────────────────────────────── */}
        <Section
          title="Motion System"
          description="M3 Expressive motion tokens. Spring-based easings for natural, playful animations."
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <div style={{ fontSize: tokens.type.titleSmall.size, fontWeight: 600, color: tokens.color.fg.brand, marginBottom: 12 }}>Easing Curves</div>
              {Object.entries(tokens.motion.easing).map(([name, val]) => (
                <div key={name} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${tokens.color.border.onpage}` }}>
                  <span style={{ fontSize: tokens.type.bodyMedium.size, color: tokens.color.fg.emphasis }}>{name}</span>
                  <span style={{ fontSize: tokens.type.bodySmall.size, color: tokens.color.fg.subtle, fontFamily: "monospace" }}>{val}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: tokens.type.titleSmall.size, fontWeight: 600, color: tokens.color.fg.brand, marginBottom: 12 }}>Duration Tokens</div>
              {Object.entries(tokens.motion.duration).map(([name, val]) => (
                <div key={name} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${tokens.color.border.onpage}` }}>
                  <span style={{ fontSize: tokens.type.bodyMedium.size, color: tokens.color.fg.emphasis }}>{name}</span>
                  <span style={{ fontSize: tokens.type.bodySmall.size, color: tokens.color.fg.subtle, fontFamily: "monospace" }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ── Compose Mapping ───────────────────────────────────── */}
        <Section
          title="Jetpack Compose Mapping Notes"
          description="Reference for developers translating these React components into Compose M3 Expressive."
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: tokens.type.bodyMedium.size, color: tokens.color.fg.emphasis, lineHeight: "1.6" }}>
            <div><strong style={{ color: tokens.color.fg.brand }}>TopAppBar</strong> — maps to <code style={{ background: tokens.color.bg.surface, padding: "2px 6px", borderRadius: 4 }}>MediumTopAppBar</code> / <code style={{ background: tokens.color.bg.surface, padding: "2px 6px", borderRadius: 4 }}>SmallTopAppBar</code> with custom <code style={{ background: tokens.color.bg.surface, padding: "2px 6px", borderRadius: 4 }}>TopAppBarColors</code></div>
            <div><strong style={{ color: tokens.color.fg.brand }}>NavCard</strong> — custom Composable using <code style={{ background: tokens.color.bg.surface, padding: "2px 6px", borderRadius: 4 }}>ElevatedCard</code> + <code style={{ background: tokens.color.bg.surface, padding: "2px 6px", borderRadius: 4 }}>OutlinedIconButton</code></div>
            <div><strong style={{ color: tokens.color.fg.brand }}>ProductCard</strong> — custom Composable using <code style={{ background: tokens.color.bg.surface, padding: "2px 6px", borderRadius: 4 }}>Card</code> with <code style={{ background: tokens.color.bg.surface, padding: "2px 6px", borderRadius: 4 }}>ShapeDefaults.ExtraLarge</code></div>
            <div><strong style={{ color: tokens.color.fg.brand }}>OrderBar</strong> — custom Composable using <code style={{ background: tokens.color.bg.surface, padding: "2px 6px", borderRadius: 4 }}>Surface</code> + <code style={{ background: tokens.color.bg.surface, padding: "2px 6px", borderRadius: 4 }}>AnimatedContent</code> to crossfade between idle (terminal info) and active (basket) states. Inspired by Square Handheld's fixed bottom bar pattern.</div>
            <div><strong style={{ color: tokens.color.fg.brand }}>BottomNavBar</strong> — maps to <code style={{ background: tokens.color.bg.surface, padding: "2px 6px", borderRadius: 4 }}>NavigationBar</code> with custom indicator shape</div>
            <div><strong style={{ color: tokens.color.fg.brand }}>Switch</strong> — maps to <code style={{ background: tokens.color.bg.surface, padding: "2px 6px", borderRadius: 4 }}>Switch</code> with <code style={{ background: tokens.color.bg.surface, padding: "2px 6px", borderRadius: 4 }}>SwitchColors</code> using GKO tokens</div>
            <div><strong style={{ color: tokens.color.fg.brand }}>FAB</strong> — maps to <code style={{ background: tokens.color.bg.surface, padding: "2px 6px", borderRadius: 4 }}>FloatingActionButton</code> / <code style={{ background: tokens.color.bg.surface, padding: "2px 6px", borderRadius: 4 }}>ExtendedFloatingActionButton</code> (used in Product Catalog for "New Product" — a legitimate primary creation action)</div>
            <div><strong style={{ color: tokens.color.fg.brand }}>ScanScreen</strong> — custom full-screen Composable using <code style={{ background: tokens.color.bg.surface, padding: "2px 6px", borderRadius: 4 }}>CameraX</code> preview with animated scan-line overlay. Dual mode: POS barcode scan (adds to basket) and Import scan (pre-fills Add Product form from Connect Express).</div>
            <div><strong style={{ color: tokens.color.fg.brand }}>Delete Confirmation Dialog</strong> — maps to <code style={{ background: tokens.color.bg.surface, padding: "2px 6px", borderRadius: 4 }}>AlertDialog</code> with M3 Expressive shape. Used on product delete and category delete with scrim overlay.</div>
            <div><strong style={{ color: tokens.color.fg.brand }}>Category CRUD</strong> — inline editable list in Product Catalog using <code style={{ background: tokens.color.bg.surface, padding: "2px 6px", borderRadius: 4 }}>LazyColumn</code> items with <code style={{ background: tokens.color.bg.surface, padding: "2px 6px", borderRadius: 4 }}>TextField</code> for rename. Cascading updates propagate to all products.</div>
            <div><strong style={{ color: tokens.color.fg.brand }}>Native File Picker</strong> — maps to Android <code style={{ background: tokens.color.bg.surface, padding: "2px 6px", borderRadius: 4 }}>ActivityResultContracts.GetContent</code> for image picking in Add/Edit Product. Single tap triggers system file browser.</div>
          </div>
        </Section>
      </div>
    </div>
  );
}
