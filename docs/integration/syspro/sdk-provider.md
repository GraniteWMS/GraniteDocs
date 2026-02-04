# Syspro

## Setup

1. **Copy** everything in the `Providers\Syspro` folder into Integration Service folder (root folder).

2. Ensure `SDKProvider.xml` setup or copied correctly
    ```xml
    <module name="Provider">
    <bind
        service="Granite.Integration.Contract.IProvider, Granite.Integration.Contract"
        to="Granite.Integration.Syspro.Provider, Granite.Integration.Syspro"/>
    </module>
    ```

3. Configure your connection string and endpoint in the `Granite.Integration.Web.exe.config` file


## Settings

The settings for Syspro are configured in the SystemSettings table. The IntegrationService will pick up the settings using the Application name specified in it's `.config` file:
```xml
<add key ="SystemSettingsApplicationName" value="IntegrationSyspro"/>
```
If this setting is missing from the config file or left empty, the IntegrationService will default to using `IntegrationSyspro` as the SystemSettingsApplicationName

You can browse the IntegrationService's `/config` page to have the IntegrationService create the default settings in the SystemSettings table for you.

The script to insert the default settings is also located in the GraniteDatabase release:
```
~\GraniteDatabase\Data\SystemSettings\SystemSettingSyspro.sql
```

!!! note 
    To pick up any changes to the SystemSettings table, the IntegrationService will need to be restarted.

### Example SystemSettings in database

| Application       | Key                                       | Value | Description                                                                       | 
|-------------------|-------------------------------------------|-------|-----------------------------------------------------------------------------------|
| IntegrationSyspro | SysproWriteXML                            |       | If true, logs XML that would be posted to C drive instead of posting to Syspro    |
| IntegrationSyspro | Operator                                  |       | Syspro Operator name                                                              |
| IntegrationSyspro | OperatorPassword                          |       | Syspro Operator password                                                          |
| IntegrationSyspro | CompanyId                                 |       | Syspro CompanyID                                                                  |
| IntegrationSyspro | CompanyPassword                           |       | Syspro Company password                                                           |
| IntegrationSyspro | SalesOrderPosting                         |       | Syspro business object to use for SalesOrder posting (SORTBO or SORTOS or ALL)    |
| IntegrationSyspro | TransferPosting                           |       | Syspro integration method for Transfers (GIT or INVT)                             |
| IntegrationSyspro | Instance                                  |       | Syspro Instance to use (empty for default)                                        |
| IntegrationSyspro | MultipleBins                              |       | true or false. Set to true when Syspro has multiple bins enabled                  |
| IntegrationSyspro | SerialNumbers                             |       | true or false. Set to true when Syspro has SerialNumbers enabled                  |
| IntegrationSyspro | WIPLedgerCode                             |       | Syspro WIP ledger code (used by CONSUME / WIPTMI)                                 |

### SysproWriteXML
- Instead of posting the transaction write to xml. Output will be in root C:

### Operator
- Syspro operator name

### OperatorPassword
- Syspro operator password

### CompanyId
- Syspro company name

### CompanyPassword
- Syspro company password

### SalesOrderPosting
- Options: SORTBO / SORTOS / ALL
- Used By: PICKING
- SORTBO: post to business object SORTBO
- SORTOS: post to business object SORTOS
- ALL: Clear SORTBO, post SORTBO, post SORTOS

### TransferPosting
- Options: INVT / GIT
- Used By: TRANSFER (TRANSFER / INTRANSIT / RECEIPT)

### Instance
- The instance to use when connecting to Syspro
- Leave empty for default

### MultipleBins
- Not fully implemented
- Set to true when Syspro has multiple bins enabled

### SerialNumbers
- Not fully implemented
- Set to true when Syspro has SerialNumbers enabled

### WIPLedgerCode
- Syspro WIP ledger code
- Used By: CONSUME (WIPTMI)

## Integration Methods

### TAKEON
- INVTMR. Inventory Receipts

INVTMR Parameters:

