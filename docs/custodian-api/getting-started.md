
## Prerequisites

- [IIS](../iis/getting-started.md)
- [ASP.NET Core 8 Hosting Bundle](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)
- Sufficient permissions for folder and file access and IIS application creation

## Install

1. Configure the connection string to the Granite database in the `appsettings.json` file

	```json
	{
	"ConnectionStrings": {
		"GRANITE": "Server=.\\sql2019;Database=GraniteDatabase;User ID=Granite;Password=******;Persist Security Info=False;"
	},
	"AllowedOrigins": [ "https://:40099" ],
	"Logging": {
		"LogLevel": {
		"Default": "Information",
		"Microsoft.AspNetCore": "Warning"
		}
	},
	"AllowedHosts": "*"
	}
	```
	
	!!! note 
		You cannot use wildcards like `*` in the `AllowedOrigins` setting for the UtilityAPI.
		
		It should contain only the WebDesktop address.
		

2. Add the site to IIS, be sure to run as https and select a valid certificate

	!!! note "Version 7"
		- Requests made over http are always redirected to https. Make sure that everything that calls the Custodian API uses the `https://` address - the `Custodian_API_Endpoint` (SQLCLR) and `CustodianApiUrl` (Scheduler) settings in the `SystemSettings` table, and the WebDesktop.
		- [API keys](../security/api-keys.md) must be sent in the `X-Api-Key` header. An API key sent as an `Authorization: Bearer` token is no longer accepted. This affects any scripts that call the Custodian API directly.
		- The Custodian API also accepts the login token that the Business API issues, so it must be connected to the **same Granite database as the Business API** (see [JwtAuthKey](../security/system-security.md#jwtauthkey)).
3. Configure the settings for each service that you are going to make use of
	- [Process Template Service Configuration](process-template-service.md#configuration)
	- [Email Service Configuration](email-service.md#configuration)
	- [Reporting Service Configuration](reporting-service.md#configuration)
	- [SqlExport Service Configuration](sql-export-service.md#configuration)