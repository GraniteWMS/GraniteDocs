# ZPL

## Setup

### Prerequisites
- [ASP.NET Core 8 Hosting Bundle](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)
- [IIS](../../iis/getting-started.md)

### Installation

- Ensure that the folder that you have installed GraniteLabelPrintingZPL to has full access enabled for all users. This will ensure that the application log files can be created

- Add GraniteLabelPrintingZPL to IIS

- GraniteLabelPrintingZPL must run as `https`. You can use the same certificate as the WebDesktop

!!! note
    As of version 7.4, requests made over http are always redirected to https, regardless of the `IsPublic` setting. Before version 7.4, setting `IsPublic` to false allowed GraniteLabelPrintingZPL to run as http.

    Point the applications that print labels to the https address:

    - SQLCLR: the `LabelPrintService` setting in the `SystemSettings` table
    - ProcessApp: the `LabelPrintingEndPoint` setting in `appsettings.json`

### Authentication

As of version 7.4 the label print service requires authentication. Calls to `/print`, `/preview`, `/printers` and `/config` that do not authenticate receive a `401 Unauthorized`.

| Caller | How it authenticates |
|--------|----------------------|
| ProcessApp | Sends the token of the user that is logged in (`Authorization: Bearer`). The token is issued by the Business API, and is only accepted over https |
| SQLCLR (`clr_PrintLabel`) | Sends the [API key](../../security/api-keys.md) of the user that is printing (`X-Api-Key`). Every user that prints from SQL must have an API key |
| A person using a browser | Signs in on the login page with their Granite user name and password |

!!! note
    - The `CONNECTION` connection string must point to the **same Granite database as the Business API**. The key that is used to validate the ProcessApp's token is stored in the `SystemSettings` table (see [JwtAuthKey](../../security/system-security.md#jwtauthkey)).
    - The site will not start if the `CONNECTION` connection string is missing.
    - The `/config` and `/printers` pages can no longer be opened without logging in. When you open them in a browser you are sent to a login page, where you sign in with your Granite user name and password. The `/metadata` page is still public, and can be used to check that the site is running.

See the [Authentication & HTTPS Upgrade Guide](../../security/auth-https-upgrade.md) when upgrading an existing site.

### AppSettings

The appsettings.json file is where you configure the application. 

**The Width and Height for each label do not affect the size that the label prints at.** These parameters actually set the size that label previews render at

AllowedOrigins must specify all addresses that can print to the LabelPrintService. You should include the ProcessApp, WebDesktop and Business API as needed.


