# SDK Provider

The Acumatica SDK provider is responsible for mapping Granite Transactions to the relevant format for posting to Acumatica. It makes use of the Acumatica REST API.

## How it connects

The upwards integration achieved using Acumatica's rest API. For more details on the Acumatica object's used in integration please consult the [Acumatica Overview](acumatica-overview.md). 

## Settings

!!! note
    To pick up any changes to the SystemSettings table, the IntegrationService will need to be restarted. 

The settings for Acumatica are configured in the SystemSettings table. The IntegrationService will pick up the settings using the Application name specified in it's `.config` file:
If this setting is missing from the config file or left empty, the IntegrationService will default to using `Acumatica` as the SystemSettingsApplicationName.
You can browse the IntegrationService's `/config` page to have the IntegrationService create the default settings in the SystemSettings table for you. 

### Config File Settings

```xml
    <add key="SystemSettingsApplicationName" value="Acumatica" />
    <add key="EndPoint" value="http://:40091/" />
```
#### SystemSettingsApplicationName
The Application name of the entries in the SystemSettings table that you want to use for this integration service. If this setting is the same as Application name for the ScheduledJobs they can use the same SystemSettings.

This setting allows you to have multiple integration services running with different settings.
### SystemSetting

- `BaseUrl` - Acumatica base URL. Default: empty.
- `UserID` - Acumatica user name. Default: empty.
- `Password` - Acumatica user password (encrypted). Default: empty.
- `Tenant` - Acumatica tenant. Default: empty.
- `Branch` - Acumatica branch. Default: empty.
- `DefaultLocation` - Acumatica default inventory location. Default: empty.
- `AcumaticaSalesOrderPrefix` - Acumatica sales order prefix. Default: empty.
- `AcumaticaPurchaseOrderPrefix` - Acumatica purchase order prefix. Default: empty.
- `AcumaticaTransferOrderPrefix` - Acumatica transfer order prefix. Default: empty.
- `AcumaticaTransferReceiptPrefix` - Acumatica transfer receipt prefix. Default: empty.
- `AcumaticaReturnToSupplierPrefix` - Acumatica return to supplier prefix. Default: empty.
- `ProductionOrderType` - Acumatica production order type. Default: empty.
- `AcumaticaWorkOrderPrefix` - Acumatica work order prefix. Default: empty.

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
`CONSUME`/manufacturing behavior is not yet implemented for documented SDK-provider usage.

### ADJUSTMENT
- Granite Transaction: **ADJUSTMENT**
- Acumatica: **INVENTORY ADJUSTMENT**
- Supports:
    - Lot
    - Serial
- Integration Post
    - False - Creates a new Inventory Adjustment with status Balanced
    - True - Creates a new Inventory Adjustment and performs the Release action to change the Status to Released
- Returns:
    Reference Number 

| Granite    | Acumatica Entity | Required | Behavior |
|------------|------------------|----------|-----------|
| Code                        | InventoryID           |Y||
| Qty                         | Qty  |Y||
| FromLocation                | WarehouseID  |Y||
| UOM                         | UOM |Y||
| Batch                       | LotSerialNbr  |N||
| Serial                      | LotSerialNbr  |N||
| ExpirationDate              | ExpiryDate|N||

### SCRAP
- Granite Transaction: **SCRAP**
- Acumatica: **INVENTORY ADJUSTMENT**
- Supports:
    - Lot
    - Serial
- Integration Post
    - False - Creates a new Inventory Adjustment with status Balanced
    - True - Creates a new Inventory Adjustment and performs the Release action to change the Status to Released
- Returns:
    Reference Number 

| Granite    | Acumatica Entity | Required | Behavior |
|------------|------------------|----------|-----------|
| Code                        | InventoryID           |Y||
| Qty                         | Qty  |Y||
| FromLocation                | WarehouseID  |Y||
| UOM                         | UOM |Y||
| Batch                       | LotSerialNbr  |N||
| Serial                      | LotSerialNbr  |N||
| ExpirationDate              | ExpiryDate|N||

### MOVE/REPLENISH

MOVE and REPLENISH create the same transaction in Acumatica. They both share a transaction type in Acumatica with Transfers.
To prevent them being brought into Granite as transfers the external reference is populated (currently `Granite move` / `Granite replenish`) as you can see below.

![Move Transfer](./acumatica-img/move-transfer.PNG)

- Granite Transaction: **MOVE/REPLENISH**
- Acumatica: **TransferOrder**
- Supports:
    - Serial
    - Lot
- Return
    - Transfer Number

