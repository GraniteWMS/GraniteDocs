# Certificates for Windows Services

The [Integration Service](../integration/accpac/sdk-provider.md) and the [Bartender Label Print Service](../label-printing/bartender/manual.md) are Windows services, not IIS sites. 
They listen on an `https://+:<port>/` address through Windows' built-in HTTP listener (http.sys), which means the certificate is not selected in IIS. 
Instead, a certificate has to be **bound to the port** before the service can start on https.

[Scaffold](../scaffold/manual.md) does this for you during an install. Use this page when:

- Scaffold reported that it could not bind the certificate to a port
- the service was installed or moved without Scaffold
- the certificate has expired or been replaced
- the service's port has changed

!!! note
    Everything on this page must be run from an **elevated (Run as administrator) PowerShell prompt** on the server where the service is installed.

| Service | Default port | Config file | Script default `appid` |
|---------|--------------|-------------|------------------------|
| Integration Service | 40091 | `Granite.Integration.Web.exe.config` | `63b4cc46-d7ad-47de-8ff9-45cfc7d03da9` |
| Bartender Label Print Service | 40092 | `Granite.LabelPrinting.exe.config` | `80fb984d-e145-4af9-99b4-b4afbe00dc8a` |

The examples below use the Integration Service on port `40091`. Substitute the port (and `appid`) of the service you are working on.

## Option 1: Use the Configure-Https script

Each service ships with a script in its install folder: `scripts\Configure-Https.ps1`. 
It is safe to run more than once - when everything is already in place it changes nothing.

Bind the certificate that the rest of the Granite sites use (recommended). 
You can find the thumbprint in step 1 of the [manual steps](#option-2-bind-the-certificate-manually) below.

```powershell
.\scripts\Configure-Https.ps1 -Thumbprint <thumbprint>
```

Or let the script create a self-signed certificate for this server (computer name, fully qualified name and `localhost`, valid for 5 years) and bind it:

```powershell
.\scripts\Configure-Https.ps1
```

Other parameters:

| Parameter | Description |
|-----------|-------------|
| `-Port` | The port in the service's `EndPoint` setting, when it is not the default |
| `-Thumbprint` | Thumbprint of an existing certificate in `LocalMachine\My`. The certificate must have its private key |
| `-DnsName` | Host names for a new self-signed certificate. Callers must use one of these names |
| `-UrlAclUser` | The account the service runs as, e.g. `'DOMAIN\svc-granite'`. Only needed when the service does **not** run as LocalSystem or an administrator |

Once the script has finished, continue with [After binding the certificate](#after-binding-the-certificate).

## Option 2: Bind the certificate manually

If the script is not available or fails, the same result can be achieved with `netsh`.

### 1. Find the certificate's thumbprint

The certificate must be in the Local Computer `Personal` store (`Cert:\LocalMachine\My`) and must have a private key. 
If you do not have a certificate yet, see [Creating Certificates](../iis/getting-started.md#creating-certificates).

```powershell
Get-ChildItem Cert:\LocalMachine\My | Format-List FriendlyName, Subject, Thumbprint, NotAfter, HasPrivateKey
```

Copy the `Thumbprint` of the certificate you want to use. Check that `HasPrivateKey` is `True` and that `NotAfter` is in the future.

### 2. Check what is currently bound to the port

```powershell
netsh http show sslcert ipport=0.0.0.0:40091
```

- If nothing is bound, netsh reports that it cannot find the file specified. Continue with step 4.
- If the `Certificate Hash` shown matches your thumbprint, the binding is already correct. Continue with [After binding the certificate](#after-binding-the-certificate).
- If a different certificate is bound, remove it first (step 3).

### 3. Remove an existing binding

Only needed when the port is bound to the wrong certificate.

```powershell
netsh http delete sslcert ipport=0.0.0.0:40091
```

### 4. Bind the certificate to the port

```powershell
netsh http add sslcert ipport=0.0.0.0:40091 certhash=<thumbprint> appid='{63b4cc46-d7ad-47de-8ff9-45cfc7d03da9}' certstorename=MY
```

!!! note
    - The `certhash` is the thumbprint without any spaces.
    - The `appid` only labels who created the binding, any GUID is accepted. Use the value from the table at the top of this page so the binding is recognisable.
    - In PowerShell the `appid` must be wrapped in single quotes, as shown, because of the curly braces.

### 5. Reserve the URL (only for non-admin service accounts)

A service running as **LocalSystem** (the default) or as an administrator does not need this step.

If the service runs as any other account, reserve the address for that account:

```powershell
netsh http add urlacl url=https://+:40091/ user='DOMAIN\svc-granite'
```

If the server still has a reservation for the old `http://` address, it can be removed:

```powershell
netsh http delete urlacl url=http://+:40091/
```

## After binding the certificate

1. Set the `EndPoint` setting in the service's `.config` file to the https address, using the same port that you bound:

    ```xml
    <add key="EndPoint" value="https://+:40091/" />
    ```

2. Restart the Windows service.

3. Browse to `https://<server>:40091/metadata`. The metadata page does not require you to log in, so it is a quick way to confirm that the service is up on https.

4. Make sure everything that calls the service uses the `https://` address, with a host name or IP address that matches the certificate:

    | Service | SystemSettings (`Application` = `SQLCLR`) | ProcessApp `appsettings.json` |
    |---------|------------------------------------------|-------------------------------|
    | Integration Service | `IntegrationService`, and any custom keys used with `clr_IntegrationPostToEndpoint` | `IntegrationEndPoint` |
    | Bartender Label Print Service | `LabelPrintService` | `LabelPrintingEndPoint` |

!!! note
    The ProcessApp and SQLCLR accept self-signed certificates on Granite services, so the certificate does not need to be added to the server's trusted root store for them to work. 
    A browser will still show a certificate warning for a self-signed certificate that it does not trust.

## Troubleshooting

<h4>The service does not start, or stops immediately</h4>

Check the service's log file. The most common causes are:

- No certificate is bound to the port in the `EndPoint` setting - run `netsh http show sslcert ipport=0.0.0.0:<port>` to check.
- `Access is denied` - the service is running as an account that is not LocalSystem or an administrator, and has no URL reservation. See [step 5](#5-reserve-the-url-only-for-non-admin-service-accounts).
- The port is already in use by something else. The Integration Service and the ZPL Label Print site both default to port `40091`, so one of them must be moved when both are installed on the same server.
- The ServiceStack license is missing. See the service's own manual.

<h4>SSL Certificate add failed, Error: 1312</h4>

`A specified logon session does not exist` means that http.sys cannot use the certificate. Either the certificate is not in `Cert:\LocalMachine\My`, or it has no private key (`HasPrivateKey` is `False`). 
Import the certificate again from a `.pfx` file that includes the private key, into the Local Computer `Personal` store.

<h4>SSL Certificate add failed, Error: 183</h4>

`Cannot create a file when that file already exists` means that there is already a certificate bound to the port. Remove it using [step 3](#3-remove-an-existing-binding), then add the binding again.

<h4>The parameter is incorrect</h4>

Check that the thumbprint has no spaces or hidden characters (retype it instead of copying it from the certificate dialog), and that the `appid` is wrapped in single quotes.

<h4>The service is running, but callers get a connection or certificate error</h4>

- Check that the caller is using `https://` and not `http://`. SQLCLR will refuse to call an address that is not https.
- Check that the caller is using a host name or IP address that is on the certificate.
- Check that the server's firewall allows the service's port.
- If the certificate was replaced, the old binding stays in place until it is removed. Check which certificate is bound using [step 2](#2-check-what-is-currently-bound-to-the-port).
