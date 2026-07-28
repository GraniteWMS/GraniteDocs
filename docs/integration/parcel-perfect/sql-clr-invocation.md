# SQL CLR Invocation

Unlike every other integration in this section, Parcel Perfect is not called by the Integration Service through an SDK Provider. Granite calls the [Parcel Perfect service](service.md)'s `/quotes` endpoints directly from SQL Server using two SQL CLR procedures:

- `dbo.clr_ParcelPerfect_CreateQuote` → `POST /quotes`
- `dbo.clr_ParcelPerfect_AcceptQuote` → `POST /quotes/{QuoteId}/accept`

Two CLR functions build the JSON array parameters those procedures need:

- `dbo.parcelPerfect_AddParcel`
- `dbo.parcelPerfect_AddWaybillReference`

!!! note
    See the general [SQLCLR](../../sqlclr/index.md) documentation and [Getting Started](../../sqlclr/getting-started.md) guide for background on how Granite's SQL CLR layer works, and the [Application Security → API Keys](../../security/api-keys.md) page for how `@userName` is used to authenticate the call below.

## System Settings

The procedures resolve the Parcel Perfect service's base URL from the `SystemSettings` table at call time:

| Application | Key | Description |
|-------------|-----|--------------|
| `SQLCLR` | `ParcelPerfectIntegrationServiceUrl` | Base URL of the `Granite.Integration.ParcelPerfect` service (no trailing slash — `/quotes` and `/quotes/{id}/accept` are appended by the CLR procedures) |

```sql
INSERT INTO [dbo].[SystemSettings] ([Application], [Key], [Value], [Description], [ValueDataType], [isEncrypted], [isActive], [AuditDate], [AuditUser])
SELECT 'SQLCLR', 'ParcelPerfectIntegrationServiceUrl', 'http://10.0.0.1:50010', 'GraniteIntegrationParcelPerfect API Address', 'string', 0, 1, GETDATE(), 'AUTOMATION'
WHERE NOT EXISTS (
    SELECT 1 FROM [dbo].[SystemSettings] WHERE [Application] = 'SQLCLR' AND [Key] = 'ParcelPerfectIntegrationServiceUrl'
);
```

!!! note
    Both procedures authenticate the call with `@userName`'s own Granite API key (`Authorization: Bearer ...`), the same way as other CLR-called services — the user executing the procedure must have an API key configured in Granite.

## CLR Procedures

### dbo.clr_ParcelPerfect_CreateQuote

Requests a quote and returns Parcel Perfect's rate options. Build `@parcels` (and, if needed, `@waybillReferences`) with the [CLR functions](#clr-functions) below before calling this.

| Parameter | Required | Description |
|-----------|----------|-------------|
| `@userName` | Yes | Granite username — used to resolve the API key for calling the service |
| `@reference` | Yes | Caller's own reference for the quote |
| `@specialInstructions` | No | |
| `@originPersonName` | Yes | |
| `@originContactName` | No | |
| `@originAddressLine1` | Yes | |
| `@originAddressLine2` | No | |
| `@originAddressLine3` | No | |
| `@originAddressLine4` | No | |
| `@originPostalCode` | Yes | |
| `@originPhone` | No | |
| `@originCell` | No | |
| `@destinationPersonName` | Yes | |
| `@destinationContactName` | No | |
| `@destinationAddressLine1` | Yes | |
| `@destinationAddressLine2` | No | |
| `@destinationAddressLine3` | No | |
| `@destinationAddressLine4` | No | |
| `@destinationPostalCode` | Yes | |
| `@destinationPhone` | No | |
| `@destinationCell` | No | |
| `@parcels` | Yes | JSON array of parcel lines — build with `dbo.parcelPerfect_AddParcel`, e.g. `[{"ItemNo":"1","Description":"Box","Pieces":1,"Length":10,"Width":10,"Height":10,"ActualMassKg":2.5}]` |
| `@waybillReferences` | No | JSON array of strings — build with `dbo.parcelPerfect_AddWaybillReference` |
| `@success` (OUTPUT) | | `bit` — whether the call succeeded |
| `@message` (OUTPUT) | | On success, the raw `CreateQuoteResponse` JSON (`QuoteId`, `PpQuoteNumber`, `Rates[]`) — parse this to get the `QuoteId` and `ServiceCode` options needed for `clr_ParcelPerfect_AcceptQuote`. On failure, an error message. |

### dbo.clr_ParcelPerfect_AcceptQuote

Accepts one of the rated service codes from a prior `clr_ParcelPerfect_CreateQuote` call and converts it into a waybill or a collection.

| Parameter | Required | Description |
|-----------|----------|-------------|
| `@userName` | Yes | |
| `@quoteId` | Yes | `bigint` — the `QuoteId` from the create-quote response |
| `@serviceCode` | Yes | One of the `ServiceCode` values from the create-quote response |
| `@conversionType` | Yes | `'Waybill'` or `'Collection'` (case-insensitive) |
| `@specialInstructions` | No | |
| `@printWaybill` | No | `bit`, defaults to `1` if `NULL` |
| `@printLabels` | No | `bit`, defaults to `1` if `NULL` |
| `@collectionDate` | Only for `Collection` | `datetime` — only the date portion is used |
| `@collectionStartTime` | Only for `Collection` | Exact `"HH:mm"`, e.g. `'08:00'` |
| `@collectionEndTime` | Only for `Collection` | Exact `"HH:mm"`, e.g. `'17:00'` |
| `@success` (OUTPUT) | | |
| `@message` (OUTPUT) | | On success, the response JSON (`WaybillNumber`, `Total`, `WaybillPdfBase64`, `LabelsPdfBase64`, ...). On failure, an error message. |