- Integration Post
    - False - Creates a 1-Step Transfer in Acumatica with status Balanced. 
    - True - Changes the status of the transfer from Balanced to Released
- Returns:
    TransferNumber

| Granite    | Acumatica Entity | Required | Behavior |
|------------|------------------|----------|-----------|
| Code                        | InventoryID           |Y||
| Qty                         | Qty  |Y||
| FromLocation                | WarehouseID  |Y||
| ToLocation                  | ToWarehouseID  |Y||
| UOM                         | UOM |Y||
| Batch                       | LotSerialNbr  |N||
| Serial                      | LotSerialNbr  |N||
| ExpirationDate              | ExpiryDate|N||

### TAKEON

TAKEON uses the same transaction type in Acumatica as Transfer receipts. To prevent TAKEON receipts from being pulled into Granite as Transfer receipts the Description is populated with "Granite TakeOn". The scheduled job will then exclude these from being integrated.

![Takeon Receipt](./acumatica-img/takeon-receipt.PNG)

- Granite Transaction: **TAKEON**
- Acumatica: **Inventory Receipt**
- Supports:
    - Serial
    - Lot
- Integration Post
    - False - Creates a Inventory Receipt in Acumatica with status Balanced
    - True - Changes the status of the Inventory Receipt to from Balanced to Released
- Return
    - Inventory Receipt Number

| Granite    | Acumatica Entity | Required | Behavior |
|------------|------------------|----------|-----------|
| Code                        | InventoryID           |Y||
| Qty                         | Qty  |Y||
| ToLocation                  | WarehouseID  |Y||
| UOM                         | UOM |Y||
| Batch                       | LotSerialNbr  |N||
| Serial                      | LotSerialNbr  |N||
| ExpirationDate              | ExpiryDate|N||

### RECLASSIFY

This process first performs as Adjustment decreasing the stock and then a receipt of the new stock.

- Granite Transaction: **RECLASSIFY**
- Acumatica: **Adjustment => Receipt**
- Supports:
    - Serial
    - Lot
- Integration Post
    - False - Creates an Adjustment and Inventory Receipt in Acumatica with status Balanced
    - True - Creates an Adjustment and Inventory Receipt and performs the Release action to change the Status to Released
- Returns:
    Receipt Number

| Granite    | Acumatica Entity | Required | Behavior |
|------------|------------------|----------|-----------|
| FromCode                    | InventoryID|          |Y||
| ToCode                    | InventoryID           |Y||
| Qty                         | Qty  |Y||
| FromLocation                | WarehouseID  |Y||
| ToLocation                  | WarehouseID  |Y||
| UOM                         | UOM |Y||
| Batch                       | LotSerialNbr  |N||
| Serial                      | LotSerialNbr  |N||
| ExpirationDate              | ExpiryDate|N||

### ISSUE 

This process issues inventory from stock. After this point it is no longer tracked in Acumatica. This can be seen as a pick but not against a document. 
It is not mapped to any specific Granite transaction type. If you have a requirement you will need to specify it as the integration method on the relevant process as you can see below. 

![issue integration method](./acumatica-img/issue-integration-method.PNG)

- Granite Transaction: **NONE**
- Acumatica: **ISSUE**
- Supports:
    - Lot
    - Serial

- Integration Post
    - False - Creates a new Issue, invokes Release From Hold, and does not invoke final Release.
    - True - Creates a new Issue, invokes Release From Hold, and then invokes Release to change status to Released.

-Returns 
    Issue Number

| Granite    | Acumatica Entity | Required | Behavior |
|------------|------------------|----------|-----------|
| Code                       | InventoryID           |Y||
| Qty                        | ShippedQty  |Y||
| FromLocation               | WarehouseID |Y||
| Lot                        | LotSerialNbr|N||
| Serial                     | LotSerialNbr|N||
| ExpirationDate             | ExpiryDate|N||

### PICK

- Granite Transaction: **PICK**
- Acumatica: **CREATE SHIPMENT**
- Supports:
    - Lot
    - Serial

- Integration Post
    - False - Creates a new Shipment with status Open
    - True - Creates a new shipment and performs the Confirm Shipment action

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
| ExpirationDate              | ExpiryDate|N||

### PACK

