# Omni (discontinued)

!!! note 
    We do not sell OMNI to new customers. OMNI support, documentation, and functionality are available exclusively to existing customers.

![maturity](https://img.shields.io/badge/maturity-low-cd242c)

![production_readiness](https://img.shields.io/badge/production_readiness-partial-cd242c)

![clients](https://img.shields.io/badge/live_clients-yes-449336)

![status](https://img.shields.io/badge/development_status-none-cd242c)

![note](https://img.shields.io/badge/product_support-low-cd242c)


## Setup

1. **Copy** everything in the `Providers\Omni` folder into Integration Service folder (root folder).

2. Ensure `SDKProvider.xml` setup or copied correctly
    ```xml
    <module name="Provider">
    <bind
        service="Granite.Integration.Contract.IProvider, Granite.Integration.Contract"
        to="Granite.Integration.OMNI.Provider, Granite.Integration.OMNI"/>
    </module>
    ```

3. Configure your connection string and endpoint in the `Granite.Integration.Web.exe.config` file

## Settings

The settings for Omni are configured in the SystemSettings table. The IntegrationService will pick up the settings using the Application name specified in it's `.config` file:
```xml
<add key ="SystemSettingsApplicationName" value="IntegrationOmni"/>
```
If this setting is missing from the config file or left empty, the IntegrationService will default to using `IntegrationOmni` as the SystemSettingsApplicationName

You can browse the IntegrationService's `/config` page to have the IntegrationService create the default settings in the SystemSettings table for you.

!!! warning "Version 7: https and authentication"
    As of version 7 the Integration Service:

    - **Runs as https.** Set the `EndPoint` setting in the `.config` file to an https address, e.g. `https://+:40091/`. A certificate must be bound to the port before the service will start. [Scaffold](../../scaffold/manual.md) does this for you - if it fails, or you are not using Scaffold, see [Certificates for Windows Services](../../security/service-certificates.md).
    - **Needs a ServiceStack license key**, set in the `servicestack:license` setting in the `.config` file or in the `SERVICESTACK_LICENSE` environment variable on the server. The service will not start without it.
    - **Requires authentication.** SQLCLR sends the [API key](../../security/api-keys.md) of the user that is passed to the `clr_Integration...` procedures, and the ProcessApp sends the token of the user that is logged in. The `/config` page can no longer be opened without credentials, and the service does not have a login page - call it with a tool that can send your API key in the `X-Api-Key` header, or log in first by posting your Granite user name and password to `/auth/credentials`.
    - **Must use the same Granite database as the Business API**, so that it can validate the ProcessApp's token.

    See the [Authentication & HTTPS Upgrade Guide](../../updates/V7/auth-https-upgrade.md) when upgrading an existing site.

The script to insert the default settings is also located in the GraniteDatabase release:
```
~\GraniteDatabase\Data\SystemSettings\SystemSettingsOmni.sql
```

!!! note 
    To pick up any changes to the SystemSettings table, the IntegrationService will need to be restarted.

### Example SystemSettings in database

| Application       | Key                           | Value | Description                                                                                   | 
|-------------------|-------------------------------|-------|-----------------------------------------------------------------------------------------------|
| IntegrationOmni   | Host                          |       | Server name or IP of the server where the Omni API is hosted                                  |
| IntegrationOmni   | Port                          |       | Port number that the Omni API is running on                                                   |
| IntegrationOmni   | UserName                      |       | Omni user name that is used to transact via the API                                           |
| IntegrationOmni   | Password                      |       | Password for the Omni user                                                                    |
| IntegrationOmni   | CompanyName                   |       | Omni company name to post to                                                                  |
| IntegrationOmni   | AdjustmentAccount             |       | Account that adjustments will post to                                                         |
| IntegrationOmni   | ScrapAccount                  |       | Account that scrap transactions will post to                                                  |
| IntegrationOmni   | IntransitWarehouse            |       | The intransit warehouse that will be used                                                     |
| IntegrationOmni   | PostDynamicTransferReceipt    |       | true or false. Determines whether Omni transfer is auto posted for Granite DynamicTransfers   |

## Integration Methods

!!! note 
    This is the complete list of supported integration methods at present. 
    There is no support for manufacturing or receiving at this time.

### ADJUSTMENT

- Granite: Transaction type **ADJUSTMENT** 
- Omni: **Stock Journal Entry**
- IntegrationPost:
    - Not supported, will always post Stock Journal Entry 
- Supports:
    - AdjustmentAccount SystemSetting

| Granite                           | Omni API                              | Required | Behavior |
|-----------------------------------|---------------------------------------|----------|-----------|
| MasterItem Code                   | stockjournalentry.stock_code          | Y        ||
| FromLocation                      | stockjournalentry.warehouse_code      | Y        ||
| TransactionDocumentReference      | stockjournalentry.reference           | Y        ||
| Comment                           | stockjournalentry.narrative           | N        ||
| ActionQty                         | stockjournalentry.quantity            | Y        ||
| AdjustmentAccount SystemSetting   | stockjournalentry.to_ledger_account   | Y        ||
|                                   | stockjournalentry.transaction_type    | Y        | Will be set to "Adjustment In" or "Adjustment Out" based on whether the transaction was an increase or decrease in Granite |


### TRANSFER

- Granite: Transaction type **TRANSFER** 
- Omni: **Warehouse Transfer**
- IntegrationPost:
    - Not supported
- Supports:
    - IntransitWarehouse SystemSetting

| Granite                           | Omni API                                              | Required  | Behavior |
|-----------------------------------|-------------------------------------------------------|-----------|-----------|
| Document                          | inter_warehouse_transfer.req_no                       | Y         ||
| IntransitWarehouse SystemSetting  | inter_warehouse_transfer.in_transit_warehouse_code    | Y         ||
| User                              | inter_warehouse_transfer.internal_reference           | Y         ||
| DocumentDescription               | inter_warehouse_transfer.delivery_details             | N         ||
| LineNumber                        | inter_warehouse_transfer_lines.line_no                | Y         ||
| MasterItem Code                   | inter_warehouse_transfer_lines.stock_code             | Y         ||
| ActionQty                         | inter_warehouse_transfer_lines.quantity               | Y         ||


### TRANSFERRECEIPT

!!! note
    The Omni API does not support partial processing of a transfer. When you post a transfer receipt, it simply completes the transfer in Omni.

    For this reason, no transaction information is posted to Omni when a transfer receipt is posted.

- Granite: Transaction type **TRANSFER** 
- Omni: **Warehouse Transfer**
- IntegrationPost:
    - Not supported

### TRANSFERDYNAMIC

- Granite: Transaction type **TRANSFERDYNAMIC** 
- Omni: **Warehouse Requisition**
- IntegrationPost:
    - If true, processes a warehouse transfer against the created requisition
- Supports:
    - IntransitWarehouse SystemSetting

| Granite                           | Omni API                                                  | Required  | Behavior |
|-----------------------------------|-----------------------------------------------------------|-----------|-----------|
| Document                          | inter_warehouse_transfer.req_no                           | Y         ||
| FromLocation                      | inter_warehouse_requisition.source_warehouse_code         | Y         ||
| ToLocation                        | inter_warehouse_requisition.destination_warehouse_code    | Y         ||
| IntransitWarehouse SystemSetting  | inter_warehouse_requisition.in_transit_warehouse_code     | Y         ||
| User                              | inter_warehouse_requisition.internal_reference            | Y         ||
| DocumentDescription               | inter_warehouse_requisition.delivery_details              | N         ||
| LineNumber                        | inter_warehouse_requisition_lines.line_no                 | Y         ||
| MasterItem Code                   | inter_warehouse_requisition_lines.stock_code              | Y         ||
| ActionQty                         | inter_warehouse_requisition_lines.quantity                | Y         ||

### SCRAP

- Granite: Transaction type **ADJUSTMENT** 
- Omni: **Stock Journal Entry**
- IntegrationPost:
    - Not supported, will always post Stock Journal Entry 
- Supports:
    - ScrapAccount SystemSetting

| Granite                           | Omni API                              | Required | Behavior |
|-----------------------------------|---------------------------------------|----------|-----------|
|                                   | stockjournalentry.reference           | Y        | Will be set to "SCRAP" |
|                                   | stockjournalentry.transaction_type    | Y        | Will be set to "Issue" |
| MasterItem Code                   | stockjournalentry.stock_code          | Y        ||
| FromLocation                      | stockjournalentry.warehouse_code      | Y        ||
| Comment                           | stockjournalentry.narrative           | N        ||
| ActionQty                         | stockjournalentry.quantity            | Y        ||
| ScrapAccount SystemSetting        | stockjournalentry.to_ledger_account   | Y        ||

### PICK

- Granite: Transaction type **PICK** 
- Omni: **Delivery Note** / **Invoice**
- IntegrationPost:
    - If true, posts an invoice instead of a delivery note

Delivery note mapping:

| Granite                           | Omni API                                              | Required  | Behavior |
|-----------------------------------|-------------------------------------------------------|-----------|-----------|
|                                   | delivery_note.source_type                             |           | Will be set to "ORDER" |
|                                   | delivery_note.customer_branch_code                    |           | Will be set to "HO" |
| Document                          | delivery_note.source_reference                        | Y         ||
| DocumentTradingPartnerCode        | delivery_note.customer_account_code                   | Y         ||
| FromLocation                      | delivery_note.warehouse_code                          | Y         ||
|                                   | delivery_note_lines.line_type                         |           | Will be set to "Stock" |
| LineNumber                        | delivery_note_lines.line_no                           | Y         ||
| MasterItem Code                   | delivery_note_lines.stock_code                        | Y         ||
| FromLocation                      | delivery_note_lines.warehouse_code                    | Y         ||
| ActionQty                         | delivery_note_lines.quantity                          | Y         ||

Invoice mapping:

| Granite                           | Omni API                                              | Required  | Behavior |
|-----------------------------------|-------------------------------------------------------|-----------|-----------|
|                                   | invoice.source_type                                   |           | Will be set to "ORDER" |
| Document                          | invoice.source_reference                              | Y         ||
| DocumentTradingPartnerCode        | invoice.customer_account_code                         | Y         ||
|                                   | invoice_lines.line_type                               |           | Will be set to "Stock" |
| LineNumber                        | invoice_lines.line_no                                 | Y         ||
| MasterItem Code                   | invoice_lines.stock_code                              | Y         ||
| ActionQty                         | invoice_lines.quantity                                | Y         ||