| Parameter Name                | Value         |
|-------------------------------|---------------|
| TransactionDate               | DateTime.Now  |
| IgnoreWarnings                | N             |
| ApplyIfEntireDocumentValid    | Y             |
| ValidateOnly                  | N             |
| ManualSerialTransfersAllowed  | N             |
| ReturnDetailedReceipt         | N             |
| IgnoreAnalysis                | Y             |

INVTMRDOC Items mapping:

| Granite       | Syspro        | 
|---------------|---------------|
| ToLocation    | Warehouse     |
| Code          | StockCode     |
| ActionQty     | Quantity      |
| Batch         | Lot           |
| UOM           | UnitOfMeasure |

### ADJUSTMENT
- INVTMA. Inventory Adjustments

INVMA Parameters:

| Parameter Name                | Value         |
|-------------------------------|---------------|
| TransactionDate               | DateTime.Now  |
| PhysicalCount                 | N             |
| PostingPeriod                 | C             |
| IgnoreAnalysis                | Y             |
| IgnoreWarnings                | N             |
| ApplyIfEntireDocumentValid    | Y             |
| ValidateOnly                  | N             |

INVTMADOC Items mapping:

| Granite       | Syspro        | 
|---------------|---------------|
| ToLocation    | Warehouse     |
| Code          | StockCode     |
| ActionQty     | Quantity      |
| Batch         | Lot           |
| UOM           | UnitOfMeasure |

### RECLASSIFY
- Not implemented/supported

### REPLENISH
- INVTMO. Inventory Warehouse Transfer

INVTMO Parameters:

| Parameter Name                | Value         |
|-------------------------------|---------------|
| IgnoreWarnings                | Y             |
| CreateDestinationWarehouse    | N             |
| ApplyIfEntireDocumentValid    | Y             |
| ValidateOnly                  | N             |

INVTMODOC Items mapping:

| Granite       | Syspro        | Behaviour |
|---------------|---------------|-----------|
|               | Immediate     | Set to Y  |
|               | NoDestination | Set to N  |
| FromLocation  | FromWarehouse |           |
| ToLocation    | ToWarehouse   |           |
| Code          | StockCode     |           |
| ActionQty     | Quantity      |           |
| Batch         | Lot           |           |
| UOM           | UnitOfMeasure |           |

### TRANSFER
Based on setting TransferPosting (INVT or GIT)

- INVT
    - TRANSFER/INTRANSIT: INVTMO
    - RECEIPT: INVTMI
- GIT 
    - TRANSFER/INTRANSIT: SORTBO
    - RECEIPT: INVTMN

INVTMO Parameters:

| Parameter Name                | Value         |
|-------------------------------|---------------|
| IgnoreWarnings                | Y             |
| CreateDestinationWarehouse    | N             |
| ApplyIfEntireDocumentValid    | Y             |
| ValidateOnly                  | N             |

INVTMODOC Items mapping:

| Granite               | Syspro        | Behaviour |
|-----------------------|---------------|-----------|
|                       | Immediate     | Set to Y  |
|                       | NoDestination | Set to N  |
| DocumentDescription   | Reference     |           |
| FromLocation          | FromWarehouse |           |
| ToLocation            | ToWarehouse   |           |
| Code                  | StockCode     |           |
| ActionQty             | Quantity      |           |
| Batch                 | Lot           |           |
| UOM                   | UnitOfMeasure |           |

SORTBO Parameters:

| Parameter Name                | Value         |
|-------------------------------|---------------|
| IgnoreWarnings                | Y             |
| ApplyIfEntireDocumentValid    | Y             |
| ValidateOnly                  | N             |

SORTBODOC Item mapping:

| Granite       | Syspro                | 
|---------------|-----------------------|
| N             | ZeroShipQuantity      |
| Item8         | OrderStatus           |
| Document      | SalesOrder            |
| LineNumber    | SalesOrderLine        |
| Code          | StockCode             |
| ToLocation    | Warehouse             |
| ActionQty     | Quantity              |
| Batch         | Lot                   |
| UOM           | UnitOfMeasure         |

INVTMI Parameters:

