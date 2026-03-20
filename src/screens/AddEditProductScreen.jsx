import { useState } from "react";
import tokens from "../theme/tokens";
import TopAppBar from "../components/TopAppBar";
import Icon from "../components/Icon";
import Switch from "../components/Switch";

/**
 * Add / Edit Product Screen
 *
 * LitePOS Confluence spec fields:
 *   Required: Name, Price
 *   Optional: Description (500 chars, 30 on receipt), SKU, UPC (barcode), Favourite
 *   Image:    Camera | Gallery | Image URL (auto square-cropped)
 *
 * Design inspiration:
 *   - Square: clean vertical form, image hero at top, grouped fields in cards,
 *     large save button fixed at bottom
 *   - Clover: high-contrast inputs, large tap targets, minimal steps
 *   - Material 3: outlined text fields, expressive shapes, surface cards
 */

// ── Reusable form components ──────────────────────────────────────────

function FieldCard({ children, style = {} }) {
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

function TextField({ label, value, onChange, placeholder, multiline, trailing, required }) {
  const Tag = multiline ? "textarea" : "input";
  return (
    <div style={{ padding: "12px 16px", borderBottom: `1px solid ${tokens.color.border.onpage}` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <label
          style={{
            fontSize: tokens.type.labelMedium.size,
            fontWeight: 600,
            color: tokens.color.fg.subtle,
          }}
        >
          {label}
          {required && <span style={{ color: tokens.color.fg.error.text, marginLeft: 2 }}>*</span>}
        </label>
        {trailing}
      </div>
      <Tag
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={multiline ? 3 : undefined}
        style={{
          width: "100%",
          fontSize: tokens.type.bodyLarge.size,
          color: tokens.color.fg.emphasis,
          border: "none",
          outline: "none",
          background: "transparent",
          fontFamily: "inherit",
          resize: multiline ? "none" : undefined,
          padding: 0,
          lineHeight: tokens.type.bodyLarge.lineHeight,
        }}
      />
    </div>
  );
}

function PriceField({ value, onChange }) {
  return (
    <div style={{ padding: "12px 16px", borderBottom: `1px solid ${tokens.color.border.onpage}` }}>
      <label
        style={{
          fontSize: tokens.type.labelMedium.size,
          fontWeight: 600,
          color: tokens.color.fg.subtle,
          display: "block",
          marginBottom: 6,
        }}
      >
        Price <span style={{ color: tokens.color.fg.error.text }}>*</span>
      </label>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <span
          style={{
            fontSize: tokens.type.headlineMedium.size,
            fontWeight: 600,
            color: tokens.color.fg.subtle,
          }}
        >
          $
        </span>
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0.00"
          style={{
            fontSize: tokens.type.headlineMedium.size,
            fontWeight: 600,
            color: tokens.color.fg.emphasis,
            border: "none",
            outline: "none",
            background: "transparent",
            fontFamily: "inherit",
            padding: 0,
            width: "100%",
          }}
        />
      </div>
    </div>
  );
}

// ── Main screen ───────────────────────────────────────────────────────

export default function AddEditProductScreen({ navigate, goBack, editProduct }) {
  const isEdit = !!editProduct;
  const [name, setName] = useState(editProduct?.name || "");
  const [price, setPrice] = useState(editProduct?.price || "");
  const [description, setDescription] = useState(editProduct?.description || "");
  const [sku, setSku] = useState(editProduct?.sku || "");
  const [upc, setUpc] = useState(editProduct?.upc || "");
  const [favourite, setFavourite] = useState(editProduct?.fav || false);
  const [imageMethod, setImageMethod] = useState(null); // null | "camera" | "gallery" | "url"

  const canSave = name.trim() && price.trim();

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: tokens.color.bg.surface, minHeight: 0 }}>
      <TopAppBar
        title={isEdit ? "Edit Product" : "Add Product"}
        onBack={goBack}
        theme="light"
        actions={isEdit ? [{ icon: "delete", onPress: () => navigate("product-catalog") }] : []}
      />

      <div style={{ flex: 1, minHeight: 0, overflow: "auto", paddingBottom: 100 }}>

        {/* ── Product Image ─────────────────────────────────────── */}
        <div style={{ padding: "12px 16px" }}>
          <div
            style={{
              width: "100%",
              aspectRatio: "1",
              maxHeight: 200,
              borderRadius: tokens.shape.expressiveLarge,
              background: tokens.color.bg.page,
              border: `1.5px dashed ${tokens.color.border.onsurface}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              cursor: "pointer",
              overflow: "hidden",
              transition: `all ${tokens.motion.duration.short4} ${tokens.motion.easing.standard}`,
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: tokens.shape.full,
                background: `${tokens.color.fg.brand}12`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name="image" size={24} color={tokens.color.fg.brand} />
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: tokens.type.labelLarge.size,
                  fontWeight: 600,
                  color: tokens.color.fg.emphasis,
                }}
              >
                Add product image
              </div>
              <div
                style={{
                  fontSize: tokens.type.bodySmall.size,
                  color: tokens.color.fg.subtle,
                  marginTop: 2,
                }}
              >
                Auto square-cropped for grid display
              </div>
            </div>
          </div>

          {/* Image source buttons */}
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            {[
              { key: "camera", icon: "image", label: "Camera" },
              { key: "gallery", icon: "image", label: "Gallery" },
              { key: "url", icon: "info", label: "Image URL" },
            ].map((opt) => {
              const active = imageMethod === opt.key;
              return (
                <button
                  key={opt.key}
                  onClick={() => setImageMethod(active ? null : opt.key)}
                  style={{
                    flex: 1,
                    height: 40,
                    borderRadius: tokens.shape.full,
                    border: active
                      ? `1.5px solid ${tokens.color.fg.brand}`
                      : `1px solid ${tokens.color.border.onpage}`,
                    background: active ? `${tokens.color.fg.brand}12` : tokens.color.bg.page,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    transition: `all ${tokens.motion.duration.short4} ${tokens.motion.easing.standard}`,
                  }}
                >
                  <Icon
                    name={opt.icon}
                    size={16}
                    color={active ? tokens.color.fg.brand : tokens.color.fg.subtle}
                  />
                  <span
                    style={{
                      fontSize: tokens.type.labelMedium.size,
                      fontWeight: active ? 600 : 500,
                      color: active ? tokens.color.fg.brand : tokens.color.fg.subtle,
                    }}
                  >
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Required Fields ───────────────────────────────────── */}
        <SectionLabel label="Product details" />
        <FieldCard>
          <TextField
            label="Name"
            value={name}
            onChange={setName}
            placeholder="e.g. Flat White"
            required
          />
          <PriceField value={price} onChange={setPrice} />
          <TextField
            label="Description"
            value={description}
            onChange={setDescription}
            placeholder="Optional — 500 chars max, 30 shown on receipt"
            multiline
            trailing={
              <span
                style={{
                  fontSize: tokens.type.labelSmall.size,
                  color: description.length > 500 ? tokens.color.fg.error.text : tokens.color.fg.subtle,
                }}
              >
                {description.length}/500
              </span>
            }
          />
        </FieldCard>

        {/* ── Identifiers ───────────────────────────────────────── */}
        <SectionLabel label="Identifiers" />
        <FieldCard>
          <TextField
            label="SKU"
            value={sku}
            onChange={setSku}
            placeholder="Optional stock keeping unit"
          />
          <div style={{ borderBottom: `1px solid ${tokens.color.border.onpage}` }}>
            <div style={{ padding: "12px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <label
                  style={{
                    fontSize: tokens.type.labelMedium.size,
                    fontWeight: 600,
                    color: tokens.color.fg.subtle,
                  }}
                >
                  UPC / Barcode
                </label>
                <button
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: tokens.shape.full,
                    border: `1.5px solid ${tokens.color.fg.brand}`,
                    background: "transparent",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon name="scan" size={18} color={tokens.color.fg.brand} />
                </button>
              </div>
              <input
                type="text"
                value={upc}
                onChange={(e) => setUpc(e.target.value)}
                placeholder="Scan or type barcode"
                style={{
                  width: "100%",
                  fontSize: tokens.type.bodyLarge.size,
                  color: tokens.color.fg.emphasis,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontFamily: "inherit",
                  padding: 0,
                }}
              />
              <div
                style={{
                  fontSize: tokens.type.labelSmall.size,
                  color: tokens.color.fg.subtle,
                  marginTop: 6,
                }}
              >
                Supports UPC-A, UPC-E, EAN-13, EAN-8
              </div>
            </div>
          </div>
        </FieldCard>

        {/* ── Preferences ───────────────────────────────────────── */}
        <SectionLabel label="Preferences" />
        <FieldCard>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Icon
                name="favorite"
                size={22}
                color={favourite ? tokens.color.fg.error.icon : tokens.color.fg.subtle}
              />
              <div>
                <div
                  style={{
                    fontSize: tokens.type.bodyLarge.size,
                    fontWeight: 400,
                    color: tokens.color.fg.emphasis,
                  }}
                >
                  Favourite
                </div>
                <div
                  style={{
                    fontSize: tokens.type.bodySmall.size,
                    color: tokens.color.fg.subtle,
                    marginTop: 1,
                  }}
                >
                  {favourite ? "Appears at top of product grid" : "Shows in default alphabetical order"}
                </div>
              </div>
            </div>
            <Switch checked={favourite} onChange={setFavourite} />
          </div>
        </FieldCard>
      </div>

      {/* ── Fixed bottom save button ──────────────────────────── */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "12px 16px",
          paddingBottom: 16,
          background: `linear-gradient(transparent, ${tokens.color.bg.surface} 20%)`,
        }}
      >
        <button
          onClick={() => navigate("product-catalog")}
          disabled={!canSave}
          style={{
            width: "100%",
            height: 52,
            borderRadius: tokens.shape.full,
            border: "none",
            background: canSave
              ? tokens.color.bg.action.primary.default
              : tokens.color.bg.action.primary.disable,
            color: tokens.color.fg.onAction,
            fontSize: tokens.type.titleSmall.size,
            fontWeight: 600,
            cursor: canSave ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            transition: `all ${tokens.motion.duration.medium2} ${tokens.motion.easing.expressive}`,
          }}
        >
          {isEdit ? "Save Changes" : "Add Product"}
        </button>
      </div>
    </div>
  );
}