```json
{
  "ConnectionStrings": {
    "CONNECTION": "Data Source=.\\SQL2019;Initial Catalog=Granite;Persist Security Info=True;User ID=username;Password=password"
  },
  "IsPublic":  false,
  "AllowedOrigins": [ "https://my-pcname:40099", "https://my-pcname:40081", "https://my-pcname:40086" ],
  "DefaultLabelPath": "C:\\Program Files (x86)\\Granite WMS\\Labels\\",
  "PrinterName": "REC",
  "DefaultTrackingEntityLabel": {
    "ViewName": "Label_TrackingEntity",
    "LabelName": "TrackingEntity.zpl",
    "Width": "100",
    "Height": "30"
  },
  "DefaultMasterItemLabel": {
    "ViewName": "Label_MasterItem",
    "LabelName": "MasterItem.zpl",
    "Width": "75",
    "Height": "20"
  },
  "DefaultLocationLabel": {
    "ViewName": "Label_Location",
    "LabelName": "Location.zpl",
    "Width": "80",
    "Height": "40"
  },
  "DefaultUserLabel": {
    "ViewName": "Label_Users",
    "LabelName": "User.zpl",
    "Width": "100",
    "Height": "20"
  },
  "DefaultPalletLabel": {
    "ViewName": "Label_Pallet",
    "LabelName": "Pallet.zpl",
    "Width": "100",
    "Height": "20"
  },
  "DefaultBoxLabel": {
    "ViewName": "Label_Box",
    "LabelName": "Box.zpl",
    "Width": "100",
    "Height": "20"
  },
  "DefaultErrorLabel": {
    "ViewName": "",
    "LabelName": "ErrorLabel.zpl",
    "Width": "100",
    "Height": "20"
  },
  "ViewTrackingEntityLabel": "Label_TrackingEntity",
  "ViewMasterItemLabel": "Label_MasterItem",
  "ViewLocationLabel": "Label_Location",
  "ViewUserLabel": "Label_Users",
  "ViewPalletLabel": "Label_Pallet",
  "ViewBoxLabel": "Label_Box",
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}

```


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
			fileName="GraniteLabelPrintingZPL.log"
			layout="${longdate}|${event-properties:item=EventId:whenEmpty=0}|${level:uppercase=true}|${mdlc:userName}|${logger}|${message} ${exception:format=tostring}" 
			archiveFileName="GraniteLabelPrintingZPL.{#}.log"
			archiveNumbering="DateAndSequence"
			archiveEvery="Day"
			archiveAboveSize="10485760"
			archiveDateFormat="yyyy-MM-dd"
			maxArchiveFiles="7" />

		<!-- File Target for own log messages with extra web details using some ASP.NET core renderers -->
		<target xsi:type="File" 
			name="innerWorkingsLogs" 
			fileName="GraniteLabelPrintingZPL-${shortdate}.Inner.log"
			layout="${longdate}|${event-properties:item=EventId:whenEmpty=0}|${level:uppercase=true}|${logger}|${mdlc:userName}|${message} ${exception:format=tostring}|url: ${aspnet-request-url}|action: ${aspnet-mvc-action}|${callsite}" />

		<!--Console Target for hosting lifetime messages to improve Docker / Visual Studio startup detection -->
		<target xsi:type="Console" name="lifetimeConsole" layout="${MicrosoftConsoleLayout}" />
	</targets>
	<rules>
		<!-- minlevel="Error"-->
		<!-- minlevel="Info"-->
		<logger name="*" minlevel="Error" writeTo="applicationLogs" />
	</rules>
</nlog>
```

The minlevel setting near the end of the file is what determines how much information is logged. You can set it to Info or Error

## Label Preview

### Previewing a template
You can preview a label by browsing to https://[hostname]:[port number]/preview/[Label key] 

[LabelKey] must be one of the label types from the appsettings.json file:

```json
"DefaultTrackingEntityLabel": {
    "ViewName": "Label_TrackingEntity",
    "LabelName": "TrackingEntity.zpl",
    "Width": "100",
    "Height": "30"
  },
  "DefaultMasterItemLabel": {
    "ViewName": "Label_MasterItem",
    "LabelName": "MasterItem.zpl",
    "Width": "75",
    "Height": "20"
  },
  "DefaultLocationLabel": {
    "ViewName": "Label_Location",
    "LabelName": "Location.zpl",
    "Width": "80",
    "Height": "40"
  },
  "DefaultUserLabel": {
    "ViewName": "Label_Users",
    "LabelName": "User.zpl",
    "Width": "100",
    "Height": "20"
  },
  "DefaultPalletLabel": {
    "ViewName": "Label_Pallet",
    "LabelName": "Pallet.zpl",
    "Width": "100",
    "Height": "20"
  },
  "DefaultBoxLabel": {
    "ViewName": "Label_Box",
    "LabelName": "Box.zpl",
    "Width": "100",
    "Height": "20"
  }
```

For example browsing to https://my-pcname:5001/preview/DefaultTrackingEntityLabel will render the TrackingEntity.zpl label using the dimensions specified in appsettings.json:

![image info](zpl-img\trackingentitypreview.png)

### Previewing with data
By making a LabelDataPreviewRequest (see API metadata), you can view a label template populated with actual data from your database

Sample request:

![image info](zpl-img\previewwithdatasamplecall.png)

Response:

![image info](zpl-img\trackingentitypreviewwithdata.png)

## Troubleshooting
If you get an error message relating to ASP.Net when browsing GraniteLabelPrintingZPL, ensure that you have the correct hosting bundle installed. The Webdesktop uses version 5, which will not work with GraniteLabelPrintingZPL. You can safely install version 6 alongside version 5

If you are running GraniteLabelPrintingZPL as http, be sure that you have allowed InsecureContent on the WebDesktop:
   ```
    ...\Dropbox\Software Installs\Granite\Granite V3.4.4\Documentation\WebDesktop Browser Insecure Content.docx
   ```


Always be sure to check your GraniteLabelPrintingZPL log file

