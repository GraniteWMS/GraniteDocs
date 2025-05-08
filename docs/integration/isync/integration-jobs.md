# Integration Jobs

### Overview

Integration with ISync is done through xml files shared with ISync via SFTP. For the integration jobs this involves reading the xml files in the steps below. 

1. The files are inserted into the respective folder `ISyncFilePath`/Inbound/`FileName`.
2. The scheduled job fires and discovers the new files. 
3. The data is read from the files and mapped to the relevant Granite type (see mappings below).
4. The job will then attempt to either insert or update existing records in Granite. 
5. The file is then moved to the Archive file path to either the success or failure folder depending on if it integrated successfully or not. 

!!! note 
    The audit user for any changes in Granite will be the name of the xml file that contained the data rather than the standard integration. 

### Configure

#### Email on Error

!!! note 
    Emailing functionality is now handled by the [Custodian API](../../custodian-api/index.md), set up has changed from previous versions.

Ensure that you have configured the CustodianApiUrl for the Scheduler in the `SystemSettings` table:

| Application | Key | Value |
|---|---|---|
| GraniteScheduler | CustodianApiUrl | https://localhost:5001/ |

Ensure you have the `IntegrationError` email template in your database. This is the email template that is used for all error notifications in these injected jobs. 

Then for each job that needs to send failure notifications, add a job input for `MailOnError` and `MailOnErrorToAddresses`:

| JobName | Name | Value |
| --- | --- | --- |
| < JobName goes here > | MailOnError | true |
| < JobName goes here > | MailOnErrorToAddresses | name@client.co.za;name2@client.co.za |

### System Settings 

| Key              | Description         | Example Value | 
|------------------|---------------------|---------------| 
| ISyncFilePath    | ISync File Path     | C:\ISync | 
| ArchiveFilePath  | Archive File Path   | C:\Archive |

<H4>ISyncFilePath</H4>

This is the base file path where files are used to integrate with ISync will be. Files for integration into Granite will be in the Inbound folder. This will then be further divided into each document type (ItemCatalogue, PurchaseOrders, WarehouseShipmentOrders).

<H4>ArchiveFilePath</H4>

This folder is used to keep a backup of the files exchanged with ISync. This will have the same file structure as the ISyncFilePath with the exception that the InBound folders will also have a success and failure folder.

### Datagrid Log

Bellow are the details for the datagrid that can be used to show errors in downwards/inbound integration jobs.

```sql
CREATE VIEW ISyncIntegrationDownwards
AS
SELECT	IntegrationLog.Date, 
		LogOrigin, 
		LogLevel, 
		IntegrationLog.[User] FileName,
		Document.Number Document,
		MasterItem.Code, 
		MasterItem.Description,
		ISNULL(DocumentDetail.Qty, 0) Qty,
		ISNULL(DocumentDetail.ActionQty, 0) ActionQty,
		Message
FROM	IntegrationLog 
		INNER JOIN Document ON IntegrationLog.Document_id = Document.ID
		LEFT JOIN DocumentDetail ON DocumentDetail_id = DocumentDetail.ID
		LEFT JOIN MasterItem ON DocumentDetail.Item_id = MasterItem.ID
```

```json
[
  {
    "field": "Date",
    "width": 105,
    "filter": "agDateColumnFilter"
  },
  {
    "field": "LogOrigin",
    "width": 100,
    "filter": "agTextColumnFilter"
  },
  {
    "field": "LogLevel",
    "width": 111,
    "filter": "agTextColumnFilter",
    "cellClassRules": {
      "bg-error": "x == 'ERROR'"
    }
  },
  {
    "field": "FileName",
    "width": 135,
    "filter": "agTextColumnFilter"
  },
  {
    "field": "Document",
    "width": 117,
    "filter": "agTextColumnFilter"
  },
  {
    "field": "Code",
    "width": 128,
    "filter": "agTextColumnFilter"
  },
  {
    "field": "Description",
    "width": 279,
    "filter": "agTextColumnFilter"
  },
  {
    "field": "Qty",
    "width": 80,
    "filter": "agTextColumnFilter"
  },
  {
    "field": "ActionQty",
    "width": 118,
    "filter": "agTextColumnFilter"
  },
  {
    "field": "Message",
    "width": 451,
    "filter": "agTextColumnFilter"
  }
]
```

### Mapping 

#### Sales Order mapping: 

