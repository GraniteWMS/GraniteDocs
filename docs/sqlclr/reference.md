## Business API
!!! note
    As of version 6 clr now calls the Business API rather than the Webservice. If you are upgrading from a previous version to version 6 please refer to the [Version 6 Upgrade Guide](version-6-upgrade-guide.md).

For detauls of the call that CLR procedure make to the Business API visit the metadata page of the Business API that you are going to be calling (BusinessApiUrl)/metadata

The following procedures map directly to the request and details of the parameter can be found as (BusinessApiURL + below path)

- dbo.clr_CreateCarryingEntity
```
/json/metadata?op=CreateCarryingEntity
```
- dbo.clr_Receive
```
/json/metadata?op=InboundReceive
```
- dbo.Adjustment
```
/json/metadata?op=InventoryAdjustment
```
- dbo.clr_Move
```
/json/metadata?op=InventoryMove
```
- dbo.clr_PalletizeRemove
```
/metadata?op=InventoryPalletizeRemove
```
- dbo.clr_PalletizeAdd
```
/metadata?op=InventoryPalletizeAdd
```
- dbo.clr_Reclassify
```
/metadata?op=InventoryReclassify
```
- dbo.clr_Replenish
```
/metadata?op=InventoryReplenish
```
- dbo.clr_Scrap
```
/metadata?op=InventoryScrap
```
- dbo.clr_Transfer
```
/metadata?op=InventoryTransfer
```
- dbo.clr_TakeOn
```
/metadata?op=InventoryTakeOn
```
- dbo.clr_TrackingEntityOptionalField
```
/json/metadata?op=SetTrackingEntityOptionalFieldValue
```
- dbo.clr_Pick
```
/json/metadata?op=OutboundPick
```
- dbo.clr_Pack
```
/json/metadata?op=OutboundPack
```
- dbo.clr_StockTakeCount
```
/json/metadata?op=StockTakeCount
```
- dbo.clr_StockTakeHold
```
/json/metadata?op=StockTakeHold
```
- dbo.clr_StockTakeRelease
```
/json/metadata?op=StockTakeRelease
```
- dbo.clr_CopyDocument
```
/json/metadata?op=CopyDocument
```
- dbo.clr_SaveOptionalField
```
/json/metadata?op=SaveOptionalFields
```

