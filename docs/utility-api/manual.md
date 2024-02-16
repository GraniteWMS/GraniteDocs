# Manual


## Setup

### Prerequisites

- IIS
- [ASP.NET Core 8 Hosting Bundle](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)

### Install

1. Configure the connection string to the Granite database in the `appsettings.json` file
2. Add the site to IIS, be sure to run as https and select a valid certificate
3. Configure the settings for each service that you are going to make use of
	- [Email Service Configuration](#configuration)
	- [Reporting Service Configuration](#configuration_1)
	- [SqlExport Service Configuration](#configuration_2)

## Email Service

### Configuration

Settings for the Email Service are configured in the `SystemSettings` table. You can find the insert script for the settings in the GraniteDatabase install folder:

```
"...\GraniteDatabase\Data\SystemSettings\SystemSettingsUtilityAPI.sql"
```

You should have the following settings after running the script:

| Application		| Key					| Value						| Description																								| ValueDataType | isEncrypted	| isActive	|
|-------------------|-----------------------|---------------------------|-----------------------------------------------------------------------------------------------------------|---------------|---------------|-----------|
| Granite.Utility	| UserName				|                   		| Username for the SMTP server																				| string		| False			| True		|
| Granite.Utility	| Password				|                       	| Password for the SMTP server																				| string		| False			| True		|
| Granite.Utility	| Host					| smtp.gmail.com			| The address of the SMTP server																			| string		| False			| True		|
| Granite.Utility	| Port					| 587						| Port number to be used when accessing the SMTP server														| int			| False			| True		|
| Granite.Utility	| EnableSsl				| true						| Use SSL when accessing the SMTP server. True or False														| bool			| False			| True		|
| Granite.Utility	| From					|                   		| Email address that will be used to send mail																| string		| False			| True		|
| Granite.Utility	| FromName				|           				| The sender name that will display to users who receive emails												| string		| False			| True		|
| Granite.Utility	| RetryInterval			| 30						| Number of seconds to wait before retrying processing an email												| int			| False			| True		|
| Granite.Utility	| MaxNumberOfRetries	| 3							| Maximum number of times to retry processing an email.             										| int			| False			| True		|
| Granite.Utility	| EmailAttachmentFolder |							| Full filepath to folder to export email attachments to. Leave empty to use the Utility API install folder | string		| False			| True		|


### Email Templates

Email templates use MARKDOWN for text formatting - HTML is not supported. 
If you're not familiar with markdown, take a look at the [syntax cheat-sheet](https://www.markdownguide.org/cheat-sheet/).

To embed images and tables in the body of your email, Email Templates use Script Methods similar to the Web Template's Script Methods.

#### Template Manager

The Template Manager is how you design and preview your email templates before using them. 
It has full auditing, so you can see which user has made changes to the Email Templates, as well as what has changed.

To copy an existing template, select it from the dropdown and then select New Template. 
When you save the template you will be prompted to give your new template a name.

#### Script Methods
Script methods are the building blocks of your emails. 
You can use these to add images, tables, and more to the body of your email.

Each currently available Script Method is described below:

##### headerImage()

The headerImage() script method allows you to add an image as a header to the top of your email.

Available parameters:

| ParameterName		| Data Type | Required	| Description													|
|-------------------|-----------|-----------|---------------------------------------------------------------|
| imageUrl			| string	| Yes		| The url of the image that you want in your header				|
| imageAltText		| string	| No		| Text that will display in place of image if link is broken	|
| backgroundColor	| string	| No		| Solid block of color behind the image. Can be hexcode or word	|

Code example:

```
{{
    headerImage(
    {
      imageUrl:'https://www.granitewms.com/wp-content/uploads/2020/07/GraniteWMS-1.png',
      imageAltText:'GraniteWMS logo',
      backgroundColor:'#182026'
    })
}}
```

##### table()

The `table()` script method works together with the `dbSelect()` method to take a SQL string as an input and return the result as a table.

| ParameterName		| Data Type | Required	| Description													|
|-------------------|-----------|-----------|---------------------------------------------------------------|
| sumColumns		| string[]	| No		| Comma separated list of columns to sum in the table footer    |
| backgroundColor	| string	| No		| Background color for the table's header and footer        	|
| textColor 		| string	| No		| Text color for the table's header and footer text             |

Code example:

```
{{    
    'SELECT * FROM EmailTemplate_OrderDetail WHERE DocumentNumber = @documentNumber'
    | dbSelect({documentNumber})
    | table({backgroundColor: '#182026', textColor: 'white', sumColumns:['Qty','Price']})
}}
```

##### footerBlock() and footerItem()

The `footerItem()` script method can be chained together with more `footerItem()`'s which are then passed into the `footerBlock()` to add a footer to your email.

FooterItem parameters:

| ParameterName		| Data Type | Required	| Description													|
|-------------------|-----------|-----------|---------------------------------------------------------------|
| imageUrl  		| string	| No		| Url of the image to include in this footer item  				|
| imageWidth    	| int   	| No		| Width of the image in pixels. Height will scale automatically	|
| text       		| string	| No		| Text to include in this footer item                           |
| url       		| string	| No		| Url to link to if this footer item is clicked on              |

FooterBlock parameters:

| ParameterName		| Data Type | Required	| Description													|
|-------------------|-----------|-----------|---------------------------------------------------------------|
| textColor  		| string	| No		| Color of the text in the footerBlock            				|
| backgroundColor  	| string   	| No		| Color of the background block for the whole footerBlock   	|

Code example:

```
{{
    footerItem(
    { 
        imageUrl:'https://cdn1.iconfinder.com/data/icons/logotypes/32/square-facebook-1024.png',
        imageWidth: 50,
        url:'https://www.facebook.com/StarWarsAfrica/'
    })
    | footerItem(
    { 
        imageUrl:'https://cdn2.iconfinder.com/data/icons/social-icons-33/128/Instagram-1024.png',
        imageWidth: 50,
        url:'https://www.instagram.com/starwars'
    })
    | footerBlock({backgroundColor:'#182026', textColor:'lightgray' })
}}
```

### Sending an Email

When you make a request to send an email, the email is immediately entered into the `Email` table in the database.
If your email is a templated email, the template is rendered just before the entry is created in the `Email` table.
The Email Service will give you a response as soon as the email is queued in the table. 
From there, the email is passed to background services to fetch any attachments. 
Once the attachments have been gathered, the email will be sent.

If any of the background services are unable to complete their job, 
whether that be fetching an attachment or actually sending the mail, they will retry until the task succeeds or the 
`MaxNumberOfRetries` configured in SystemSettings is reached.

When the `MaxNumberOfRetries` is reached, the mail's status is set to FAILED and will not be retried without manual intervention.

See the API Documentation page for more info on sending emails using the API. 
For sending mails using SQLCLR, see the SQLCLR manual.

### Attachments

When you send an email with attachments, copies of those attachments are saved to the `EmailAttachmentFolder` specified in SystemSettings. 
The attachments for any given email will be placed in a subfolder named with the `ID` of the email in the `Email` database table.
This allows you to go back at any point to check the contents of the files that were sent as attachments.

#### SSRS Reports

To attach SSRS reports, ensure the Reporting Service is configured correctly and working.

Attaching an SSRS report works very similarly to printing or exporting the report directly from the Reporting Service. 
The difference is that the Email Service will make the request to fetch the report after the email has been queued in the database.

Browse the API's documentation page (`/metadata`) for details on the properties needed to attach an SSRS report. 
The details can be found on the TemplateEmail or SimpleEmail requests.

#### SQL Table exports

To attach SQL Table exports, ensure the SQLExport Service is configured correctly and working.

Attaching an excel export works very similarly to exporting the data directly from the SQLExport Service. 
The difference is that the Email Service will make the request to export the data after the email has been queued in the database.

Browse the API's documentation page (`/metadata`) for details on the properties needed to attach a SQL Table Export. 
The details can be found on the TemplateEmail or SimpleEmail requests.

#### File attachments

File attachments allow you to specify a file path to the file that you want to attach.
When fetching this attachment type, the Email Service will copy the file into the email attachment folder configured in the SystemSettings table.
This is to ensure that a copy is kept for future reference in case the original is ever moved or deleted.

Browse the API's documentation page (`/metadata`) for details on the properties needed to attach a File Attachment. 
The details can be found on the TemplateEmail or SimpleEmail requests.

## Reporting Service

`todo` explain that this is a SSRS API, etc.
`todo` document ssrs installation and setup 
### Configuration

Settings for the Reporting Service element of the UtilityAPI are configured in the `SystemSettings` table. You can find the insert script for the settings in the GraniteDatabase install folder:

```
"...\GraniteDatabase\Data\SystemSettings\SystemSettingsUtilityAPI.sql"
```

You should have the following settings after running the script:

| Application		| Key					| Value						| Description																								| ValueDataType | isEncrypted	| isActive	|
|-------------------|-----------------------|---------------------------|-----------------------------------------------------------------------------------------------------------|---------------|---------------|-----------|
| Granite.Utility	| SSRSWebServiceUrl			|  | Url of the reporting service | string	| False	| True	|

The SSRS Web Service Url should look something like this: http://10.0.01/ReportServer

You can find it on the Report Server Configuration Manager under the web service url tab. Check the configuration page (`/config`) and ensure that `Report Service URL Valid` and `Report Execution Service URL Valid` are both `true`.

#### IIS Application Pool

In order for the UtilityAPI to access SSRS, the Identity of the Application pool needs to be changed to LocalSystem. 

To do this, go to the advanced settings of the application pool associated with the UtilityAPI and change from ApplicationPoolIdentity to LocalSystem as you can see below.

![image info](img\AdvancedSettings.JPG)


### Report Properties

Report Properties on the UtilityAPI homepage allows you to see all of the report paths and parameters. 

If the parameter Name is ERROR you will need to check that the report is working in SSRS. The most common errors are a missing stored procedure or the report being pointed to a data source that does not exist.

### Printer Statuses

Printer Statuses on the UtilityAPI homepage allows you to see all of the Printers visible to the UtilityAPI and their statuses. The report service does not check the status of the printer before sending a print job. The status is purely useful to diagnose issues printing.

### ReportFileExport

This process calls SSRS and saves the report to the specified file path. The file path has to be on the server where the UtilityAPI is running. To get the file from the server, the easiest option is to send it as an email attachment.

Supported file types are PDF and EXCEL, both the new .xlsx and the old .xls. If you are unsure which to use, go for .xlsx

See the API Documentation for more details on how to export a report using the API. See the SQLCLR documentation for how to export a report using SQLCLR.

### ReportPrint

This process calls SSRS and sends the report to a print queue. Check Printer Statues on the UtilityAPI homepage to see the list of available printers.

See the API Documentation for more details on how to print a report using the API. See the SQLCLR documentation for how to print a report using SQLCLR.

## SqlExport Service
### Configuration

The only setup required is to configure the connection string to the Granite database in the `appsettings.json` file.

### Table Export

This process saves data from either a table or a view to the specified file path. The file path has to be on the server where the UtilityAPI is running. To get the file from the server, the easiest option is to send it as an email attachment.

Supported file types are EXCEL (.xlsx) AND CSV (.csv).

Table Export supports filters (Equal, GreaterThan, ect..), order by, offset, and limit.

- **Filters** require the column name, the filter type, and filter value. (For a full list of supported filter types, see the API documentation)
- **OrderBy** requires a column name and an order by type (ASC or DESC). The order in which the order bys are submitted determines the order in which they are applied. 
- **Offset** determines how many rows from the start of the data are skipped. If not set it will default to 0.
- **Limit** determines the number of rows returned from the data. If not set it will default to 10000. 

See the API documentation for more details on how to export a table or view using the API. See the SQLCLR documentation for how to export a table or view using SQLCLR.
