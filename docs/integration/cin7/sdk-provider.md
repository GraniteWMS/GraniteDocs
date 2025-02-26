# SDK Provider

!!! note
    This documentation is a work in progress and is intended to show the development progress of the integration with CIN7. As such, it may be subject to change as progress is made. 

## Supported Transactions

Currently, the support transaction are 

- Move (Stock Transfer)
- Adjustment (Stock Adjustment)
- Receive (Purchase Order Receipt)
- Pick (Sale Fulfilment Pick)
- Pack (Sale Fulfilment Pack)

These transactions were done first as they cover all of the main transactions types in CIN7 and most other Granite transactions will be using the same base transactions types. 

### ADJUSTMENT

- Granite Transaction: **ADJUSTMENT**
- CIN7: **STOCK ADJUSTMENT**
- Supports:
    - Batch
    - Serial
    - Expiration Date
- Integration Post
    - False - Creates a new Stock Adjustment with the status Draft
    - True - Creates a new Stock Adjustment with the status Authorized.
- Returns:
    Stock Adjustment Task ID

| Granite    | Acumatica Entity | Required | Behavior |
|------------|------------------|----------|-----------|
| Code                        | SKU           |Y||
| Qty                         | Qty  |Y||
| FromLocation                | Location  |Y||
| Batch                       | BatchSN  |N||
| Serial                      | BatchSN  |N||
| ExpirationDate              | ExpiryDate|N||

The quantity filed that is sent to CIN7 is the total qty of the product in that location so the integration provider uses this view to get that qty for each item being adjusted. This view needs to be created on the Granite Database. 

```sql
CREATE VIEW Integration_CIN7_StockOnHand
AS
select MasterItem.Code, Location.ERPLocation, ExpiryDate, Batch, SerialNumber, SUM(Qty) Qty
from TrackingEntity 
		INNER JOIN Location on TrackingEntity.Location_id = Location.ID
		INNER JOIN MasterItem ON TrackingEntity.MasterItem_id = MasterItem.ID
WHERE Location.NonStock = 0 AND TrackingEntity.InStock = 1
GROUP BY MasterItem.Code, Location.ERPLocation, ExpiryDate, Batch, SerialNumber

```

### MOVE

- Granite Transaction: **MOVE**
- CIN7: **STOCK Transfer**
- Supports:
    - Batch
    - Serial
    - Expiration Date
- Integration Post
    - False - Creates a new Stock Transfer with the status Draft
    - True - Creates a new Stock Transfer with the status Authorized.
- Returns:
    Stock Transfer Task ID

| Granite    | Acumatica Entity | Required | Behavior |
|------------|------------------|----------|-----------|
| Code                        | SKU           |Y||
| Qty                         | Qty  |Y||
| FromLocation                | FromLocation  |Y||
| ToLocation                  | ToLocation  |Y||
| Batch                       | BatchSN  |N||
| Serial                      | BatchSN  |N||
| ExpirationDate              | ExpiryDate|N||

### RECEIVE

- Granite Transaction: **RECEIVE**
- CIN7: **Purchase Stock Receive**
- Supports:
    - Batch
    - Serial
    - Expiration Date
- Integration Post
    - False - Creates a new Purchase Stock Receive with the status Draft
    - True - Creates a new Purchase Stock Receive with the status Authorized.
- Returns:
    Purchase Task ID

| Granite    | Acumatica Entity | Required | Behavior |
|------------|------------------|----------|-----------|
| Document                   | OrderNumber |Y||
| Code                        | SKU           |Y||
| Qty                         | Qty  |Y||
| ToLocation                  | ToLocation  |Y||
| Batch                       | BatchSN  |N||
| Serial                      | BatchSN  |N||
| ExpirationDate              | ExpiryDate|N||

### PICK

- Granite Transaction: **PICK**
- CIN7: **Sale Fulfilment Pick**
- Supports:
    - Batch
    - Serial
    - Expiration Date
- Integration Post
    - False - Creates a new Sale Fulfilment Pick with the status Draft
    - True - Creates a new Sale Fulfilment Pick with the status Authorized.
- Returns:
    Sale Task ID

| Granite    | Acumatica Entity | Required | Behavior |
|------------|------------------|----------|-----------|
| Document                   | OrderNumber |Y||
| Code                        | SKU           |Y||
| Qty                         | Qty  |Y||
| FromLocation                  | Location  |Y||
| Batch                       | BatchSN  |N||
| Serial                      | BatchSN  |N||
| ExpirationDate              | ExpiryDate|N||

### PICK

- Granite Transaction: **PaCK**
- CIN7: **Sale Fulfilment Pack**
- Supports:
    - Batch
    - Serial
    - Expiration Date
- Integration Post
    - False - Creates a new Sale Fulfilment Pack with the status Draft
    - True - Creates a new Sale Fulfilment Pack with the status Authorized.
- Returns:
    Sale Task ID

| Granite    | Acumatica Entity | Required | Behavior |
|------------|------------------|----------|-----------|
| Document                   | OrderNumber |Y||
| Code                        | SKU           |Y||
| Qty                         | Qty  |Y||
| FromLocation                  | Location  |Y||
| Batch                       | BatchSN  |N||
| Serial                      | BatchSN  |N||
| ExpirationDate              | ExpiryDate|N||


If the item that was picked has a expiry date, serial/batch it then needs to 
be packed using the tracking entity number so that the serial and batch gets sent with the Transactions. 
You need a separate view for the pack transactions that changes the integration type from pack to something else. 
You will also need to call integration through clr on a custom process. 

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

