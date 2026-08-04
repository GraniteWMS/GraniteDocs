# Parcel Perfect Service

The Parcel Perfect service lets Granite request courier quotes and convert them into waybills or collections with Parcel Perfect. It's deployed to IIS, like Granite's other applications.

!!! note
    This service only handles courier **quoting and waybill/collection conversion**. There is no downward sync job — Parcel Perfect has no document or master-data feed back into Granite today.

## Setup

### Prerequisites

1. **IIS** — installed and configured with the [ASP.NET Core 10 Hosting Bundle](https://dotnet.microsoft.com/en-us/download/dotnet/10.0)
    - See [IIS Getting Started Guide](../../iis/getting-started.md) for general IIS installation instructions
2. A connection string to the Granite database — the service creates its own tables in it automatically.
3. Parcel Perfect account details, set in the Granite `SystemSettings` table (see [Configuration Reference](#configuration-reference)):
    - **AccountNumber** — the Parcel Perfect account code (`accnum` on every request). Defaults to `WMS001` if not set.
    - **TokenId** — the API token (`token_id`) issued by Parcel Perfect.
    - **BaseUrl** — the `ecomService v32` JSON endpoint to call (sandbox vs. production differ).

### Installation

1. **Configure `appsettings.json`**

    ```json
    {
      "ConnectionStrings": {
        "Granite": "Server=YOUR_SERVER;Database=YOUR_GRANITE_DB;User ID=Granite;Password=YOUR_PASSWORD;TrustServerCertificate=true;"
      }
    }
    ```

2. **Create an IIS site** for the service, following the [Adding a site to IIS](../../iis/getting-started.md#adding-a-site-to-iis) guide, pointed at the published service files.

3. **Start the site once** — on first startup the service seeds any missing rows from [Configuration Reference](#configuration-reference) into `SystemSettings` with blank/default values. No manual `INSERT` is needed.

4. **Update the seeded `SystemSettings` rows** with the real values, then restart the IIS site.

5. **Verify installation** — `GET /up` should return a healthy status.

## Configuration Reference

| Key | Where | Description | Seeded default | Required |
|-----|-------|--------------|-----------------|----------|
| `ConnectionStrings:Granite` | `appsettings.json` | Connection string to the Granite SQL Server database | — (not seeded) | Yes |
| `BaseUrl` | `SystemSettings` (`Application` = `Granite.Integration.ParcelPerfect`) | Base URL of Parcel Perfect's `ecomService v32` JSON API | `https://adpdemo.pperfect.com/ecomService/v32/Json/` (sandbox) | Yes |
| `TokenId` | `SystemSettings` (`Application` = `Granite.Integration.ParcelPerfect`) | Parcel Perfect API token (`token_id`) | *(blank)* | Yes |
| `AccountNumber` | `SystemSettings` (`Application` = `Granite.Integration.ParcelPerfect`) | Parcel Perfect account number (`accnum`), sent on every quote request | `WMS001` | No |
| `ParcelPerfectIntegrationServiceUrl` | `SystemSettings` (`Application` = `SQLCLR`) | Base URL of this service itself, used by the [SQL CLR](#sql-clr) procedures (no trailing slash — `/quotes` and `/quotes/{id}/accept` are appended by the CLR procedures) | *(blank)* | Yes, for SQL CLR callers |

!!! note
    Unlike the connection string, all of these `SystemSettings` rows — including `ParcelPerfectIntegrationServiceUrl`, which is consumed by the SQL CLR procedures rather than this service — are seeded automatically by the service on first startup and are loaded once at startup, so restart the IIS site after changing them.

## SQL CLR

Unlike every other integration in this section, Parcel Perfect is not called by the Integration Service through an SDK Provider. Granite calls the [Parcel Perfect service](service.md)'s `/quotes` endpoints directly from SQL Server using two SQL CLR procedures:

- `dbo.clr_ParcelPerfect_CreateQuote` → `POST /quotes`
- `dbo.clr_ParcelPerfect_AcceptQuote` → `POST /quotes/{QuoteId}/accept`

Two CLR functions build the JSON array parameters those procedures need:

- `dbo.parcelPerfect_AddParcel`
- `dbo.parcelPerfect_AddWaybillReference`

!!! note
    See the general [SQLCLR](../../sqlclr/index.md) documentation and [Getting Started](../../sqlclr/getting-started.md) guide for background on how Granite's SQL CLR layer works, and the [Application Security → API Keys](../../security/api-keys.md) page for how `@userName` is used to authenticate the call below.

The procedures resolve the Parcel Perfect service's own base URL from the `ParcelPerfectIntegrationServiceUrl` `SystemSettings` row at call time — see [Configuration Reference](#configuration-reference) for that setting (it's seeded automatically, along with the service's own settings).

!!! note
    Both procedures authenticate the call with `@userName`'s own Granite API key (`Authorization: Bearer ...`), the same way as other CLR-called services — the user executing the procedure must have an API key configured in Granite.

### CLR Procedures

#### dbo.clr_ParcelPerfect_CreateQuote

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
| `@message` (OUTPUT) | | On success, the raw `CreateQuoteResponse` JSON — parse `Rates[]` from it to get the `ServiceCode` options for `clr_ParcelPerfect_AcceptQuote`. On failure, an error message. |
| `@quoteId` (OUTPUT) | | `bigint` — the new quote's ID, needed for `clr_ParcelPerfect_AcceptQuote`. `0` if the call failed or the response couldn't be parsed. |
| `@quoteNumber` (OUTPUT) | | Parcel Perfect's own quote number (`PpQuoteNumber`). `NULL` if the call failed or the response couldn't be parsed. |

#### dbo.clr_ParcelPerfect_AcceptQuote

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
| `@waybillNumber` (OUTPUT) | | The generated waybill number. `NULL` if the call failed or the response couldn't be parsed. |

### CLR Functions

These assist with building the JSON array parameters above — call once per item, threading the result back in as the input, then pass the final value to the procedure. See the "Using the CLR Functions" section of [Getting Started](../../sqlclr/getting-started.md) for the general pattern.

#### dbo.parcelPerfect_AddParcel

| Parameter | Required | Description |
|-----------|----------|-------------|
| `@parcels` | Yes | Existing JSON array — `NULL` or empty starts a new array |
| `@itemNo` | Yes | |
| `@description` | Yes | |
| `@pieces` | Yes | `int` |
| `@length`, `@width`, `@height` | Yes | `decimal(19,4)` |
| `@actualMassKg` | Yes | `decimal(19,4)` |

#### dbo.parcelPerfect_AddWaybillReference

| Parameter | Required | Description |
|-----------|----------|-------------|
| `@waybillReferences` | Yes | Existing JSON array — `NULL` or empty starts a new array |
| `@waybillReference` | Yes | Reference text to add |

### Examples

#### Create a quote

```sql
DECLARE @parcels nvarchar(max)
DECLARE @waybillRefs nvarchar(max)
DECLARE @success bit
DECLARE @message nvarchar(max)
DECLARE @quoteId bigint
DECLARE @quoteNumber nvarchar(200)
DECLARE @itemNo nvarchar(50)
DECLARE @description nvarchar(200)
DECLARE @pieces int
DECLARE @length decimal(19,4)
DECLARE @width decimal(19,4)
DECLARE @height decimal(19,4)
DECLARE @actualMassKg decimal(19,4)

SELECT @itemNo = 'ITEM001', @description = 'Carton of widgets', @pieces = 1, @length = 30, @width = 20, @height = 15, @actualMassKg = 4.5
SELECT @parcels = dbo.parcelPerfect_AddParcel(@parcels, @itemNo, @description, @pieces, @length, @width, @height, @actualMassKg)

SELECT @itemNo = 'ITEM002', @description = 'Carton of gadgets', @pieces = 2, @length = 25, @width = 25, @height = 10, @actualMassKg = 2.0
SELECT @parcels = dbo.parcelPerfect_AddParcel(@parcels, @itemNo, @description, @pieces, @length, @width, @height, @actualMassKg)

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
        @message = @message OUTPUT,
        @quoteId = @quoteId OUTPUT,
        @quoteNumber = @quoteNumber OUTPUT
END TRY
BEGIN CATCH
    SELECT @message = ERROR_MESSAGE()
    SELECT @success = 0
END CATCH

SELECT @success, @message, @quoteId, @quoteNumber
-- @quoteId is what you pass to clr_ParcelPerfect_AcceptQuote. On success, @message is
-- also the raw CreateQuoteResponse JSON — parse Rates[].ServiceCode from it.
```

#### Accept a quote as a waybill

```sql
DECLARE @success bit
DECLARE @message nvarchar(max)
DECLARE @waybillNumber nvarchar(200)

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
        @message = @message OUTPUT,
        @waybillNumber = @waybillNumber OUTPUT
END TRY
BEGIN CATCH
    SELECT @message = ERROR_MESSAGE()
    SELECT @success = 0
END CATCH

SELECT @success, @message, @waybillNumber
```

#### Accept a quote as a collection

```sql
DECLARE @success bit
DECLARE @message nvarchar(max)
DECLARE @waybillNumber nvarchar(200)

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
        @message = @message OUTPUT,
        @waybillNumber = @waybillNumber OUTPUT
END TRY
BEGIN CATCH
    SELECT @message = ERROR_MESSAGE()
    SELECT @success = 0
END CATCH

SELECT @success, @message, @waybillNumber
```

## Receiving Webhooks

!!! note
    Receiving webhooks is a **separate capability** from quoting and waybill/collection conversion above. It has its own endpoint, its own database tables, and no configuration dependency on the `BaseUrl`/`TokenId`/`AccountNumber` settings — it can be enabled and exercised entirely independently of whether this service is being used to create quotes at all.

Once enabled, Parcel Perfect calls **this service** to push waybill status updates, tracking history and proof-of-delivery documents as they happen, rather than Granite having to poll for them.

### 1. Create a dedicated Granite user for Parcel Perfect

The webhook endpoint requires the same Granite API key authentication as the rest of this service — see [Application Security → API Keys](../../security/api-keys.md).

!!! tip
    Create a **dedicated Granite user for Parcel Perfect** and issue the API key from that account, rather than reusing a real person's key. This keeps the credential Parcel Perfect holds independent of any individual's login, and lets it be rotated or revoked without affecting anyone else.

### 2. Arrange inbound access from Parcel Perfect

For Parcel Perfect's servers to reach this service, they need inbound network access to wherever it's hosted on the customer's network.

!!! warning "Ingress into the customer's network"
    This is almost always a firewall/reverse-proxy/DNS change outside of Granite's control. Raise it with the **customer's IT team** early — it's usually the longest lead-time item in getting webhooks live.

### 3. Give Parcel Perfect the endpoint details

Webhook delivery is configured on **Parcel Perfect's side**, not ours — there's no API in this service to register a callback URL. Provide Parcel Perfect (via their support/account team) with:

- This service's public URL for `POST /webhooks/parcelperfect`
- The dedicated Granite API key from step 1, for them to send as the `Authorization: Bearer` header on every webhook call

Once Parcel Perfect has both, they'll start pushing events as they occur — no further setup is needed on the Granite side, and this can be enabled independently of whether the service is also being used to create quotes.