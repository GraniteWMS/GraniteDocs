# Lightspeed POS Overview & Core Objects

## Introduction: What is Lightspeed POS?

Lightspeed POS is a **cloud-based point-of-sale and retail platform** designed for small and medium businesses, particularly in **retail, hospitality, and e-commerce**.  

It helps businesses run **day-to-day operations** such as:
- Register sales (POS)
- Inventory across multiple shops
- Purchases and supplier orders
- Transfers between locations
- Customer loyalty and e-commerce

---

## Lightspeed POS vs Traditional ERP (e.g. Sage 300)

| Feature | Lightspeed POS | ERP (e.g. Sage 300) |
|---------|----------------|----------------------|
| **Purpose** | Retail and shop-floor operations | Full enterprise management |
| **Focus** | POS, inventory, purchasing, e-commerce | Accounting, financials, procurement, operations |
| **Strengths** | Cloud-native, multi-location, user-friendly POS | Deep financials, compliance, wide module coverage |
| **Weaknesses** | Limited accounting, fewer workflows | Complex setup, weaker retail/POS interface |
| **Best For** | Retailers, restaurants, businesses needing fast POS & stock control | Companies needing full back-office financial integration |

👉 In many setups, Lightspeed handles the **front-end retail operations** (sales, stock, customer transactions), while an ERP like Sage 300 manages the **back-office accounting and financials**.

---

## Core Lightspeed Objects & Their States

### 1. Sales (`Sale`)
- **Purpose**: Records a customer transaction (like an invoice/order in ERP).
- **Key States**:
  - `quote` → not committed yet
  - `open` → in-progress (cart)
  - `complete` → finalized, paid
  - `workorder` / `layaway` → pending fulfillment
  - `voided` / `refunded` → cancelled or reversed
- **Sub-objects**:
  - `SaleLine` (line items)
  - `Payment` (tender details)

---

### 2. Purchases (`PurchaseOrder`)
- **Purpose**: Ordering stock from a supplier.
- **Key States**:
  - `new` → created, not sent
  - `ordered` → submitted to vendor
  - `received` → goods received
  - `partial` → partially received
  - `voided` → cancelled
- **Sub-objects**:
  - `PurchaseLine` (items ordered)

---

### 3. Transfers (`Transfer`)
- **Purpose**: Moving inventory between shops/warehouses.
- **Key States**:
  - `new` → created, not shipped
  - `in_transit` → shipped, not received
  - `received` → received at destination
  - `cancelled` → aborted

---

### 4. Shops (`Shop`)
- **Purpose**: Represents a store, warehouse, or location.
- **Attributes**:
  - Name, address, tax settings
  - Stock levels per item
- **States**:
  - `active`
  - `inactive`

---

### 5. Items (`Item`)
- **Purpose**: Product catalog (SKUs).
- **Attributes**:
  - Code/SKU, description, supplier, category, brand
  - Stock quantities per shop
  - Pricing (base, default, customer group)
- **States**:
  - `active` → available for sale
  - `archived` → retired, kept for history
  - `non-inventory` → services, not stock-tracked
- **Features**:
  - Variants (matrix items: size, color, etc.)

---
