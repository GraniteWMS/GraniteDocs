# SDK Provider

The Evolution SDK provider is responsible for mapping Granite transactions to the relevant format for posting to Evolution. It makes use of the Evolution SDK in order to post.

## Setup

1. Check the version of the Evolution SDK that is currently installed on the server. The SDK is usually found at `C:\Program Files (x86)\Sage Evolution`. Take note of the first two numbers of `Pastel.Evolution.dll` file version.

    !!! note 
        If the SDK is not yet installed, please engage with the client's Evolution consultant - the SDK is required for Granite integration.

2. In the `Providers\Evo` folder, find the `EvoX.Y` folder matching the installed SDK version. `X.Y` must match the first two numbers of the installed SDK version. For example, if the installed SDK version is 7.20.0.14, you will take the files from the Evo7.20 folder

3. **Copy** everything in the `Providers\Evo\EvoX.Y` folder into Integration Service folder (root folder).

4. Ensure `SDKProvider.xml` setup or copied correctly
    ```xml
    <module name="Provider">
    <bind
        service="Granite.Integration.Contract.IProvider, Granite.Integration.Contract"
        to="Granite.Integration.PastelEvo.Provider, Granite.Integration.PastelEvo"/>
    </module>
    ```

5. Configure your connection string and endpoint in the `Granite.Integration.Web.exe.config` file

___
## Settings

### Config File

The settings for Sage 200 (Evo) are configured in the SystemSettings table. The IntegrationService will pick up the settings using the Application name specified in it's `.config` file:
```xml
<add key ="SystemSettingsApplicationName" value="IntegrationSage200"/>
```
If this setting is missing from the config file or left empty, the IntegrationService will default to using `IntegrationSage200` as the SystemSettingsApplicationName

You can browse the IntegrationService's `/config` page to have the IntegrationService create the default settings in the SystemSettings table for you.

The script to insert the default settings is also located in the GraniteDatabase release:
```
~\GraniteDatabase\Data\SystemSettings\SystemSettingsEvolution.sql
```

!!! note 
    To pick up any changes to the SystemSettings table, the IntegrationService will need to be restarted.

### Database SystemSettings

| Application        | Key                                     | Value      | Description                                           | 
|--------------------|-----------------------------------------|------------|-------------------------------------------------------|
| IntegrationSage200 | EvoSqlServer                            |            | Evo database''s SqlServer instance                    |
| IntegrationSage200 | EvoDatabase                             |            | Evo database name                                     |
| IntegrationSage200 | EvoSqlUserName                          |            | Sql user for Evo database                             |
| IntegrationSage200 | EvoSqlPassword                          |            | Sql password for Evo database                         |
| IntegrationSage200 | EvoCommonSqlServer                      |            | Evo Common database''s SqlServer instance             |
| IntegrationSage200 | EvoCommonSqlUserName                    |            | Sql user for Evo Common database                      |
| IntegrationSage200 | EvoCommonSqlPassword                    |            | Sql password for Evo Common database                  |
| IntegrationSage200 | EvoCommonDatabase                       |            | Evo Common database name                              |
| IntegrationSage200 | EvoSDKSerialNumber                      | DE09110172 | Evo SDK Serial number. Alternate value DE09110060     |
| IntegrationSage200 | EvoSDKAuthKey                           | 1228187    | Evo SDK auth key. Alternate value 4929466             |
| IntegrationSage200 | EvoBreakApartActive                     | false      |                                                       |
| IntegrationSage200 | EvoBranchContextActive                  | false      |                                                       |
| IntegrationSage200 | EvoBranchUseLocation                    | false      |                                                       |
| IntegrationSage200 | EvoTransactionCodeGoodsReceiveVoucher   | RC         |                                                       |
| IntegrationSage200 | EvoTransactionCodeAdjustments           | ADJ        |                                                       |
| IntegrationSage200 | EvoTransactionCodeReclassifyAdjustments | ADJ        |                                                       |
| IntegrationSage200 | EvoTransactionCodeIssue                 | IIS        |                                                       |
| IntegrationSage200 | EvoTransactionCodeProjectsIssue         | IIS        |                                                       |
| IntegrationSage200 | EvoTransactionCodeMove                  | WHT        |                                                       |
| IntegrationSage200 | EvoTransactionCodeTransfer              | WHT        |                                                       |
| IntegrationSage200 | EvoManufactureActive                    | false      |                                                       |
| IntegrationSage200 | EvoManufactureCodes                     | 2          | List of comma separated codes                         |


