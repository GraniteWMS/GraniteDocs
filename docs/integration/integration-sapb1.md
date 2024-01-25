# SAP B1 

This document contains all the information needed to setup and configure SAP B1 integration.
The Data Interface API (DI API) is part of the SAP Business One Software Development Kit (SDK). 

---
## Setup 

##### Prerequisites

- The server running the Granite WMS service require the DI API to be locally installed and permissions setup in order for Granite to work. 
This should be done by the client or SAP consultant.
- Granite WMS Integration service should be installed and all settings in regard to database and endpoints setup.

##### SDK provider 

1. Copy `Granite.Integration.SAPB1.dll` into the root folder of the Integration Service
2. Copy `SDKProvider.xml` into the root folder of the Integration Service

Preview of the  `SDKProvider.xml` file
```xml
<module name="Provider">
  <bind
    service="Granite.Integration.Contract.IProvider, Granite.Integration.Contract"
    to="Granite.Integration.SAPB1.Provider, Granite.Integration.SAPB1"/>
</module>
```
---
## Application Settings
The following is a list of settings that must be configured in the SystemSettings table. It is advisable to schedule time to obtain these settings from the client or SAP consultant beforehand.

You can locate the database script to create these records in the following path:
```
~\GraniteDatabase\Data\SystemSettings\SystemSettingsSAPB1.sql
```
##### Settings
| Application        | Key                                     | Value | Description                                             | 
|--------------------|-----------------------------------------|-------|---------------------------------------------------------|
| IntegrationSAPB1   | Server                                  |       | Integration provider SAP|
| IntegrationSAPB1   | LicenseServer                           |       | SAP License server address `*see note*`|
| IntegrationSAPB1   | DbUserName                              |       | Database user name|
| IntegrationSAPB1   | DbPassword                              |       | Database password|
| IntegrationSAPB1   | CompanyDB                               |       | SAP company database name|
| IntegrationSAPB1   | DbServerType                            |       | SQL dialect. dst_MSSQL2012 dst_MSSQL2014 dst_MSSQL2016 dst_MSSQL2017 dst_MSSQL2019 |
| IntegrationSAPB1   | UserName                                |       | SAP application user name|
| IntegrationSAPB1   | Password                                |       | SAP application user password|
| IntegrationSAPB1   | InventoryAccountCode                    |       | TAKEON AccountCode |
| IntegrationSAPB1   | BinEntry                                |       | 0 false, 1 true. The BinEntry will be used by TAKEON, SCRAP and ADJUSTMENT |

**`Take Note`** LicenseServer address found in
`C:\Program Files (x86)\SAP\SAP Business One DI API\Conf\B1_Local_machine.xml`

**`Take Note`** Once the settings is capture please test the SAP connection by execute the `/config` operation on the integration service.

---
## Integration Methods

Integration Methods refer to the specific functionalities supported for the given provider. This documentation serves as a crucial resource when engaging with a client, providing insights into our supported operations and the manner in which we support them.

Integration Methods are predefined values, each corresponding to an operation within SAP B1. These methods are configured at a process level in the database table `Process.IntegrationMethod`. In cases where the IntegrationMethod in the database is left empty, Granite will automatically use `Transaction.Type` as the default Integration Method.

**`See Also`** The `Integration_Transactions` SQL view is responsible for determining the information sent to each operation.

##### GOODISSUE 
- Not supported (future development)
  
##### GOODRECEIPT
- Not supported (future development)

##### RECLASSIFY
- Not supported (future development)

##### DYNAMICPICK
- Not supported (future development)