## CLR Functions

These assist with building the JSON array parameters above — call once per item, threading the result back in as the input, then pass the final value to the procedure. See the "Using the CLR Functions" section of [Getting Started](../../sqlclr/getting-started.md) for the general pattern.

### dbo.parcelPerfect_AddParcel

| Parameter | Required | Description |
|-----------|----------|-------------|
| `@parcels` | Yes | Existing JSON array — `NULL` or empty starts a new array |
| `@itemNo` | Yes | |
| `@description` | Yes | |
| `@pieces` | Yes | `int` |
| `@length`, `@width`, `@height` | Yes | `decimal(19,4)` |
| `@actualMassKg` | Yes | `decimal(19,4)` |

### dbo.parcelPerfect_AddWaybillReference

| Parameter | Required | Description |
|-----------|----------|-------------|
| `@waybillReferences` | Yes | Existing JSON array — `NULL` or empty starts a new array |
| `@waybillReference` | Yes | Reference text to add |

## Examples

### Create a quote

```sql
DECLARE @parcels nvarchar(max)
DECLARE @waybillRefs nvarchar(max)
DECLARE @success bit
DECLARE @message nvarchar(max)

SELECT @parcels = dbo.parcelPerfect_AddParcel(@parcels, 'ITEM001', 'Carton of widgets', 1, 30, 20, 15, 4.5)
SELECT @parcels = dbo.parcelPerfect_AddParcel(@parcels, 'ITEM002', 'Carton of gadgets', 2, 25, 25, 10, 2.0)

SELECT @waybillRefs = dbo.parcelPerfect_AddWaybillReference(@waybillRefs, 'SO-100234')

BEGIN TRY
    EXEC [dbo].[clr_ParcelPerfect_CreateQuote]
        @userName = 'jsmith',
        @reference = 'SO-100234',
        @specialInstructions = 'Handle with care',
        @originPersonName = 'Granite Warehouse',
        @originContactName = NULL,
        @originAddressLine1 = '1 Warehouse Rd',
        @originAddressLine2 = NULL,
        @originAddressLine3 = NULL,
        @originAddressLine4 = NULL,
        @originPostalCode = '6730',
        @originPhone = NULL,
        @originCell = NULL,
        @destinationPersonName = 'John Customer',
        @destinationContactName = NULL,
        @destinationAddressLine1 = '2 Customer Ave',
        @destinationAddressLine2 = NULL,
        @destinationAddressLine3 = NULL,
        @destinationAddressLine4 = NULL,
        @destinationPostalCode = '7700',
        @destinationPhone = NULL,
        @destinationCell = NULL,
        @parcels = @parcels,
        @waybillReferences = @waybillRefs,
        @success = @success OUTPUT,
        @message = @message OUTPUT
END TRY
BEGIN CATCH
    SELECT @message = ERROR_MESSAGE()
    SELECT @success = 0
END CATCH

SELECT @success, @message
-- On success, @message is the CreateQuoteResponse JSON — parse QuoteId and Rates[].ServiceCode from it.
```

### Accept a quote as a waybill

```sql
DECLARE @success bit
DECLARE @message nvarchar(max)

BEGIN TRY
    EXEC [dbo].[clr_ParcelPerfect_AcceptQuote]
        @userName = 'jsmith',
        @quoteId = 123,
        @serviceCode = 'ECO',
        @conversionType = 'Waybill',
        @specialInstructions = NULL,
        @printWaybill = 1,
        @printLabels = 1,
        @collectionDate = NULL,
        @collectionStartTime = NULL,
        @collectionEndTime = NULL,
        @success = @success OUTPUT,
        @message = @message OUTPUT
END TRY
BEGIN CATCH
    SELECT @message = ERROR_MESSAGE()
    SELECT @success = 0
END CATCH

SELECT @success, @message
```

### Accept a quote as a collection

```sql
DECLARE @success bit
DECLARE @message nvarchar(max)

BEGIN TRY
    EXEC [dbo].[clr_ParcelPerfect_AcceptQuote]
        @userName = 'jsmith',
        @quoteId = 123,
        @serviceCode = 'ECO',
        @conversionType = 'Collection',
        @specialInstructions = NULL,
        @printWaybill = 1,
        @printLabels = 1,
        @collectionDate = '2026-08-01',
        @collectionStartTime = '08:00',
        @collectionEndTime = '17:00',
        @success = @success OUTPUT,
        @message = @message OUTPUT
END TRY
BEGIN CATCH
    SELECT @message = ERROR_MESSAGE()
    SELECT @success = 0
END CATCH

SELECT @success, @message
```
