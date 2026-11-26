# Bartender

The Bartender LabelPrint service is a Window Service that enables other Granite applications to print Bartender labels.

Each type of label that can be printed has a corresponding SQL view that returns the information/data that displays on the label.
The application will query this view with a key (Barcode, Item Code, etc) to fetch the relevant information.
After that, the application will map the data returned by the SQL view to the matching Named Data Source in the Bartender label format. 

**Supported Bartender Versions:**

<div class="grid cards" markdown>

-   32 bit versions

    ---

    - 10.1 R1, R4
    - 2016, R1, R4


-   64 bit versions

    ---

    - 2016 R9
    - 2019 R6, R10
    - 2020
    - 2021, R7 
</div>

## Setup

### Prerequisites

- Bartender
- .NET Framework 4.7.2 or later
- A ServiceStack license key (version 7 and up)
- A certificate for the server (version 7 and up). The same certificate that is used for the Granite IIS sites can be used, see [Creating Certificates](../../iis/getting-started.md#creating-certificates)

### Installation 
1. Check the version of Bartender that is currently installed. You can check by opening Bartender Designer, and selecting Help -> About. Take note of the release number ant the bitness as shown here:

    ![](bartender-img\about.png)

2. Copy the version of GraniteLabelPrinting that matches the bitness of Bartender that you have installed.


3. In the `Granite.LabelPrinting.exe.config` file, configure your connection string to the Granite database
    ```xml
    <connectionStrings>
        <add name="CONNECTION" connectionString="Data Source=.\;Initial Catalog=Granite;Persist Security Info=True;User ID=******;Password=****" providerName="System.Data.SqlClient" />
    </connectionStrings>
    ```

4. In the `Granite.LabelPrinting.exe.config` file, configure your `EndPoint` setting. This is the address that the LabelPrintService will run on. As of version 7 this must be an https address.
    ```xml
    <add key="EndPoint" value="https://+:40092/"/>
    ```

    A certificate must be bound to the port before the service will start on https. [Scaffold](../../scaffold/manual.md) does this for you during the install.
    If Scaffold was unable to bind the certificate, or you are installing without Scaffold, follow the steps in [Certificates for Windows Services](../../security/service-certificates.md).

5. In the `Granite.LabelPrinting.exe.config` file, set your ServiceStack license key. The service will not start without it.
    ```xml
    <add key="servicestack:license" value="your license key"/>
    ```
    Alternatively, set the license key in the `SERVICESTACK_LICENSE` environment variable on the server.

6. In the `Granite.LabelPrinting.exe.config` file, ensure that the `Provider` setting is set to `Bartender`
    ```xml
    <add key="Provider" value="Bartender"/>
    ```

7. Run `Granite.LabelPrinting.exe` and follow the instructions to complete the install.

8. Point the applications that print labels to the https address of the service, using a host name or IP address that is on the certificate:
    - SQLCLR: the `LabelPrintService` setting in the `SystemSettings` table
    - ProcessApp: the `LabelPrintingEndPoint` setting in `appsettings.json`

!!! note 
    It is advisable to run the service from the console and test print before installing as a service.

    You may need to run the the Granite Label Printing service as administrator, depending on the permissions yor user account has.

### App Settings

#### EndPoint
The endpoint address of the printing service. Hosted via windows service.
``` xml
<add key="EndPoint" value="https://+:40092/"/>
```
As of version 7 this must be an https address, and a certificate must be bound to the port. See [Certificates for Windows Services](../../security/service-certificates.md).

#### servicestack:license
The ServiceStack license key. Required as of version 7 - the service will not start without it. Can also be set in the `SERVICESTACK_LICENSE` environment variable on the server.
``` xml
<add key="servicestack:license" value=""/>
```

#### Provider
Provider options ZPL OR Bartender. 

**`Take Note`** while this service is still capable of printing ZPL labels, it is highly advised to use the new [IIS ZPL Label Print Service](../zpl/manual.md) instead. 
ZPL printing via this service will not receive any further support, and will eventually be removed.
 **If you do choose to use this service to print ZPL labels, nsure that the default labels below is relevant to your provider. The extension and file needs to be setup correctly .zpl or .btw** 

``` xml
<add key="Provider" value="Bartender"/>  <!--Bartender or ZPL-->
```

#### PrinterName
Default printer for the instance of the service, you can override the windows default printer by specifying a printer name.
``` xml
<add key="PrinterName" value=""/>
```

#### PrinterNameErrorLabel
Printer name for error label printing. If configured a label with information about the application error will print. This will typical be the error you see on the screen but just printed out. Used to keep track of errors.
``` xml
<add key="PrinterNameErrorLabel" value=""/>
```

#### DefaultLabelPath
Path to the default labels location
``` xml
<add key="DefaultLabelPath" value="C:\Program Files\Common Files\Cradle Technology Services\Granite\Labels\"/>
```

### Authentication

As of version 7 the label print service requires authentication. Calls to `/print`, `/printers`, `/config` and `/printerror` that do not authenticate receive a `401 Unauthorized`.

| Caller | How it authenticates |
|--------|----------------------|
| ProcessApp | Sends the token of the user that is logged in (`Authorization: Bearer`). The token is issued by the Business API, and is only accepted over https |
| SQLCLR (`clr_PrintLabel`) | Sends the [API key](../../security/api-keys.md) of the user that is printing (`X-Api-Key`). Every user that prints from SQL must have an API key |

!!! note
    - The service must be connected to the **same Granite database as the Business API**. The key that is used to validate the ProcessApp's token is stored in the `SystemSettings` table (see [JwtAuthKey](../../security/system-security.md#jwtauthkey)).
    - The service now needs to be able to connect to the database in order to start.
    - The `/config` page can no longer be opened without credentials, and the service does not have a login page. Call it with a tool that can send your API key in the `X-Api-Key` header, or log in first by posting your Granite user name and password to `/auth/credentials`. The `/metadata` page is still public, and can be used to check that the service is running.

See the [Authentication & HTTPS Upgrade Guide](../../updates/V7/auth-https-upgrade.md) when upgrading an existing site.

### Settings Label configuration
The tables below documents all the appsettings related to changing the label format and data. 
Each Default label is linked to a setting that below that configures the SQL view.

`Settings for label path (.btw or .zpl)`

| Key | Value | Setting name for SQL View
| --- | --- |--- |
| DefaultTrackingEntityLabel | TrackingEntity.btw | ViewTrackingEntityLabel
| DefaultMasterItemLabel | MasterItem.btw | ViewMasterItemLabel
| DefaultLocationLabel | Location.btw | ViewLocationLabel
| DefaultUserLabel | User.btw | ViewUserLabel
| DefaultPalletLabel | Pallet.btw | PalletLabel
| DefaultBoxLabel | Box.btw | ViewBoxLabel

`Settings for label data (SQL view)`

| Key | Value (SQl View Name) 
| --- | --- |
| ViewTrackingEntityLabel | Label_TrackingEntity |
| ViewMasterItemLabel | Label_MasterItem |
| ViewLocationLabel | Label_Location |
| ViewUserLabel | Label_Users |
| PalletLabel | Label_Pallet |
| ViewBoxLabel | Label_Box |


### Logging

Logging can be configured in the nlog.config file

```xml
<?xml version="1.0" encoding="utf-8" ?>
<nlog xmlns="http://www.nlog-project.org/schemas/NLog.xsd"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      autoReload="true"
      internalLogLevel="Info"
      internalLogFile="c:\temp\internal-nlog-AspNet.txt">

	<!-- enable asp.net core layout renderers -->
	<extensions>
		<add assembly="NLog.Web"/>
	</extensions>

	<targets>
	<target xsi:type="File"
		name="applicationLogs"
		fileName="Granite.LabelPrinting.log"
		layout="${longdate}|${event-properties:item=EventId:whenEmpty=0}|${level:uppercase=true}|${mdlc:userName}|${logger}|${message} ${exception:format=tostring}"
		archiveFileName="Granite.LabelPrinting.{#}.log"
		archiveNumbering="DateAndSequence"
		archiveEvery="Day"
		archiveAboveSize="10485760"
		archiveDateFormat="yyyy-MM-dd"
		maxArchiveFiles="7" />
		<!-- File Target for own log messages with extra web details using some ASP.NET core renderers -->
	<target xsi:type="File"
		name="innerWorkingsLogs"
		fileName="Granite.LabelPrinting-${shortdate}.Inner.log"
		layout="${longdate}|${event-properties:item=EventId:whenEmpty=0}|${level:uppercase=true}|${logger}|${mdlc:userName}|${message} ${exception:format=tostring}|url: ${aspnet-request-url}|action: ${aspnet-mvc-action}|${callsite}" />

	<target xsi:type="Console"
		name="lifetimeConsole"
		layout="${MicrosoftConsoleLayout}" />
	</targets>
	<rules>
		<!-- minlevel="Error"-->
		<!-- minlevel="Info"-->
		<logger name="*" minlevel="Error" writeTo="applicationLogs" />
	</rules>
</nlog>
```

The minlevel setting near the end of the file is what determines how much information is logged. You can set it to Info or Error
