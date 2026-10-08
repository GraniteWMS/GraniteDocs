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

## 2026-10-08

### SDK Provider

<h4>Version: 7.0.14.1</h4>

<h4>Changes:</h4>
- STOCKTAKE now creates a CIN7 Stocktake for the counted location and updates it with the Granite counts, instead of posting a Stock Adjustment. It returns the Stocktake number, requires all transactions to be in one session and one location, and does not support dry run.
- Added PARTIALSTOCKTAKE, which adjusts only the counted items in a location by the difference between the counted and expected quantities.
- Added SCRAP and TAKEON, which reduce or increase stock for an item at a location as a Stock Adjustment.
- Added REPLENISH, posted as a Stock Transfer in the same way as MOVE.
- Stock adjustments (RECLASSIFY, ADJUSTMENT, SCRAP, TAKEON, PARTIALSTOCKTAKE) now net all changes per item, batch, expiry and location before posting, skip changes that cancel out, treat items with no CIN7 availability record as zero on hand, and report every line that would go negative in a single error.
- RECLASSIFY now requires the from and to location to be the same.
- The Granite Batch field is now the only value sent as CIN7 BatchSN; the Serial field is no longer sent or used for matching in any method.
- Stock transfer IN TRANSIT and COMPLETED updates now check the Granite locations against the CIN7 transfer, validate instead of changing quantities when the transfer is already in transit, and build lines from the Granite transactions for order-driven transfers that have no lines yet.
- Stock transfers posted as completed now carry a completion date.
- Every CIN7 response is logged, and a non-JSON response fails with a clear message pointing to the integration logs.
<h4>Fixes:</h4>
- SALECREDITNOTE and PURCHASECREDITNOTE now resolve the CIN7 sale or purchase from the composite ERP identification written by the credit note jobs, so a credit note raised on a simple sale or purchase validates against the correct record.
- RECEIVE no longer reuses a receiving task that is not open (DRAFT or NOT AVAILABLE).
- POSTPUTAWAY with put-away grouping now reads the invoicing and receiving number after an underscore in the transaction document reference.
- MANUFACTURE no longer fails the batch check when neither Granite nor CIN7 has a batch.
- Stock adjustments (RECLASSIFY, ADJUSTMENT, SCRAP, TAKEON, PARTIALSTOCKTAKE) now update the CIN7 on-hand quantity. Previously CIN7 applied the posted quantity to the available quantity, so on-hand stock ended up too high by the allocated quantity whenever the item had stock allocated to open orders.

### Injected Jobs

<h4>Version: 7.0.9.0</h4>
<h4>Changes:</h4>
- Added a new BOM job that syncs the Bill of Materials of active CIN7 Assembly products into Granite as BOM documents (one INPUT line per component and an OUTPUT line for the assembled product), and deactivates the document when a product stops being an active Assembly.
- Sale and purchase credit note document lines now map Batch and ExpiryDate from the CIN7 restock or unstock line.
<h4>Fixes:</h4>
- Sale and purchase credit notes are now stored with a composite ERP identification (CIN7 ID plus credit note number), so a credit note raised on a simple sale or purchase no longer overwrites the sales order or purchase order document that shares its CIN7 ID.
- Queued documents whose queue time equals the processing cut-off are no longer skipped.

## 2026-09-03

### SDK Provider

<h4>Version: 7.0.13.0</h4>
<h4>Changes:</h4>
- Added a new PURCHASECREDITNOTE method that validates a CIN7 purchase credit note's unstock lines against the matching Granite transactions (by SKU, batch/serial and expiry), reporting missing matches, transactions claimed by more than one line, quantity mismatches, and unmatched Granite transactions.

### Injected Jobs

<h4>Version: 7.0.8.0</h4>
<h4>Changes:</h4>
- Added a new Purchase Credit Note job that syncs CIN7 purchase credit notes (status AUTHORISED) into Granite as ORDER documents (goods returned to a supplier), with a configurable lookback window (`PurchaseCreditNoteLookbackMinutes`) and location filtering.

## 2026-08-24

### SDK Provider

<h4>Version: 7.0.12.1</h4>
<h4>Changes:</h4>
- Stock transfer IN TRANSIT/COMPLETED quantity updates for order-driven transfers with no CIN7 lines yet now build the transfer lines from the order lines instead, matching them against Granite transactions. Order lines with no matching Granite transaction are left out of the request rather than being included at 0.
<h4>Fixes:</h4>
- Stock transfer IN TRANSIT/COMPLETED quantity updates for transfers that already have CIN7 lines no longer silently set an unmatched line's quantity to 0 — the update now fails with a line discrepancy error instead, consistent with the non-posting validation.

## 2026-08-05

### SDK Provider

