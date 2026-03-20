import { useState } from "react";
import tokens from "../theme/tokens";
import TopAppBar from "../components/TopAppBar";
import FAB from "../components/FAB";
import Icon from "../components/Icon";

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

export default function ProductCatalogScreen({ navigate, goBack, products = [] }) {
  const hasProducts = products.length > 0;

  // Category management state
  const existingCats = [...new Set(products.map((p) => p.cat).filter(Boolean))];
  const [categories, setCategories] = useState(existingCats);
  const [showCategories, setShowCategories] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [renamingCat, setRenamingCat] = useState(null); // { index, name }
  const [deletingCat, setDeletingCat] = useState(null); // index

  const handleAddCategory = () => {
    const trimmed = newCatName.trim();
    if (trimmed && !categories.includes(trimmed)) {
      setCategories([...categories, trimmed]);
      setNewCatName("");
    }
  };

  const handleRenameCategory = (index, newName) => {
    const trimmed = newName.trim();
    if (trimmed && !categories.includes(trimmed)) {
      setCategories(categories.map((c, i) => (i === index ? trimmed : c)));
    }
    setRenamingCat(null);
  };

  const handleDeleteCategory = (index) => {
    setCategories(categories.filter((_, i) => i !== index));
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

            {/* ── Categories section ────────────────────── */}
            <div style={{ margin: "0 16px 10px" }}>
              <button
                onClick={() => setShowCategories(!showCategories)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  background: tokens.color.bg.page,
                  border: `1px solid ${tokens.color.border.onpage}`,
                  borderRadius: showCategories
                    ? `${tokens.shape.expressiveLarge} ${tokens.shape.expressiveLarge} 0 0`
                    : tokens.shape.expressiveLarge,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: `border-radius ${tokens.motion.duration.short4} ${tokens.motion.easing.standard}`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Icon name="store" size={20} color={tokens.color.fg.brand} />
                  <span style={{
                    fontSize: tokens.type.titleSmall.size,
                    fontWeight: 600,
                    color: tokens.color.fg.emphasis,
                  }}>
                    Categories
                  </span>
                  <span style={{
                    fontSize: tokens.type.labelSmall.size,
                    fontWeight: 600,
                    color: tokens.color.fg.subtle,
                    background: tokens.color.bg.surface,
                    padding: "2px 8px",
                    borderRadius: tokens.shape.full,
                  }}>
                    {categories.length}
                  </span>
                </div>
                <Icon
                  name="expand-more"
                  size={20}
                  color={tokens.color.fg.subtle}
                />
              </button>

              {showCategories && (
                <div
                  style={{
                    background: tokens.color.bg.page,
                    border: `1px solid ${tokens.color.border.onpage}`,
                    borderTop: "none",
                    borderRadius: `0 0 ${tokens.shape.expressiveLarge} ${tokens.shape.expressiveLarge}`,
                    overflow: "hidden",
                  }}
                >
                  {categories.map((cat, i) => {
                    const count = getCategoryCount(cat);
                    const isRenaming = renamingCat?.index === i;

                    return (
                      <div
                        key={cat + i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "10px 16px",
                          borderBottom: `1px solid ${tokens.color.border.onpage}`,
                        }}
                      >
                        {isRenaming ? (
                          <input
                            autoFocus
                            value={renamingCat.name}
                            onChange={(e) => setRenamingCat({ index: i, name: e.target.value })}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleRenameCategory(i, renamingCat.name);
                              if (e.key === "Escape") setRenamingCat(null);
                            }}
                            onBlur={() => handleRenameCategory(i, renamingCat.name)}
                            style={{
                              flex: 1,
                              fontSize: tokens.type.bodyMedium.size,
                              color: tokens.color.fg.emphasis,
                              border: "none",
                              outline: "none",
                              background: "transparent",
                              fontFamily: "inherit",
                              fontWeight: 500,
                              padding: 0,
                            }}
                          />
                        ) : (
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <span style={{
                              fontSize: tokens.type.bodyMedium.size,
                              fontWeight: 500,
                              color: tokens.color.fg.emphasis,
                            }}>
                              {cat}
                            </span>
                            <span style={{
                              fontSize: tokens.type.bodySmall.size,
                              color: tokens.color.fg.subtle,
                              marginLeft: 8,
                            }}>
                              {count} {count === 1 ? "item" : "items"}
                            </span>
                          </div>
                        )}

                        {!isRenaming && (
                          <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>
                            <button
                              onClick={() => setRenamingCat({ index: i, name: cat })}
                              style={{
                                width: 34, height: 34, borderRadius: tokens.shape.full,
                                border: "none", background: "transparent", cursor: "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center",
                              }}
                            >
                              <Icon name="edit" size={16} color={tokens.color.fg.subtle} />
                            </button>
                            <button
                              onClick={() => setDeletingCat(i)}
                              style={{
                                width: 34, height: 34, borderRadius: tokens.shape.full,
                                border: "none", background: "transparent", cursor: "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center",
                              }}
                            >
                              <Icon name="delete" size={16} color={tokens.color.fg.subtle} />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Add new category */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "10px 16px",
                    }}
                  >
                    <Icon name="add" size={18} color={tokens.color.fg.brand} />
                    <input
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddCategory();
                      }}
                      placeholder="New category..."
                      style={{
                        flex: 1,
                        fontSize: tokens.type.bodyMedium.size,
                        color: tokens.color.fg.emphasis,
                        border: "none",
                        outline: "none",
                        background: "transparent",
                        fontFamily: "inherit",
                        padding: 0,
                      }}
                    />
                    {newCatName.trim() && (
                      <button
                        onClick={handleAddCategory}
                        style={{
                          padding: "6px 14px",
                          borderRadius: tokens.shape.full,
                          background: tokens.color.bg.action.primary.default,
                          border: "none",
                          cursor: "pointer",
                          fontSize: tokens.type.labelMedium.size,
                          fontWeight: 600,
                          color: "#fff",
                          fontFamily: "inherit",
                        }}
                      >
                        Add
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ── Delete category confirmation ──────────── */}
            {deletingCat !== null && (
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
                    borderRadius: tokens.shape.expressiveLarge,
                    padding: "24px",
                    zIndex: 51,
                    boxShadow: tokens.elevation.level3,
                  }}
                >
                  <div style={{
                    fontSize: tokens.type.titleLarge.size,
                    fontWeight: tokens.type.titleLarge.weight,
                    color: tokens.color.fg.emphasis,
                  }}>
                    Delete category?
                  </div>
                  <div style={{
                    fontSize: tokens.type.bodyMedium.size,
                    color: tokens.color.fg.subtle,
                    marginTop: 8,
                    lineHeight: 1.5,
                  }}>
                    <span style={{ fontWeight: 600, color: tokens.color.fg.emphasis }}>
                      {categories[deletingCat]}
                    </span>
                    {getCategoryCount(categories[deletingCat]) > 0
                      ? ` has ${getCategoryCount(categories[deletingCat])} products. They'll be moved to Uncategorised.`
                      : " will be permanently removed."}
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
                      onClick={() => handleDeleteCategory(deletingCat)}
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
                      background: tokens.color.bg.surface,
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}
                  >
                    <Icon name="image" size={20} color={tokens.color.border.onsurface} />
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
          /* ═══ EMPTY — skeleton cards + prompt ═══ */
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

            {/* Skeleton product cards */}
            <div style={{
              background: tokens.color.bg.page,
              borderRadius: tokens.shape.expressiveLarge,
              border: `1px solid ${tokens.color.border.onpage}`,
              overflow: "hidden",
            }}>
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 16px",
                    borderBottom: i < 4 ? `1px solid ${tokens.color.border.onpage}` : "none",
                  }}
                >
                  {/* Skeleton image */}
                  <div
                    style={{
                      width: 44, height: 44, borderRadius: tokens.shape.medium,
                      background: tokens.color.bg.surface,
                      flexShrink: 0,
                    }}
                  />
                  {/* Skeleton text lines */}
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                    <div
                      style={{
                        height: 12,
                        borderRadius: 6,
                        background: tokens.color.bg.surface,
                        width: `${55 + (i * 13) % 35}%`,
                      }}
                    />
                    <div
                      style={{
                        height: 10,
                        borderRadius: 5,
                        background: tokens.color.bg.surface,
                        width: `${30 + (i * 7) % 20}%`,
                      }}
                    />
                  </div>
                  {/* Skeleton chevron */}
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