PACK appends package information to an existing [Acumatica Shipment](./acumatica-overview.md#shipments). 

- Granite Transaction: **PACK**
- Acumatica: **Shipment (Packages)**
- Shipment lookup and validation:
    - Uses `TransactionDocumentReference` as the `ShipmentNbr`.
    - Requires exactly one shipment number across the provided transactions.
    - Fails if multiple shipment numbers are found, no shipment number is provided, or the shipment is not found in Acumatica.
- Package source:
    - Reads carrying entity data for the provided Granite transaction IDs from `CarryingEntity` (joined via `Transaction.ToContainableEntity_id`).
    - Appends one package per carrying entity to the shipment `Packages` collection and updates the shipment.
- Integration Post
    - The `post` flag is accepted but currently not used; behavior is the same for `True` and `False`.
- Returns:
    Shipment Number

| Granite    | Acumatica Entity | Required | Behavior |
|------------|------------------|----------|-----------|
| Document (`TransactionDocumentReference`) | ShipmentNbr |Y| All transactions must reference a single shipment number |
| CarryingEntity type (`MasterItem.Code`)   | BoxID       |N| Mapped to package box code/type |
| CarryingEntity Barcode                     | Description |N| Mapped to package description |
| CarryingEntity Weight                      | Weight      |N||
| CarryingEntity Height                      | Height      |N||
| CarryingEntity Length                      | Length      |N||
| CarryingEntity Width                       | Width       |N||

You need a separate view for the pack transactions that changes the integration type from pack to something else. 
You will also need to call integration through clr on a custom process. 
In the examples below the process name is PACKINGPOST. The ShipmentNbr that needs to be in the TransactionDocumentReference is the integration reference that is returned from Pick post. 

```sql
CREATE VIEW [dbo].[Integration_Transactions_PACKINGPOST]
AS
SELECT * FROM 
(SELECT DISTINCT 
    dbo.[Transaction].ID, dbo.[Transaction].Date, dbo.Users.Name AS [User], dbo.[Transaction].IntegrationStatus, dbo.[Transaction].IntegrationReady, dbo.MasterItem.Code, ISNULL(dbo.[Transaction].UOM, dbo.MasterItem.UOM) 
    AS UOM, dbo.[Transaction].UOMConversion, dbo.[Transaction].FromQty, dbo.[Transaction].ToQty, dbo.[Transaction].ActionQty, dbo.Location.ERPLocation AS FromLocationERPLocation, 
    Location_1.ERPLocation AS ToLocationERPLocation, dbo.[Document].Number AS [Document], dbo.DocumentDetail.LineNumber, MasterItem_1.Code AS FromCode, MasterItem_2.Code AS ToCode, dbo.TrackingEntity.Batch, 
    dbo.[Transaction].Comment, 
    CASE 
    WHEN (dbo.[Transaction].Type = 'PACK')
    THEN 'CUSTOMPACK'
    ELSE dbo.[Transaction].Type
    END AS Type, 
    dbo.[Transaction].Process, dbo.TrackingEntity.SerialNumber, dbo.[Document].Type AS DocumentType, dbo.[Transaction].IntegrationReference, 
    dbo.[Document].Description AS DocumentDescription, dbo.TrackingEntity.ExpiryDate, [log].Message, dbo.DocumentDetail.Cancelled AS DocumentLineCancelled, Location_1.Site AS ToSite, dbo.Location.Site AS FromSite, 
    Process.Name,
    CASE 
    WHEN dbo.[Transaction].Process ='PACKING' AND dbo.Process.IntegrationIsActive = 0  THEN 
    (SELECT IntegrationIsActive FROM dbo.Process WHERE [Name] = 'PACKINGPOST')
    ELSE dbo.Process.IntegrationIsActive END
    as IntegrationIsActive, 
    dbo.[Document].TradingPartnerCode AS DocumentTradingPartnerCode, dbo.[Transaction].DocumentReference AS TransactionDocumentReference, dbo.[Transaction].ReversalTransaction_id
FROM    dbo.[Transaction] INNER JOIN
        dbo.TrackingEntity ON dbo.[Transaction].TrackingEntity_id = dbo.TrackingEntity.ID INNER JOIN
        dbo.MasterItem ON dbo.TrackingEntity.MasterItem_id = dbo.MasterItem.ID INNER JOIN
        dbo.Users ON dbo.[Transaction].User_id = dbo.Users.ID LEFT OUTER JOIN
        dbo.Process ON dbo.[Transaction].Process = dbo.Process.Name LEFT OUTER JOIN
        dbo.Location AS Location_1 ON dbo.[Transaction].ToLocation_id = Location_1.ID LEFT OUTER JOIN
        dbo.Location ON dbo.[Transaction].FromLocation_id = dbo.Location.ID LEFT OUTER JOIN
        dbo.[Document] ON dbo.[Transaction].Document_id = dbo.[Document].ID LEFT OUTER JOIN
        dbo.MasterItem AS MasterItem_1 ON dbo.[Transaction].FromMasterItem_id = MasterItem_1.ID LEFT OUTER JOIN
        dbo.MasterItem AS MasterItem_2 ON dbo.[Transaction].ToMasterItem_id = MasterItem_2.ID LEFT OUTER JOIN
        dbo.DocumentDetail ON dbo.[Transaction].DocumentLine_id = dbo.DocumentDetail.ID OUTER APPLY
        (
            SELECT TOP(1) [Message]
            FROM dbo.IntegrationLog
            WHERE GraniteTransaction_id = [Transaction].ID
            ORDER BY [Date] DESC
        ) [log]
WHERE       dbo.[Transaction].Type = 'PACK' AND 
            IntegrationStatus = 0 AND ISNULL(ReversalTransaction_id, 0) = 0
) AS table_1
WHERE table_1.IntegrationIsActive = 1
GO
```

```sql
CREATE PROCEDURE [dbo].PrescriptPackingPostDocument (
   @input dbo.ScriptInputParameters READONLY 
)
AS
DECLARE @Output TABLE(
  Name varchar(max),  
  Value varchar(max)  
  )

SET NOCOUNT ON;

DECLARE @valid bit
DECLARE @message varchar(MAX)
DECLARE @stepInput varchar(MAX) 
SELECT @stepInput = Value FROM @input WHERE Name = 'StepInput' 


EXEC	[dbo].[clr_IntegrationPost]
		@transactionID = null,
		@document = @stepInput,
		@documents = null,
		@reference = null,
		@transactionType = N'CUSTOMPACK', -- Can be anything, just must match the view above
		@processName = N'PACKINGPOST',
		@success = @valid OUTPUT,
		@message = @message OUTPUT


INSERT INTO @Output
SELECT 'Message', @message
INSERT INTO @Output
SELECT 'Valid', @valid
INSERT INTO @Output
SELECT 'StepInput', @stepInput


SELECT * FROM @Output

```

The Carrying entities that are sent to the shipment are fetched with the following query

``` sql
SELECT DISTINCT
    CarryingEntity.Barcode,
    MasterItem.Code AS BoxCode,
    CarryingEntity.[Weight],
    CarryingEntity.[Length],
    CarryingEntity.[Width],
    CarryingEntity.[Height]
FROM CarryingEntity
INNER JOIN [Transaction] T
    ON CarryingEntity.ID = T.ToContainableEntity_id
LEFT JOIN MasterItem
    ON CarryingEntity.type_id = MasterItem.ID
WHERE T.IntegrationStatus = 0
    AND ISNULL(T.ReversalTransaction_id, 0) = 0
    AND T.ID IN (); // The pack transaction ids are passed in here. 
```
### RECEIVE

- Granite Transaction: **RECEIVE**
- Acumatica: **CREATE PURCHASE RECEIPT**
- Supports:
    - Lot
    - Serial

- Integration Post
    - False - Creates a new Purchase Order Receipt with `On Hold` status (`Hold = true`)
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
| Batch                      | LotSerialNbr  |N||
| Serial                     | LotSerialNbr  |N||
| ExpirationDate              | ExpiryDate|N||

### TRANSFER

!!! note
    The TRANSFER integration method supports Granite document types `TRANSFER`, `INTRANSIT`, and `RECEIPT` with different validation flows.

- Granite Transaction: **TRANSFER**
- Acumatica: **TransferOrder / InventoryReceipt**
- Supports:
    - Serial
    - Lot
- Document handling:
    - `TRANSFER` - Validates each Transfer Order allocation against Granite `ActionQty` (line + split + lot/serial where applicable), updates `ExternalRef` to `Quantities validated in Granite`, and optionally releases.
    - `INTRANSIT` - Uses the same validation/update path as `TRANSFER`, and when `Integration Post = True` also attempts transfer receipt creation.
    - `RECEIPT` - Validates ERP receipt detail/allocation quantities against Granite grouped transactions (`ActionQty`), appends `. Quantities validated in Granite` to receipt `Description`, and optionally releases.

- Integration Post
    - False - Runs validation and updates the ERP document without invoking release.
    - True - Runs validation and invokes release (`ReleaseTransferOrder` / `ReleaseInventoryReceipt`); for `INTRANSIT`, transfer receipt creation is also attempted.
- Returns:
    - `TRANSFER`/`INTRANSIT`: Transfer reference number.
    - `RECEIPT`: `AcumaticaTransferReceiptPrefix` + receipt reference number.

| Granite    | Acumatica Entity | Required | Behavior |
|------------|------------------|----------|-----------|
| Document                   | TransferOrder/InventoryReceipt |Y||
| LineNumber                 |               |Y||
| Qty / ActionQty            |               |Y| Validates Granite `ActionQty` against ERP allocation/detail quantities |
| Batch                      | LotSerialNbr  |N||
| Serial                     | LotSerialNbr  |N||
| ExpirationDate             | ExpiryDate|N||

### RETURNTOSUPPLIER

- Granite Transaction: **PICK**
- Acumatica: **PO RECEIPT RETURN**
- Supports:
    - Serial
    - Lot
- Validation behavior:
    - Validates each purchase receipt allocation against Granite `ActionQty` using `LineNumber-SplitLineNumber`.
    - For lot/serial tracked allocations, validates quantity per lot/serial number; otherwise validates total allocation quantity for the split line.
    - If allocations are missing or quantities do not match, integration fails with validation errors.
    - On successful validation, sets `VendorRef` to `Quantity validated in Granite`.
- Integration Post
    - False - Runs validation and updates the PO Receipt Return without releasing.
    - True - Runs validation, updates the document, and invokes release.
- Returns:
    `AcumaticaReturnToSupplierPrefix` + purchase receipt return number.

| Granite    | Acumatica Entity | Required | Behavior |
|------------|------------------|----------|-----------|
| Document                   | PurchaseReceipt |Y||
| LineNumber                 |               |Y| Use `LineNumber-SplitLineNumber` format for allocation validation |
| Qty / ActionQty            |               |Y| Validates Granite `ActionQty` against ERP allocation quantities |
| Batch                      | LotSerialNbr  |N||
| Serial                     | LotSerialNbr  |N||
| ExpirationDate             | ExpiryDate|N||

### STOCKTAKE

StockTake pushes Granite transactions onto an existing Acumatica **Physical Inventory Review** (PIR) using the REST entity endpoint (`PhysicalInventoryReviewApi`). The PIR must already exist in Acumatica; the integration updates it rather than creating it.

- Granite Transaction: **STOCKTAKE**
- Acumatica: **Physical Inventory Review**
- Supports:
    - Lot
    - Serial
- Session lookup:
    - Uses the first transaction's `TransactionDocumentReference` as the PIR `ReferenceNbr`, fetched via `GetList` with `$expand=Details`.
- Warehouse validation:
    - Transactions whose `ToLocation` does not match the PIR's `WarehouseID` are skipped.
    - A `Warning` row is written to Granite's `IntegrationLog` table with `LogOrigin = StockTakePosting` listing the ignored transaction IDs.
- Detail matching and accumulation:
    - Existing PIR details are matched to Granite transactions by `InventoryID`; when the detail has a `LotSerialNbr`, matching also requires the Granite `Batch` or `Serial` to match, and if the detail has an `ExpirationDate` the Granite `ExpiryDate` must match that date as well.
    - For each matched detail, the summed Granite `ToQty` is accumulated into `PhysicalQty` (using `+=`) and the source Granite transaction IDs are appended to the detail `Note`.
- New details for unmatched transactions:
    - Transactions that do not match any existing PIR detail generate new detail rows at `AppConfig.DefaultLocation` with `Status = Entered`.
    - Lot/Serial tracked items are grouped by `Code`/`Batch`/`Serial`/`ExpiryDate` before being added.
    - Non-tracked items are summed per inventory code into a single new detail.
    - The new detail's `Note` is populated with the contributing Granite transaction IDs.
- Submit:
    - The updated PIR is committed using `PutEntity` with `$expand=Details`.
- Integration Post
    - The `post` flag is accepted but not currently used; behaviour is the same whether `post` is `True` or `False` (no separate Release step is invoked).
- Returns:
    PIR `ReferenceNbr`.

| Granite    | Acumatica Entity | Required | Behavior |
|------------|------------------|----------|-----------|
| Document (`TransactionDocumentReference`) | ReferenceNbr (PIR) |Y| Identifies the Physical Inventory Review to update |
| Code                       | InventoryID   |Y||
| Qty / ToQty                | PhysicalQty   |Y| Summed Granite quantities are accumulated into existing detail `PhysicalQty` (`+=`) |
| ToLocation                 | WarehouseID   |Y| Transactions whose `ToLocation` differs from the PIR `WarehouseID` are skipped and logged to `IntegrationLog` |
| Batch                      | LotSerialNbr  |N||
| Serial                     | LotSerialNbr  |N||
| ExpirationDate             | ExpirationDate|N||
