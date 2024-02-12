# Evolution

This document contains all of the information needed to set up and configure integration with Evolution.
There are two parts to the complete integration solution:

The [SDK Provider](#sdk-provider) is used by the Integration Service to map transactions performed in Granite to the relevant format for Evolution.

The [integration jobs](#integration-jobs) are used by the [Scheduler](../scheduler/manual.md) to pull Evolution's documents, item codes, and trading partners into Granite.

## SDK Provider

The Evolution SDK provider is responsible for mapping Granite transactions to the relevant format for posting to Evolution. It makes use of the Evolution SDK in order to post.

### Setup

1. Check the version of the Evolution SDK that is currently installed on the server. The SDK is usually found at `C:\Program Files (x86)\Sage Evolution`. Take note of the first two numbers of `Pastel.Evolution.dll` file version.

    **`Take Note`** If the SDK is not yet installed, please engage with the client's Evolution consultant - the SDK is required for Granite integration.

2. In the `Providers\Evo` folder, find the `EvoX.Y` folder matching the installed SDK version. `X.Y` must match the first two numbers of the installed SDK version. For example, if the installed SDK version is 7.20.0.14, you will take the files from the Evo7.20 folder

3. **Copy** the dll's from the `Providers\Evo\EvoX.Y` folder into Integration Service folder (root folder).
    - Pastel.Evolution.dll
    - Pastel.Evolution.Common.dll (if present in the folder)

4. **Copy** the following from the `Providers\Evo` folder into Integration Service folder (root folder)
    - docs folder
    - Granite.Integration.PastelEvo.dll
    - SDKProvider.xml

5. Ensure `SDKProvider.xml` setup or copied correctly
  
        <module name="Provider">
        <bind
            service="Granite.Integration.Contract.IProvider, Granite.Integration.Contract"
            to="Granite.Integration.PastelEvo.Provider, Granite.Integration.PastelEvo"/>
        </module>

6. Open the `DependentAssembly.xml` file in your `EvoX.Y` folder and copy it's contents. Paste the contents into the `<assemblyBinding xmlns="urn:schemas-microsoft-com:asm.v1">` node near the bottom of the `Granite.Integration.Web.exe.config` file. It should look like this:

    
        <assemblyBinding xmlns="urn:schemas-microsoft-com:asm.v1">
        <dependentAssembly>
            <assemblyIdentity name="Iesi.Collections" publicKeyToken="aa95f207798dfdb4" culture="neutral" />
            <bindingRedirect oldVersion="0.0.0.0-4.0.0.0" newVersion="4.0.0.0" />
        </dependentAssembly>
        <dependentAssembly>
            <assemblyIdentity name="Ninject" publicKeyToken="c7192dc5380945e7" culture="neutral" />
            <bindingRedirect oldVersion="0.0.0.0-3.3.4.0" newVersion="3.3.4.0" />
        </dependentAssembly>
        <dependentAssembly>
            <assemblyIdentity name="System.Threading.Tasks.Extensions" publicKeyToken="cc7b13ffcd2ddd51" culture="neutral" />
            <bindingRedirect oldVersion="0.0.0.0-4.2.0.1" newVersion="4.2.0.1" />
        </dependentAssembly>
        <dependentAssembly>
            <assemblyIdentity name="Pastel.Evolution" publicKeyToken="1a4bc88fe3044688" culture="neutral" />
            <bindingRedirect oldVersion="0.0.0.0-11.0.0.0" newVersion="11.0.0.0" />
        </dependentAssembly>
        </assemblyBinding>
    

7. Configure your connection string and endpoint in the `Granite.Integration.Web.exe.config` file

___
### Settings

#### Config File

The settings for Sage 200 (Evo) are configured in the SystemSettings table. The IntegrationService will pick up the settings using the Application name specified in it's `.config` file:
```
<add key ="SystemSettingsApplicationName" value="IntegrationSage200"/>
```
If this setting is missing from the config file or left empty, the IntegrationService will default to using `IntegrationSage200` as the SystemSettingsApplicationName

You can browse the IntegrationService's `/config` page to have the IntegrationService create the default settings in the SystemSettings table for you.

The script to insert the default settings is also located in the GraniteDatabase release:
```
~\GraniteDatabase\Data\SystemSettings\SystemSettingsEvolution.sql
```

**`Take Note`** To pick up any changes to the SystemSettings table, the IntegrationService will need to be restarted.

#### Database SystemSettings

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


**`Take Note`** in most cases the Data and Common Pastel EVO database is on the same SQL instance and
settings will be the same.

##### EvoSqlServer
- SQL server instance name

##### EvoDatabase
- Pastel EVO database name

##### EvoSqlUserName
- SQL server username

##### EvoSqlPassword
- SQL server password

##### EvoCommonSqlServer
- SQL server instance name for common database

##### EvoCommonDatabase
- Pastel EVO common database name

##### EvoCommonSqlUserName
- SQL server username for common database

##### EvoCommonSqlPassword
- SQL server password for common database

##### EvoSDKSerialNumber
- SDK serial number

##### EvoSDKAuthKey
- SDK Auth key

##### EvoBreakApartActive
- Options: true / false
- Used by: SCRAP
- When active validate the Batch against the EvoManufactureCodes (appsetting)

##### EvoManufactureActive
- Options: true / false
- Used by: TAKEON
- Workings: When active verify against EvoManufactureCodes (app setting) if valid perform custom Manufacture (MANUFACTURE post).

##### EvoManufactureCodes
- Options: comma separated codes. Example : 3214, 3431, 9876
- Used by: EvoManufactureActive (TAKEON, SCRAP)

##### EvoBranchContextActive	
- Options: true / false
- Used by: Application level
- When active set branch. Branch based on Pastel item OR EvoBranchUseLocation setting.
- EvoBranchUseLocation: see setting.

##### EvoBranchUseLocation
- Options: true / false
- Used by: EvoBranchContextActive
- When active use Granite site on transaction as branch ID.

##### EvoTransactionCodeGoodsReceiveVoucher
- Options: string value representing GoodsReceive Voucher code
- Used by: TAKEON Inventory transaction code 

##### EvoTransactionCodeAdjustments
- Options: string value representing transaction inventory code
- Used by: ADJUSTMENT Inventory transaction code 

##### EvoTransactionCodeReclassifyAdjustments
- Options: string value representing transaction inventory code
- Used by: RECLASSIFY Inventory transaction code 

##### EvoTransactionCodeMove
- Options: string value representing transaction inventory code
- Used by: MOVE Inventory transaction code 

##### EvoTransactionCodeTransfer
- Options: string value representing transaction inventory code
- Used by: TRANSFER Inventory transaction code 

##### EvoTransactionCodeIssue
- Options: string value representing transaction inventory code
- Used by: ISSUE Inventory transaction code 
___

### Integration Methods
By default if the method name below is the same as a Granite Transaction type, it will autowire the integration.
If you require a different integration action you can specify the name below in the Process IntegrationMethod
property.

#### TAKEON

**`Take Note`** If setting EvoManufactureActive is true and part of the batch of the item taken on is specified in setting EvoManufactureCodes, the item is posted using [MANUFACTURE](#manufacture) method

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

#### ADJUSTMENT
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

#### RECLASSIFY

**`Take Note`** Processes two InventoryAdjustments in Evo. One decreases the qty of the original item code, and the other increases the qty of the new item code.

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

#### REPLENISH
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


#### TRANSFER

**`Take Note`** Transfer integration does NOT update an existing Transfer document in Evolution. It creates a new warehouse transfer in Evolution when posted. Transactions are grouped by Code, Batch, ExpiryDate, Serial, FromLocation, ToLocation and ActionQty is summed before posting


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


#### DYNAMICTRANSFER
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

#### MOVE
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

#### SCRAP

**`Take Note`** If setting EvoManufactureActive is true and part of the batch of the item scrapped is specified in setting EvoManufactureCodes, 
the item will attempt to post as a manufacturing transaction. This is not supported currently and will return an error.

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

#### PICK

**`Take Note`** Branch can be set on the Sales Order header OR on the Sales Order line using the Inventory Item on the line. 
Lot support for picking does not work like it does on other integration methods. 
If the lot number is specified on a line in Evolution, we must pick the same lot in Granite.
If we do not pick the same lot in Granite on the same line, we will not post the qty picked on the line in Granite.

- SalesOrder. Order Entry Sales Order.
- Supports: 
    - Branch
    - LOT
    - Serial
    - Comment
- IntegrationPost:
    - False - Save SalesOrder
    - True - Process SalesOrder
- Returns:
    - SalesOrder number or Invoice number, depending on IntegrationPost setting

| Granite         | Evo SDK                    | Required | Behaviour |
|-----------------|----------------------------|----------|-----------|
| ActionQty       | Detail.ToProcess           | Y        ||
| Batch           | Detail.Note                | N        | Only applies if setting EvoBatchInNotes is true. Adds to comma separated list of unique batches |
| SerialNumber    | Detail.SerialNumbers       | N        | Only applies if InventoryItem is Serial tracked in Evo |
| Comment         | SalesOrder.ExternalOrderNo | N        ||

#### DYNAMICPICK

**`Take Note`** Branch is set based on the Sales Order header
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

#### RECEIVE

**`Take Note`** Branch can be set on the Purchase Order header OR on the Purchase Order line using the Inventory Item on the line. 

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

#### DYNAMICRECEIVE

**`Take Note`** Branch is set based on the Purchase Order header.
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

#### RECEIVELINE

**`Take Note`** Branch can be set on the Purchase Order header OR on the Purchase Order line using the Inventory Item on the line. 

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

#### MANUFACTURE

**`Take Note`** Transactions are grouped by Code, Batch, ExpiryDate, Serial, FromLocation, ToLocation and ActionQty is summed before posting

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
#### ISSUE

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


#### PROJECTISSUE
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

#### Custom Methods for clients

##### AMBRO_ADJUSTMENT

- Complete custom as per customer requirements.

___


### External Resources

#### Document Profiles/Agents
Video on Document profiles for agents.
https://www.youtube.com/watch?v=Y-RUXaGBg9A


## Integration Jobs

Integration jobs are a special type of [Scheduler](../scheduler/manual.md) job called [injected jobs](../scheduler/manual.md#injected-jobs-integration-jobs). 
See below for information for specifics on how document and master data jobs work

### How Document jobs work
Triggers on the ERP document tables insert a record into the Granite IntegrationDocumentQueue table whenever a change is applied to a document. 

Scheduler runs injected jobs that monitor the IntegrationDocumentQueue table for records that need to be processed.

When a record with Status 'ENTERED' is found, the job uses views on the Granite database to fetch the 
information related to that document from the ERP database and apply the changes to the Granite document. 

All valid changes to data in the Granite tables are logged to the Audit table, showing the previous value and the new value.

If a change is made in the ERP system that would put Granite into an invalid state, no changes are applied. Instead, the ERPSyncFailed field is set to true and the ERPSyncFailedReason field shows the reason for the failure. The IntegrationLog table will contain futher details on the failure if applicable.

### How master data jobs work
MasterItems and TradingPartners have their own jobs. These jobs compare the results of their respective views to the data in the Granite tables and insert new records / update records as needed.

The document jobs themselves also sync changes to the TradingPartners & MasterItems that are on the document. This means that on sites that do not process a lot of changes to master data you can limit the MasterItem/TradingPartner jobs to running once a day or even less frequently. 
The only thing they are really still needed for is setting isActive to false when something is deactivated in the ERP system.

### Install

**`Take Note`** If you are upgrading from the old StoredProcedure/Trigger integration, ensure that ERPIdentification (Document, DocumentDetail, MasterItem, TradingPartner) column is populated with correct values before attempting to start the new jobs

#### Set up database triggers & views

Run the create scripts for the views and triggers that you will need for the version of ERP & document types that the site uses.

All document types also require the Integration_ERP_MasterItem view.

#### Add the Injected job files to GraniteScheduler
To add the injected job files to the GraniteScheduler, simply copy the dlls and xml files into the root folder of GraniteScheduler. 

Example:

![Injectedjobfiles](evo-img\injectedjobfiles.png)

### Configure
#### Schedule configuration
See the GraniteScheduler manual for how to configure scheduled jobs - ERP document integration jobs are of type INJECTED

#### Email on Error
To enable mail notifications for failures you will need to add the Email_IntegrationError mail template stored procedure to your database and configure it. This is the template procedure that is used for all error notifications in these injected jobs. 

When there is a failure while syncing a document, a ONCE only email job is added to GraniteScheduler that will detail the error messages. The job input for the email job will contain the document number and the messages that were logged surrounding the failure.

See the GraniteScheduler documentation for more information on email jobs.

Then for each job that needs to send failure notifications, add a job input for MailOnError:

| JobName | Name | Value |
| --- | --- | --- |
| < JobName goes here >| MailOnError | true |

#### View customisation
Each view can be customised to include custom logic or map extra fields to fields on the corresponding Granite table. 

All of the standard fields on Granite tables are supported, simply add the required field to your view with an alias matching the Granite field name on the table the view maps to.

Non standard fields are also supported, but for these to work your column name on the destination table must start with 'Custom'. On the view, simply alias the name of the field to match the name of the field on the destination Granite table, including the 'Custom' prefix.

For fields like Document.Status where you may have custom rules / statuses, use a CASE statement in your view definition so that the view returns the Status that you want to set on the Granite Document table.

It is highly advised that you check the validity of yor job on the GraniteScheduler /config page after making a change to your view! Especially after changing filter criteria/joins, your view may be returning duplicate rows - the job validation will bring this to your attention.

### What's different about Evolution jobs

#### Single line per MasterItem for INTRANSIT, RECEIPT, and TRANSFER
Because of the way that these documents are stored and managed on the Evolution database, we can only handle a single line per MasterItem on transfer documents. If a document of one of these types contains multiple lines for a MasterItem, the document insert/update will fail setting the ERPSyncFailedReason accordingly. 

#### SalesOrders and PurchaseOrders line mapping
Because Evolution stores multiple copies of SalesOrders and PurchaseOrders when changes are made or the document changes status, there is special logic implemented to find the correct versions of lines on the Evolution database.
It is calculated using the idInvoiceLines (DocumentDetail ERPIdentification) and the iOrigLineID field. For that reason, the SalesOrderDetail and PurchaseOrderDetail views MUST include all rows from the _btblInvoiceLines table for any given document.
These views must not modify the values in ERPIdentification or iOrigLineID for any reason.

#### Changing MasterItem codes
If Rename Item Code is used in Evolution to change an Item Code, we will update the MasterItem in Granite to match, thereby updating all of the TrackingEntities and Transactions to the new Code as well. 

We will not update the MasterItem in Granite if a new Item Code is created in Evolution and Global Item Change is used to change Evolution stock over to the new Item Code. In this case the new Item Code will be added to Granite, but all TrackingEntities will need to be reclassified to the new MasterItem.

### Things to look out for

#### Importance of ERPIdentification
The injected jobs use the ERPIdentification column on the Document, DocumentDetail and MasterItem tables to look for matching records in the corresponding view. It is very important that you ensure that these values are populated for all records in Granite if you are upgrading from the old Document stored procedures.

#### Validation
Each job type has it's own validation criteria that must be passed before the job will execute. You can check the validity of injected jobs on the GraniteScheduler /config page. 

Here is an example of some failed validation:

![Injectedjobsvalidation](evo-img\injectedjobsvalidation.png)

### Supported Document types

- ORDER (SalesOrder)
- RECEIVING (PurchaseOrder)
- INTRANSIT (InterBranchTransfer)
- RECEIPT (InterBranchReceipt)
- TRANSFER (WarehouseTransfer)
- WORKORDER (ManufactureProcess)