# Integration Jobs

Integration jobs are a special type of [Scheduler](../../scheduler/manual.md) job called [injected jobs](../../scheduler/manual.md#injected-jobs-integration-jobs). 
See below for information for specifics on how document and master data jobs work

## Supported document types 
<div class="grid cards" markdown>

-   ORDER
    ---
    LightSpeed type: Sales Order

-   RECEIVING
    ---
    LightSpeed type: Purchase Order

-   TRANSFER
    ---
    LightSpeed type: Transfer Order

</div>

## How it works
### Document Jobs
The LightSpeed integration connects to the LightSpeed REST API using OAuth 2.0 authentication. The integration jobs check for updated documents by comparing the last update time stored in Granite with the TimeStamp field from LightSpeed.

The workflow operates as follows:
1. Jobs retrieve the last successful integration timestamp from Granite
2. Query the LightSpeed API for documents updated since the last timestamp
3. Compare retrieved documents with those currently queued for integration
4. Queue new or updated documents for integration into Granite
5. Process queued documents by fetching full document details and updating Granite entities
6. Update the integration timestamp upon successful completion

Error handling includes validation of required fields, connection testing, and detailed logging of any failures.


#### Mapping logic per job

##### Sales Order (ORDER)
  - Status: completed == "true" -> ENTERED; else ONHOLD
  - Header:
    - ERPIdentification = saleID
    - Number = SalesOrderPrefix + saleID
    - Description = referenceNumber
    - isActive = archived != "true"
    - ERPLocation = shopID
    - TradingPartnerCode/Description from ShipTo/Customer
  - Lines:
    - ERPIdentification = saleLineID; LineNumber = saleLineID
    - ERP_ItemID = itemID; Qty = unitQuantity; FromLocation = shopID
    - Completed/Cancelled = false

##### Purchase Order (RECEIVING)
  - Status: complete == "true" -> COMPLETE; else ENTERED
  - Header:
    - ERPIdentification = orderID
    - Number = PurchaseOrderPrefix + orderID
    - Description = stockInstructions; ERPLocation = shopID
    - isActive = archived != "true"
    - TradingPartnerCode/Description = Vendor.name
  - Lines:
    - ERPIdentification = orderLineID; LineNumber = 10,20,..
    - ERP_ItemID = itemID; Qty = quantity; ToLocation = shopID
    - Completed = (quantity == numReceived); Cancelled = false

##### Transfer Order (TRANSFER)
  - Status: always ENTERED
  - Header:
    - ERPIdentification = transferID
    - Number = TransferPrefix + transferID
    - Description = "{SendingShop}>{ReceivingShop} {note}" (trimmed)
    - isActive = archived != "true"; ERPLocation = sendingShopID
  - Lines (from TransferItems):
    - ERPIdentification = transferItemID; LineNumber = 10,20,..
    - ERP_ItemID = itemID; Qty = sent; FromLocation = sendingShopID; ToLocation = receivingShopID

#### Document Statuses

Based on sc/Granite.Integration.LightSpeed.Job/Granite.Integration.LightSpeed.Job/Repository/LightSpeedRepository.cs:

For Sales Orders (Sale):

| LightSpeed Field | Condition | Granite Status |
|---|---|---|
| completed | == "true" | ENTERED |
| completed | != "true" | ONHOLD |

For Purchase Orders (Order):

| LightSpeed Field | Condition | Granite Status |
|---|---|---|
| complete | == "true" | COMPLETE |
| complete | != "true" | ENTERED |

For Transfer Orders (InventoryTransfer):

| LightSpeed Field | Condition | Granite Status |
|---|---|---|
| n/a | always | ENTERED |

### Master data jobs
The master data synchronization handles both MasterItems and ItemShop (inventory) data.

#### MasterItem Job
  - Item -> Granite MasterItem mapping:
    - ERPIdentification = itemID
    - Code/FormattedCode = systemSku
    - Description = description
    - isActive = archived == "false"
    - Type = itemType
    - UOM = "EACH"
    - Category = Category.name
    - Aliases from ean/upc when present
  - Updateable fields: Code, FormattedCode, Description, isActive, UOM, Category

#### ItemShop Job
  - ItemShop -> Granite inventory snapshot:
    - itemShopID, qoh, sellable, backorder, componentQoh, componentBackorder, reorderPoint, reorderLevel, timeStamp, itemID, shopID
  - Initial sync: qoh > 0; Incremental: timeStamp > last
  - Respects ShopIds filter when configured
## Install 

### Set up database triggers, views, and data
Run the `LightSpeedIntegrationJobs_Create.sql` script to insert the required SystemSettings and ScheduledJob table entries needed. 
You can then just activate the Scheduled Jobs that are needed.

The script creates the following scheduled jobs:
- LightSpeed Sales Order Job
- LightSpeed Purchase Order Job  
- LightSpeed Transfer Job
- LightSpeed Master Item Job
- LightSpeed Item Shop Job

#### SystemSettings

<h5>BaseUrl</h5>
The base URL for the LightSpeed REST API. Default value is `https://api.lightspeedapp.com/API/V3/Account/`

<h5>AuthUrl</h5>
The authentication URL for OAuth token requests. Default value is `https://cloud.lightspeedapp.com/auth/oauth/token`

<h5>client_id</h5>
The OAuth client ID provided by LightSpeed for API access.

<h5>client_secret</h5>
The OAuth client secret provided by LightSpeed for API access. This setting is encrypted for security.

<h5>AccountID</h5>
The LightSpeed Account ID that identifies your specific LightSpeed account.

<h5>access_token</h5>
The OAuth access token for API authentication. This is automatically managed by the integration.

<h5>refresh_token</h5>
The OAuth refresh token used to renew access tokens. This is automatically managed by the integration.

<h5>ShopIds</h5>
A comma-separated list of LightSpeed Shop IDs to filter data synchronization (e.g., 7,9,12). Default value is empty (no filtering).

How it's used:

-  When empty: The integration synchronizes data from all shops in your LightSpeed account
-  When populated: The integration only synchronizes data from the specified shops
-  Sales Orders: Filters by shopID parameter in the API call
-  Purchase Orders: Filters by shopID parameter in the API call  
-  Transfer Orders: Filters by both sendingShopID and receivingShopID parameters
-  ItemShop (Inventory): Filters by shopID parameter to only sync inventory from specified locations

This setting is useful when you only want to integrate specific locations/shops from a multi-location LightSpeed setup into Granite, rather than synchronizing all locations.

<h5>PurchaseOrderPrefix</h5>
Prefix applied to Purchase Order document numbers in Granite. Default value is PO.

<h5>SalesOrderPrefix</h5>
Prefix applied to Sales Order document numbers in Granite. Default value is SO.

<h5>TransferPrefix</h5>
Prefix applied to Transfer Order document numbers in Granite. Default value is TR.

### Add the Injected job files to GraniteScheduler
To add the injected job files to the GraniteScheduler, simply copy the dlls and xml files into the root folder of GraniteScheduler.

Required files:
- `Granite.Integration.LightSpeed.Job.dll`
- `Granite.Integration.LightSpeed.Job.SalesOrder.xml`
- `Granite.Integration.LightSpeed.Job.PurchaseOrder.xml`
- `Granite.Integration.LightSpeed.Job.Transfer.xml`
- `Granite.Integration.LightSpeed.Job.MasterItem.xml`
- `Granite.Integration.LightSpeed.Job.ItemShop.xml`

## Configure

### Schedule configuration
See the GraniteScheduler manual for the details on how to [configure injected jobs](../../scheduler/manual.md#injected-jobs-integration-jobs).
Most of the work will have already been done for you by the `LightSpeedIntegrationJobs_Create.sql` script, you can simply activate the jobs you want to run.


