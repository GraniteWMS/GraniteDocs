# Manual

<!-- ![alt text](image.jpg) -->

The SQL CLR (Common Language Runtime) integration offers a unique approach by `abstracting HTTP` technology away from direct SQL manipulation. 
This encourages users to interact with our `API` instead of directly manipulating data within SQL Server.
By promoting interaction with the API, this integration enhances security, maintains `data integrity`, and streamlines data processing workflows, empowering users to leverage our API's full capabilities within the SQL environment.

## Currently supported operations

### Inventory
- TAKEON, SCRAP, ADJUST, MOVE, PALLETIZE, REPLENISH, RECLASSIFY

### Inbound
- RECEIVE

### Outbound
- PICK, PACK

### Stocktake
- STOCKTAKECOUNT, STOCKTAKEHOLD, STOCKTAKERELEASE

### Label Printing
- TRACKINGENTITY, MASTERITEM, LOCATION

### Integration
- POST, POST TO ENDPOINT, UPDATE

### Utility API
- REPORT PRINT, REPORT EXPORT, SQL TABLE EXPORT, SIMPLE EMAIL, TEMPLATE EMAIL


## Setup
```txt
	NOTE:

	The previous scripts and dlls have been replaced with: SQLCLR_Install.sql

	When opening the SQLCLR_Install.sql it will ask if you want to normalise the endings; select NO.
	
	Be sure to replace [GraniteDatabase] with the database in which you wish to create the 
    procedures. 
```
```txt
	You will need a SQL auth user with the sysadmin role to run the script
```
```txt
	If you are upgrading from an older version of CLR ensure that you change 
    Application in Systemsettings table from GraniteSQLCLR to SQLCLR
```

### In the Granite database...
### SystemSettings table


| Application	| Key					| Value						| Description					| ValueDataType	| isEncrypted	| isActive	|
|---------------|-----------------------|---------------------------|-------------------------------|---------------|---------------|-----------|
| SQLCLR		| Webservice			| http://10.0.0.1:50002	| Granite Webservice Address	| string		| False			| True		|
| SQLCLR		| LabelPrintService		| http://10.0.0.1:50004	| Label Print Service Address	| string		| False			| True		|
| SQLCLR		| IntegrationService	| http://10.0.0.1:50003	| Integration Service Address	| string		| False			| True		|
| SQLCLR		| UtilityAPI    	| https://10.0.0.1:50001	| UtilityAPI Address	    | string		| False			| True		|

### Create Assemblies and Stored Procedures

This script does not have to be run on the server. You will need a SQL auth user with the sysadmin role to run the script.

```
	Execute the SQLCLR_Install.sql file
```


## Using the CLR Procedures

### How to execute
The suggested way to start working with your CLR procedures, is to right click the procedure in SSMS and select Script Stored Procedure as -> Execute To

This will ensure that you have all of the necessary variables declared with correct datatypes, and that all parameters are specified for the EXECUTE statement

If you are not specifying a particular value, just set the variable to NULL. The variable must still be specified as a parameter when executing the CLR procedure.

todo, explain the role of clr functions. in other words it is purely to help you with the more complex use cases etc. the message that is important is function to one thing and one thing only in context to SQL clr.

### CLR_IntegrationPostToEndpoint
If you have multiple integration services that you need to interact with using the CLR_IntegrationPostToEndpoint procedure, 
you will need to add them with a unique name in the Key column:

| Application	| Key							| Value						| Description						| ValueDataType	| isEncrypted	| isActive	|
|---------------|-------------------------------|---------------------------|-----------------------------------|---------------|---------------|-----------|
| SQLCLR		| MySecondIntegrationService	| http://10.0.0.1:50006	| ERP Company 2 Integration Service	| string		| False			| True		|

The Key "MySecondIntegrationService" can now be used when executing the CLR_IntegrationPostToEndpoint procedure  

## UtilityAPI

### UtilityAPI SSRS Report Procedures

The two operations supported are:

- [Print Report](#clr_PrintReport)
- [Export Report](#clr_ReportExportToFile)

#### dbo.clr_PrintReport

Use this procedure to print a SSRS report.

| Parameter Name		| Required	| Description																			|
|-----------------------|-----------|---------------------------------------------------------------------------------------|
| reportPath | Yes | Path to the report in SSRS (use the report properties in the UtilityAPI to find the report path) |
| printerName | Yes | Name of the printer to print to (check available printers in UtilityAPI printer statuses ) |
| parameters | No | List of all parameters required by the report |



#### dbo.clr_ReportExportToFile

Use this procedure to save a SSRS report to the server where the UtilityAPI is running.

| Parameter Name		| Required	| Description																			|
|-----------------------|-----------|---------------------------------------------------------------------------------------|
| reportPath | Yes | Path to the report in SSRS (use the report properties in the UtilityAPI to find the report path) |
| fileDestinationPath | Yes | Where the report will be save to including the file name.
| filetype | Yes | File type that you want to save as (PDF, EXCELOPENXML (.xlsx), EXCEL (.xls)) |
| parameters | No | List of all parameters required by the report |

#### dbo.report_AddReportParameters

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

### UtilityAPI SQL Table Export


#### dbo.clr_TableExport

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


#### dbo.export_AddFilter

This function allows you to build the filters parameter string.

| Parameter Name		| Required	| Description																			|
|-----------------------|-----------|---------------------------------------------------------------------------------------|
| filters | Yes | The string containing the list of filters |
| column | Yes | The name of the column that is being filtered |
| filterType | Yes | The type of filter being applied (Equal, NotEqual, Like, NotLike, StartsWith, EndsWith, Between, GreaterThan, GreaterThanOrEqual, LessThan, LessThanOrEqual) |
| value | Yes | The value applied to the filter |



#### dbo.export_AddOrderBy

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



### UtilityAPI Email Procedures

Two types of emails can be sent using SQLCLR:

- [Template Emails](#clr_templateemail)
- [Simple Emails](#clr_simpleemail)

The difference between these two types of emails is where the content of the email body comes from. 
Templated emails require an email template that will be used to generate the body of the email. 
Simple emails can only contain unformatted text in the body of the email.
For more info on these, as well as help with designing your own email templates, see the Utility API manual.

Both types of emails have support for the following types of attachments:

- SSRS Reports
- Excel exports of SQL tables
- File attachments

#### dbo.clr_TemplateEmail

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


#### dbo.email_AddTemplateParameter

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


#### dbo.clr_SimpleEmail

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

#### Attachments

Attachments can have lots of different parameters that need to be sent along with the request to generate the files that end up being attached.
To assist with this we have a set of sql functions that help to build up the request JSON in the correct format.

#### Report Attachments

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

#### Excel Attachments

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

#### File Attachments

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