| WarehouseShipmentOrder Property | Document Property            | Mapping Logic                                      |
|---------------------------------|------------------------------|----------------------------------------------------|
| DepositorOrderNumber            | Number                       | `documentNumberPrefix + order.DepositorOrderNumber`|
| BillToCode                      | TradingPartnerCode           | `order.BillToCode`                                 |
| BillToCompany                   | TradingPartnerDescription    | `order.BillToCompany`                              |
| N/A                             | CreateDate                   | `DateTime.Now`                                     |
| N/A                             | isActive                     | `true`                                             |
| N/A                             | AuditDate                    | `DateTime.Now`                                     |
| N/A                             | AuditUser                    | `order.FileName`                                   |
| N/A                             | Site                         | `""`                                               |
| N/A                             | Type                         | `"ORDER"`                                          |
| N/A                             | Status                       | `"ENTERED"`                                        |
| DepositorOrderNumber            | ERPIdentification            | `order.DepositorOrderNumber`                       |
| FileName                        | FileName                     | `order.FileName`                                   |
| CarrierName                     | RouteName                    | `order.CarrierName`                                |

| WarehouseShipmentOrderLineItem Property | DocumentDetail Property    | Mapping Logic                                      |
|-----------------------------------------|----------------------------|----------------------------------------------------|
| N/A                                     | LineNumber                 | `((index + 1) * 10).ToString()`                    |
| OrderedQty                              | Qty                        | `item.OrderedQty`                                  |
| OrderedQtyUOM                           | UOM                        | `item.OrderedQtyUOM`                               |
| UPC                                     | MasterItem_Code            | `item.UPC.ToString()`                              |
| UPC-ShipmentOrderItemId                 | ERPIdentification          | `{item.UPC.ToString()}-{item.ShipmentOrderItemId.ToString()}`                              |
| N/A                                     | AuditDate                  | `DateTime.Now`                                     |
| N/A                                     | AuditUser                  | `order.FileName`                                   |




#### Purchase Order Mapping

| PurchaseOrder Property       | Document Property          | Mapping Logic                                      |
|------------------------------|----------------------------|----------------------------------------------------|
| DepositorOrderNumber         | Number                     | `documentNumberPrefix + po.DepositorOrderNumber`   |
| DepositorCode                | TradingPartnerCode         | `po.DepositorCode`                                 |
| Comments                     | Description                | `po.Comments`                                      |
| PurchaseOrderDate            | CreateDate                 | `po.PurchaseOrderDate`                             |
| DueDate                      | ExpectedDate               | `po.DueDate`                                       |
| N/A                          | isActive                   | `true`                                             |
| N/A                          | AuditDate                  | `DateTime.Now`                                     |
| N/A                          | AuditUser                  | `po.FileName`                                      |
| N/A                          | Site                       | `""`                                               |
| N/A                          | Type                       | `"RECEIVING"`                                      |
| N/A                          | Status                     | `"ENTERED"`                                        |
| DepositorOrderNumber         | ERPIdentification          | `po.DepositorOrderNumber`                          |
| FileName                     | FileName                   | `po.FileName`                                      |

| PurchaseOrderItem Property   | DocumentDetail Property    | Mapping Logic                                      |
|------------------------------|----------------------------|----------------------------------------------------|
| N/A                          | LineNumber                 | `((index + 1) * 10).ToString()`                    |
| OrderedQty                   | Qty                        | `item.OrderedQty`                                  |
| OrderedQtyUOM                | UOM                        | `item.OrderedQtyUOM`                               |
| UPC                          | MasterItem_Code            | `item.UPC.ToString()`                              |
| UPC-PurchaseOrderItemId      | ERPIdentification          | `{item.UPC.ToString()}-{item.PurchaseOrderItemId.ToString()`|
| N/A                          | AuditDate                  | `DateTime.Now`                                     |
| N/A                          | AuditUser                  | `po.FileName`                                    |


#### MasterItem Mapping

| ItemCatalogueItem Property | MasterItem Property | Mapping Logic                                      |
|----------------------------|---------------------|----------------------------------------------------|
| UPC                        | Code                | `item.UPC.ToString()`                              |
| ProductCode                | FormattedCode       | `$"{item.ProductCode}-{item.UPC.ToString()}"`      |
| ProductDescription         | Description         | `item.ProductDescription`                          |
| Category                   | RST_StyleName       | `item.Category`                                    |
| SizeDescription            | SIZ_SizeDesc        | `item.SizeDescription`                             |
| N/A                        | UOM                 | `"EACH"`                                           |
| N/A                        | isActive            | `true`                                             |
| N/A                        | AuditDate           | `DateTime.Now`                                     |
| N/A                        | AuditUser           | `Path.GetFileNameWithoutExtension(filePath)`       |
| ProductCode                | ERPIdentification   | `item.ProductCode`                                 |