!!! note 
    in most cases the Data and Common Pastel EVO database is on the same SQL instance and settings will be the same.

#### EvoSqlServer
- SQL server instance name

#### EvoDatabase
- Pastel EVO database name

#### EvoSqlUserName
- SQL server username

#### EvoSqlPassword
- SQL server password

#### EvoCommonSqlServer
- SQL server instance name for common database

#### EvoCommonDatabase
- Pastel EVO common database name

#### EvoCommonSqlUserName
- SQL server username for common database

#### EvoCommonSqlPassword
- SQL server password for common database

#### EvoSDKSerialNumber
- SDK serial number

#### EvoSDKAuthKey
- SDK Auth key

#### EvoBreakApartActive
- Options: true / false
- Used by: SCRAP
- When active validate the Batch against the EvoManufactureCodes (appsetting)

#### EvoManufactureActive
- Options: true / false
- Used by: TAKEON
- Workings: When active verify against EvoManufactureCodes (app setting) if valid perform custom Manufacture (MANUFACTURE post).

#### EvoManufactureCodes
- Options: comma separated codes. Example : 3214, 3431, 9876
- Used by: EvoManufactureActive (TAKEON, SCRAP)

#### EvoBranchContextActive	
- Options: true / false
- Used by: Application level
- When active set branch. Branch based on Pastel item OR EvoBranchUseLocation setting.
- EvoBranchUseLocation: see setting.

#### EvoBranchUseLocation
- Options: true / false
- Used by: EvoBranchContextActive
- When active use Granite site on transaction as branch ID.

#### EvoTransactionCodeGoodsReceiveVoucher
- Options: string value representing GoodsReceive Voucher code
- Used by: TAKEON Inventory transaction code 

#### EvoTransactionCodeAdjustments
- Options: string value representing transaction inventory code
- Used by: ADJUSTMENT Inventory transaction code 

#### EvoTransactionCodeReclassifyAdjustments
- Options: string value representing transaction inventory code
- Used by: RECLASSIFY Inventory transaction code 

#### EvoTransactionCodeMove
- Options: string value representing transaction inventory code
- Used by: MOVE Inventory transaction code 

#### EvoTransactionCodeTransfer
- Options: string value representing transaction inventory code
- Used by: TRANSFER Inventory transaction code 

#### EvoTransactionCodeIssue
- Options: string value representing transaction inventory code
- Used by: ISSUE Inventory transaction code 
___

## Integration Methods
By default if the method name below is the same as a Granite Transaction type, it will autowire the integration.
If you require a different integration action you can specify the name below in the Process IntegrationMethod
property.

### TAKEON

