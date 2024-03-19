## Webservice 

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
<h4>dbo.clr_TakeOn</h4>

This procedure differs from the WebService call in that it combines the parameters **"AssignTrackingEntityBarcode"** and **"TrackingEntityBarcode"** into **@assignTrackingEntityBarcode**. This parameter is not required, so leave as a null if not used for the standard TakeOn behavior.

The procedure will check if tracking entity exists. If it does exist, then the qty will be assigned to that tracking entity. If not a new tracking entity will be created with the supplied barcode. 

## Label Printing

<h4>dbo.clr_PrintLabel</h4>

Barcode	query	string	No	
Barcodes	query	IEnumerable<string>	No	
Document	query	string	No	
LabelName	query	string	No	
NumberOfLabels	query	int	No	
PrinterName	query	string	No	
Reference	query	string	No	
Type	query	string	No	
UserID	query	long	No

## Integration 

<h4>CLR_IntegrationPostToEndpoint</h4>

If you have multiple integration services that you need to interact with using the CLR_IntegrationPostToEndpoint procedure, 
you will need to add them with a unique name in the Key column:

| Application	| Key							| Value						| Description						| ValueDataType	| isEncrypted	| isActive	|
|---------------|-------------------------------|---------------------------|-----------------------------------|---------------|---------------|-----------|
| SQLCLR		| MySecondIntegrationService	| http://10.0.0.1:50006	| ERP Company 2 Integration Service	| string		| False			| True		|

The Key "MySecondIntegrationService" can now be used when executing the CLR_IntegrationPostToEndpoint procedure  

## UtilityAPI


<h3>Report Service</h3>

The two operations supported are:

