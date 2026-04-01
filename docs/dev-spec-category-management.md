# LitePOS — Category Management Dev Spec

**Feature:** Product Categories
**Status:** Draft
**Last updated:** 2026-04-01

---

## Overview

Categories are a lightweight organisational layer for the product catalogue. They are not a standalone entity — a category exists only as long as at least one product belongs to it. There is no separate categories table or API; categories are derived from the `category` field on the product model.

A reserved virtual category, **"Uncategorised"**, acts as the fallback bucket. It cannot be renamed or deleted by the merchant. It appears in the UI only when at least one product has no assigned category.

---

## Data Model

Categories are stored as a plain string on the product record.

```
Product {
  id: String
  name: String              // required
  price: String             // required
  category: String          // nullable — null or empty → treated as "Uncategorised"
  description: String?
  sku: String?
  upc: String?
  favourite: Boolean
  image: String?            // URI
}
```

There is no `Category` entity. The canonical list of categories at any point in time is:

```kotlin
val categories = products.map { it.category }
    .filterNot { it.isNullOrBlank() || it == "Uncategorised" }
    .distinct()
    .sorted()
```

"Uncategorised" is included in the UI list only when `products.any { it.category.isNullOrBlank() }`.

---

## Behaviour Specification

### 1. Category Creation

Categories are created implicitly through the product form — there is no standalone "create category" flow.

**Trigger:** Merchant types a value into the category field on the Add Product or Edit Product screen that does not match any existing category.

**Behaviour:**

- The category field uses an **M3 Exposed Dropdown Menu (editable variant)** — a text field with an anchored dropdown that supports both selection and free-text input.
- On focus, the dropdown opens showing all existing categories plus the default suggestions (see §5).
- As the merchant types, the list filters in real-time using case-insensitive substring matching.
- When the typed value does not match any existing category, a **"Create \[typed value\]"** option appears at the top of the dropdown with a leading `+` icon.
- Tapping "Create …" or simply saving the product with the new text value creates the category.
- The category is committed to the product record on Save — not on selection from the dropdown. If the merchant dismisses the product form without saving, no category is created.

**Validation rules:**

- Category names are trimmed of leading/trailing whitespace before comparison and storage.
- Empty or whitespace-only values are treated as "Uncategorised" (stored as `null` or empty string).
- Duplicate detection is case-insensitive: if "Drinks" exists, typing "drinks" should match it rather than offering to create a new one.
- The merchant cannot create a category named "Uncategorised" (exact match, case-insensitive).

---

### 2. Category Selection (Add/Edit Product)

**Component:** `ExposedDropdownMenuBox` with editable `OutlinedTextField`

**Behaviour:**

- Tapping the field or the trailing dropdown arrow opens the dropdown menu.
- The dropdown is anchored directly below the text field (not a full-screen bottom sheet).
- Each menu item shows the category name and a trailing product count badge (e.g. "3").
- The currently selected category shows a leading checkmark icon.
- "Uncategorised" appears first in the list, styled in italic to distinguish it as the default.
- Selecting a category populates the text field and closes the dropdown.
- Selecting "Uncategorised" clears the text field (stores null/empty).
- The merchant can clear their selection with the inline clear (✕) button that appears when the field has a value and is focused.
- On blur without explicit selection, the typed value is accepted as-is (supporting free-text category creation).

**Default suggestions** (shown when the dropdown opens with an empty field): Uncategorised, then existing categories alphabetically, then any of the following defaults that don't already exist as categories: Drinks, Food, Snacks, Merchandise, Services. These defaults are suggestions only — they are not persisted until a product is saved with one of them.

---

### 3. Category Rename

**Location:** Manage Products screen → Categories section

**Behaviour:**

- Each category row (except "Uncategorised") has an edit action.
- Tapping edit enters inline rename mode: the category label becomes an editable text field, pre-populated with the current name.
- On confirm (checkmark / done), all products belonging to the old category name are bulk-updated to the new name.
- The operation is atomic from the merchant's perspective — there is no state where some products have the old name and others have the new name.

**Validation rules:**

- The new name must be non-empty after trimming.
- The new name must not collide with an existing category (case-insensitive).
- The new name cannot be "Uncategorised" (case-insensitive).
- If validation fails, the rename is rejected and the field reverts to the original name.

**"Uncategorised" protection:** The edit action is hidden for the "Uncategorised" row. If triggered programmatically, the operation is a no-op.

---

### 4. Category Deletion

**Location:** Manage Products screen → Categories section

**Behaviour:**

- Each category row (except "Uncategorised") has a delete action.
- Tapping delete shows a confirmation dialog:
  - Title: "Delete category?"
  - Body: **"\[Category name\]** has \[N\] products. They'll be moved to Uncategorised."
  - Actions: Cancel (text button) · Delete (filled, destructive red)
- On confirm, all products in the deleted category have their `category` field set to `null`/empty (i.e. they become "Uncategorised").
- The category ceases to exist because no products reference it.

**"Uncategorised" protection:** The delete action is hidden for the "Uncategorised" row. If triggered programmatically, the operation is a no-op.

**Empty categories:** Because categories are derived from products, a category with zero products cannot exist. If the last product in a category is deleted or moved to another category, that category disappears from the list automatically — no explicit delete is needed.

---

### 5. "Uncategorised" — Special Behaviour

