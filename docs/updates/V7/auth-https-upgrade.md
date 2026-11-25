# Authentication & HTTPS Upgrade Guide

Granite version 7 moves all of the Granite services onto a single, shared authentication mechanism and requires every service to run over **https**. 
This guide lists what changes and what you need to do when upgrading an existing site.

## What has changed

- **Every service runs over https.** This now includes the Integration Service and the Bartender Label Print Service, which previously ran as http.
- **API keys are sent in the `X-Api-Key` header.** Sending an API key as `Authorization: Bearer <api key>` no longer works. See [API Keys](../../security/api-keys.md).
- **More services require authentication.** The Integration Service, both Label Print services and the Sage Intacct Integration Service now reject calls that do not include an API key or a token. This includes their `/config` pages.
- **The Business API issues a token when a user logs in.** The ProcessApp passes this token on to the Integration Service and Label Print service, so that they know which user is making the call. Tokens are only accepted over https.
- **SQLCLR only calls https addresses**, and sends the API key of the user to every service that it calls.
- **The SQLCLR integration procedures take a user name.** `clr_IntegrationPost`, `clr_IntegrationPostToEndpoint` and `clr_IntegrationUpdate` have a new first parameter, `@userName`.

## Before you start

!!! warning
    The Business API, ProcessApp, Integration Service, Label Print service, Custodian API, Scheduler and database (including SQLCLR) must all be upgraded together. 
    Older versions of the applications cannot authenticate against the upgraded services.

- Have the ServiceStack license key at hand. The Integration Service and the Bartender Label Print Service will not start without it.
- Make sure there is a certificate on the server. All services can use the same certificate. See [Creating Certificates](../../iis/getting-started.md#creating-certificates).
- All services must connect to the **same Granite database**. They share the token signing key that is stored in it (see [JwtAuthKey](../../security/system-security.md#jwtauthkey)).
- Users that are logged in to the ProcessApp when the upgrade is deployed will be sent back to the logon page once.

## Upgrade steps

### 1. Upgrade the database

Run the database upgrade script. Amongst other things this will:

- add the `JwtAuthKey` setting, if it does not exist yet
- install the new version of SQLCLR

!!! note
    The upgrade drops the `clr_ParcelPerfect_*` procedures and does not recreate them. If the site uses the [Parcel Perfect service](../../integration/parcel-perfect/service.md), run `ParcelPerfect_CLR.sql` after the upgrade.

### 2. Install the applications

[Scaffold](../../scaffold/manual.md) is the recommended way to install the new versions. It will add the https bindings for the IIS sites, bind the certificate to the ports of the Windows services, and write the https addresses to the configuration files and `SystemSettings` table.

If you are not using Scaffold:

- **IIS sites** - make sure each site has an `https` binding with a certificate selected. See [Adding a site to IIS](../../iis/getting-started.md#adding-a-site-to-iis).
- **Windows services** (Integration Service, Bartender Label Print Service) - set the `EndPoint` setting to `https://+:<port>/`, add the `servicestack:license` setting, and bind a certificate to the port. See [Certificates for Windows Services](../../security/service-certificates.md).

### 3. Change the service addresses to https

Existing addresses are **not** changed by the database upgrade. Check each of these and change `http://` to `https://`:

| Where | Setting |
|-------|---------|
| `SystemSettings`, `Application` = `SQLCLR` | `Business_API_Endpoint` |
| | `Custodian_API_Endpoint` |
| | `LabelPrintService` |
| | `IntegrationService` |
| | `ParcelPerfectIntegrationServiceUrl` |
| | Any custom keys that are used with `clr_IntegrationPostToEndpoint` |
| `SystemSettings`, `Application` = `GraniteScheduler` | `CustodianApiUrl` |
| ProcessApp `appsettings.json` | `BusinessApiEndPoint`, `IntegrationEndPoint`, `LabelPrintingEndPoint` |
| WebDesktop `appsettings.json` | The address of each API, including the Scheduler |
| Business API, Custodian API, ZPL Label Print `appsettings.json` | `AllowedOrigins` |

Until a SQLCLR address is changed, every SQLCLR call to that service will fail with a message saying that the address is not an `https://` URL.

### 4. Check that users have API keys

SQLCLR looks up the API key of the user that is passed to the procedure. If the user does not have one, the call fails with `ApiKey not found for user`.

- Every user that prints labels using `clr_PrintLabel` needs an API key.
- The user that is passed as `@userName` to the integration procedures needs an API key.

API keys are generated when a user's password is saved. See [How do I get an API key](../../security/api-keys.md#how-do-i-get-an-api-key).

### 5. Update calls to the SQLCLR integration procedures

Find every prescript, trigger, stored procedure and scheduled job that calls `clr_IntegrationPost`, `clr_IntegrationPostToEndpoint` or `clr_IntegrationUpdate` and add the `@userName` parameter. 

```sql
EXEC [dbo].[clr_IntegrationPost]
		@userName = @userName,		-- new
		@transactionID = null,
		@document = @document,
		@documents = null,
		@reference = null,
		@transactionType = N'PICK',
		@processName = null,
		@success = @valid OUTPUT,
		@message = @message OUTPUT
```

This query will help you find the places that need to change:

```sql
SELECT OBJECT_NAME(object_id) AS ObjectName
FROM sys.sql_modules
WHERE definition LIKE '%clr_Integration%'
```

See the [CLR Procedure Reference](../../sqlclr/reference.md#integration) for the parameters of each procedure.

### 6. Update anything else that uses an API key

Any script, Python job or third party that calls a Granite API with an API key must change from the `Authorization: Bearer` header to the `X-Api-Key` header.

The one exception is the Parcel Perfect webhook, which still accepts the key in the `Authorization` header so that the configuration on Parcel Perfect's side does not need to change.

### 7. Check session timeouts

The length of time that a ProcessApp user stays logged in is now also limited by the lifetime of the token that the Business API issues. See [Session Timeout Configuration](../../process-app/session-timeout.md).

## Verifying the upgrade

- Log in to the ProcessApp. If the logon page shows a message asking you to check that the Business API endpoint uses https, the `BusinessApiEndPoint` setting is still an `http://` address.
- Browse to the ProcessApp's `/Config` page and check that the Business API, Label Print and Integration endpoints are all valid.
- Print a label from the ProcessApp and from SQL (`clr_PrintLabel`).
- Post a transaction to the ERP from the ProcessApp and from SQL (`clr_IntegrationPost`).
- Run a scheduled email job and check that the email is queued.

## Troubleshooting

| Problem | Cause |
|---------|-------|
| SQLCLR returns `... is not an https:// URL` | The address in `SystemSettings` still starts with `http://`. See [step 3](#3-change-the-service-addresses-to-https) |
| SQLCLR returns `ApiKey not found for user` | The user passed to the procedure has no API key. See [step 4](#4-check-that-users-have-api-keys) |
| A service returns `401 Unauthorized` | No API key or token was sent, the API key was sent in the `Authorization` header instead of `X-Api-Key`, or the service is connected to a different database than the Business API |
| Procedure or function `clr_IntegrationPost` expects parameter `@userName` | The call has not been updated. See [step 5](#5-update-calls-to-the-sqlclr-integration-procedures) |
| The Integration Service or Bartender Label Print Service does not start | No certificate bound to the port, or no ServiceStack license. See [Certificates for Windows Services](../../security/service-certificates.md) |
| The ProcessApp logs users out earlier than expected | The token lifetime on the Business API is shorter than the ProcessApp's timeouts. See [Session Timeout Configuration](../../process-app/session-timeout.md) |