| Parameter Name                | Value         |
|-------------------------------|---------------|
| IgnoreWarnings                | Y             |
| ApplyIfEntireDocumentValid    | Y             |
| ValidateOnly                  | N             |


INVTMIDOC Item mapping

| Granite               | Syspro        | 
|-----------------------|---------------|
| DocumentDescription   | Reference     |
| ToLocation            | Warehouse     |
| Code                  | StockCode     |
| ActionQty             | Quantity      |
| Batch                 | Lot           |
| UOM                   | UnitOfMeasure |


INVTMN Parameters:

| Parameter Name                | Value         |
|-------------------------------|---------------|
| IgnoreWarnings                | Y             |
| ApplyIfEntireDocumentValid    | Y             |
| ValidateOnly                  | N             |

INVTMNDOC Item mapping:

| Granite               | Syspro                | 
|-----------------------|-----------------------|
| LineNumber            | Key.LineNumber        |
| ToLocation            | Key.TargetWarehouse   |
| FromLocation          | Key.SourceWarehouse   |
| DocumentDescription   | Key.GtrReference      |
| ActionQty             | Quantity              |


### MOVE
- INVTMO. Inventory Warehouse Transfer

INVTMO Parameters:

| Parameter Name                | Value         |
|-------------------------------|---------------|
| IgnoreWarnings                | Y             |
| CreateDestinationWarehouse    | N             |
| ApplyIfEntireDocumentValid    | Y             |
| ValidateOnly                  | N             |

INVTMODOC Items mapping:

| Granite       | Syspro                | Behaviour |
|---------------|-----------------------|-----------| 
|               | Immediate             | Set to Y  |
|               | NoDestination         | Set to N  |
| FromLocation  | FromWarehouse         |           |
| ToLocation    | ToWarehouse           |           |
| Code          | StockCode             |           |
| ActionQty     | Quantity              |           |
| Batch         | Lot                   |           |
| UOM           | UnitOfMeasure         |           |

### SCRAP
- INVTMA. Inventory Adjustments

INVMA Parameters:

| Parameter Name                | Value         |
|-------------------------------|---------------|
| TransactionDate               | DateTime.Now  |
| PhysicalCount                 | N             |
| PostingPeriod                 | C             |
| IgnoreAnalysis                | Y             |
| IgnoreWarnings                | N             |
| ApplyIfEntireDocumentValid    | Y             |
| ValidateOnly                  | N             |

INVTMADOC Items mapping:

| Granite       | Syspro                | 
|---------------|-----------------------|
| Code          | StockCode             |
| ActionQty     | Quantity              |
| Batch         | Lot                   |
| UOM           | UnitOfMeasure         |
| ToLocation    | Warehouse             |

### PICK
Based on setting SalesOrderPosting (SORTBO/SORTOS/ALL)

- SORTBO
    - SORTBO PostSorBackOrderRelease
- SORTOS
    - SORTOS PostSorOrderStatus
- ALL
    - SORTBO PostSorBackOrderRelease Clear (Set qty 0)
    - SORTBO PostSorBackOrderRelease set qty from Granite
    - SORTOS PostSorOrderStatus
    - SORTIC PostSalesOrderInvoice

#### SORTBO Setting
SORTBO Parameters:

| Parameter Name                | Value         |
|-------------------------------|---------------|
| IgnoreWarnings                | Y             |
| ApplyIfEntireDocumentValid    | Y             |
| ValidateOnly                  | N             |

SORTBODOC Item mapping:

| Granite       | Syspro                | Behaviour     |
|---------------|-----------------------|---------------|
|               | ZeroShipQuantity      | Set to N      |
|               | ReleaseFromShip       | Set to N      |
|               | OrderStatus           | Set to Item8  |
| Document      | SalesOrder            |               |
| LineNumber    | SalesOrderLine        |               |
| Code          | StockCode             |               |
| ToLocation    | Warehouse             |               |
| ActionQty     | Quantity              |               |
| Batch         | Lot                   |               |
| UOM           | UnitOfMeasure         |               |

#### SORTOS Setting
SORTOS Parameters:

