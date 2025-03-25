# Reporting Service

The reporting service accesses the reports by directly calling SQL Server Reporting Service's API. Once it has received the report back from the API it either prints or exports the report depending on the call.

## Prerequisites

- [SQL Server Reporting Service](../ssrs/getting-started.md)
 
## Configuration

Settings for the Reporting Service element of the UtilityAPI are configured in the `SystemSettings` table. You can find the insert script for the settings in the GraniteDatabase install folder:

```
"...\GraniteDatabase\Data\SystemSettings\SystemSettingsUtilityAPI.sql"
```

You should have the following settings after running the script:

| Application		| Key					| Value						| Description																								| ValueDataType | isEncrypted	| isActive	|
|-------------------|-----------------------|---------------------------|-----------------------------------------------------------------------------------------------------------|---------------|---------------|-----------|
| Granite.Utility	| SSRSWebServiceUrl			|  | Url of the reporting service | string	| False	| True	|

The SSRS Web Service Url should look something like this: http://10.0.0.1/ReportServer

You can find it on the Report Server Configuration Manager under the web service url tab. Check the configuration page (`/config`) and ensure that `Report Service URL Valid` and `Report Execution Service URL Valid` are both `true`.

### IIS Application Pool

In order for the UtilityAPI to access SSRS, the Identity of the Application pool needs to be changed to LocalSystem. 

To do this, go to the advanced settings of the application pool associated with the UtilityAPI and change from ApplicationPoolIdentity to LocalSystem as you can see below.

![image info](img\AdvancedSettings.JPG)


## Report Properties

Report Properties on the UtilityAPI homepage allows you to see all of the report paths and parameters. 

If the parameter Name is ERROR you will need to check that the report is working in SSRS. The most common errors are a missing stored procedure or the report being pointed to a data source that does not exist.

## Printer Statuses

Printer Statuses on the UtilityAPI homepage allows you to see all of the Printers visible to the UtilityAPI and their statuses. The report service does not check the status of the printer before sending a print job. The status is purely useful to diagnose issues printing.

## ReportFileExport

This process calls SSRS and saves the report to the specified file path. The file path has to be on the server where the UtilityAPI is running. To get the file from the server, the easiest option is to send it as an email attachment.

Supported file types are PDF and EXCEL, both the new .xlsx and the old .xls. If you are unsure which to use, go for .xlsx

See the API Documentation for more details on how to export a report using the API. See the dbo.clr_ReportExportToFile procedure for how to export a report using SQLCLR.



## ReportPrint

!!! note
    From version 6 of the Custodian API onwards this method no longer sends the job directly to the printer. Instead it is sent to an internal queue that then sends the job to the printer asynchronously. This allows the call to be faster. 

This process calls SSRS and sends the report to a print queue. Check Printer Statues on the UtilityAPI homepage to see the list of available printers.

See the API Documentation for more details on how to print a report using the API. See below the dbo.clr_PrintReport procedure for how to print a report using SQLCLR.

## CLR Procedures
### dbo.clr_ReportExportToFile

Use this procedure to save a SSRS report to the server where the CustodianAPI is running.
Will require using [dbo.report_AddReportParameters](#dbo.report_AddReportParameters), see a working example below.

| Parameter Name		| Required	| Description																			|
|-----------------------|-----------|---------------------------------------------------------------------------------------|
| reportPath | Yes | Path to the report in SSRS (use the report properties in the CustodianAPI to find the report path) |
| fileDestinationPath | Yes | Where the report will be save to including the file name.
| filetype | Yes | File type that you want to save as (PDF, EXCELOPENXML (.xlsx), EXCEL (.xls)) |
| parameters | No | List of all parameters required by the report |

### dbo.clr_PrintReport

Use this procedure to print a SSRS report. 
Will require using [dbo.report_AddReportParameters](#dbo.report_AddReportParameters), see a working example below.

| Parameter Name		| Required	| Description																			|
|-----------------------|-----------|---------------------------------------------------------------------------------------|
| reportPath | Yes | Path to the report in SSRS (use the report properties in the CustodianAPI to find the report path) |
| printerName | Yes | Name of the printer to print to (check available printers in CustodianAPI printer statuses ) |
| copies | Yes | Number of copies to be printed |
| parameters | No | List of all parameters required by the report |

### dbo.report_AddReportParameters

Use this Function to create a report parameter to use with dbo.clr_ReportExport and dbo.clr_PrintReport.

| Parameter Name		| Required	| Description																			|
|-----------------------|-----------|---------------------------------------------------------------------------------------|
| parameters | Yes | The string that will contain the report parameters |
| name | Yes | The name of the report parameter |
| value | Yes | The value of the parameter |

Example use (printing)

```sql
DECLARE @reportPath varchar(50)
DECLARE @printerName varchar(50) 
DECLARE @parameters varchar(200)
DECLARE @copies int
DECLARE @success bit
DECLARE @message varchar(max)

SELECT @reportPath = '/Pick Slip - Per Cage'
SELECT @printerName = 'TestPrinter'
SELECT @copies = 1

BEGIN TRY
	SELECT @parameters = dbo.report_AddReportParameter(@parameters, 'DocumentNumber', 'STV-AVO-000001')
	SELECT @parameters = dbo.report_AddReportParameter(@parameters, 'Cage', 'CAGE D')

	EXEC [dbo].[clr_ReportPrint]
		@reportPath
		,@printerName
		,@parameters
		,@copies
		,@success OUTPUT
		,@message OUTPUT
END TRY
BEGIN CATCH
	SELECT @message = ERROR_MESSAGE()
	SELECT @success = 0
END CATCH

SELECT @success, @message

```

Example use (export)

```sql
DECLARE @reportPath varchar(50)
DECLARE @fileDestinationPath varchar(50)
DECLARE @fileType varchar(50) 
DECLARE @parameters varchar(200)
DECLARE @success bit
DECLARE @message varchar(max)

SELECT @reportPath = N'/Pick Slip - Per Cage'
SELECT @fileDestinationPath = 'D:\\Granite WMS\\V5 Demo\\PickSlip.pdf'
SELECT @fileType = 'PDF'

BEGIN TRY

	SELECT @parameters = dbo.report_AddReportParameter(@parameters, 'DocumentNumber', 'STV-AVO-000001')
	SELECT @parameters = dbo.report_AddReportParameter(@parameters, 'Cage', 'CAGE D')

	EXEC [dbo].[clr_ReportExportToFile]
		 @reportPath
		,@fileDestinationPath
		,@fileType
		,@parameters
		,@success OUTPUT
		,@message OUTPUT
END TRY
BEGIN CATCH
	SELECT @message = ERROR_MESSAGE()
	SELECT @success = 0
END CATCH

SELECT @success, @message

```
