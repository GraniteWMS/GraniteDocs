# Parcel Perfect Service

The Parcel Perfect service lets Granite request courier quotes and convert them into waybills or collections with Parcel Perfect. It's deployed to IIS, like Granite's other applications.

!!! note
    This service only handles courier **quoting and waybill/collection conversion**. There is no downward sync job — Parcel Perfect has no document or master-data feed back into Granite today.

## Setup

### Prerequisites

1. **IIS** — installed and configured with the matching .NET Hosting Bundle
    - See [IIS Getting Started Guide](../../iis/getting-started.md) for installation instructions
2. A connection string to the Granite database — the service creates its own tables in it automatically.
3. Parcel Perfect account details:
    - **AccountNumber** — the Parcel Perfect account code (`accnum` on every request).
    - **TokenId** — the API token (`token_id`) issued by Parcel Perfect.
    - **BaseUrl** — the `ecomService v32` JSON endpoint to call (sandbox vs. production differ).

### Installation

1. **Configure `appsettings.json`**

    ```json
    {
      "ConnectionStrings": {
        "Granite": "Server=YOUR_SERVER;Database=YOUR_GRANITE_DB;User ID=Granite;Password=YOUR_PASSWORD;TrustServerCertificate=true;"
      },
      "ParcelPerfect": {
        "BaseUrl": "https://adpdemo.pperfect.com/ecomService/v32/Json/",
        "TokenId": "YOUR_TOKEN_ID",
        "AccountNumber": "YOUR_ACCOUNT_NUMBER"
      }
    }
    ```

    !!! warning
        The checked-in `appsettings.json` points at Parcel Perfect's **sandbox** environment (`adpdemo.pperfect.com`) with a demo token. Replace `BaseUrl`, `TokenId` and `AccountNumber` with the client's real production values before going live.

2. **Create an IIS site** for the service, following the [Adding a site to IIS](../../iis/getting-started.md#adding-a-site-to-iis) guide, pointed at the published service files.

3. **Verify installation** — `GET /up` should return a healthy status.

## Configuration Reference

| Key | Description | Required |
|-----|-------------|----------|
| `ConnectionStrings:Granite` | Connection string to the Granite SQL Server database | Yes |
| `ParcelPerfect:BaseUrl` | Base URL of Parcel Perfect's `ecomService v32` JSON API | Yes |
| `ParcelPerfect:TokenId` | Parcel Perfect API token (`token_id`) | Yes |
| `ParcelPerfect:AccountNumber` | Parcel Perfect account number (`accnum`), sent on every quote request | Yes |

!!! note "Prepaid credit"
    Converting a quote into a waybill or collection (`AcceptQuote`) requires the Parcel Perfect account to have sufficient **prepaid credit**. If the balance is insufficient, Parcel Perfect rejects the conversion (`errorcode 1`, "Not enough prepaid credit") even though the original quote succeeded.

## API

### `POST /quotes` — Create a quote

Requests a courier quote for a shipment. Persists a `ParcelPerfectQuote` (and its parcel lines) locally and returns Parcel Perfect's rate options.

**Request**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `Reference` | string | Yes | Caller's own reference for the quote |
| `SpecialInstructions` | string | No | |
| `Origin` | QuoteParty | Yes | Sender address |
| `Destination` | QuoteParty | Yes | Receiver address |
| `Parcels` | list of QuoteParcel | Yes | One entry per carton/parcel |
| `WaybillReferences` | list of string | No | Printed on the waybill, one per page |

**QuoteParty**

| Field | Type | Required |
|-------|------|----------|
| `PersonName` | string | Yes |
| `ContactName` | string | No |
| `AddressLine1` | string | Yes |
| `AddressLine2`–`AddressLine4` | string | No |
| `PostalCode` | string | Yes |
| `Phone` | string | No |
| `Cell` | string | No |

**QuoteParcel**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `ItemNo` | string | Yes | |
| `Description` | string | Yes | |
| `Pieces` | int | No | Defaults to 1 |
| `Length`, `Width`, `Height` | decimal | Yes | |
| `ActualMassKg` | decimal | Yes | |

**Response**

| Field | Notes |
|-------|-------|
| `QuoteId` | Granite's own quote ID — used to accept the quote |
| `PpQuoteNumber` | Parcel Perfect's quote number |
| `Rates` | List of `{ ServiceCode, Description, Price }` — the options available to accept |

### `POST /quotes/{QuoteId}/accept` — Accept a quote

Accepts one of the rated service codes and converts the quote into either a waybill or a collection.

**Request**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `QuoteId` | long | Yes | From the create-quote response |
| `ServiceCode` | string | Yes | Must be one of the `Rates` returned for this quote |
| `ConversionType` | `Waybill` (1) / `Collection` (2) | Yes | |
| `SpecialInstructions` | string | No | |
| `PrintWaybill` | bool | No | Defaults to `true` |
| `PrintLabels` | bool | No | Defaults to `true` |
| `CollectionDate` | date | Only for `Collection` | |
| `CollectionStartTime` | string | Only for `Collection` | Exact `"HH:mm"`, e.g. `"08:00"` |
| `CollectionEndTime` | string | Only for `Collection` | Exact `"HH:mm"`, e.g. `"17:00"` |

!!! note
    `CollectionDate`, `CollectionStartTime` and `CollectionEndTime` are required when `ConversionType` is `Collection`, and the two time fields must parse as exact `HH:mm` — send plain strings, not `DateTime`/time-of-day values.

**Response**

| Field | Notes |
|-------|-------|
| `WaybillNumber` | |
| `ConversionType` | Echoes the request |
| `CollectionDate` | Only set for `Collection` |
| `CollectionNumber` | Only set for `Collection` — the new collection request's own number |
| `Total` | Actual charged amount incl. VAT — can differ from the originally quoted price |
| `WaybillPdfBase64` | Present when `PrintWaybill` was requested |
| `LabelsPdfBase64` | Present when `PrintLabels` was requested |

**Validation errors**

| Condition | Result |
|-----------|--------|
| `QuoteId` doesn't exist | 404 |
| Quote isn't in the `Requested` state, or has no Parcel Perfect quote number | 400 |
| `ServiceCode` wasn't one of the rates returned for this quote | 400 |
| Collection fields missing or not `HH:mm` when `ConversionType` is `Collection` | 400 |

## Error Handling

If Parcel Perfect rejects a request (e.g. invalid account, insufficient prepaid credit), the service returns **HTTP 502** carrying Parcel Perfect's own error message.

## Resources

- Calling this service: [SQL CLR Invocation](sql-clr-invocation.md)