| Parameter Name                | Value         |
|-------------------------------|---------------|
| IgnoreWarnings                | Y             |
| ApplyIfEntireDocumentValid    | Y             |
| ValidateOnly                  | N             |

SORTOSDOC Item mapping:

| Granite       | Syspro                | Behaviour     |
|---------------|-----------------------|---------------|
|               | OrderStatus           | Set to Item   |
|               | NewOrderStatus        | Set to Item8  |
| Document      | SalesOrder            |               |

#### ALL Setting

Clear SORTBO Parameters:

| Parameter Name                | Value         |
|-------------------------------|---------------|
| IgnoreWarnings                | Y             |
| ApplyIfEntireDocumentValid    | Y             |
| ValidateOnly                  | N             |

Clear SORTBODOC Item mapping:

| Granite       | Syspro                    | Behaviour     |
|---------------|---------------------------|---------------|
|               | CompleteLine              | Set to N      |
|               | ReleaseFromMultipleLines  | Set to N      |
|               | AdjustOrderQuantity       | Set to N      |
|               | ZeroShipQuantity          | Set to Y      |
|               | ReleaseFromShip           | Set to Y      |
|               | OrderStatus               | Set to N      |
| Document      | SalesOrder                |               |
| LineNumber    | SalesOrderLine            |               |
| Code          | StockCode                 |               |
| ToLocation    | Warehouse                 |               |
|               | Quantity                  | Set to 0      |
| Batch         | Lot                       |               |
| UOM           | UnitOfMeasure             |               |


SORTBO Parameters:

| Parameter Name                | Value         |
|-------------------------------|---------------|
| IgnoreWarnings                | Y             |
| ApplyIfEntireDocumentValid    | Y             |
| ValidateOnly                  | N             |

SORTBODOC Item mapping:

| Granite       | Syspro                    | Behaviour     |
|---------------|---------------------------|---------------|
|               | ZeroShipQuantity          | Set to N      |
|               | ReleaseFromMultipleLines  | Set to N      |
|               | AdjustOrderQuantity       | Set to N      |
|               | OrderStatus               | Set to N      |
|               | ReleaseFromShip           | Set to N      |
|               | AllocateSerialNumbers     | Set to N      |
| Document      | SalesOrder                |               |
| LineNumber    | SalesOrderLine            |               |
| Code          | StockCode                 |               |
| ToLocation    | Warehouse                 |               |
| ActionQty     | Quantity                  |               |
| Batch         | Lot                       |               |
| UOM           | UnitOfMeasure             |               |

SORTOS Parameters:

| Parameter Name                | Value         |
|-------------------------------|---------------|
| IgnoreWarnings                | Y             |
| ApplyIfEntireDocumentValid    | Y             |
| ValidateOnly                  | N             |

SORTOSDOC Item mapping:

| Granite       | Syspro                    | Behaviour     |
|---------------|---------------------------|---------------|
|               | OrderStatus               | Set to Item   |
|               | OrderStatus               | Set to Item8  |
| Document      | SalesOrder                |               |


SORTIC Parameters:

| Parameter Name                | Value         |
|-------------------------------|---------------|
| IgnoreWarnings                | Y             |
| ApplyIfEntireDocumentValid    | Y             |
| ValidateOnly                  | N             |

SORTICDOC Item mapping:

| Granite       | Syspro                    | Behaviour                             |
|---------------|---------------------------|---------------------------------------|
| Document      | SalesOrder                |                                       |
| LineNumber    | SalesOrderLineList        | Comma separated list of line numbers  |


### RECEIVE
- PORTOR. Purchase Order Receipts

PORTOR Parameters:

| Parameter Name                | Value         |
|-------------------------------|---------------|
| TransactionDate               | Empty string  |
| IgnoreWarnings                | Y             |
| GRNMatchingAction             | A             |
| ApplyIfEntireDocumentValid    | Y             |
| ValidateOnly                  | N             |
| ManualSerialTransfersAllowed  | N             |
| IgnoreAnalysis                | Y             |

