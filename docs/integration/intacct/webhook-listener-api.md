# Webhook Listener API

The Webhook Listener API is a small, standalone ASP.NET Core web service that lets Sage Intacct (or an integration middleware layer) notify Granite in real time that a document has changed. It queues a record for the [Integration Jobs](integration-jobs.md) to pick up on their next run, rather than waiting for the job's normal polling interval or its catch-up scan of all open documents.

This service does not replace the Integration Jobs — it only queues a notification. The Integration Jobs still fetch the full document from the Sage Intacct XML API before syncing it into Granite.

## Network Requirements

Sage Intacct is a cloud SaaS product. For its Smart Events to reach this service, **the Webhook Listener API's endpoint must be reachable from the internet**.

!!! warning "Customer Responsibility"
    Granite is not responsible for exposing this service to the internet. The customer's IT team must arrange the necessary network ingress — DNS record, firewall rule, reverse proxy, TLS certificate, etc. — so that Sage Intacct can reach the deployed endpoint (e.g. `https://your-exposed-hostname/integration-queue/document`). This must be arranged and confirmed working before Smart Events are configured in Sage Intacct (see [Configuring Sage Intacct Smart Events](#configuring-sage-intacct-smart-events) below).

## Architecture Overview

- **ASP.NET Core / ServiceStack** - REST API for receiving webhook notifications
- **SQL Server** - writes to the same `IntegrationDocumentQueue` table used by the Integration Jobs
- **API Key Authentication** - requests must present a valid, pre-configured API key

## How it fits with the Integration Jobs

Both this service and the Integration Jobs project share the `IntegrationDocumentQueue` table:

1. A document changes in Sage Intacct.
2. Sage Intacct (or middleware) calls this API's `/integration-queue/document` endpoint with the document's identifiers.
3. The service inserts a row into `IntegrationDocumentQueue` with `Status = 'ENTERED'`.
4. On its next run, the relevant Integration Job (matched by `DocumentType`) selects rows where `Status = 'ENTERED'`, fetches the full document from Intacct, and syncs it into Granite — updating the queue row to `POSTED` or `FAILED`.

