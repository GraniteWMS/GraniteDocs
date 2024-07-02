# SDK Provider

The Acumatica SDK provider is responsible for mapping Granite Transactions to the relevant format for posting to Acumatica. It makes use of the Acumatica REST API.

## Setup


## Settings

!!! note
    To pick up any changes to the SystemSettings table, the IntegrationService will need to be restarted. 

The settings for Acumatica are configured in the SystemSettings table. The IntegrationService will pick up the settings using the Application name specified in it's `.config` file:
If this setting is missing from the config file or left empty, the IntegrationService will default to using `Acumatica` as the SystemSettingsApplicationName.
You can browse the IntegrationService's `/config` page to have the IntegrationService create the default settings in the SystemSettings table for you. 

### Acumatica Settings

#### Lot/Serial Tracking
For Granite to be able to post Serial Numbers or Batch back to Acumatica the feature in System Management > Enable/Disable Features > Lot and Serial Tracking needs to be turned on. 

After that a Lot/Serial class must be created and assigned to all Item Classes that require Lot/Serial tracking. 

If this is not done, acumatica will discard any Lot\Serial information sent as part of the request. 

#### Control Quantity

Acumatica has a feature that requires the user to validate the document quantity before changing the document status. 
This needs to be disabled in order from Granite to post documents into the system. 

The setting needs to be disabled in the following places (if Granite is integrating these documents):

- Sales Order Preferences > Validate Shipment Total on Confirmation
- Inventory Preferences > Validate Document Totals on Entry


## Integration Methods

By default if the method names below is the same as a Granite Transaction type, it will autowire the integration. 
If you require a different integration action you can specify the name below in the Process IntegrationMethod property. 

### PICK

- Granite Transaction: **PICK**
- Acumatica: **CREATE SHIPMENT**
- Supports:
    - Lot
    - Serial

- Integration Post
    - False - Creates a new Shipment with the status Balanced
    - True - Creates a new shipment and performs the Release action to change the Status to Released
- Returns:
    Shipment Number

| Granite    | Acumatica Entity | Required | Behavior |
|------------|------------------|----------|-----------|
| Document                   | OrderNumber |Y||
| LineNumber                 |             |Y||
| Qty                        | ShippedQty  |Y||
| DocumentTradingPartnerCode | CustomerID  |Y||
| FromLocation               | WarehouseID |Y||
| Lot                        | LotSerialNbr|N||
| Serial                     | LotSerialNbr|N||

### RECEIVE

- Granite Transaction: **RECEIVE**
- Acumatica: **CREATE PURCHASE RECEIPT**
- Supports:
    - Lot
    - Serial

- Integration Post
    - False - Creates a new Purchase Order Receipt with the status Balanced
    - True - Creates a new Purchase Order Receipt and performs the Release action to change the Status to Released. 
- Returns:
    Purchase Order Receipt Number

| Granite    | Acumatica Entity | Required | Behavior |
|------------|------------------|----------|-----------|
| Document                   | POOrderNumber |Y||
| LineNumber                 |               |Y||
| Qty                        | ReceiptQty    |Y||
| DocumentTradingPartnerCode | VendorID      |Y||
| TLocation                  | WarehouseID   |Y||
| Lot                        | LotSerialNbr  |N||
| Serial                     | LotSerialNbr  |N||

### TRANSFER

!!! note
    Acumatica does not have separate fields on Transfers and Receipts for Qty vs ActionQty. As such, the current behavior is to only accept completed lines where the Qty and ActionQty in Granite are equal and therefore match the value in Acumatica.

- Granite Transaction: **TRANSFER**
- Acumatica: **TransferOrder**
- Supports:
    - Serial
    - Lot
- Return
    - Transfer Number

- Integration Post
    - False - Changes the status of the transfer/receipt from On Hold to Balanced. 
    - True - Changes the status of the transfer/receipt from On Hold to Released
- Returns:
    Transfer/Receipt Number

| Granite    | Acumatica Entity | Required | Behavior |
|------------|------------------|----------|-----------|
| Document                   | TransferOrder/InventoryReceipt |Y||
| LineNumber                 |               |Y||
| Qty                        |               |Y| Compares qty to acumatica document qty |
| Lot                        | LotSerialNbr  |N||
| Serial                     | LotSerialNbr  |N||