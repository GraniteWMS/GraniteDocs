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

