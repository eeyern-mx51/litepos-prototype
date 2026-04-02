import { useState, useRef, useEffect } from "react";
import tokens from "../theme/tokens";
import TopAppBar from "../components/TopAppBar";
import FAB from "../components/FAB";
import Icon from "../components/Icon";
import InputBadge from "../components/InputBadge";
import { useSoftKeyboard } from "../components/SoftKeyboard";

/**
 * ProductCatalogScreen
 *
 * Two states:
 *   1. EMPTY — new merchant, no products yet. Shows skeleton placeholder cards
 *      as visual examples of what the catalogue will look like, with a
 *      descriptive prompt and prominent Add Product FAB.
 *   2. POPULATED — has products. Shows real product list items with a
 *      collapsible Categories section for CRUD management.
 *
 * Top bar: back arrow (left) · "Products" title · close ✕ (right, goes home).
 */

export default function ProductCatalogScreen({ navigate, goBack, products = [], setProducts, keyboardType = "onscreen" }) {
  const kb = useSoftKeyboard();
  const hasProducts = products.length > 0;

  // Categories are always derived from products — no separate state needed.
  // Empty categories auto-remove when their last product is deleted or recategorised.
  const categories = [...new Set(products.map((p) => p.cat).filter(Boolean))].sort();
  const [showCategories, setShowCategories] = useState(false);
  const [overflowMenuCat, setOverflowMenuCat] = useState(null); // category name or null
  const [renamingCat, setRenamingCat] = useState(null);         // { name, newName } — dialog
  const [deletingCat, setDeletingCat] = useState(null);         // category name — dialog
  const overflowRef = useRef(null);
  const renameInputRef = useRef(null);

  // Close overflow menu on outside click
  useEffect(() => {
    if (!overflowMenuCat) return;
    const handler = (e) => {
      if (overflowRef.current && !overflowRef.current.contains(e.target)) {
        setOverflowMenuCat(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [overflowMenuCat]);

  const handleRenameCategory = () => {
    if (!renamingCat) return;
    const trimmed = renamingCat.newName.trim();
    const oldName = renamingCat.name;
    if (oldName === "Uncategorised") { setRenamingCat(null); return; }
    if (trimmed && trimmed !== oldName && trimmed.toLowerCase() !== "uncategorised" && !categories.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
      if (setProducts) {
        setProducts(products.map((p) =>
          p.cat === oldName ? { ...p, cat: trimmed } : p
        ));
      }
    }
    setRenamingCat(null);
  };

  const handleDeleteCategory = () => {
    if (!deletingCat) return;
    if (deletingCat === "Uncategorised") { setDeletingCat(null); return; }
    if (setProducts) {
      setProducts(products.map((p) =>
        p.cat === deletingCat ? { ...p, cat: "Uncategorised" } : p
      ));
    }
    setDeletingCat(null);
  };

  const getCategoryCount = (cat) => products.filter((p) => p.cat === cat).length;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", background: tokens.color.bg.surface, minHeight: 0 }}>
      <TopAppBar
        title="Products"
        onBack={goBack}
        theme="light"
        actions={[{ icon: "close", onPress: () => navigate("home") }]}
      />

      <div style={{ flex: 1, minHeight: 0, overflow: "auto", background: tokens.color.bg.surface }}>
        {hasProducts ? (
          /* ═══ POPULATED — real product list ═══ */
          <>
            <div
              style={{
                padding: "4px 16px 8px",
                fontSize: tokens.type.bodySmall.size,
                color: tokens.color.fg.subtle,
              }}
            >
              {products.length} products · {categories.length} categories
            </div>

            {/* ── Categories section — M3 List ──────────── */}
            <div style={{ margin: "0 16px 10px" }}>
              {/* Section header with expand/collapse */}
              <button
                onClick={() => setShowCategories(!showCategories)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 16px",
                  background: tokens.color.bg.page,
                  border: `1px solid ${tokens.color.border.onpage}`,
                  borderRadius: showCategories
                    ? `${tokens.shape.large} ${tokens.shape.large} 0 0`
                    : tokens.shape.large,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: `border-radius ${tokens.motion.duration.short4} ${tokens.motion.easing.standard}`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: tokens.shape.full,
                    background: `${tokens.color.fg.brand}12`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <Icon name="label" size={20} color={tokens.color.fg.brand} />
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <div style={{
                      fontSize: tokens.type.bodyLarge.size,
                      fontWeight: 500,
                      color: tokens.color.fg.emphasis,
                      lineHeight: tokens.type.bodyLarge.lineHeight,
                    }}>
                      Categories
                    </div>
                    <div style={{
                      fontSize: tokens.type.bodySmall.size,
                      color: tokens.color.fg.subtle,
                      lineHeight: tokens.type.bodySmall.lineHeight,
                    }}>
                      {categories.length} {categories.length === 1 ? "category" : "categories"}
                    </div>
                  </div>
                </div>
                <div style={{
                  transition: `transform ${tokens.motion.duration.short4} ${tokens.motion.easing.standard}`,
                  transform: showCategories ? "rotate(180deg)" : "rotate(0deg)",
                }}>
                  <Icon name="expand-more" size={24} color={tokens.color.fg.subtle} />
                </div>
              </button>

              {/* M3 List — category rows */}
              {showCategories && (
                <div
                  style={{
                    background: tokens.color.bg.page,
                    border: `1px solid ${tokens.color.border.onpage}`,
                    borderTop: "none",
                    borderRadius: `0 0 ${tokens.shape.large} ${tokens.shape.large}`,
                    overflow: "visible",
                    position: "relative",
                  }}
                >
                  {categories.map((cat, i) => {
                    const count = getCategoryCount(cat);
                    const isUncategorised = cat === "Uncategorised";
                    const isOverflowOpen = overflowMenuCat === cat;

                    return (
                      <div
                        key={cat}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "8px 4px 8px 16px",
                          minHeight: 56,
                          borderBottom: i < categories.length - 1 ? `1px solid ${tokens.color.border.onpage}` : "none",
                          position: "relative",
                        }}
                      >
                        {/* Leading — category icon */}
                        <div style={{
                          width: 40, height: 40, borderRadius: tokens.shape.full,
                          background: isUncategorised ? `${tokens.color.fg.subtle}10` : `${tokens.color.fg.brand}08`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0,
                        }}>
                          <Icon
                            name="label"
                            size={20}
                            color={isUncategorised ? tokens.color.fg.subtle : tokens.color.fg.brand}
                          />
                        </div>

                        {/* Content — headline + supporting text */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontSize: tokens.type.bodyLarge.size,
                            fontWeight: 400,
                            color: isUncategorised ? tokens.color.fg.subtle : tokens.color.fg.emphasis,
                            fontStyle: isUncategorised ? "italic" : "normal",
                            lineHeight: tokens.type.bodyLarge.lineHeight,
                          }}>
                            {cat}
                          </div>
                          <div style={{
                            fontSize: tokens.type.bodySmall.size,
                            color: tokens.color.fg.subtle,
                            lineHeight: tokens.type.bodySmall.lineHeight,
                          }}>
                            {count} {count === 1 ? "product" : "products"}
                          </div>
                        </div>

                        {/* Trailing — M3 IconButton (MoreVert overflow) */}
                        {!isUncategorised && (
                          <div ref={isOverflowOpen ? overflowRef : undefined} style={{ position: "relative", flexShrink: 0 }}>
                            <button
                              onClick={() => setOverflowMenuCat(isOverflowOpen ? null : cat)}
                              style={{
                                width: 48, height: 48, borderRadius: tokens.shape.full,
                                border: "none",
                                background: isOverflowOpen ? `${tokens.color.fg.emphasis}0A` : "transparent",
                                cursor: "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                padding: 0,
                                transition: `background ${tokens.motion.duration.short2} ${tokens.motion.easing.standard}`,
                              }}
                            >
                              <Icon name="more-vert" size={20} color={tokens.color.fg.subtle} />
                            </button>

                            {/* M3 Dropdown Menu */}
                            {isOverflowOpen && (
                              <div style={{
                                position: "absolute",
                                top: "100%",
                                right: 0,
                                zIndex: 40,
                                minWidth: 160,
                                background: tokens.color.bg.page,
                                borderRadius: tokens.shape.extraSmall,
                                boxShadow: tokens.elevation.level2,
                                paddingTop: 8,
                                paddingBottom: 8,
                                overflow: "hidden",
                              }}>
                                <button
                                  onClick={() => {
                                    setOverflowMenuCat(null);
                                    setRenamingCat({ name: cat, newName: cat });
                                  }}
                                  style={{
                                    width: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                    padding: "10px 16px",
                                    minHeight: 48,
                                    border: "none",
                                    background: "transparent",
                                    cursor: "pointer",
                                    fontFamily: "inherit",
                                    textAlign: "left",
                                  }}
                                >
                                  <Icon name="edit" size={20} color={tokens.color.fg.emphasis} />
                                  <span style={{
                                    fontSize: tokens.type.bodyLarge.size,
                                    color: tokens.color.fg.emphasis,
                                  }}>
                                    Rename
                                  </span>
                                </button>
                                <button
                                  onClick={() => {
                                    setOverflowMenuCat(null);
                                    setDeletingCat(cat);
                                  }}
                                  style={{
                                    width: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                    padding: "10px 16px",
                                    minHeight: 48,
                                    border: "none",
                                    background: "transparent",
                                    cursor: "pointer",
                                    fontFamily: "inherit",
                                    textAlign: "left",
                                  }}
                                >
                                  <Icon name="delete" size={20} color={tokens.color.fg.error.text} />
                                  <span style={{
                                    fontSize: tokens.type.bodyLarge.size,
                                    color: tokens.color.fg.error.text,
                                  }}>
                                    Delete
                                  </span>
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Supporting text — M3 list footer */}
                  <div
                    style={{
                      padding: "12px 16px 14px",
                      paddingLeft: 68,
                      fontSize: tokens.type.bodySmall.size,
                      color: tokens.color.fg.subtle,
                      lineHeight: tokens.type.bodySmall.lineHeight,
                    }}
                  >
                    Categories are created when you assign them to products
                  </div>
                </div>
              )}
            </div>

            {/* ── Rename category dialog (M3 AlertDialog) ── */}
            {renamingCat && (
              <>
                <div
                  onClick={() => setRenamingCat(null)}
                  style={{
                    position: "absolute", inset: 0,
                    background: "rgba(0,0,0,0.45)", zIndex: 50,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "50%", left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "calc(100% - 48px)",
                    background: tokens.color.bg.page,
                    borderRadius: tokens.shape.extraLarge,
                    padding: "24px",
                    zIndex: 51,
                    boxShadow: tokens.elevation.level3,
                  }}
                >
                  <div style={{
                    fontSize: tokens.type.headlineSmall.size,
                    fontWeight: tokens.type.headlineSmall.weight,
                    color: tokens.color.fg.emphasis,
                  }}>
                    Rename category
                  </div>
                  <div style={{
                    fontSize: tokens.type.bodyMedium.size,
                    color: tokens.color.fg.subtle,
                    marginTop: 8,
                    lineHeight: 1.5,
                  }}>
                    Products in "{renamingCat.name}" will be updated to the new name.
                  </div>

                  {/* M3 OutlinedTextField */}
                  <div style={{ marginTop: 20, position: "relative" }}>
                    <InputBadge keyboardType={keyboardType} inputType="alpha" />
                    <div style={{
                      marginTop: 6,
                      borderRadius: tokens.shape.extraSmall,
                      border: `2px solid ${tokens.color.fg.brand}`,
                      padding: "0 16px",
                      height: 56,
                      display: "flex",
                      alignItems: "center",
                      background: tokens.color.bg.page,
                    }}>
                      <input
                        ref={renameInputRef}
                        autoFocus
                        value={renamingCat.newName}
                        onChange={(e) => setRenamingCat({ ...renamingCat, newName: e.target.value })}
                        onFocus={(e) => kb?.enabled && kb.show("alpha", e.target)}
                        inputMode={kb?.enabled ? "none" : undefined}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleRenameCategory();
                          if (e.key === "Escape") setRenamingCat(null);
                        }}
                        placeholder="Category name"
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
                    </div>
                    {/* Validation hint */}
                    {renamingCat.newName.trim() && renamingCat.newName.trim() !== renamingCat.name && categories.some(c => c.toLowerCase() === renamingCat.newName.trim().toLowerCase()) && (
                      <div style={{
                        fontSize: tokens.type.bodySmall.size,
                        color: tokens.color.fg.error.text,
                        marginTop: 6,
                        paddingLeft: 16,
                      }}>
                        A category with this name already exists
                      </div>
                    )}
                    {renamingCat.newName.trim().toLowerCase() === "uncategorised" && (
                      <div style={{
                        fontSize: tokens.type.bodySmall.size,
                        color: tokens.color.fg.error.text,
                        marginTop: 6,
                        paddingLeft: 16,
                      }}>
                        "Uncategorised" is reserved
                      </div>
                    )}
                  </div>

                  {/* M3 Dialog actions */}
                  <div style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 8,
                    marginTop: 24,
                  }}>
                    <button
                      onClick={() => setRenamingCat(null)}
                      style={{
                        padding: "10px 24px",
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
                      onClick={handleRenameCategory}
                      disabled={
                        !renamingCat.newName.trim() ||
                        renamingCat.newName.trim() === renamingCat.name ||
                        renamingCat.newName.trim().toLowerCase() === "uncategorised" ||
                        categories.some(c => c.toLowerCase() === renamingCat.newName.trim().toLowerCase() && c !== renamingCat.name)
                      }
                      style={{
                        padding: "10px 24px",
                        borderRadius: tokens.shape.full,
                        border: "none",
                        background: tokens.color.bg.action.primary.default,
                        cursor: "pointer",
                        fontSize: tokens.type.labelLarge.size,
                        fontWeight: 600,
                        color: tokens.color.fg.onAction,
                        fontFamily: "inherit",
                        opacity:
                          !renamingCat.newName.trim() ||
                          renamingCat.newName.trim() === renamingCat.name ||
                          renamingCat.newName.trim().toLowerCase() === "uncategorised" ||
                          categories.some(c => c.toLowerCase() === renamingCat.newName.trim().toLowerCase() && c !== renamingCat.name)
                            ? 0.38 : 1,
                        transition: `opacity ${tokens.motion.duration.short4} ${tokens.motion.easing.standard}`,
                      }}
                    >
                      Rename
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* ── Delete category dialog (M3 AlertDialog) ── */}
            {deletingCat && (
              <>
                <div
                  onClick={() => setDeletingCat(null)}
                  style={{
                    position: "absolute", inset: 0,
                    background: "rgba(0,0,0,0.45)", zIndex: 50,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "50%", left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "calc(100% - 48px)",
                    background: tokens.color.bg.page,
                    borderRadius: tokens.shape.extraLarge,
                    padding: "24px",
                    zIndex: 51,
                    boxShadow: tokens.elevation.level3,
                  }}
                >
                  <div style={{
                    fontSize: tokens.type.headlineSmall.size,
                    fontWeight: tokens.type.headlineSmall.weight,
                    color: tokens.color.fg.emphasis,
                  }}>
                    Delete category?
                  </div>
                  <div style={{
                    fontSize: tokens.type.bodyMedium.size,
                    color: tokens.color.fg.subtle,
                    marginTop: 16,
                    lineHeight: 1.5,
                  }}>
                    {getCategoryCount(deletingCat) > 0 ? (
                      <>
                        <span style={{ fontWeight: 600, color: tokens.color.fg.emphasis }}>
                          {deletingCat}
                        </span>
                        {` has ${getCategoryCount(deletingCat)} ${getCategoryCount(deletingCat) === 1 ? "product" : "products"}. They'll be moved to Uncategorised.`}
                      </>
                    ) : (
                      <>
                        <span style={{ fontWeight: 600, color: tokens.color.fg.emphasis }}>
                          {deletingCat}
                        </span>
                        {" will be permanently removed."}
                      </>
                    )}
                  </div>
                  <div style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 8,
                    marginTop: 24,
                  }}>
                    <button
                      onClick={() => setDeletingCat(null)}
                      style={{
                        padding: "10px 24px",
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
                      onClick={handleDeleteCategory}
                      style={{
                        padding: "10px 24px",
                        borderRadius: tokens.shape.full,
                        border: "none",
                        background: tokens.color.bg.error.default,
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

            <div style={{ margin: "0 16px", background: tokens.color.bg.page, borderRadius: tokens.shape.expressiveLarge, border: `1px solid ${tokens.color.border.onpage}`, overflow: "hidden" }}>
              {[...products].sort((a, b) => a.name.localeCompare(b.name)).map((p, i) => (
                <button
                  key={i}
                  onClick={() => navigate("edit-product", p)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 16px",
                    background: "transparent",
                    border: "none",
                    borderBottom: i < products.length - 1 ? `1px solid ${tokens.color.border.onpage}` : "none",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      width: 44, height: 44, borderRadius: tokens.shape.medium,
                      background: p.image ? tokens.color.bg.surface : p.emojiBg || tokens.color.bg.surface,
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      overflow: "hidden",
                    }}
                  >
                    {p.image ? (
                      <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : p.emoji ? (
                      <span style={{ fontSize: 22, lineHeight: 1 }}>{p.emoji}</span>
                    ) : (
                      <Icon name="image" size={20} color={tokens.color.border.onsurface} />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: tokens.type.bodyMedium.size, fontWeight: 500,
                      color: tokens.color.fg.emphasis,
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: tokens.type.bodySmall.size, color: tokens.color.fg.subtle, marginTop: 1 }}>
                      ${p.price}{p.cat ? `  ·  ${p.cat}` : ""}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                    {p.fav && <Icon name="favorite" size={16} color={tokens.color.fg.error.icon} />}
                    <Icon name="chevron" size={20} color={tokens.color.fg.subtle} />
                  </div>
                </button>
              ))}
            </div>
            <div style={{ height: 80 }} /> {/* FAB clearance */}
          </>
        ) : (
          /* ═══ EMPTY — example row + skeleton cards + prompt ═══ */
          <div style={{ padding: "8px 16px 80px" }}>
            {/* Descriptor */}
            <div style={{ padding: "12px 0 16px", textAlign: "center" }}>
              <div style={{
                fontSize: tokens.type.titleSmall.size,
                fontWeight: tokens.type.titleSmall.weight,
                color: tokens.color.fg.emphasis,
              }}>
                Your product catalogue
              </div>
              <div style={{
                fontSize: tokens.type.bodySmall.size,
                color: tokens.color.fg.subtle,
                marginTop: 4,
                lineHeight: 1.5,
              }}>
                Add products for quick tap-to-sell checkout.
                They'll appear here and on your home screen.
              </div>
            </div>

            {/* Product list with example + skeletons */}
            <div style={{
              background: tokens.color.bg.page,
              borderRadius: tokens.shape.expressiveLarge,
              border: `1px solid ${tokens.color.border.onpage}`,
              overflow: "hidden",
            }}>
              {/* ── Example row — realistic but clearly illustrative ── */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 16px",
                  borderBottom: `1px solid ${tokens.color.border.onpage}`,
                  position: "relative",
                }}
              >
                {/* Example product thumbnail */}
                <div
                  style={{
                    width: 44, height: 44, borderRadius: tokens.shape.medium,
                    background: `linear-gradient(135deg, ${tokens.color.bg.action.primary.default}18, ${tokens.color.bg.action.primary.default}30)`,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    border: `1px dashed ${tokens.color.fg.brand}40`,
                  }}
                >
                  <span style={{ fontSize: 20 }}>☕</span>
                </div>
                {/* Example text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: tokens.type.bodyMedium.size, fontWeight: 500,
                    color: tokens.color.fg.emphasis,
                  }}>
                    Flat White
                  </div>
                  <div style={{ fontSize: tokens.type.bodySmall.size, color: tokens.color.fg.subtle, marginTop: 1 }}>
                    $4.50  ·  Drinks
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                  <Icon name="favorite" size={16} color={tokens.color.fg.error?.icon || "#E53935"} />
                  <Icon name="chevron" size={20} color={tokens.color.fg.subtle} />
                </div>
                {/* "Example" badge */}
                <div style={{
                  position: "absolute",
                  top: 4,
                  right: 8,
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  color: tokens.color.fg.brand,
                  opacity: 0.5,
                }}>
                  example
                </div>
              </div>

              {/* ── Skeleton rows ── */}
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 16px",
                    borderBottom: i < 3 ? `1px solid ${tokens.color.border.onpage}` : "none",
                    opacity: 1 - i * 0.15,
                  }}
                >
                  <div
                    style={{
                      width: 44, height: 44, borderRadius: tokens.shape.medium,
                      background: tokens.color.bg.surface,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                    <div
                      style={{
                        height: 12,
                        borderRadius: 6,
                        background: tokens.color.bg.surface,
                        width: `${55 + (i * 17) % 35}%`,
                      }}
                    />
                    <div
                      style={{
                        height: 10,
                        borderRadius: 5,
                        background: tokens.color.bg.surface,
                        width: `${30 + (i * 11) % 20}%`,
                      }}
                    />
                  </div>
                  <div
                    style={{
                      width: 20, height: 20, borderRadius: tokens.shape.full,
                      background: tokens.color.bg.surface,
                      flexShrink: 0,
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Hint at bottom */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              padding: "20px 0 0",
              fontSize: tokens.type.bodySmall.size,
              color: tokens.color.fg.subtle,
            }}>
              <Icon name="info" size={16} color={tokens.color.fg.subtle} />
              <span>Tap + to add your first product</span>
            </div>
          </div>
        )}
      </div>

      <FAB icon="add" label="New Product" onClick={() => navigate("add-product")} variant="primary" />
    </div>
  );
}