##### TAKEON
- Post :SAPbobsCOM.BoObjectTypes.oInventoryGenEntry
- Documents object for entering general items to inventory
- Table: OIGN (https://biuan.com/OIGN/)

##### ADJUSTMENT
- Post : SAPbobsCOM.InventoryPostingsServiceDataInterfaces.ipsInventoryPosting
- The InventoryPostingsService service enables you to add, look up, and update inventory posting transactions.
- Table: OIQR (https://biuan.com/OIQR/)

##### SCRAP
- Post :SAPbobsCOM.InventoryPostingsServiceDataInterfaces.ipsInventoryPosting
- The InventoryPostingsService service enables you to add, look up, and update inventory posting transactions.
- Table: OIQR (https://biuan.com/OIQR/)

##### REPLENISH
- Post :SAPbobsCOM.BoObjectTypes.oStockTransfer
- StockTransfer is a business object that represents items to transfer from one warehouse to another. This object is part of the Inventory and Production module.
- Table:  OWTR (https://biuan.com/OWTR/)

##### MOVE
- Post :SAPbobsCOM.BoObjectTypes.oStockTransfer
- StockTransfer is a business object that represents items to transfer from one warehouse to another. This object is part of the Inventory and Production module.
- Table:  OWTR (https://biuan.com/OWTR/)

##### TRANSFER
- Post :SAPbobsCOM.BoObjectTypes.oStockTransfer
- StockTransfer is a business object that represents items to transfer from one warehouse to another. This object is part of the Inventory and Production module.
- Table:  OWTR (https://biuan.com/OWTR/)

##### TRANSFERDRAFT
- Post :SAPbobsCOM.BoObjectTypes.oStockTransferDraft
-  Documents object that represents a draft document
- Table:  OWTR (https://biuan.com/ODRF/)

##### RECEIVE
- Post :oPurchaseOrders -> SAPbobsCOM.BoObjectTypes.oPurchaseDeliveryNotes
- Documents object that represents a purchase delivery note document
- Table: OPDN (https://biuan.com/OPDN/)

##### RECEIVINGPOSTMULTIPLE
- Post :oPurchaseOrders -> SAPbobsCOM.BoObjectTypes.oPurchaseDeliveryNotes
- Documents object that represents a purchase delivery note document
- Table: OPDN (https://biuan.com/OPDN/)
- Note: same as RECEIVING but instead of using Document Number we use all the IntegrationReference as PO Numbers.

##### PURCHASEORDERDRAFT
- Post :oPurchaseOrders -> SAPbobsCOM.BoObjectTypes.oDrafts
- Documents object that represents a draft document
- Table: ODRF (https://biuan.com/ODRF/)

##### PURCHASECREDITNOTES
- Post :oGoodsReturnRequest -> oPurchaseCreditNotes
- Documents object that represents a draft of purchase credit note document
- Table: ORPC (https://biuan.com/ORPC/)

##### PICK
- Post :oOrders -> SAPbobsCOM.BoObjectTypes.oDeliveryNotes
- Documents object that represents a sales delivery note document
- Table: ODLN (https://biuan.com/ODLN/)

##### SALESORDERRETURNREQUEST
- Post :SAPbobsCOM.BoObjectTypes.oReturns -> SAPbobsCOM.BoObjectTypes.oReturnRequest
- Documents object that represents a sales return document
- Table: ORDN 

##### SALESORDERINVOICE
- Post :oOrders -> SAPbobsCOM.BoObjectTypes.oInvoices
- Documents object that represents a sales invoice document
- Table: OINV (https://biuan.com/OINV/)

##### SALESORDERCREDITMEMO
- Post : SAPbobsCOM.BoObjectTypes.oInvoices -> SAPbobsCOM.BoObjectTypes.oCreditNotes
- Documents object that represents a sales Credit Memo
- Table: OINV (https://biuan.com/OINV/)
- 
##### SALESORDERDRAFT 
- Post :SAPbobsCOM.BoObjectTypes.oOrders -> SAPbobsCOM.BoObjectTypes.oDrafts
- Documents object that represents a draft document
- Table: ODRF (https://biuan.com/ODRF/)

---

## SAP Table Names

- OINV table = Sales A/R > A/R Invoice.
- ORIN table = Sales A/R > A/R Credit Memo.
- ODLN table = Sales A/R > Delivery.
- ORDN table = Sales A/R > Returns.
- ORDR table = Sales A/R > Order.
- OQUT table = Sales A/R > Quotation.
- OPCH table = Purchasing A/P > A/P Invoice.
- ORPC table = Purchasing A/P > A/P Credit Memo.
- OPDN table = Purchasing A/P > Goods Receipt PO.
- ORPD table = Purchasing A/P > Goods Returns.
- OPOR table = Purchasing A/P > A/R Invoice.
- OPQT table = Purchasing A/P > Purchase Quotation.
- OIGN table = Inventory > Inventory Transactions > Goods Receipt.
Or, in case of receipt from production, select Production > Receipt from Production (see ProductionOrders).
- OIGE table = Inventory > Inventory Transactions > Goods Issue.
Or, in case of issue for production, select Production > Issue for Production (see ProductionOrders).
- ODRF table = Sales A/R (or Purchasing - A/P) > Document Draft. Set your selection criteria, and click OK.

---
## SAP Error Codes

- 0	    Success.
- 10    Seems to be a generic code. Need to troubleshoot issue to determine exact reason.
- 103 	Connection to the company database has failed.
- 104 	Connection to the license database has failed.
- 105 	The observer.dll init has failed.
- 106 	You are not connected to a company.
- 107 	Wrong username and/or password.
- 108 	Error reading company definitions.
- 109 	Error copying dll to temp directory.
- 110 	Error opening observer.dll.
- 111 	Connection to SBO-Common has failed.
- 112 	Error extracting dll from cab.
- 113 	Error creating temporary dll folder.
- 114 	No server defined.
- 115 	No database defined.
- 116 	Already connected to a company database.
- 117 	Language is not supported.
- 118 	Exceeded the number of max concurrent users.
- 125 	SAP connection issue, SQL version incorrect. Appsetting DbServerType, version might not be supported in release.
- 132   Cannot connect to SAP, SAP Database names are case-sensitive.
- 111   Similar issue to 125, DbServerType incorrect. Verify DbServerType setting, must be correct 2012, 2014 ect.
- 1001	The field is to small to accept the data.
- 1002	Invalid row.
- 1103	Object not supported.
- 1104	Invalid XML file.
- 1105	Invalid index.
- 1106	Invalid field name.
- 1107	Wrong object state.
- 1108	The transaction is already active.
- 1109	There is no active transaction in progress.
- 1110	Invalid user entered.
- 1111	Invalid file name.
- 1112	Could not save the XML file.
- 1113	Function not implemented.
- 1114	XML validation failed.
- 1115	No XML schema was found to support this object.
- 1120	Ref count for this object is higher then 0.
- 1130	Invalid edit state.
- 2000	SQL native error.
- 2050	No query string entered.
- 2051	No value found.
- 2052	No records found.
- 2053	Invalid object.
- 2054	Either BOF or EOF have been reached.
- 2055	The value entered is invalid.
- 3000	The logged-on user does not have permission to use this object.
- 3001	You do not have a permission to view this fields data.
- 8004	Company connection is dead.
- 8005	Server connection is dead.
- 8006	Error opening language resource.
- 8007	License failure.
- 8008	Error initializing the DB layer.
- 8009	Too many users connected.
- 8010	No valid license is present.
- 8011	Error initializing Business objects layer.
- 8012	Company version mismatch.
- 8013	Error initializing the application environment.
- 8014	Invalid command.
- 8015	Missing parameter.
- 8016	Unsupported object.
- 8017	Invalid command for this object.
- 8018	Internal permission error.
- 8019	DLL is not initialized.
- 8020	Language init error.
- 8021	Timeout encountered.
- 8022	Init error.
- 8023	Wrong user or password.
  
---
## Known issues

##### Integration Slow

The DI API could slow down due to the number of SAP log files (~b1logger.~.csv).
The default path for log files:
> C:\ProgramData\SAP\SAP Business One\Log\SAP Business One

The number of files will impact the connection speed to the DI API, and can ultimately cause timeouts.
Deleting these files should resolve the issue, but the path will often grew again within a few days.
You can schedule a task to clear the path or switch logging off the logging.
> C:\Program Files (x86)\SAP\SAP Business One DI API\Conf\b1LogConfig.xml
 
`Set Activate = "0"`
``` xml
<?xml version="1.0" encoding="utf-16"?>
<log FolderSize="50">
<b1logger Mode="A" MaxFileSize="5" MaxNumOfMsg="500" LogStack="0" Activate = "0">
```

**`See Also`**  https://www.youtube.com/watch?v=kGueS8LdF-w

If the IIS (app pool) user does not have permissions it can cause issues.

## Further Reading

- Complete list of DI API (SDK) Document objects (https://biuan.com/Documents/).
- SAP Tables https://sap.erpref.com/
- https://www.sap-business-one-tips.com/
- https://support.boyum-it.com/hc/en-us/articles/360021794234-SAP-Object-Types
- http://www.saptables.net/?schema=BusinessOne9.3
