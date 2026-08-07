# Change Log

<!-- 
- New entries go at the top of the file — dates must be in **descending** order (newest first).
- Date format: `yyyy-MM-dd`
- The section heading depends on which project changed:
  - `sdk-provider.md` changes → `### SDK Provider`
  - `integration-jobs.md` changes → `### Injected Jobs`
- Under each version, include a `Changes:` block and/or a `Fixes:` block. **Omit a block entirely if there is nothing for it** (e.g. don't include an empty `Fixes:` header if there were no fixes).

Template:

```
## yyyy-MM-dd

### SDK Provider

<h4>Version: Version Number</h4>
<h4>Changes:</h4>
- This is a change
<h4>Fixes:</h4>
- This is a fix

### Injected Jobs

<h4>Version: Version Number</h4>
<h4>Changes:</h4>
- This is a change
<h4>Fixes:</h4>
- This is a fix
```
-->

## 2026-08-07

### Injected Jobs

<h4>Version: 7.0.6.0</h4>
<h4>Changes:</h4>
- Documents now support generic optional fields, with missing definitions created automatically. Sales Order ship-to address is synced as the first optional field, "Ship To Address".
- MasterItem `UnitValue` is now synced from Acumatica stock item cost data when items are fetched directly from Acumatica, using the currency configured via the new `AcumaticaStockItemCurrencyID` setting.
- Return to Supplier lines now include expiry date, enabling the SDK Provider's expiry validation for that document.

## 2026-07-24

### Injected Jobs

<h4>Version: 7.0.5.9</h4>
<h4>Changes:</h4>
- Shipment documents now carry `Priority`, set to the highest linked Sales Order priority across the shipment's lines.

## 2026-07-22

### SDK Provider

<h4>Version: 7.0.7.3</h4>
<h4>Fixes:</h4>
- RECEIVE no longer sends `ReceiptQty` on purchase receipt lines; Acumatica was duplicating allocations when it was sent alongside the allocation lines.

## 2026-07-16

### Injected Jobs

<h4>Version: 7.0.5.8</h4>
<h4>Changes:</h4>
- Shipments deleted in Acumatica are now detected via audit history and automatically cancelled in Granite; when any document's ERP record can no longer be found, it is set to CANCELLED with an updated description instead of failing the sync.
- Shipment documents now carry `ExpectedDate`, populated from Acumatica's `ShipDate`.

## 2026-07-15

### SDK Provider

<h4>Version: 7.0.7.2</h4>
<h4>Fixes:</h4>
- Await the release action to complete when releasing a Purchase Order Return, instead of returning immediately after invoking it.
