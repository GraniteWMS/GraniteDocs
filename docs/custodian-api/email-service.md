# Email Service

## Configuration

!!! warning "Google shutting down access to sending mails via SMTP"
    As of January 2025, the Custodian API will not be able to send emails using SMTP.

    If you are using a Gmail address to send emails, you will need to switch over to the new [Gmail provider](#gmail)


Settings for the Email Service are configured in the `SystemSettings` table. You can find the insert script for the settings in the GraniteDatabase install folder:

```
"...\GraniteDatabase\Data\SystemSettings\SystemSettingsCustodian.sql"
```

You should have the following settings after running the script:

| Application		| Key					| Value						| Description																								| ValueDataType | isEncrypted	| isActive	|
|-------------------|-----------------------|---------------------------|-----------------------------------------------------------------------------------------------------------|---------------|---------------|-----------|
| Granite.Custodian	| UserName				|                   		| Username for the account that will be used to send email													| string		| False			| True		|
| Granite.Custodian	| Password				|                           | Password for the account that will be used to send email                                                  | string	    | True			| True		|
| Granite.Custodian	| Host					| smtp.gmail.com			| The address of the SMTP server																			| string		| False			| True		|
| Granite.Custodian	| Port					| 587						| Port number to be used when accessing the SMTP server														| int			| False			| True		|
| Granite.Custodian	| EnableSsl				| true						| Use SSL when accessing the SMTP server. True or False														| bool			| False			| True		|
| Granite.Custodian	| From					|                   		| Email address that will be used to send mail																| string		| False			| True		|
| Granite.Custodian	| FromName				|           				| The sender name that will display to users who receive emails												| string		| False			| True		|
| Granite.Custodian	| RetryInterval			| 30						| Number of seconds to wait before retrying processing an email												| int			| False			| True		|
| Granite.Custodian	| MaxNumberOfRetries	| 3							| Maximum number of times to retry processing an email.             										| int			| False			| True		|
| Granite.Custodian	| EmailAttachmentFolder |							| Full filepath to folder to export email attachments to. Leave empty to use the Custodian install folder   | string		| False			| True		|
| Granite.Custodian	| EmailProvider         |							| Provider to use for sending emails. If empty, we will use the SMTP provider.                              | string		| False			| True		|

!!! note "Password isEncrypted is True"
    You will only be able to change the value of this setting from the Webdesktop System Settings page

### Email Providers

Email Providers allow us to configure the way that we send emails for different types of email accounts.
At the moment we support sending email using a SMTP server directly, or using the Gmail API.

Note that as of January 2025, Gmail no longer allows sending emails using their SMTP server directly.
This is why configuring the Email Service to send email via a Gmail account works slightly differently.

To configure the `EmailProvider`, set the name of the provider you want to use in SystemSettings.
If the `EmailProvider` setting is empty, it will default to using the SMTP provider.

#### SMTP
Sending email via SMTP is quite straightforward, all you need is the credentials of the account that you are using to send email, and the details of the server that you are using to send email. These get configured in the `System Settings`

##### Required System Settings

- UserName - User name to use when connecting to the SMTP server
- Password - Password to use when connecting to the SMTP server
- Host - The host address of the SMTP server (server name or IP)
- Port - The port number to use when accessing the SMTP server
- EnableSsl - Use SSL when accessing the SMTP server. True or False
- From - The email address that you are sending mail from
- FromName - The sender name that will display to users who receive emails

#### Gmail
Since Gmail has blocked access to SMTP, sending email via a Gmail account involves more set up.

!!! note 
    If you are updating in order to continue using the GraniteWMS Info to send email, all you need to do is the following:
    
    1. Deploy the latest Custodian API 

    2. Run the SQL script at `...\Granite Releases\Granite Info Gmail Auth\CustodianSystemSettings.sql`

    3. Copy the GmailTokens folder `...\Granite Releases\Granite Info Gmail Auth\GmailTokens` into the GraniteCustodian folder

To send email via Gmail, you will first need to [enable Gmail API access](#allow-gmail-account-api-access) for the account you're using and obtain the `Client ID` and `Client secret`.
These are the UserName and Password that you will need to set in `SystemSettings`.

Next, you will need to place the API token file in the `...\GraniteCustodian\GmailTokens` folder.
If you have the token file for the account you are using already, you can simply paste it in.
Otherwise, you will need to run the [Gmail Authenticator](#gmail-authenticator) to obtain the token file.

##### Required System Settings

- UserName - The Client ID used to connect to the Gmail API
- Password - The Client secret used to connect to the Gmail API
- From - The email address that you are sending mail from
- FromName - The sender name that will display to users who receive emails

##### Allow Gmail account API access

!!! note
    This configuration has already been completed for the GraniteWMS Info account, it does not need to be performed again.
    
    If you are using the GraniteWMS Info account, use the script in Dropbox to update your SystemSettings and then run the [GmailAuthenticator](#gmail-authenticator) app to log in.

To allow Email Service access to the Gmail account in order to send email, we will need to configure some settings on the Gmail account.

Browse to [https://console.cloud.google.com](https://console.cloud.google.com) and log in with the account that you want to use, then follow the steps below.

1. Click the `Select a project` button on the top left

    ![](img/gmail1.png)

2. Click the `New Project` button on the top right of the box.

    ![](img/gmail2.png)

3. Give the new project a name e.g. `GraniteCustodianAPI`.
You shouldn't need to change the Location/Organization. Just keep the default and click `CREATE`

    ![](img/gmail3.png)

4. Click the hamburger menu on the top left and select `Enabled APIs & services` from the menu

    ![](img/gmail4.png)

5. Click the `Enable APIs and Services` button

    ![](img/gmail5.png)

6. Search for "gmail", click on the Gmail API entry and then click the `Enable` button

    ![](img/gmail6.png)

7. Once the Gmail API is enabled, select the `OAuth consent screen` from the menu on the left

    ![](img/gmail7.png)

8. On the OAuth consent screen, select User Type `Internal` and click `Create`

    ![](img/gmail8.png)

9. Select the Application type `Web application`. 
Enter an App name e.g. `Granite.Custodian.Api`, a user support email address and a developer contact email address. 
You can set both of the email addresses to the email address that you are using to send email.
Click the `Save and Continue` button once you've entered the required fields.

    ![](img/gmail9.png)

10. Click the `Add or Remove Scopes` button

    ![](img/gmail10.png)

11. Filter the list of scopes by `Gmail API` and select the scope `https://mail.google.com`. 
Scroll to the bottom of the page and click `Update`

    ![](img/gmail11.png)

12. Now that the scope has been added, scroll down to the bottom of the page and click `Save and Continue`

    ![](img/gmail12.png)

13. Select `Credentials` from the menu on the left

    ![](img/gmail13.png)

14. Click the `Create Credentials` button at the top and select `OAuth client ID`

    ![](img/gmail14.png)

15. Give the client ID a name, e.g. `Granite.Custodian.Api`. 
Under Authorized redirect URIs add both `http://localhost/authorize/` and `http://127.0.0.1/authorize/`
Then click the `Create` button at the bottom

    ![](img/gmail15.png)

16. Take note of the `Client ID` and the `Client secret`. 
These are the `UserName` and `Password` that you will need for SystemSettings

    ![](img/gmail16.png)

17. Set the `Client ID` and `Client secret` as your `UserName` and `Password` in SystemSettings. 
While you are in SystemSettings, also ensure that you have the `EmailProvider` setting and that the value is set to `GMAIL`

    !!! note
        The `Client secret` must be encrypted. Ensure that you save it through the Webdesktop so that it is not stored in plaintext.

##### Gmail Authenticator 
The Gmail Authenticator connects to the Gmail API using the Client ID and Client secret from System Settings, and fetches tokens that allow the Custodian API to connect to the Gmail API.
This is a once off set up, once you have authenticated, the Email Service will be able to send email via Gmail.

1. Open a browser window that is either signed in with the Gmail account you are planning to use, or not signed in to any Gmail account. The Guest mode in Chrome works well for this.

2. Browse to the folder where you have installed Custodian, and into the `GmailAuthenticator` folder. 
Run the `Granite.Email.GmailAuthenticator.exe`.

    !!! note 
        Granite.Email.GmailAuthenticator.exe uses the Custodian's appSettings.json file. 
        Make sure that it is configured before trying to authenticate the Gmail account.

3. A new browser tab will open asking you to log in to authorize the Custodian API. 
Log in with the Gmail account that you are going to use to send emails. 
Log in with the **normal username and password** - NOT the Client ID and Client secret

After signing in via the browser, Gmail Authenticator will place the received token file into the `...\GraniteCustodian\GmailTokens` folder

## Email Templates

Email templates use MARKDOWN for text formatting - HTML is not supported. 
If you're not familiar with markdown, take a look at the [syntax cheat-sheet](https://www.markdownguide.org/cheat-sheet/).

To embed images and tables in the body of your email, Email Templates use Script Methods similar to the Web Template's Script Methods.

### Template Manager

The Template Manager is how you design and preview your email templates before using them. 
It has full auditing, so you can see which user has made changes to the Email Templates, as well as what has changed.

To copy an existing template, select it from the dropdown and then select New Template. 
When you save the template you will be prompted to give your new template a name.

### Script Methods
Script methods are the building blocks of your emails. 
You can use these to add images, tables, and more to the body of your email.

Each currently available Script Method is described below:

#### headerImage()

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
      imageUrl:'https://raw.githubusercontent.com/GraniteWMS/GraniteBrandAssets/main/Granite_WMS_Reversed.png',
      imageAltText:'GraniteWMS logo',
      backgroundColor:'#182026'
    })
}}
```

#### table()

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

#### footerBlock() and footerItem()

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

## CLR Procedures

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

Two types of emails can be sent using SQLCLR:

- [Template Emails](#dbo.clr_templateemail)
- [Simple Emails](#dbo.clr_simpleemail)

The difference between these two types of emails is where the content of the email body comes from. 
Templated emails require an email template that will be used to generate the body of the email. 
Simple emails can only contain unformatted text in the body of the email.
For more info on these, as well as help with designing your own email templates, see the Custodian API manual.

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

Example usage

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
DECLARE @success bit
DECLARE @message varchar(max)

BEGIN TRY

    SET @subject = 'Test Clr Mail'																			
    SET @templateName = 'PickingNotification' -- Use the email template named PickingNotification
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
        ,@success OUTPUT
        ,@message OUTPUT

END TRY
BEGIN CATCH
    SELECT @message = ERROR_MESSAGE()
    SELECT @success = 0
END CATCH

SELECT @success, @message

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



Example usage

```sql
DECLARE @subject nvarchar(max)
DECLARE @body nvarchar(max)
DECLARE @toEmailAddresses nvarchar(max)
DECLARE @ccEmailAddresses nvarchar(max)
DECLARE @bccEmailAddresses nvarchar(max)
DECLARE @reportAttachments nvarchar(max)
DECLARE @excelAttachments nvarchar(max)
DECLARE @fileAttachments nvarchar(max)
DECLARE @success bit
DECLARE @message varchar(max)

SET @subject = 'Test Clr Mail' 
SET @body = 'Test mail'
SET @toEmailAddresses = 'email1@gmail.com;email2@gmail.com'

BEGIN TRY
    EXECUTE [dbo].[clr_SimpleEmail] 
        @subject
        ,@body
        ,@toEmailAddresses
        ,@ccEmailAddresses
        ,@bccEmailAddresses
        ,@reportAttachments
        ,@excelAttachments
        ,@fileAttachments
        ,@success OUTPUT
        ,@message OUTPUT
END TRY
BEGIN CATCH
    SELECT @message = ERROR_MESSAGE()
    SELECT @success = 0
END CATCH

SELECT @success, @message

```


### Attachments

When you send an email with attachments, copies of those attachments are saved to the `EmailAttachmentFolder` specified in SystemSettings. 
The attachments for any given email will be placed in a subfolder named with the `ID` of the email in the `Email` database table.
This allows you to go back at any point to check the contents of the files that were sent as attachments.

#### SSRS Reports

To attach SSRS reports, ensure the [Reporting Service](reporting-service.md) is configured correctly and working.

Attaching an SSRS report works very similarly to printing or exporting the report directly from the Reporting Service. 
The difference is that the Email Service will make the request to fetch the report after the email has been queued in the database.

Browse the API's documentation page (`/metadata`) for details on the properties needed to attach an SSRS report. 
The details can be found on the TemplateEmail or SimpleEmail requests.

##### dbo.email_CreateReportAttachment

| ParameterName | Required	| Description																								|
|---------------|-----------|-----------------------------------------------------------------------------------------------------------|
| reportPath	| Yes		| The path to this report in SSRS. You can find the report path by browsing the CustodianAPI's reports page	|
| fileType		| Yes		| The file type that the report should be exported to. Valid values are PDF, EXCELOPENXML, or EXCEL			|

dbo.email_AddReportParameter

| ParameterName		| Required	| Description																													|
|-------------------|-----------|-------------------------------------------------------------------------------------------------------------------------------|
| reportAttachment	| Yes		| The report attachment that you are adding the parameter to. This must be created using the CreateReportAttachment function	|
| parameterName		| Yes		| The name of the SSRS report parameter you want to set 																		|
| parameterValue	| Yes		| The value that you want to set the SSRS report parameter to																	|

##### dbo.email_AddReportAttachment

| ParameterName				| Required	| Description																									|
|---------------------------|-----------|---------------------------------------------------------------------------------------------------------------|
| reportAttachments			| Yes		| The variable that contains the list of report attachments that you are going to send							|
| reportAttachmentToAdd		| Yes		| The variable that contains the report that you want to add to the list of reports that you are going to send	|

Example

```sql
DECLARE @subject nvarchar(max)
DECLARE @body nvarchar(max)
DECLARE @toEmailAddresses nvarchar(max)
DECLARE @ccEmailAddresses nvarchar(max)
DECLARE @bccEmailAddresses nvarchar(max)
DECLARE @reportAttachments nvarchar(max)
DECLARE @excelAttachments nvarchar(max)
DECLARE @fileAttachments nvarchar(max)
DECLARE @success bit
DECLARE @message varchar(max)
DECLARE @PickingReport varchar(max)

BEGIN TRY
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
		,@success OUTPUT
		,@message OUTPUT
END TRY
BEGIN CATCH
	SELECT @message = ERROR_MESSAGE()
	SELECT @success = 0
END CATCH

SELECT @success, @message
```

#### SQL Table exports

To attach SQL Table exports, ensure the [SQLExport Service](sql-export-service.md) is configured correctly and working.

Attaching an excel export works very similarly to exporting the data directly from the SQLExport Service. 
The difference is that the Email Service will make the request to export the data after the email has been queued in the database.

Browse the API's documentation page (`/metadata`) for details on the properties needed to attach a SQL Table Export. 
The details can be found on the TemplateEmail or SimpleEmail requests.

##### dbo.email_CreateExcelAttachment

| ParameterName | Required	| Description																		|
|---------------|-----------|-----------------------------------------------------------------------------------|
| tableName		| Yes		| The name of the table or view that you want to export results from				|
| fileType		| Yes		| The file type that the data should be exported to. Valid values are CSV or EXCEL	|

##### dbo.email_AddExcelAttachmentFilter

| ParameterName		| Required	| Description																																														|
|-------------------|-----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| excelAttachment	| Yes		| The excel attachment you are adding a filter to. The variable passed in must be created using the CreateExcelAttachment function																	|
| filterColumn		| Yes		| The column that you want to filter on																																								|
| filterType		| Yes		| The filter operation you want to perform. Valid values are Equal, NotEqual, Like, NotLike, StartsWith, EndsWith, Between, GreaterThan, GreaterThan, GreaterThanOrEqual, LessThan, LessThanOrEqual	|
| filterValue		| Yes		| The value you want to filter by																																									|

##### dbo.email_AddExcelAttachmentOrderBy

| ParameterName		| Required	| Description																														|
|-------------------|-----------|-----------------------------------------------------------------------------------------------------------------------------------|
| excelAttachment	| Yes		| The excel attachment you are adding a filter to. The variable passed in must be created using the CreateExcelAttachment function	|
| orderByColumn		| Yes		| The column that you want to order by																								|
| orderByType		| Yes		| Order by ascending or descending. Valid values are ASC or DESC																	|

##### dbo.email_AddExcelAttachment

| ParameterName			| Required	| Description																													|
|-----------------------|-----------|-------------------------------------------------------------------------------------------------------------------------------|
| excelAttachments		| Yes		| The variable that contains the list of excel attachments that you are going to send											|
| excelAttachmentToAdd	| Yes		| The variable that contains the excel attachment that you want to add to the list of attachments that you are going to send	|


Example

```sql
DECLARE @subject nvarchar(max)
DECLARE @body nvarchar(max)
DECLARE @toEmailAddresses nvarchar(max)
DECLARE @ccEmailAddresses nvarchar(max)
DECLARE @bccEmailAddresses nvarchar(max)
DECLARE @reportAttachments nvarchar(max)
DECLARE @excelAttachments nvarchar(max)
DECLARE @fileAttachments nvarchar(max)
DECLARE @success bit
DECLARE @message varchar(max)

DECLARE @ConsumablesExport varchar(max)

BEGIN TRY
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
		,@success OUTPUT
		,@message OUTPUT
END TRY
BEGIN CATCH
	SELECT @message = ERROR_MESSAGE()
	SELECT @success = 0
END CATCH

SELECT @success, @message

```

#### File attachments

File attachments allow you to specify a file path to the file that you want to attach.
When fetching this attachment type, the Email Service will copy the file into the email attachment folder configured in the SystemSettings table.
This is to ensure that a copy is kept for future reference in case the original is ever moved or deleted.

Browse the API's documentation page (`/metadata`) for details on the properties needed to attach a File Attachment. 
The details can be found on the TemplateEmail or SimpleEmail requests.

##### dbo.email_AddFileAttachment

| ParameterName		| Required	| Description																								|
|-------------------|-----------|-----------------------------------------------------------------------------------------------------------|
| fileAttachments	| Yes		| The variable that contains all the file attachment paths that will be sent with the email					|
| fileToAttach		| Yes		| The path to the file that you want to add as an attachment												|


Example

```sql
DECLARE @subject nvarchar(max)
DECLARE @body nvarchar(max)
DECLARE @toEmailAddresses nvarchar(max)
DECLARE @ccEmailAddresses nvarchar(max)
DECLARE @bccEmailAddresses nvarchar(max)
DECLARE @reportAttachments nvarchar(max)
DECLARE @excelAttachments nvarchar(max)
DECLARE @fileAttachments nvarchar(max)
DECLARE @success bit
DECLARE @message varchar(max)

BEGIN TRY
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
		,@success OUTPUT
		,@message OUTPUT
END TRY
BEGIN CATCH
	SELECT @message = ERROR_MESSAGE()
	SELECT @success = 0
END CATCH

SELECT @success, @message
```