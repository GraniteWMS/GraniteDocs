# Parcel Perfect

![maturity](https://img.shields.io/badge/maturity-low-cd242c)

![production_readiness](https://img.shields.io/badge/production_readiness-no-cd242c)

![clients](https://img.shields.io/badge/live_clients-no-cd242c)

![status](https://img.shields.io/badge/development_status-active-365893)

Parcel Perfect is a third-party courier quoting and waybill/collection management platform, accessed here via its `ecomService v32` JSON API. This integration lets Granite request a courier quote for a shipment and, once a rate is accepted, convert it into either a waybill or a scheduled collection.

## How this differs from other Granite integrations

Every other integration in this section is called by Granite's Integration Service through an [SDK Provider](../accpac/sdk-provider.md), with downward sync handled by [Scheduler](../../scheduler/manual.md) integration jobs. **Parcel Perfect does not use either of those.**

Instead, Granite calls this service's API directly from SQL Server using **SQL CLR** — not through the Integration Service pipeline.

See [Service → SQL CLR](service.md#sql-clr) for the procedures, parameters and worked examples, and the general [SQLCLR](../../sqlclr/index.md) reference for background on Granite's SQL CLR layer.

## What it does

- Requests a courier quote for a shipment (parcels + origin/destination) and returns Parcel Perfect's rate options.
- Accepts one of the quoted rates and converts it into either:
    - a **Waybill** — collected on the courier's next scheduled run, or
    - a **Collection** — a specific pickup date and time window is requested.
- Optionally returns the generated waybill and label documents (base64-encoded PDFs) in the accept response.
- Receives waybill status, tracking and proof-of-delivery **webhooks** pushed from Parcel Perfect. This is a separate capability from quoting above — it can be enabled independently and has no dependency on the quoting/accept configuration.

See [Service](service.md) for setup, configuration and the full API reference, and [Service → Receiving Webhooks](service.md#receiving-webhooks) for the webhook endpoint specifically.

## Resources

- Parcel Perfect sandbox: `https://adpdemo.pperfect.com/ecomService/v32/Json/`
- Parcel Perfect demo dashboard: [https://adpdemo.pperfect.com/pponline/](https://adpdemo.pperfect.com/pponline/)