If a row already exists for the same `DocumentType` and `ErpIdentification` with `Status = 'ENTERED'` (i.e. it hasn't been processed yet), the request is rejected as a duplicate rather than queuing a second entry.

## Setup

### Configure Connection String

Edit `appsettings.json` in the published folder to point to the Granite database that owns the `IntegrationDocumentQueue` table (the same database used by the Integration Jobs):

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER;Database=YOUR_GRANITE_DB;Integrated Security=true;TrustServerCertificate=true;"
  }
}
```

### Configure API Keys

At least one API key must be configured, or the service will fail to start:

```json
{
  "ApiKeys": {
    "SageIntacct": "your-secret-key-here"
  }
}
```

Multiple named keys can be configured if more than one caller needs access. Any of the configured values will be accepted as a valid `ApiKey`.

!!! note
    Treat these keys as secrets. Do not communicate keys insecurely.

### Deployment

Deploy behind IIS in the same way as the other Sage Intacct services — see [IIS Getting Started](../../iis/getting-started.md).

## Configuring Sage Intacct Smart Events

Once the service is deployed and reachable from the internet (see [Network Requirements](#network-requirements)), Sage Intacct needs to be configured to actually call it. Sage Intacct doesn't do this on its own — it requires **Smart Events** to be loaded into the company.

Smart Events are defined in a **Custom ERP Package**: an XML file that Sage Intacct imports via Platform Services. Each `smartLink` in the package watches an Intacct object for `add`, `delete`, and `set` events and, when one fires, issues an HTTP POST to a target URL — in this case, this service's `/integration-queue/document` endpoint.

A template package, `GraniteSmartEventsTemplate.xml`, is provided as a starting point and covers the same five document types used by the [Integration Jobs](integration-jobs.md#supported-document-types):

| Intacct Object | Intacct Document Type | Events | Granite `DocumentType` |
|-----------------|-----------------------|--------|-------------------------|
| sodocument | Sales Order-Inventory | add, delete, set | ORDER |
| podocument | Purchase Order-Inventory | add, delete, set | RECEIVING |
| invdocument | SYS-Warehouse Transfer Out | add, delete, set | TRANSFER |
| invdocument | Inv Transfer Out Qty Value | add, delete, set | INTRANSIT |
| invdocument | Inv Transfer In Qty Value | add, delete, set | RECEIPT |

Each `smartLink`'s `httpPostAction` sends arguments that map directly onto this service's request fields, using Intacct merge-field syntax to pull values from the document that triggered the event:

| Argument | Value | Notes |
|----------|-------|-------|
| ApiKey | Static value | Must match one of the values configured under `ApiKeys` in this service's `appsettings.json` |
| LastUpdateDateTime | `{!<OBJECT>.WHENMODIFIED!}` | |
| ErpIdentification | `{!<OBJECT>.RECORDNO!}` | |
| DocumentNumber | `{!<OBJECT>.DOCNO!}` | |
| DocumentType | Static value | One of `ORDER`, `RECEIVING`, `INTRANSIT`, `RECEIPT`, `TRANSFER` |

Each `smartLink` also has a `condition` that filters on `MEGAENTITYID`, so the event only fires for the Sage Intacct entity being integrated with Granite — this matters in multi-entity companies, where otherwise every entity's documents would trigger a webhook call:

```
{!SODOCUMENT.MEGAENTITYID!}==400
```

### Example smartLink

```xml
<smartLink>
    <smartLinkId>GRANITE_SODOCUMENT_MODIFIED</smartLinkId>
    <type>workflow</type>
    <ownerObject>sodocument</ownerObject>
    <documentType>Sales Order-Inventory</documentType>
    <events>
        <event>add</event>
        <event>delete</event>
        <event>set</event>
    </events>
    <target>https://YOUR-EXPOSED-URL/integration-queue/document</target>
    <renderDetails>
        <workflow>
            <action>
                <httpPostAction>
                    <method>post</method>
                    <arguments>
                        <argument>
                            <argument>ApiKey</argument>
                            <value>YOUR-API-KEY</value>
                        </argument>
                        <argument>
                            <argument>LastUpdateDateTime</argument>
                            <value>{!SODOCUMENT.WHENMODIFIED!}</value>
                        </argument>
                        <argument>
                            <argument>ErpIdentification</argument>
                            <value>{!SODOCUMENT.RECORDNO!}</value>
                        </argument>
                        <argument>
                            <argument>DocumentNumber</argument>
                            <value>{!SODOCUMENT.DOCNO!}</value>
                        </argument>
                        <argument>
                            <argument>DocumentType</argument>
                            <value>ORDER</value>
                        </argument>
                    </arguments>
                    <requestTimeout>5</requestTimeout>
                </httpPostAction>
            </action>
            <condition>{!SODOCUMENT.MEGAENTITYID!}==YOUR_ENTITY_ID</condition>
        </workflow>
    </renderDetails>
    <active>true</active>
</smartLink>
```

The full template repeats this pattern for `podocument` and `invdocument`, one `smartLink` per row in the table above.

### Required customization per client

The template must be edited before it's loaded into a client's Sage Intacct company — none of the following are shared across clients:

1. **`target`** — every `smartLink`'s target URL must be updated to the actual internet-facing URL the customer's IT team has exposed (see [Network Requirements](#network-requirements)).
2. **`ApiKey` argument** — must match a value configured under `ApiKeys` in that deployment's Webhook Listener API `appsettings.json`.
3. **`condition` (`MEGAENTITYID`)** — must match the Sage Intacct entity ID (or entity code) of the entity being integrated with Granite, found in Sage Intacct under Company > Setup > Entities.

### Loading the package into Sage Intacct

Custom ERP Packages are uploaded and activated through Sage Intacct's Platform Services. Refer to Sage Intacct's Smart Events / Custom ERP Package documentation, or handover to your Intacct implementation partner to import the package for you. 

## Resources

- **Integration Jobs**: See [Integration jobs](integration-jobs.md) for how queued documents are processed
- **Developer Documentation**: [https://developer.intacct.com/](https://developer.intacct.com/)