<h4>Version: 7.0.12.0</h4>
<h4>Changes:</h4>
- Added a new SALECREDITNOTE method that validates a CIN7 sale credit note's restock lines against the matching Granite transactions (by SKU, batch/serial and expiry), reporting missing matches, transactions claimed by more than one line, quantity mismatches, and unmatched Granite transactions.
- Improved line validation for stock transfer IN TRANSIT/COMPLETED updates: matching now also considers expiry date, and detects transactions claimed by more than one line.
- When posting stock transfer quantity updates, lines with no matching Granite transaction now have their quantity set to 0, and Granite transactions with no matching CIN7 line are now added as new lines on the transfer instead of being left out.

### Injected Jobs

<h4>Version: 7.0.7.0</h4>
<h4>Changes:</h4>
- Added a new Sale Credit Note job that syncs CIN7 sale credit notes (status AUTHORISED) into Granite as RECEIVING documents, with a configurable lookback window (`SaleCreditNoteLookbackMinutes`) and location filtering.
- Transfer document lines now also map Batch and ExpiryDate from the CIN7 transfer line.
<h4>Fixes:</h4>
- MasterItem sync from document lines now matches items using the line's MasterItem ERP identification instead of the document line's own identification, fixing lookups for lines where these values differ (for example, batched transfer lines). Lines missing this identification are now logged and skipped instead of causing incorrect matches.

!!! warning "Action required"
    Any customized detail-mapping F# script (`Configuration/Scripts/*JobConfiguration.fsx`) must set `MasterItem_ERPIdentification` on the mapped `DocumentDetail`. Scripts that do not set this value will have their document lines logged as errors and skipped when syncing MasterItems from documents.

    Example: `MasterItem_ERPIdentification = productId`

## 2026-07-23

### SDK Provider

<h4>Version: 7.0.11.0</h4>
<h4>Changes:</h4>
- CIN7 requests that are rate-limited or find the API unavailable (429 / 503) are still retried up to 2 times, but now wait with an increasing, slightly randomized delay (starting around 3 seconds) between attempts instead of a fixed 10 second wait.

### Injected Jobs

<h4>Version: 7.0.6.7</h4>
<h4>Fixes:</h4>
- When a CIN7 API call fails and is retried, the underlying error is no longer masked by a wrapped exception, and the log now shows the HTTP status code and message for the failure, making transient CIN7 outages easier to diagnose.

## 2026-07-21

### SDK Provider

<h4>Version: 7.0.10.2</h4>
<h4>Fixes:</h4>
- POSTPUTAWAY: when put-away grouping is enabled and no open put-away task is found for the invoicing/receiving number, the existing invoice is now reused so put-away lines are posted against it, instead of always creating a brand new put-away task.

## 2026-07-20

### SDK Provider

<h4>Version: 7.0.10.1</h4>
<h4>Fixes:</h4>
- Fixed a potential deadlock/hang when the integration made CIN7 API calls from certain hosting contexts.
- POSTPUTAWAY: when put-away grouping is enabled, no open put-away task is found, and the related invoice has already been received in CIN7, the integration now creates a new put-away task instead of failing with an error.

## 2026-07-14

### Injected Jobs

<h4>Version: 7.0.6.6</h4>
<h4>Changes:</h4>
- MasterItems that are missing from CIN7 are now only marked as removed (inactive, with `_REMOVED` appended to the code) during the full MasterItem sync. Other syncs no longer mark items as removed.
- Improved the performance of the MasterItem sync lookup so it no longer waits on locks held by other activity on the MasterItem table.
<h4>Fixes:</h4>
- MasterItems that were already marked as removed are no longer repeatedly re-marked on every full sync.

## 2026-07-06

### SDK Provider

<h4>Version: 7.0.9.3</h4>
<h4>Changes:</h4>
- Added support for RECLASSIFY: stock can now be reclassified from one item/batch/expiry to another, posted to CIN7 as a Stock Adjustment based on current CIN7 stock availability.
- Re-enabled support for ADJUSTMENT: stock quantity adjustments are posted to CIN7 as a Stock Adjustment based on current CIN7 stock availability.
- Added a configurable expense account setting used when posting RECLASSIFY and ADJUSTMENT stock adjustments to CIN7.
- RECLASSIFY and ADJUSTMENT can now proceed even when CIN7 has no existing availability record for an item/batch/location, using the transaction quantity as the starting stock level (a negative adjustment still fails if there is no matching stock in CIN7).
- Stock adjustment lines posted to CIN7 now show the adjustment/reclassify quantity in the line comment, and the adjustment reference includes the originating Granite transaction IDs, making it easier to trace a CIN7 adjustment back to Granite.
<h4>Fixes:</h4>
- Stock adjustments, reclassifications, and stock takes are now blocked with a clear error when they would result in negative stock on hand, instead of posting an invalid quantity to CIN7.
- Fixed RECLASSIFY posting the adjustment against the wrong item in some cases by ensuring the source line always uses the item being reclassified from.
- Transactions for a MasterItem with a missing or blank code, or with no corresponding CIN7 product ID, now fail with a clear error instead of silently posting against an empty product reference.