!!! note 
    If setting EvoManufactureActive is true and part of the batch of the item taken on is specified in setting EvoManufactureCodes, the item is posted using [MANUFACTURE](#manufacture) method

- Granite: Transaction type **TAKEON** 
- Evolution: **InventoryTransaction RC**
- Supports: 
    - Branch
    - LOT
    - Expiry
    - Serial
- IntegrationPost:
    - Not supported, will always Post InventoryTransaction 
- Pre-post validation:
    - ActionQty is greater than 0
- Returns:
    - InventoryTransaction.Audit

| Granite         | Evo SDK                              | Required | Behaviour |
|-----------------|--------------------------------------|----------|-----------|
| MasterItem Code | InventoryTransaction.InventoryItem   | Y        ||
| ToSite          | Branch                               | N        | Applies if EvoBranchContextActive is true and EvoBranchUseLocation is true, if EvoBranchUseLocation is false uses InventoryItem's branch |
| Batch           | InventoryTransaction.Lot.Code        | N        | Only applies if InventoryItem is Lot tracked in Evo |
| ExpiryDate      | InventoryTransaction.Lot.ExpiryDate  | N        | Only applies if InventoryItem Lots expire in Evo |
| SerialNumber    | InventoryTransaction.SerialNumbers   | N        | Only applies if InventoryItem is Serial tracked in Evo |
| ToLocation      | InventoryTransaction.Warehouse       | Y        | If ToLocation is empty, uses FromLocation |
| ActionQty       | InventoryTransaction.Quantity        | Y        ||
| Transaction ID  | InventoryTransaction.Reference       | Y        | Prefixed with "GRANITE ID: " |
| Comment         | InventoryTransaction.Reference2      | N        | If Comment is empty, will be set to "Granite TakeOn" |

### ADJUSTMENT
- Granite: Transaction type **ADJUSTMENT**
- Evolution: **InventoryTransaction ADJ - Inventory Adjustments**
    - Inventory Adjustments Increase and Decrease. 
- Supports: 
    - Branch
    - LOT
    - Expiry
    - Serial
    - Comment
- IntegrationPost:
    - Not supported, will always Post InventoryTransaction 
- Pre-post validation:
    - ActionQty is greater than 0
- Returns:
    - InventoryTransaction.Audit

| Granite         | Evo SDK                              | Required | Behaviour |
|-----------------|--------------------------------------|----------|-----------|
| MasterItem Code | InventoryTransaction.InventoryItem   | Y        ||
| FromSite        | Branch                               | N        | Applies if EvoBranchContextActive is true and EvoBranchUseLocation is true, if EvoBranchUseLocation is false uses InventoryItem's branch |
| ToLocation      | InventoryTransaction.Warehouse       | Y        | If ToLocation is empty, uses FromLocation |
| Comment         | InventoryTransaction.Reference2      | N        | If Comment is empty, will be set to "Granite Adjustment" |
| Batch           | InventoryTransaction.Lot.Code        | N        | Only applies if InventoryItem is Lot tracked in Evo |
| ExpiryDate      | InventoryTransaction.Lot.ExpiryDate  | N        | Only applies if InventoryItem Lots expire in Evo |
| SerialNumber    | InventoryTransaction.SerialNumbers   | N        | Only applies if InventoryItem is Serial tracked in Evo |
| ActionQty       | InventoryTransaction.Quantity        | Y        ||
| Transaction ID  | InventoryTransaction.Reference       | Y        | Prefixed with "GRANITE ID: " |

### RECLASSIFY

!!! note 
    Processes two InventoryAdjustments in Evo. One decreases the qty of the original item code, and the other increases the qty of the new item code.

- Granite: Transaction type **RECLASSIFY**
- Evolution: Inventory Transaction ADJ. 
    - Inventory Adjustments Increase and Decrease. 
- Supports: 
    - Branch
    - LOT
    - Expiry
- IntegrationPost:
    - Not supported, will always Post InventoryTransaction 
- Returns:
    - InventoryTransaction.ID for QtyDecrease, InventoryTransaction.ID for QtyIncrease 

| Granite         | Evo SDK                              | Required | Behaviour |
|-----------------|--------------------------------------|----------|---------------------|
| MasterItem Code | InventoryTransaction.InventoryItem   | Y        ||
| FromSite        | Branch                               | N        | Applies if EvoBranchContextActive is true and EvoBranchUseLocation is true, if EvoBranchUseLocation is false uses InventoryItem's branch |
| FromLocation    | InventoryTransaction.Warehouse       | Y        | This is the location used for the QtyDecrease transaction |
| ToLocation      | InventoryTransaction.Warehouse       | Y        | This is the location used for the QtyIncrease transaction |
| Comment         | InventoryTransaction.Reference2      | N        ||
| Batch           | InventoryTransaction.Lot.Code        | N        | Only applies if InventoryItem is Lot tracked in Evo |
| ExpiryDate      | InventoryTransaction.Lot.ExpiryDate  | N        | Only applies if InventoryItem Lots expire in Evo |
| ActionQty       | InventoryTransaction.Quantity        | Y        ||
| Transaction ID  | InventoryTransaction.Reference       | Y        | Prefixed with "GRANITE ID: " |

### REPLENISH
- Granite: Transaction type **REPLENISH**
- WarehouseTransfer. Inventory Warehouse Transfer. 
- Supports: 
    - Branch
    - LOT
    - Expiry
    - Serial
    - Comment
    - EvoTransactionCodeMove
- IntegrationPost:
    - Not supported, will always Post WarehouseTransfer 
- Pre-post validation:
    - ToLocation and FromLocation are not the same
    - InventoryItem is warehouse tracked in Evo
- Returns:
    - WarehouseTransfer.Audit

| Granite         | Evo SDK                              | Required | Behaviour |
|-----------------|--------------------------------------|----------|---------------------|
| MasterItem Code | WarehouseTransfer.InventoryItem      | Y        ||
| FromSite        | Branch                               | N        | Applies if EvoBranchContextActive is true and EvoBranchUseLocation is true, if EvoBranchUseLocation is false uses InventoryItem's branch |
| Batch           | WarehouseTransfer.Lot.Code           | N        | Only applies if InventoryItem is Lot tracked in Evo |
| ExpiryDate      | WarehouseTransfer.Lot.ExpiryDate     | N        | Only applies if InventoryItem Lots expire in Evo |
| SerialNumber    | WarehouseTransfer.SerialNumbers      | N        | Only applies if InventoryItem is Serial tracked in Evo |
| ActionQty       | WarehouseTransfer.Quantity           | Y        ||
| FromLocation    | WarehouseTransfer.FromWarehouse      | Y        ||
| ToLocation      | WarehouseTransfer.ToWarehouse        | Y        ||
| Transaction ID  | WarehouseTransfer.Reference          | Y        | Prefixed with "GRANITE ID: " |
| Comment         | WarehouseTransfer.Description        | N        | If Comment is empty, will be set to "Granite Move" |


### TRANSFER

!!! note 
    Transfer integration does NOT update an existing Transfer document in Evolution. It creates a new warehouse transfer in Evolution when posted. Transactions are grouped by Code, Batch, ExpiryDate, Serial, FromLocation, ToLocation and ActionQty is summed before posting


- WarehouseTransfer. Inventory Warehouse Transfer. 
- Supports: 
    - Branch
    - LOT
    - Expiry
    - Serial
    - Comment
    - EvoTransactionCodeMove
- IntegrationPost:
    - Not supported, will always Post WarehouseTransfer 
- Pre-post validation:
    - ToLocation and FromLocation are not the same
    - InventoryItem is warehouse tracked in Evo
- Returns:
    - WarehouseTransfer.Audit

| Granite         | Evo SDK                              | Required | Behaviour |
|-----------------|--------------------------------------|----------|---------------------|
| MasterItem Code | WarehouseTransfer.InventoryItem      | Y        ||
| FromSite        | Branch                               | N        | Applies if EvoBranchContextActive is true and EvoBranchUseLocation is true, if EvoBranchUseLocation is false uses InventoryItem's branch |
| Batch           | WarehouseTransfer.Lot.Code           | N        | Only applies if InventoryItem is Lot tracked in Evo |
| ExpiryDate      | WarehouseTransfer.Lot.ExpiryDate     | N        | Only applies if InventoryItem Lots expire in Evo |
| SerialNumber    | WarehouseTransfer.SerialNumbers      | N        | Only applies if InventoryItem is Serial tracked in Evo |
| ActionQty       | WarehouseTransfer.Quantity           | Y        ||
| FromLocation    | WarehouseTransfer.FromWarehouse      | Y        ||
| ToLocation      | WarehouseTransfer.ToWarehouse        | Y        ||
| Transaction ID  | WarehouseTransfer.Reference          | Y        | Prefixed with "GRANITE ID: " |
| Comment         | WarehouseTransfer.Description        | N        | If Comment is empty, will be set to "Granite Move" |


### DYNAMICTRANSFER
- WarehouseTransfer. Inventory Warehouse Transfer. 
- Supports: 
    - Branch
    - LOT
    - Expiry
    - Serial
    - Comment
    - EvoTransactionCodeMove
- IntegrationPost:
    - Not supported, will always Post WarehouseTransfer 
- Pre-post validation:
    - ToLocation and FromLocation are not the same
    - InventoryItem is warehouse tracked in Evo
- Returns:
    - WarehouseTransfer.Audit

| Granite         | Evo SDK                              | Required | Behaviour |
|-----------------|--------------------------------------|----------|-----------|
| MasterItem Code | WarehouseTransfer.InventoryItem      | Y        ||
| FromSite        | Branch                               | N        | Applies if EvoBranchContextActive is true and EvoBranchUseLocation is true, if EvoBranchUseLocation is false uses InventoryItem's branch |
| Batch           | WarehouseTransfer.Lot.Code           | N        | Only applies if InventoryItem is Lot tracked in Evo |
| ExpiryDate      | WarehouseTransfer.Lot.ExpiryDate     | N        | Only applies if InventoryItem Lots expire in Evo |
| SerialNumber    | WarehouseTransfer.SerialNumbers      | N        | Only applies if InventoryItem is Serial tracked in Evo |
| ActionQty       | WarehouseTransfer.Quantity           | Y        ||
| FromLocation    | WarehouseTransfer.FromWarehouse      | Y        ||
| ToLocation      | WarehouseTransfer.ToWarehouse        | Y        ||
| Transaction ID  | WarehouseTransfer.Reference          | Y        | Prefixed with "GRANITE ID: " |
| Comment         | WarehouseTransfer.Description        | N        | If Comment is empty, will be set to "Granite Move" |

### MOVE
- WarehouseTransfer. Inventory Warehouse Transfer. 
- Supports: 
    - Branch
    - LOT
    - Expiry
    - Serial
    - Comment 
    - EvoTransactionCodeMove
- IntegrationPost:
    - Not supported, will always Post WarehouseTransfer 
- Pre-post validation:
    - ToLocation and FromLocation are not the same
    - InventoryItem is warehouse tracked in Evo
- Returns:
    - WarehouseTransfer.Audit

| Granite         | Evo SDK                              | Required | Behaviour |
|-----------------|--------------------------------------|----------|-----------|
| MasterItem Code | WarehouseTransfer.InventoryItem      | Y        ||
| FromSite        | Branch                               | N        | Applies if EvoBranchContextActive is true and EvoBranchUseLocation is true, if EvoBranchUseLocation is false uses InventoryItem's branch |
| Batch           | WarehouseTransfer.Lot.Code           | N        | Only applies if InventoryItem is Lot tracked in Evo |
| ExpiryDate      | WarehouseTransfer.Lot.ExpiryDate     | N        | Only applies if InventoryItem Lots expire in Evo |
| SerialNumber    | WarehouseTransfer.SerialNumbers      | N        | Only applies if InventoryItem is Serial tracked in Evo |
| ActionQty       | WarehouseTransfer.Quantity           | Y        ||
| FromLocation    | WarehouseTransfer.FromWarehouse      | Y        ||
| ToLocation      | WarehouseTransfer.ToWarehouse        | Y        ||
| Transaction ID  | WarehouseTransfer.Reference          | Y        | Prefixed with "GRANITE ID: " |
| Comment         | WarehouseTransfer.Description        | N        | If Comment is empty, will be set to "Granite Move" |

### SCRAP

!!! note 
    If setting EvoManufactureActive is true and part of the batch of the item scrapped is specified in setting EvoManufactureCodes, the item will attempt to post as a manufacturing transaction. This is not supported currently and will return an error.

- InventoryTransaction ADJ. Inventory Adjustments Decrease. 
- Supports: 
    - Branch
    - LOT
    - Expiry
    - Serial
    - Comment 
- IntegrationPost:
    - Not supported, will always Post InventoryTransaction 
- Pre-post validation:
    - ActionQty is greater than 0
- Returns:
    - InventoryTransaction.Audit

| Granite         | Evo SDK                              | Required | Behaviour |
|-----------------|--------------------------------------|----------|---------------------|
| MasterItem Code | InventoryTransaction.InventoryItem   | Y        ||
| FromSite        | Branch                               | N        | Applies if EvoBranchContextActive is true and EvoBranchUseLocation is true, if EvoBranchUseLocation is false uses InventoryItem's branch |
| ToLocation      | InventoryTransaction.Warehouse       | Y        | If ToLocation is empty, uses FromLocation |
| ActionQty       | InventoryTransaction.Quantity        | Y        ||
| Comment         | InventoryTransaction.Reference2      | N        | If Comment is empty, will be set to "Granite Adjustment" |
| Batch           | InventoryTransaction.Lot.Code        | N        | Only applies if InventoryItem is Lot tracked in Evo |
| ExpiryDate      | InventoryTransaction.Lot.ExpiryDate  | N        | Only applies if InventoryItem Lots expire in Evo |
| SerialNumber    | InventoryTransaction.SerialNumbers   | N        | Only applies if InventoryItem is Serial tracked in Evo |
| Transaction ID  | InventoryTransaction.Reference       | Y        | Prefixed with "GRANITE ID: " |

### PICK

!!! note 
    Branch can be set on the Sales Order header OR on the Sales Order line using the Inventory Item on the line. 
    
    Lot support for picking does not work like it does on other integration methods. 
    
    If the lot number is specified on a line in Evolution, we must pick the same lot in Granite.

    If we do not pick the same lot in Granite on the same line, we will not post the qty picked on the line in Granite.

- SalesOrder. Order Entry Sales Order.
- Supports: 
    - Branch
    - LOT
    - Serial
    - Comment
    - DocumentReference
- IntegrationPost:
    - False - Save SalesOrder
    - True - Process SalesOrder
- Returns:
    - SalesOrder number or Invoice number, depending on IntegrationPost setting

| Granite                       | Evo SDK                    | Required | Behaviour |
|-------------------------------|----------------------------|----------|-----------|
| ActionQty                     | Detail.ToProcess           | Y        ||
| Batch                         | Detail.Note                | N        | Only applies if setting EvoBatchInNotes is true. Adds to comma separated list of unique batches |
| SerialNumber                  | Detail.SerialNumbers       | N        | Only applies if InventoryItem is Serial tracked in Evo |
| Comment                       | SalesOrder.ExternalOrderNo | N        ||
| Transaction.DocumentReference | SalesOrder.MessageLine1    | N        ||


### DYNAMICPICK

!!! note 
    Branch is set based on the Sales Order header 
    
    Transactions are grouped by Code, Batch, ExpiryDate, Serial, FromLocation, ToLocation and ActionQty is summed before posting

- SalesOrder. Order Entry Sales Order. 
- Supports: 
    - TradingPartner
    - Branch
    - Comment 
- IntegrationPost:
    - False - Save SalesOrder
    - True - Process SalesOrder
- Returns:
    - SalesOrder number or Invoice number, depending on IntegrationPost setting

| Granite                     | Evo SDK                         | Required | Behaviour |
|-----------------------------|---------------------------------|----------|-----------|
| Document TradingPartnerCode | SalesOrder.Customer             | Y        ||
| MasterItem Code             | Detail.InventoryItem            | Y        ||
| ActionQty                   | Detail.Quantity                 | Y        ||
| ActionQty                   | Detail.ToProcess                | Y        ||
| Comment                     | SalesOrder.ExternalOrderNo      | N        ||

### RECEIVE

!!! note 
    Branch can be set on the Purchase Order header OR on the Purchase Order line using the Inventory Item on the line. 

Lot support for receiving does not work like it does on other integration methods. 
If the lot number is specified on a line in Evolution, we must receive the same lot in Granite.
If we do not receive the same lot in Granite on the same line, we will not post the qty received on the line in Granite.
If the lot number is not specified on line in Evolution but the InventoryItem is Lot tracked, we will post the Batch received in Granite.

Transactions are grouped by Code, Batch, ExpiryDate, Serial, FromLocation, ToLocation and ActionQty is summed before posting

- PurchaseOrder. Order Entry Purchase Order. 
- Supports: 
    - Branch
    - LOT
    - Expiry
    - Serial
    - Comment 
- IntegrationPost:
    - False - Save PurchaseOrder
    - True - ProcessStock PurchaseOrder
- Returns:
    - PurchaseOrder number or Receipt number, depending on IntegrationPost setting

| Granite         | Evo SDK                        | Required | Behaviour |
|-----------------|--------------------------------|----------|---------------------|
| ActionQty       | Detail.ToProcess               | Y        ||
| Batch           | Detail.Lot.Code                | N        | Only applies if InventoryItem is Lot tracked in Evo, and Lot is not specified on the line in Evo |
| ExpiryDate      | Detail.Lot.Code                | N        | Only applies if InventoryItem Lots are set to expire in Evo |
| SerialNumber    | Detail.SerialNumbers           | N        | Only applies if InventoryItem is Serial tracked in Evo |
| Comment         | PurchaseOrder.ExternalOrderNo  | N        ||

### DYNAMICRECEIVE

!!! note 
    Branch is set based on the Purchase Order header.
    
    Transactions are grouped by Code, Batch, ExpiryDate, Serial, FromLocation, ToLocation and ActionQty is summed before posting

- PurchaseOrder. Order Entry Purchase Order. 
- Supports: 
    - TradingPartner
    - Branch
    - Comment 
- IntegrationPost:
    - False - Save PurchaseOrder
    - True - Process PurchaseOrder
- Returns:
    - PurchaseOrder number or Receipt number, depending on IntegrationPost setting

| Granite                     | Evo SDK                         | Required | Behaviour |
|-----------------------------|---------------------------------|----------|---------------------|
| Document TradingPartnerCode | PurchaseOrder.Supplier          | Y        ||
| MasterItem Code             | Detail.InventoryItem            | Y        ||
| ActionQty                   | Detail.Quantity                 | Y        ||
| ActionQty                   | Detail.ToProcess                | Y        ||
| Comment                     | PurchaseOrder.ExternalOrderNo   | N        ||

### RECEIVELINE

!!! note 
    Branch can be set on the Purchase Order header OR on the Purchase Order line using the Inventory Item on the line. 

Lot support for receiving does not work like it does on other integration methods. 
If the lot number is specified on a line in Evolution, we must receive the same lot in Granite.
If we do not receive the same lot in Granite on the same line, we will not post the qty received on the line in Granite.
If the lot number is not specified on line in Evolution but the InventoryItem is Lot tracked, we will post the Batch received in Granite.

Transactions are grouped by Code, Batch, ExpiryDate, Serial, FromLocation, ToLocation and ActionQty is summed before posting

- PurchaseOrder. Order Entry Purchase Order. 
- Supports: 
    - Branch
    - LOT
    - Expiry
    - Serial
    - Comment (Evolution ExternalOrderNo field)
- IntegrationPost:
    - Not supported, will always Save PurchaseOrder
- Returns:
    - PurchaseOrder number

| Granite         | Evo SDK                        | Required | Behaviour |
|-----------------|--------------------------------|----------|---------------------|
| ActionQty       | Detail.ToProcess               | Y        ||
| Batch           | Detail.Lot.Code                | N        | Only applies if InventoryItem is Lot tracked in Evo, and Lot is not specified on the line in Evo |
| ExpiryDate      | Detail.Lot.Code                | N        | Only applies if InventoryItem Lots are set to expire in Evo |
| SerialNumber    | Detail.SerialNumbers           | N        | Only applies if InventoryItem is Serial tracked in Evo |
| Comment         | PurchaseOrder.ExternalOrderNo  | N        ||

### MANUFACTURE

!!! note 
    Transactions are grouped by Code, Batch, ExpiryDate, Serial, FromLocation, ToLocation and ActionQty is summed before posting

- Custom implementation using SDK GLTransaction MFMF, MFDR, MFR4M in conjunction with Database _bspPostStTrans.

- Posts 2 GL transactions with TransactionCode "MFDR" for each BOM Item
    - Credit account is InventoryItem Group's StockAccount
    - Debit account is GL Account "7600"

- Posts a GL transaction with transaction code "MFMF" for each BOM Item
    - Credits GL account "7600"

- Posts a GL transaction with TransactionCode "40" for the manufactured item
    - Debits manufactured item's group's StockAccount (if null defaults to "7700>020")

- Executes procedure _bspPostStTrans twice for each BOM Item
    - MFDR
    - MFR4M

- Executes procedure _bspPostStTrans for the manufactured item
    - MFMF

- Returns AutoIndex from final _bspPostStTrans if successful
### ISSUE

- InventoryTransaction IIS. Pastel OverrideCreditAccount based on Granite transaction Comment.
- Supports: 
    - Branch
    - LOT
    - Expiry
    - Comment (Evolution Reference2 field)
- IntegrationPost:
    - Not supported, will always Post InventoryTransaction
- Returns:
    - InventoryTransaction.Audit

| Granite         | Evo SDK                                    | Required | Behaviour |
|-----------------|--------------------------------------------|----------|---------------------|
| MasterItem Code | InventoryTransaction.InventoryItem         | Y        ||
| FromSite        | Branch                                     | N        | Applies if EvoBranchContextActive is true and EvoBranchUseLocation is true, if EvoBranchUseLocation is false uses InventoryItem's branch |
| FromLocation    | InventoryTransaction.Warehouse             | Y        ||
| ActionQty       | InventoryTransaction.Quantity              | Y        ||
| Comment         | InventoryTransaction.Reference2            | N        | If Comment is empty, will set "Granite Issue" |
| Comment         | InventoryTransaction.OverrideCreditAccount | N        | If Comment is a valid GL Account Code, it will override the default credit account |
| Batch           | InventoryTransaction.Lot.Code              | N        | Only applies if InventoryItem is Lot tracked in Evo |
| ExpiryDate      | InventoryTransaction.Lot.Code              | N        | Only applies if InventoryItem Lots are set to expire in Evo |
| Transaction ID  | InventoryTransaction.Reference             | N        | Prefixed with "GRANITE ID: " |


### PROJECTISSUE
- InventoryTransaction. Qty decrease against a project
- Supports:
    - EvoTransactionCodeProjectsIssue (See settings detail)
    - Branch
    - LOT
    - Expiry
    - Comment (Evolution Reference2 field)
- IntegrationPost:
    - Not supported, will always Post InventoryTransaction
- Returns:
    - InventoryTransaction.Audit

| Granite                           | Evo SDK                                       | Required  | Behaviour |
|-----------------------------------|-----------------------------------------------|-----------|-----------|
| MasterItem Code                   | InventoryTransaction.InventoryItem            | Y         ||
| FromSite                          | Branch                                        | N         | Applies if EvoBranchContextActive is true and EvoBranchUseLocation is true, if EvoBranchUseLocation is false uses InventoryItem's branch |
| EvoTransactionCodeProjectsIssue   | InventoryTransaction.TransactionCode          | Y         ||
| TransactionDocumentReference      | InventoryTransaction.Project                  | Y         ||
| FromLocation                      | InventoryTransaction.Warehouse                | Y         ||
| ActionQty                         | InventoryTransaction.Quantity                 | Y         ||
| Comment                           | InventoryTransaction.Reference2               | N         | If Comment is empty, will set "Granite Issue" |
| Batch                             | InventoryTransaction.Lot.Code                 | N         | Only applies if InventoryItem is Lot tracked in Evo |
| ExpiryDate                        | InventoryTransaction.Lot.Code                 | N         | Only applies if InventoryItem Lots are set to expire in Evo |
| Comment                           | InventoryTransaction.OverrideCreditAccount    | N         | If Comment is a valid GL Account Code, it will override the default credit account |
| Transaction ID                    | InventoryTransaction.Reference                | N         | Prefixed with "GRANITE ID: " |

### Custom Methods for clients

#### AMBRO_ADJUSTMENT

- Complete custom as per customer requirements.

___


## External Resources

### Document Profiles/Agents
Video on Document profiles for agents.
[https://www.youtube.com/watch?v=Y-RUXaGBg9A](https://www.youtube.com/watch?v=Y-RUXaGBg9A)

