# Custodian API
![Local Image](./custodian.jpg)


The primary responsibility of the Custodian API is to manage **Process Templates**, which encapsulate Granite Processes along with Process Steps, web templates, and pre-scripts. Each template consists of both **metadata** and **artifact** files. Metadata serves to document the process and provide additional information, while artifacts encompass all the data, scripts, views, lookups, and static data necessary for deploying the process. Ultimately, each deployment is self-contained, facilitating seamless sharing and deployment processes through the WebDesktop.

---
## Setup

##### Requirements

- [ASP.NET Core 8 Hosting Bundle](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)
- [IIS](../iis/getting-started.md)
- Sufficient permissions for folder and file access and IIS application creation

## Application Settings

The settings below are configured in the `appsettings.json`.

##### ConnectionStrings
Configuring multiple connection strings allow you to deploy to any instance of Granite.
The name of the connection string will be used in the Webdesktop to identify the connection.
Example CONNECTION and TEST.

``` json
"ConnectionStrings": {
    "CONNECTION": "Data Source=.;Initial Catalog=GraniteLive;Persist Security Info=True;User ID=;TrustServerCertificate=True;",
    "TEST": "Data Source=.;Initial Catalog=GraniteTest;Persist Security Info=True;User ID=;TrustServerCertificate=True;"
  }
```

##### AllowedOrigins

The 'allowed origins' is a list of addresses for applications requiring access to the API. 
By default, the only address that requires configuration is the Granite **WebDesktop** address.

```json

"AllowedOrigins": [ "https://192.168.1.10:8081" ]
```
#### SystemSettings

```sql
INSERT INTO SystemSettings ([Application], [Key], [Value], [Description], [isEncrypted], [isActive], AuditDate, AuditUser)
VALUES 
('GRANITECUSTODIAN', 'Repo_id', '676912773', '', 0, 1, GETDATE(), 'AUTOMATION'),
('GRANITECUSTODIAN', 'Token', '******', '', 0, 1, GETDATE(), 'AUTOMATION'),
('GRANITECUSTODIAN', 'Stores', 'Approved,Draft', '', 0, 1, GETDATE(), 'AUTOMATION')
```

- **`Take Note`** Ensure that the Token is Encrypted. After 90 days reset the token. We will issue a new token prior to expiry.
- New stores could be introduced and added to this setting. The stores available will be communicated to the team; you cannot add names that do not exist.


## Troubleshoot

The most common issues will arise with the connection to the cloud store, ensuring that the token is correct and not expired.
Run `\config` operation to verify connections, authentication and setup.