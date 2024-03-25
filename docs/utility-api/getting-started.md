
## Prerequisites

- [IIS](../iis/getting-started.md)
- [ASP.NET Core 8 Hosting Bundle](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)

## Install

1. Configure the connection string to the Granite database in the `appsettings.json` file
2. Add the site to IIS, be sure to run as https and select a valid certificate
3. Configure the settings for each service that you are going to make use of
	- [Email Service Configuration](email-service.md#configuration)
	- [Reporting Service Configuration](reporting-service.md#configuration)
	- [SqlExport Service Configuration](sql-export-service.md#configuration)