- [Print Report](#clr_PrintReport)
- [Export Report](#clr_ReportExportToFile)

<h4>dbo.clr_PrintReport</h4>

Use this procedure to print a SSRS report.

| Parameter Name		| Required	| Description																			|
|-----------------------|-----------|---------------------------------------------------------------------------------------|
| reportPath | Yes | Path to the report in SSRS (use the report properties in the UtilityAPI to find the report path) |
| printerName | Yes | Name of the printer to print to (check available printers in UtilityAPI printer statuses ) |
| parameters | No | List of all parameters required by the report |



<h4>dbo.clr_ReportExportToFile</h4>

Use this procedure to save a SSRS report to the server where the UtilityAPI is running.

| Parameter Name		| Required	| Description																			|
|-----------------------|-----------|---------------------------------------------------------------------------------------|
| reportPath | Yes | Path to the report in SSRS (use the report properties in the UtilityAPI to find the report path) |
| fileDestinationPath | Yes | Where the report will be save to including the file name.
| filetype | Yes | File type that you want to save as (PDF, EXCELOPENXML (.xlsx), EXCEL (.xls)) |
| parameters | No | List of all parameters required by the report |

<h4>dbo.report_AddReportParameters</h4>

Use this Function to create a report parameter to use with dbo.clr_ReportExport and dbo.clr_PrintReport.

| Parameter Name		| Required	| Description																			|
|-----------------------|-----------|---------------------------------------------------------------------------------------|
| parameters | Yes | The string that will contain the report parameters |
| name | Yes | The name of the report parameter |
| value | Yes | The value of the parameter |

- Example use (printing)

```sql
DECLARE @ResponseCode int
DECLARE @ResponseJson varchar(max)
DECLARE @reportPath varchar(50) = N'/Pick Slip - Per Cage'
DECLARE @printerName varchar(50) = 'TestPrinter'
DECLARE @Parameters varchar(200) = ''

SELECT @Parameters = dbo.report_AddReportParameter(@Parameters, 'DocumentNumber', 'STV-AVO-000001')
SELECT @Parameters = dbo.report_AddReportParameter(@Parameters, 'Cage', 'CAGE D')

EXEC [dbo].[clr_ReportPrint]
		@reportPath
		,@printerName
		,@parameters
		,@responseCode OUTPUT
		,@responseJSON OUTPUT

SELECT @ResponseCode, @ResponseJson

```

- Example use (export)

```sql
DECLARE @ResponseCode int
DECLARE @ResponseJson varchar(max)
DECLARE @reportPath varchar(50) = N'/Pick Slip - Per Cage'
DECLARE @fileDestinationPath varchar(50) = 'D:\\Granite WMS\\V5 Demo\\PickSlip.pdf'
DECLARE @fileType varchar(50) = 'PDF'
DECLARE @Parameters varchar(200) = ''

SELECT @Parameters = dbo.report_AddReportParameter(@Parameters, 'DocumentNumber', 'STV-AVO-000001')
SELECT @Parameters = dbo.report_AddReportParameter(@Parameters, 'Cage', 'CAGE D')

EXEC [dbo].[clr_ReportExportToFile]
		@reportPath
		,@fileDestinationPath
		,@fileType
		,@parameters
		,@responseCode OUTPUT
		,@responseJSON OUTPUT

SELECT @ResponseCode, @ResponseJson

```

<h3>SQL Export Service</h3>


<h4>dbo.clr_TableExport</h4>

Use this procedure to export data from a SQL Table or View to either a CSV or Excel file. 

| Parameter Name		| Required	| Description																			|
|-----------------------|-----------|---------------------------------------------------------------------------------------|
| tableName | Yes | The name of the sql table or view to export data from |
| filters | No | The list of filters to be applied to the dataset (see below for details)|
| offset | No | Number of lines to skip from the dataset |
| limit | No | Limit the number of rows exported (if left blank it will default to 10000) | 
| orderByList | No | The list of order by criteria to sort the dataset (see below for details) |
| fileDestinationPath | Yes | Where the report will be save to including the file name.
| filetype | Yes | File type that you want to save as (CSV (.csv),  EXCEL (.xlsx)) |


<h4>dbo.export_AddFilter</h4>

This function allows you to build the filters parameter string.

| Parameter Name		| Required	| Description																			|
|-----------------------|-----------|---------------------------------------------------------------------------------------|
| filters | Yes | The string containing the list of filters |
| column | Yes | The name of the column that is being filtered |
| filterType | Yes | The type of filter being applied (Equal, NotEqual, Like, NotLike, StartsWith, EndsWith, Between, GreaterThan, GreaterThanOrEqual, LessThan, LessThanOrEqual) |
| value | Yes | The value applied to the filter |



<h4>dbo.export_AddOrderBy</h4>

This function allows you to build the OrderBy parameter string.

| Parameter Name		| Required	| Description																			|
|-----------------------|-----------|---------------------------------------------------------------------------------------|
| orderByList | Yes | The string containing the list of orderby parameters |
| column | Yes | The name of the column that is being order by |
| orderByType | Yes | The type of filter being applied (ASC or DESC) |

- Example usage
```sql
DECLARE @ResponseCode int
DECLARE @ResponseJson varchar(max)
DECLARE @tableName varchar(50) = 'API_QueryStockTotals'
DECLARE @offset int = 0
DECLARE @limit int = 500
DECLARE @fileDestinationPath varchar(100) = 'D:\\Granite WMS\\V5 Demo\\StockInFreezer.csv'
DECLARE @filetype varchar(20) = 'CSV'
DECLARE @OrderByList varchar(200)= '';
DECLARE @Filters varchar(200) = '';

SET @OrderByList = dbo.export_AddOrderBy(@OrderByList, 'Type', 'DESC')
SET @OrderByList = dbo.export_AddOrderBy(@OrderByList, 'Code', 'ASC')
SET @Filters = dbo.export_AddFilter(@Filters, 'Category', 'Equal', 'Freezer')
SET @Filters = dbo.export_AddFilter(@Filters, 'Qty', 'GreaterThan', '0')


EXEC clr_TableExport 
        @tableName
        ,@filters
		,@offset
		,@limit
		,@orderByList
		,@fileDestinationPath 
		,@fileType
		,@responseCode OUTPUT
		,@responseJson OUTPUT

SELECT @responseCode, @responseJson

```



<h3>Email Service</h3>

Two types of emails can be sent using SQLCLR:

- [Template Emails](#dbo.clr_templateemail)
- [Simple Emails](#dbo.clr_simpleemail)

The difference between these two types of emails is where the content of the email body comes from. 
Templated emails require an email template that will be used to generate the body of the email. 
Simple emails can only contain unformatted text in the body of the email.
For more info on these, as well as help with designing your own email templates, see the Utility API manual.

Both types of emails have support for the following types of attachments:

- SSRS Reports
- Excel exports of SQL tables
- File attachments

<h4>dbo.clr_TemplateEmail</h4>

Use this procedure to send an email that uses an Email template to generate the body of the email.

| Parameter Name		| Required	| Description																			|
|-----------------------|-----------|---------------------------------------------------------------------------------------|
| subject				| Yes		| The subject of the email																|
| templateName			| Yes		| The name of the email template to use for the body of this email						|
| templateParameters	| No		| List of parameters to pass into the email template to render the body of the email	|
| toEmailAddresses		| No		| Semicolon delimited list of email addresses to address this email to					|
| ccEmailAddresses		| No		| Semicolon delimited list of email address to CC on this email							|
| bccEmailAddresses		| No		| Semicolon delimited list of email addresses to BCC on this email						|
| reportAttachments		| No		| List of SSRS reports to attach to this email											|
| excelAttachments		| No		| List of excel exports to attach to this email											|
| fileAttachments		| No		| List of files to attach to this email													|


<h4>dbo.email_AddTemplateParameter</h4>

Use this function to add parameters to the list that will be used to render the email template

| Parameter Name		| Required	| Description																			|
|-----------------------|-----------|---------------------------------------------------------------------------------------|
| templateParameters	| Yes		| The list of template parameters														|
| parameterName			| Yes		| The name of the parameter as it appears in the email template							|
| parameterValue		| Yes		| The value that you are passing into the parameter										|


- Example usage

```sql
DECLARE @subject nvarchar(max)
DECLARE @templateName nvarchar(max)
DECLARE @templateParameters nvarchar(max)
DECLARE @toEmailAddresses nvarchar(max)
DECLARE @ccEmailAddresses nvarchar(max)
DECLARE @bccEmailAddresses nvarchar(max)
DECLARE @reportAttachments nvarchar(max)
DECLARE @excelAttachments nvarchar(max)
DECLARE @fileAttachments nvarchar(max)
DECLARE @responseCode int
DECLARE @responseJSON nvarchar(max)

SET @subject = 'Test Clr Mail'																			
SET @templateName = 'PickingNotification'																-- Use the email template named PickingNotification
SET @templateParameters = dbo.email_AddTemplateParameter(@templateParameters, 'documentNumber', 'SO000123')	-- Add a parameter to be passed to the email template. The parameter name is documentNumber, and value is SO000123
SET @toEmailAddresses = 'email1@gmail.com;email2@gmail.com'										

EXECUTE [dbo].[clr_TemplateEmail] 
   @subject
  ,@templateName
  ,@templateParameters
  ,@toEmailAddresses
  ,@ccEmailAddresses
  ,@bccEmailAddresses
  ,@reportAttachments
  ,@excelAttachments
  ,@fileAttachments
  ,@responseCode OUTPUT
  ,@responseJSON OUTPUT

  SELECT @responseCode, @responseJSON

```


<h4>dbo.clr_SimpleEmail</h4>

| Parameter Name		| Required	| Description																			|
|-----------------------|-----------|---------------------------------------------------------------------------------------|
| subject				| Yes		| The subject of the email																|
| body					| Yes		| The string content that will make up the body of the email							|
| toEmailAddresses		| No		| Semicolon delimited list of email addresses to address this email to					|
| ccEmailAddresses		| No		| Semicolon delimited list of email address to CC on this email							|
| bccEmailAddresses		| No		| Semicolon delimited list of email addresses to BCC on this email						|
| reportAttachments		| No		| List of SSRS reports to attach to this email											|
| excelAttachments		| No		| List of excel exports to attach to this email											|
| fileAttachments		| No		| List of files to attach to this email													|



- Example usage

```sql
DECLARE @subject nvarchar(max)
DECLARE @body nvarchar(max)
DECLARE @toEmailAddresses nvarchar(max)
DECLARE @ccEmailAddresses nvarchar(max)
DECLARE @bccEmailAddresses nvarchar(max)
DECLARE @reportAttachments nvarchar(max)
DECLARE @excelAttachments nvarchar(max)
DECLARE @fileAttachments nvarchar(max)
DECLARE @responseCode int
DECLARE @responseJSON nvarchar(max)

SET @subject = 'Test Clr Mail' 
SET @body = 'Test mail'
SET @toEmailAddresses = 'email1@gmail.com;email2@gmail.com'

EXECUTE [dbo].[clr_SimpleEmail] 
   @subject
  ,@body
  ,@toEmailAddresses
  ,@ccEmailAddresses
  ,@bccEmailAddresses
  ,@reportAttachments
  ,@excelAttachments
  ,@fileAttachments
  ,@responseCode OUTPUT
  ,@responseJSON OUTPUT

  SELECT @responseCode, @responseJSON

```

<h3>Attachments</h3>

Attachments can have lots of different parameters that need to be sent along with the request to generate the files that end up being attached.
To assist with this we have a set of sql functions that help to build up the request JSON in the correct format.

<h3>Report Attachments</h3>


- dbo.email_CreateReportAttachment

| ParameterName | Required	| Description																								|
|---------------|-----------|-----------------------------------------------------------------------------------------------------------|
| reportPath	| Yes		| The path to this report in SSRS. You can find the report path by browsing the UtilityAPI's reports page	|
| fileType		| Yes		| The file type that the report should be exported to. Valid values are PDF, EXCELOPENXML, or EXCEL			|

- dbo.email_AddReportParameter

| ParameterName		| Required	| Description																													|
|-------------------|-----------|-------------------------------------------------------------------------------------------------------------------------------|
| reportAttachment	| Yes		| The report attachment that you are adding the parameter to. This must be created using the CreateReportAttachment function	|
| parameterName		| Yes		| The name of the SSRS report parameter you want to set 																		|
| parameterValue	| Yes		| The value that you want to set the SSRS report parameter to																	|

- dbo.email_AddReportAttachment

| ParameterName				| Required	| Description																									|
|---------------------------|-----------|---------------------------------------------------------------------------------------------------------------|
| reportAttachments			| Yes		| The variable that contains the list of report attachments that you are going to send							|
| reportAttachmentToAdd		| Yes		| The variable that contains the report that you want to add to the list of reports that you are going to send	|

- Example

```sql
DECLARE @subject nvarchar(max)
DECLARE @body nvarchar(max)
DECLARE @toEmailAddresses nvarchar(max)
DECLARE @ccEmailAddresses nvarchar(max)
DECLARE @bccEmailAddresses nvarchar(max)
DECLARE @reportAttachments nvarchar(max)
DECLARE @excelAttachments nvarchar(max)
DECLARE @fileAttachments nvarchar(max)
DECLARE @responseCode int
DECLARE @responseJSON nvarchar(max)
DECLARE @PickingReport varchar(max)

SET @PickingReport = dbo.email_CreateReportAttachment('/PickingReport', 'PDF')					-- Creating the report that we want to attach. The reportPath is /PickingReport, and fileType is PDF
SET @PickingReport = dbo.email_AddReportParameter(@PickingReport, 'documentNumber', 'SO0001')		-- Adding a parameter that will be used to call the SSRS report. The parameter named 'documentNumber' will be set to 'SO0001'
SET @reportAttachments = dbo.email_AddReportAttachment(@reportAttachments, @PickingReport)		-- Lastly, we add the picking report to the list of report attachments. 
SET @subject = 'Test Clr Mail' 
SET @toEmailAddresses = 'email1@gmail.com;email2@gmail.com'

EXECUTE [dbo].[clr_SimpleEmail] 
   @subject
  ,@body
  ,@toEmailAddresses
  ,@ccEmailAddresses
  ,@bccEmailAddresses
  ,@reportAttachments
  ,@excelAttachments
  ,@fileAttachments
  ,@responseCode OUTPUT
  ,@responseJSON OUTPUT

  SELECT @responseCode, @responseJSON

```

<h3>Excel Attachments</h3>


- dbo.email_CreateExcelAttachment

| ParameterName | Required	| Description																		|
|---------------|-----------|-----------------------------------------------------------------------------------|
| tableName		| Yes		| The name of the table or view that you want to export results from				|
| fileType		| Yes		| The file type that the data should be exported to. Valid values are CSV or EXCEL	|

- dbo.email_AddExcelAttachmentFilter

| ParameterName		| Required	| Description																																														|
|-------------------|-----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| excelAttachment	| Yes		| The excel attachment you are adding a filter to. The variable passed in must be created using the CreateExcelAttachment function																	|
| filterColumn		| Yes		| The column that you want to filter on																																								|
| filterType		| Yes		| The filter operation you want to perform. Valid values are Equal, NotEqual, Like, NotLike, StartsWith, EndsWith, Between, GreaterThan, GreaterThan, GreaterThanOrEqual, LessThan, LessThanOrEqual	|
| filterValue		| Yes		| The value you want to filter by																																									|


- dbo.email_AddExcelAttachmentOrderBy

| ParameterName		| Required	| Description																														|
|-------------------|-----------|-----------------------------------------------------------------------------------------------------------------------------------|
| excelAttachment	| Yes		| The excel attachment you are adding a filter to. The variable passed in must be created using the CreateExcelAttachment function	|
| orderByColumn		| Yes		| The column that you want to order by																								|
| orderByType		| Yes		| Order by ascending or descending. Valid values are ASC or DESC																	|

- dbo.email_AddExcelAttachment

| ParameterName			| Required	| Description																													|
|-----------------------|-----------|-------------------------------------------------------------------------------------------------------------------------------|
| excelAttachments		| Yes		| The variable that contains the list of excel attachments that you are going to send											|
| excelAttachmentToAdd	| Yes		| The variable that contains the excel attachment that you want to add to the list of attachments that you are going to send	|



- Example

```sql
DECLARE @subject nvarchar(max)
DECLARE @body nvarchar(max)
DECLARE @toEmailAddresses nvarchar(max)
DECLARE @ccEmailAddresses nvarchar(max)
DECLARE @bccEmailAddresses nvarchar(max)
DECLARE @reportAttachments nvarchar(max)
DECLARE @excelAttachments nvarchar(max)
DECLARE @fileAttachments nvarchar(max)
DECLARE @responseCode int
DECLARE @responseJSON nvarchar(max)

DECLARE @ConsumablesExport varchar(max)

SET @ConsumablesExport = dbo.email_CreateExcelAttachment('CustomView_MasterItem', 'CSV')								-- Create the excel attachment. The view we will pull from is CustomView_MasterItem, and it will export to a csv file 
SET @ConsumablesExport = dbo.email_AddExcelAttachmentFilter(@ConsumablesExport, 'Category', 'Equal', 'CONSUMABLE')	-- Add a filter on the Category column of the view, fetch results where Category is equal to CONSUMABLE
SET @ConsumablesExport = dbo.email_AddExcelAttachmentOrderBy(@ConsumablesExport, 'Description', 'ASC')				-- Order the results of the export using the Description column in ascending order
SET @excelAttachments = dbo.email_AddExcelAttachment(@excelAttachments, @ConsumablesExport)							-- Lastly, we add the export to the list of excel attachments

SET @subject = 'Test Clr Mail' 
SET @toEmailAddresses = 'email1@gmail.com;email2@gmail.com'

EXECUTE [dbo].[clr_SimpleEmail] 
   @subject
  ,@body
  ,@toEmailAddresses
  ,@ccEmailAddresses
  ,@bccEmailAddresses
  ,@reportAttachments
  ,@excelAttachments
  ,@fileAttachments
  ,@responseCode OUTPUT
  ,@responseJSON OUTPUT

  SELECT @responseCode, @responseJSON

```

<h3>File Attachments</h3>

- dbo.email_AddFileAttachment

| ParameterName		| Required	| Description																								|
|-------------------|-----------|-----------------------------------------------------------------------------------------------------------|
| fileAttachments	| Yes		| The variable that contains all the file attachment paths that will be sent with the email					|
| fileToAttach		| Yes		| The path to the file that you want to add as an attachment												|



- Example

```sql
DECLARE @subject nvarchar(max)
DECLARE @body nvarchar(max)
DECLARE @toEmailAddresses nvarchar(max)
DECLARE @ccEmailAddresses nvarchar(max)
DECLARE @bccEmailAddresses nvarchar(max)
DECLARE @reportAttachments nvarchar(max)
DECLARE @excelAttachments nvarchar(max)
DECLARE @fileAttachments nvarchar(max)
DECLARE @responseCode int
DECLARE @responseJSON nvarchar(max)

SET @fileAttachments = dbo.email_AddFileAttachment(@fileAttachments, 'C:\logexport.txt')		-- Add a file to the list of file attachments

SET @subject = 'Test Clr Mail' 
SET @toEmailAddresses = 'email1@gmail.com;email2@gmail.com'

EXECUTE [dbo].[clr_SimpleEmail] 
   @subject
  ,@body
  ,@toEmailAddresses
  ,@ccEmailAddresses
  ,@bccEmailAddresses
  ,@reportAttachments
  ,@excelAttachments
  ,@fileAttachments
  ,@responseCode OUTPUT
  ,@responseJSON OUTPUT

  SELECT @responseCode, @responseJSON

```

## Troubleshooting

To run the create scripts you will need sysadmin permissions on the SQL instance that you are installing on

Be sure that you are executing the procedure using ALL of the parameters. Set them to null if they are not being used

## Examples

### Integration 
[https://stackoverflowteams.com/c/granitewms/questions/349](https://stackoverflowteams.com/c/granitewms/questions/349)