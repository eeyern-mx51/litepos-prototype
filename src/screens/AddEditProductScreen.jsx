import { useState, useRef } from "react";
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

export default function AddEditProductScreen({ navigate, goBack, editProduct, products = [], setProducts }) {
  const isEdit = !!editProduct && !editProduct?.imported;
  const isImport = !!editProduct?.imported;
  const [name, setName] = useState(editProduct?.name || "");
  const [price, setPrice] = useState(editProduct?.price || "");
  const [description, setDescription] = useState(editProduct?.description || "");
  const [sku, setSku] = useState(editProduct?.sku || "");
  const [upc, setUpc] = useState(editProduct?.upc || "");
  const [category, setCategory] = useState(editProduct?.cat || "");
  const [favourite, setFavourite] = useState(editProduct?.fav || false);
  const [imagePreview, setImagePreview] = useState(editProduct?.image || null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fileInputRef = useRef(null);

  // Gather unique categories from existing products for suggestions
  const existingCategories = [...new Set(products.map((p) => p.cat).filter(
    (c) => c && c !== "Uncategorised"
  ))];

  const handleImagePick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const canSave = name.trim() && price.trim();
  const title = isImport ? "Review Import" : isEdit ? "Edit Product" : "New Product";
  const saveLabel = isImport ? "Import Product" : isEdit ? "Save Changes" : "Save Product";

  const buildProduct = () => ({
    name: name.trim(),
    price: price.trim(),
    cat: category.trim() || "Uncategorised",
    description: description.trim(),
    sku: sku.trim(),
    upc: upc.trim(),
    fav: favourite,
    image: imagePreview || undefined,
    // Preserve default emoji visual from sample products
    emoji: editProduct?.emoji,
    emojiBg: editProduct?.emojiBg,
  });

  const handleSave = (then) => {
    if (!canSave || !setProducts) return;
    const product = buildProduct();

    if (isEdit && editProduct) {
      // Update existing product (match by original name)
      setProducts(products.map((p) =>
        p.name === editProduct.name ? product : p
      ));
    } else {
      // Add new product (or import)
      setProducts([...products, product]);
    }

    navigate(then);
  };

  const handleDelete = () => {
    if (setProducts && editProduct) {
      setProducts(products.filter((p) => p.name !== editProduct.name));
    }
    navigate("product-catalog");
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: tokens.color.bg.surface, minHeight: 0 }}>
      <TopAppBar
        title={title}
        onBack={goBack}
        theme="light"
        actions={isEdit ? [{ icon: "delete", onPress: () => setShowDeleteConfirm(true) }] : []}
      />

      <div style={{ flex: 1, minHeight: 0, overflow: "auto", paddingBottom: isImport ? 150 : 100 }}>

        {/* ── Import from Connect Express shortcut (Add mode only) ── */}
        {!isEdit && !isImport && (
          <div style={{ padding: "12px 16px 4px" }}>
            <button
              onClick={() => navigate("import-scan")}
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: tokens.shape.large,
                background: `${tokens.color.fg.brand}08`,
                border: `1px solid ${tokens.color.fg.brand}25`,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 12,
                textAlign: "left",
                fontFamily: "inherit",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: tokens.shape.medium,
                  background: `${tokens.color.fg.brand}15`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon name="scan" size={20} color={tokens.color.fg.brand} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: tokens.type.labelLarge.size,
                  fontWeight: 600,
                  color: tokens.color.fg.brand,
                }}>
                  Import from Connect Express
                </div>
                <div style={{
                  fontSize: tokens.type.bodySmall.size,
                  color: tokens.color.fg.subtle,
                  marginTop: 1,
                }}>
                  Scan a barcode to auto-fill product details
                </div>
              </div>
              <Icon name="chevron" size={20} color={tokens.color.fg.brand} />
            </button>
          </div>
        )}

        {/* ── Product Image ─────────────────────────────────────── */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <div style={{ padding: "12px 16px" }}>
          {(imagePreview || editProduct?.emoji) ? (
            /* ── Image / emoji preview ──────────────────── */
            <div style={{ position: "relative" }}>
              <div
                style={{
                  width: "100%",
                  aspectRatio: "1",
                  maxHeight: 200,
                  borderRadius: tokens.shape.expressiveLarge,
                  overflow: "hidden",
                  background: imagePreview ? tokens.color.bg.page : editProduct?.emojiBg || tokens.color.bg.surface,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Product"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <span style={{ fontSize: 72, lineHeight: 1 }}>{editProduct.emoji}</span>
                )}
              </div>
              {/* Action buttons overlay */}
              <div
                style={{
                  position: "absolute",
                  bottom: 10,
                  right: 10,
                  display: "flex",
                  gap: 8,
                }}
              >
                <button
                  onClick={handleImagePick}
                  style={{
                    width: 40, height: 40, borderRadius: tokens.shape.full,
                    background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)",
                    border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <Icon name="edit" size={18} color="#fff" />
                </button>
                <button
                  onClick={handleRemoveImage}
                  style={{
                    width: 40, height: 40, borderRadius: tokens.shape.full,
                    background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)",
                    border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <Icon name="delete" size={18} color="#fff" />
                </button>
              </div>
            </div>
          ) : (
            /* ── Empty image placeholder ────────────────── */
            <div
              onClick={handleImagePick}
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
                  Tap to choose from gallery or camera
                </div>
              </div>
            </div>
          )}
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

          {/* ── Category field (text input with datalist) ──── */}
          <div style={{ padding: "12px 16px", borderBottom: `1px solid ${tokens.color.border.onpage}` }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <label
                style={{
                  fontSize: tokens.type.labelMedium.size,
                  fontWeight: 600,
                  color: tokens.color.fg.subtle,
                }}
              >
                Category
              </label>
              <span
                style={{
                  fontSize: tokens.type.labelSmall.size,
                  color: tokens.color.fg.subtle,
                }}
              >
                {category ? "" : "Defaults to Uncategorised"}
              </span>
            </div>
            <input
              list="category-suggestions"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Drinks, Food, Snacks"
              style={{
                width: "100%",
                fontSize: tokens.type.bodyLarge.size,
                color: tokens.color.fg.emphasis,
                border: "none",
                outline: "none",
                background: "transparent",
                fontFamily: "inherit",
                padding: 0,
                lineHeight: tokens.type.bodyLarge.lineHeight,
              }}
            />
            <datalist id="category-suggestions">
              {["Drinks", "Food", "Snacks", "Merchandise", "Services", ...existingCategories]
                .filter((v, i, a) => a.indexOf(v) === i)
                .map((cat) => (
                  <option key={cat} value={cat} />
                ))}
            </datalist>
          </div>

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

      {/* ── Fixed bottom buttons ──────────────────────────── */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "12px 16px",
          paddingBottom: 16,
          background: `linear-gradient(transparent, ${tokens.color.bg.surface} 20%)`,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {isImport && (
          <button
            onClick={() => handleSave("import-scan")}
            disabled={!canSave}
            style={{
              width: "100%",
              height: 48,
              borderRadius: tokens.shape.full,
              border: canSave
                ? `1.5px solid ${tokens.color.fg.brand}`
                : `1.5px solid ${tokens.color.border.onpage}`,
              background: "transparent",
              color: canSave ? tokens.color.fg.brand : tokens.color.fg.disable,
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
            <Icon name="scan" size={18} color={canSave ? tokens.color.fg.brand : tokens.color.fg.disable} />
            Save & Scan Another
          </button>
        )}
        <button
          onClick={() => handleSave("product-catalog")}
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
          {saveLabel}
        </button>
      </div>

      {/* ── Delete confirmation dialog ───────────────────── */}
      {showDeleteConfirm && (
        <>
          {/* Scrim */}
          <div
            onClick={() => setShowDeleteConfirm(false)}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.45)",
              zIndex: 50,
            }}
          />
          {/* Dialog */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "calc(100% - 48px)",
              background: tokens.color.bg.page,
              borderRadius: tokens.shape.expressiveLarge,
              padding: "24px",
              zIndex: 51,
              boxShadow: tokens.elevation.level3,
            }}
          >
            <div
              style={{
                fontSize: tokens.type.titleLarge.size,
                fontWeight: tokens.type.titleLarge.weight,
                color: tokens.color.fg.emphasis,
              }}
            >
              Delete product?
            </div>
            <div
              style={{
                fontSize: tokens.type.bodyMedium.size,
                color: tokens.color.fg.subtle,
                marginTop: 8,
                lineHeight: 1.5,
              }}
            >
              <span style={{ fontWeight: 600, color: tokens.color.fg.emphasis }}>{name || "This product"}</span> will be permanently removed from your catalogue. This action cannot be undone.
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 8,
                marginTop: 24,
              }}
            >
              <button
                onClick={() => setShowDeleteConfirm(false)}
                style={{
                  padding: "10px 20px",
                  borderRadius: tokens.shape.full,
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: tokens.type.labelLarge.size,
                  fontWeight: 600,
                  color: tokens.color.fg.brand,
                  fontFamily: "inherit",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                style={{
                  padding: "10px 20px",
                  borderRadius: tokens.shape.full,
                  border: "none",
                  background: "#E53935",
                  cursor: "pointer",
                  fontSize: tokens.type.labelLarge.size,
                  fontWeight: 600,
                  color: "#fff",
                  fontFamily: "inherit",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