PORTORDOC Item mapping:

| Granite       | Syspro                        | Behaviour             |
|---------------|-------------------------------|-----------------------|
|               | ReceiptFromInspection         | Set to null           |
|               | ReceiptIntoInspection         | Set to null           |
|               | Receipt.SwitchOnGRNMatching   | Set to N              |
|               | Receipt.Units                 | Set to empty string   |
|               | Receipt.Cost                  | Set to empty string   |
|               | Receipt.CostBasis             | Set to P              |
|               | Receipt.DeliveryNote          | Set to empty string   |
| Document      | Receipt.PurchaseOrder         |                       |
| LineNumber    | Receipt.PurchaseOrderLine     |                       |
| Code          | Receipt.StockCode             |                       |
| ActionQty     | Receipt.Quantity              |                       |
| UOM           | Receipt.UnitOfMeasure         |                       |
| Comment       | Receipt.Reference             |                       |
| ToLocation    | Receipt.Warehouse             |                       |
| Batch         | Receipt.Lot                   |                       |
| ExpiryDate    | Receipt.LotExpiryDate         |                       |

### MANUFACTURE
- WIPTJR. Job Receipts

WIPTJR Parameters:

| Parameter Name                            | Value         |
|-------------------------------------------|---------------|
| ValidateOnly                              | N             |
| ApplyIfEntireDocumentValid                | Y             |
| IgnoreWarnings                            | Y             |
| TransactionDate                           | DateTime.Now  |
| SetJobToCompleteIfCoProductsComplete      | Y             |

WIPTJRDOC Item mapping:

| Granite     | Syspro                     | Behaviour                   |
|-------------|----------------------------|-----------------------------|
| Document    | Job                        |                             |
| ActionQty   | Quantity                   |                             |
| Batch       | Lot                        |                             |
| ExpiryDate  | LotExpiryDate              | If provided                 |
|             | UnitOfMeasure              | Set to Stocking             |
|             | InspectionFlag             | Set to N                    |
|             | CostBasis                  | Set to CurrentWarehouseCost |
|             | UseSingleTypeABCElements   | Set to N                    |
|             | JobComplete                | Set to NotComplete          |
|             | CoProductComplete          | Set to NotComplete          |
|             | IncreaseSalesOrderQuantity | Set to N                    |

Notes:
- Transactions are grouped by Batch + ExpiryDate + Code and the Quantity is summed before posting.
- Job is taken from the first transaction in each group (ensure grouped transactions belong to the same Job).
- If SysproWriteXML is enabled, the XML is written to `C:\WIPTJR.xml` and `C:\WIPTJRDOC.xml`.

### CONSUME
- WIPTMI. Post Material

WIPTMI Parameters:

| Parameter Name             | Value         |
|----------------------------|---------------|
| TransactionDate            | DateTime.Now  |
| PostingPeriod              | Current       |
| ApplyIfEntireDocumentValid | Y             |
| ValidateOnly               | N             |
| IgnoreWarnings             | Y             |
| AutoDepleteLotsBins        | N             |
| PostFloorstock             | N             |

WIPTMIDOC Item mapping:

| Granite       | Syspro         | Behaviour                         |
|---------------|---------------|-----------------------------------|
| Document      | Job            |                                   |
| FromLocation  | Warehouse      |                                   |
| Code          | StockCode      |                                   |
| ActionQty     | QtyIssued      |                                   |
| Batch         | Lot            |                                   |
|               | LedgerCode     | From setting `WIPLedgerCode`      |
|               | Notation       | Set to `Granite Issue`            |
|               | NonStockedFlag | Set to N                          |
|               | AllocCompleted | Set to N                          |

Notes:
- Transactions are grouped by Batch + ExpiryDate + Code + FromLocation and the QtyIssued is summed before posting.
- Job is taken from the first transaction in each group (ensure grouped transactions belong to the same Job).
- If SysproWriteXML is enabled, the XML is written to `C:\WIPTMI.xml` and `C:\WIPTMIDOC.xml`.

### DYNAMICPICK
- Not Implemented/supported