"Uncategorised" is a virtual category, not stored as a string value. A product belongs to "Uncategorised" when its `category` field is `null`, empty, or blank.

| Rule | Detail |
|------|--------|
| **Cannot be renamed** | Edit action hidden; programmatic rename is a no-op |
| **Cannot be deleted** | Delete action hidden; programmatic delete is a no-op |
| **Auto-appears** | Shown in category lists when ≥1 product has no category |
| **Auto-disappears** | Hidden from category lists when every product has an explicit category |
| **Display style** | Rendered in italic to distinguish from merchant-created categories |
| **Sort position** | Always first in any category list |
| **Cannot be created** | The Add/Edit product combobox prevents typing "Uncategorised" as a new category |

---

### 6. Category Display — Home Screen

**Location:** LitePOS home screen → filter chip row

**Behaviour:**

- A horizontal scrolling row of filter chips appears below the top bar.
- Fixed chips: "All Items", "Favourites".
- Dynamic chips: one per category, sorted alphabetically. "Uncategorised" appears only if applicable.
- If the total chip count exceeds the visible area, an overflow "More" chip appears. Tapping it shows the remaining categories in a dropdown.
- Tapping a category chip filters the product grid/list to only show products in that category.
- The active chip uses the selected/brand colour treatment.
- Search spans all products regardless of the active category filter. When search is active, the category filter is ignored.

---

### 7. Category Display — Manage Products

**Location:** Product Catalog screen → collapsible "Categories" section

**Behaviour:**

- A toggleable section header "Categories (\[count\])" expands/collapses the category list.
- Each row shows: category name, product count, edit button, delete button.
- "Uncategorised" row: italic name, product count, no edit/delete buttons.
- The product list below can be visually grouped by category (each product row shows its category as secondary text).

---

## Compose M3 Implementation Notes

### Exposed Dropdown Menu (Category Selector)

The category field on Add/Edit Product maps directly to a first-party Compose M3 component.

```kotlin
ExposedDropdownMenuBox(
    expanded = expanded,
    onExpandedChange = { expanded = it }
) {
    OutlinedTextField(
        value = textFieldValue,
        onValueChange = { /* filter logic */ },
        modifier = Modifier.menuAnchor(ExposedDropdownMenuAnchorType.PrimaryEditable),
        label = { Text("Category") },
        trailingIcon = {
            ExposedDropdownMenuDefaults.TrailingIcon(
                expanded = expanded,
                modifier = Modifier.menuAnchor(ExposedDropdownMenuAnchorType.SecondaryEditable)
            )
        }
    )
    ExposedDropdownMenu(expanded = expanded, onDismissRequest = { expanded = false }) {
        // "Create new" item (conditional)
        // Filtered category items with trailing count badge
    }
}
```

**Minimum dependency:** `androidx.compose.material3:material3:1.3.0+` (the `ExposedDropdownMenuAnchorType` API was introduced in 1.3; the older parameterless `menuAnchor()` is deprecated).

**Accessibility:** The `SecondaryEditable` anchor type on the trailing icon allows TalkBack users to toggle the dropdown without typing. Hardware keyboard navigation (arrow keys, Enter, Escape) is supported natively.

**Custom additions beyond the default component:**

- "Create \[value\]" `DropdownMenuItem` — conditionally rendered when typed text doesn't match any existing category. Uses `leadingIcon` slot for the `+` icon.
- Product count — rendered in the `trailingIcon` slot of each `DropdownMenuItem` as a `Text` composable.
- "Uncategorised" styling — italic `fontStyle` on the text, always sorted first.

### Category Rename (Inline Edit)

Standard `OutlinedTextField` in the category list row, toggled by an edit icon button. No special components required.

### Category Delete (Confirmation Dialog)

Standard `AlertDialog` with destructive action styling.

---

## Edge Cases

| Scenario | Expected behaviour |
|----------|-------------------|
| Merchant types "  Drinks  " (whitespace) | Trimmed to "Drinks" → matches existing, no new category created |
| Merchant types "drinks" when "Drinks" exists | Case-insensitive match → selects "Drinks", no duplicate created |
| Merchant types "Uncategorised" | Treated as clearing the field → product saved with null category |
| Last product in "Coffee" is deleted | "Coffee" disappears from all category lists automatically |
| Last product in "Coffee" is recategorised to "Drinks" | "Coffee" disappears, "Drinks" count increments |
| All products are given explicit categories | "Uncategorised" row disappears from filter chips and manage screen |
| Merchant renames "Drinks" to "Beverages" | All products with category "Drinks" are updated to "Beverages" atomically |
| Merchant tries to rename "Food" to "Drinks" (collision) | Rename rejected, field reverts to "Food" |
| Merchant tries to rename "Food" to "uncategorised" | Rename rejected (case-insensitive reserved word) |
| Product saved with empty category field | Stored as null → appears under "Uncategorised" |
| Category with special characters (e.g. "Café & Bar") | Allowed — no character restrictions beyond non-empty after trim |
| Merchant opens category dropdown with >15 categories | Dropdown scrolls with `maxHeight` constraint, does not expand to full screen |

---

## Out of Scope

- Category ordering/sorting preferences (alphabetical only for now)
- Category icons, colours, or images
- Category nesting / hierarchy
- Standalone "create category" flow outside of the product form
- Category sync with external POS systems (future Connect Express integration)
- Drag-and-drop category reordering on the home screen filter chips
