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

## 2026-08-14

### SDK Provider

<h4>Version: 7.0.2.2</h4>
<h4>Changes:</h4>
- Inventory receipt (TAKEON), adjustment, reclassify, scrap, replenish/move, and purchase order receipt (RECEIVE) postings now carry the originating Granite transaction ID as the SYSPRO line reference, so posted records can be traced back to Granite.
- For transfer postings (INVT and GIT TRANSFER) where the reference field was already used for the document description, the Granite transaction ID is now carried in the notation field instead.
- Consolidated postings (CONSUME material issues and MANUFACTURE job receipts), where multiple Granite transactions can be grouped into a single posted line, now include a comma-separated list of all source transaction IDs.
- GIT stock transfers now populate the companion sales order transfer document's reference with the source transaction IDs, since the primary transfer document has no field available for this.