## Webservice 
!!! note
    From version 6 onwards the Webservice is no longer used in the SQLCLR methods. Please refer to the [Business API section](#business-api).

For details of the calls that the CLR procedures make to the WebService visit the metadata page of the WebService that you are going to be calling 
(WebServiceUrl)/metadata

The following procedures directly map to the WebService request, for details browse to the associated details on the WebService (WebserviceURL + below path)

![PasteURL](img/PasteUrl.gif)

- dbo.clr_Adjustment 
```
/json/metadata?op=InventoryAdjustmentRequest
```
- dbo.clr_Move
```
/json/metadata?op=InventoryMoveRequest
```
- dbo.clr_Pack
```
/json/metadata?op=OutboundPackingRequest
```
- dbo.clr_Pick
```
/json/metadata?op=OutboundPickingRequest
```
- dbo.clr_Receive
```
/json/metadata?op=InboundReceivingRequest
```
- dbo.clr_Replenish
```
/json/metadata?op=InventoryReplenishRequest
```
- dbo.clr_Reclassify
```
/json/metadata?op=InventoryReclassifyRequest
```
- dbo.clr_Scrap
```
/json/metadata?op=InventoryScrapRequest
```
- dbo.clr_StockTakeCount
```
/json/metadata?op=StockTakeCountRequest
```
- dbo.clr_StockTakeHold
```
/json/metadata?op=StockTakeHoldRequest
```
- dbo.clr_StockTakeRelease
```
/json/metadata?op=StockTakeReleaseRequest
```
- dbo.clr_Transfer
```
/json/metadata?op=InventoryTransferRequest
```

<h4>dbo.clr_TakeOn</h4>

This procedure differs from the WebService call in that it combines the parameters **"AssignTrackingEntityBarcode"** and **"TrackingEntityBarcode"** into **@assignTrackingEntityBarcode**. This parameter is not required, so leave as a null if not used for the standard TakeOn behavior.

The procedure will check if tracking entity exists. If it does exist, then the qty will be assigned to that tracking entity. If not a new tracking entity will be created with the supplied barcode. 

## Label Printing

<h4>dbo.clr_PrintLabel</h4>

| Parameter name  | Required  | Description |
|-----------------|-----------|-------------|
| Barcode         |	No        | The barcode that you want to print. If not specified, you must set the Barcodes parameter |
| Barcodes        |	No        | A comma separated list of barcodes you want to print. If not specified, you must set the Barcode parameter |
| LabelName       | No	      | Full name of the label you want to print, including the file extension (.zpl or .btw). If not set, will use the default format configured for the label type. |
| NumberOfLabels  | No        | Number of copies of the label to print. Defaults to 1 if not set |
| PrinterName     | No        | Name of the printer that you are printing to |
| Type            | Yes        | The type of label that you want to print. Valid values are TRACKINGENTITY, MASTERITEM, LOCATION, USER, PALLET or BOX |	
| UserID	        | Yes        | ID of the user that is printing the label |

## Integration 

<h4>dbo.clr_IntegrationPost</h4>

| Parameter name  | Required  | Description |
|-----------------|-----------|-------------|
| transactionID   | No        | Comma separated list of transaction IDs to post |
| document        | No        | Document number to post |
| documents       | No        | Comma separated list of documents to post |
| reference       | No        | Integration reference of the transactions you want to post |
| transactionType | No        | Transaction type of the transactions being posted |
| processName     | No        | Process name of the transactions being posted |

<h4>dbo.clr_IntegrationPostToEndpoint</h4>

If you have multiple integration services that you need to interact with using the CLR_IntegrationPostToEndpoint procedure, 
you will need to add them with a unique name in the Key column:

| Application	| Key							| Value						| Description						| ValueDataType	| isEncrypted	| isActive	|
|---------------|-------------------------------|---------------------------|-----------------------------------|---------------|---------------|-----------|
| SQLCLR		| MySecondIntegrationService	| http://10.0.0.1:50006	| ERP Company 2 Integration Service	| string		| False			| True		|

The Key "MySecondIntegrationService" can now be used when executing the CLR_IntegrationPostToEndpoint procedure  

| Parameter name        | Required  | Description |
|-----------------------|-----------|-------------|
| transactionID         | No        | Comma separated list of transaction IDs to post |
| document              | No        | Document number to post |
| documents             | No        | Comma separated list of documents to post |
| reference             | No        | Integration reference of the transactions you want to post |
| transactionType       | No        | Transaction type of the transactions being posted |
| processName           | No        | Process name of the transactions being posted |
| systemSettingsURLKey  | Yes       | Key from the SystemSettings table for the url you want to post to |

<h4>dbo.clr_IntegrationUpdate</h4>

| Parameter name  | Required  | Description |
|-----------------|-----------|-------------|
| transactionID   | No        | Comma separated list of transaction IDs to post |
| document        | No        | Document number to post |
| documents       | No        | Comma separated list of documents to post |
| reference       | No        | Integration reference of the transactions you want to post |
| transactionType | No        | Transaction type of the transactions being posted |
| processName     | No        | Process name of the transactions being posted |


## Troubleshooting

To run the create scripts you will need sysadmin permissions on the SQL instance that you are installing on

Be sure that you are executing the procedure using ALL of the parameters. Set them to null if they are not being used

## Examples

### Integration 
[https://stackoverflowteams.com/c/granitewms/questions/349](https://stackoverflowteams.com/c/granitewms/questions/349)